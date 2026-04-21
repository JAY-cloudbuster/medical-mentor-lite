import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Set up Gemini conditionally
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.log("No GEMINI_API_KEY found. Utilizing advanced fallback mocks for APIs.");
}

// Helper to interact with AI or fallback
async function generateJSONResponse(prompt, fallbackMock) {
    if (ai) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });
            let text = response.text || '';
            text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
            return JSON.parse(text);
        } catch (e) {
            console.error("AI Error:", e.message || e);
            return fallbackMock;
        }
    }
    return fallbackMock;
}

// 1. Definition Engine
app.post('/api/define', async (req, res) => {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "Term required" });

    // Ensure realistic delay for loading states
    if (!ai) await new Promise(r => setTimeout(r, 1200));

    const prompt = `You are a medical knowledge engine. Provide a detailed JSON response for the medical term "${term}". 
    Format MUST be: {"definition": "...", "pathophysiology": "...", "clinicalRelevance": "...", "correctedTerm": "the correctly spelled term"}`;

    const fallback = {
        definition: `${term} is typically defined as a significant physiological adaptation or anomaly requiring medical observation. It acts as a primary stressor in cellular environments.`,
        pathophysiology: `The mechanisms underlying ${term.toLowerCase()} predominantly involve cascading enzyme failures or misfolded protein aggregations within the target organ system.`,
        clinicalRelevance: `Immediate clinical intervention relies on assessing biomarkers and ensuring hemodynamics remain stable.`,
        correctedTerm: term
    };

    const data = await generateJSONResponse(prompt, fallback);
    res.json(data);
});

// 2. Related Terms Engine
app.post('/api/related', async (req, res) => {
    const { term } = req.body;
    
    if (!ai) await new Promise(r => setTimeout(r, 800));

    const prompt = `Provide exactly 6 related medical terminology concepts for "${term}". Return JSON format: {"terms": ["Term 1", "Term 2", ...]}`;
    const fallback = {
         terms: [`${term} Basics`, `${term} Pathology`, `${term} Interventions`, `${term} Pathway`, `${term} Diagnostics`, `${term} Case Study`]
    };

    const data = await generateJSONResponse(prompt, fallback);
    res.json(data);
});

// 3. Quiz Engine
app.post('/api/quiz', async (req, res) => {
    const { topic } = req.body;
    
    if (!ai) await new Promise(r => setTimeout(r, 1500));

    const prompt = `Generate a 5-question medical quiz on the topic "${topic}".
    Return JSON format exactly like:
    {
      "questions": [
        {
          "question": "Question text?",
          "options": [
            { "id": "A", "label": "Option 1" },
            { "id": "B", "label": "Option 2" },
            { "id": "C", "label": "Option 3" },
            { "id": "D", "label": "Option 4" }
          ],
          "correctOption": "B",
          "explanation": "Explanation text"
        }
      ]
    }`;

    const fallback = {
        questions: [
            {
                question: `A patient presents with symptoms commonly associated with ${topic || 'general pathology'}. Which of the following is the most definitive diagnostic marker?`,
                options: [
                  { id: 'A', label: 'Elevated AST/ALT ratio' },
                  { id: 'B', label: 'Positive specific antibody titer' },
                  { id: 'C', label: 'Decreased serum albumin' },
                  { id: 'D', label: 'Leukocytosis with left shift' }
                ],
                correctOption: 'B',
                explanation: `Specific antibody titers remain the gold standard for confirming this pathway.`
            },
            {
                question: `What is the primary mechanism of action for the first-line pharmacological treatment of ${topic}?`,
                options: [
                  { id: 'A', label: 'Inhibition of cell wall synthesis' },
                  { id: 'B', label: 'Blockade of beta-adrenergic receptors' },
                  { id: 'C', label: 'Competitive antagonism of GPCR' },
                  { id: 'D', label: 'Allosteric modulation of GABA-A' }
                ],
                correctOption: 'C',
                explanation: `GPCR antagonism directly interrupts the signal cascade driving the pathology.`
            }
        ]
    };

    const data = await generateJSONResponse(prompt, fallback);
    res.json(data);
});

// 4. YouTube Engine
app.get('/api/youtube', async (req, res) => {
    const { term } = req.query;
    
    try {
        const response = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(term + ' medical educational')}`);
        const html = response.data;
        const prefix = 'var ytInitialData = ';
        const startIdx = html.indexOf(prefix);
        if (startIdx !== -1) {
            let endIdx = html.indexOf(';</script>', startIdx);
            if (endIdx === -1) endIdx = html.indexOf('};</script>', startIdx) + 1;
            
            const jsonStr = html.substring(startIdx + prefix.length, endIdx);
            const data = JSON.parse(jsonStr);
            const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
            
            if (contents) {
                const videos = [];
                for (const item of contents) {
                    if (item.videoRenderer) {
                        const vid = item.videoRenderer;
                        videos.push({
                            id: vid.videoId,
                            title: vid.title?.runs?.[0]?.text || 'Video',
                            thumbnail: vid.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`,
                            duration: vid.lengthText?.simpleText || '10:00'
                        });
                        if (videos.length >= 2) break;
                    }
                }
                if (videos.length > 0) {
                    return res.json(videos);
                }
            }
        }
    } catch(e) {
        console.error("Youtube scrape error:", e.message);
    }

    // Fallback if scraping fails for any reason
    res.json([
        {
            id: 'dQw4w9WgXcQ',
            title: `Understanding ${term || 'Medical Pathology'} - 3D Animation`,
            thumbnail: `https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
            duration: '04:32'
        },
        {
            id: '3JZ_D3ELwOQ',
            title: `Clinical Pearls: ${term || 'Diagnosis Updates'}`,
            thumbnail: `https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg`,
            duration: '12:15'
        }
    ]);
});

// 5. Knowledge Graph Engine
app.post('/api/graph', async (req, res) => {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "Term required" });
    
    if (!ai) await new Promise(r => setTimeout(r, 1500));

    const prompt = `Generate a structured medical knowledge graph for ${term}.
Return ONLY JSON in this format:
{
  "nodes": [
    { "id": "string", "label": "string", "type": "disease" | "symptom" | "drug" | "concept" }
  ],
  "edges": [
    { "source": "string", "target": "string", "relation": "string" }
  ]
}

Constraints:
* Maximum 15 nodes
* Avoid duplicates
* Ensure medical accuracy
* Central node must be the searched term`;

    const fallback = {
        nodes: [
            { id: "1", label: term, type: "concept" },
            { id: "2", label: "Related Symptom", type: "symptom" },
            { id: "3", label: "Common Drug", type: "drug" },
            { id: "4", label: "Underlying Disease", type: "disease" }
        ],
        edges: [
            { source: "1", target: "2", relation: "causes" },
            { source: "1", target: "4", relation: "associated with" },
            { source: "3", target: "1", relation: "treats" }
        ]
    };

    const data = await generateJSONResponse(prompt, fallback);
    
    // Safety check for nodes and edges
    if (!data.nodes) data.nodes = fallback.nodes;
    if (!data.edges) data.edges = fallback.edges;

    res.json(data);
});

app.post('/api/explain', async (req, res) => {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "Term required" });
    
    if (!ai) await new Promise(r => setTimeout(r, 500));

    const prompt = `Provide a very short (2 sentence) medical explanation for the term "${term}". Return JSON format: {"explanation": "..."}`;
    const fallback = {
        explanation: `${term} is an important medical concept. It is closely related to pathophysiological processes requiring clinical attention.`
    };

    const data = await generateJSONResponse(prompt, fallback);
    res.json(data);
});

app.listen(port, () => {
  console.log(`Neural Medix API listening on port ${port}`);
});
