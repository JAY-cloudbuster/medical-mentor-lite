import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { validateTermInput, validateQuizInput } from './serverValidators.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Express security settings
app.use(helmet());
app.disable('x-powered-by');

// Global CORS configuration
app.use(cors());
app.use(express.json());

// Global API rate limiter to protect against denial of service
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" }
});

// Strict rate limiter for AI-backed endpoints to protect api key quota
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI generation quota exceeded for this IP, please try again after 15 minutes" }
});

app.use('/api', apiLimiter);

// Set up Gemini conditionally
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("Gemini AI initialized successfully.");
} else {
  console.log("No GEMINI_API_KEY found. Using fallback mock responses. Add your key to .env to enable real AI.");
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

// ═══════════════════════════════════════════════
// 1. Definition Engine
// ═══════════════════════════════════════════════
app.post('/api/define', aiLimiter, validateTermInput, async (req, res, next) => {
    try {
        const term = req.sanitizedTerm;

        if (!ai) await new Promise(r => setTimeout(r, 1200));

        const prompt = `You are a medical knowledge engine. Provide a detailed JSON response for the medical term "${term}". 
        Format MUST be exactly: {"definition": "...", "pathophysiology": "...", "clinicalRelevance": "...", "correctedTerm": "the correctly spelled term"}
        The content must be medically accurate, detailed (2-4 sentences each), and specific to "${term}". Do not use generic placeholder text.`;

        const fallback = {
            definition: `${term} is a medical concept requiring clinical attention. Please add your GEMINI_API_KEY to the .env file to get real AI-generated definitions.`,
            pathophysiology: `The specific pathophysiological mechanisms of ${term} involve complex biological processes. Enable the AI engine by adding your Gemini API key.`,
            clinicalRelevance: `Clinical management of ${term} depends on presentation severity and patient context. Enable the AI engine for accurate clinical guidance.`,
            correctedTerm: term
        };

        const data = await generateJSONResponse(prompt, fallback);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// ═══════════════════════════════════════════════
// 2. Related Terms Engine
// ═══════════════════════════════════════════════
app.post('/api/related', aiLimiter, validateTermInput, async (req, res, next) => {
    try {
        const term = req.sanitizedTerm;

        if (!ai) await new Promise(r => setTimeout(r, 800));

        const prompt = `Provide exactly 6 related medical terminology concepts for "${term}". These must be real, distinct medical terms closely related to "${term}". Return JSON format: {"terms": ["Term 1", "Term 2", ...]}`;
        const fallback = {
             terms: [`${term} Basics`, `${term} Pathology`, `${term} Interventions`, `${term} Pathway`, `${term} Diagnostics`, `${term} Case Study`]
        };

        const data = await generateJSONResponse(prompt, fallback);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// ═══════════════════════════════════════════════
// 3. Quiz Engine
// ═══════════════════════════════════════════════
app.post('/api/quiz', aiLimiter, validateQuizInput, async (req, res, next) => {
    try {
        const { topic, difficulty, numQuestions } = req.sanitizedQuiz;

        if (!ai) await new Promise(r => setTimeout(r, 1500));

        const prompt = `Generate exactly ${numQuestions} UNIQUE, DISTINCT, and DIVERSE medical quiz questions on the topic "${topic}" with a difficulty level of "${difficulty}". Ensure no two questions are the same or cover the exact same concept.

        CRITICAL INSTRUCTION: You MUST generate EXACTLY ${numQuestions} questions in the array. Do not stop early.

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

        const fallbackQuestions = Array(numQuestions).fill(null).map((_, i) => ({
           question: `[Q${i+1} - ${difficulty}] A patient presents with symptoms associated with ${topic || 'general pathology'}. What is the primary consideration for presentation ${i+1}?`,
           options: [
             { id: 'A', label: `Elevated AST/ALT ratio for variant ${i+1}` },
             { id: 'B', label: `Positive specific antibody titer for variant ${i+1}` },
             { id: 'C', label: `Decreased serum albumin for variant ${i+1}` },
             { id: 'D', label: `Leukocytosis with left shift for variant ${i+1}` }
           ],
           correctOption: ['A', 'B', 'C', 'D'][i % 4],
           explanation: `Explanation for question ${i+1}: Add your GEMINI_API_KEY to .env to get real quiz questions.`
        }));

        const fallback = { questions: fallbackQuestions };

        const data = await generateJSONResponse(prompt, fallback);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// ═══════════════════════════════════════════════
// 4. YouTube Engine
// ═══════════════════════════════════════════════
app.get('/api/youtube', validateTermInput, async (req, res, next) => {
    try {
        const term = req.sanitizedTerm;

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
                            const videoId = vid.videoId;
                            videos.push({
                                id: videoId,
                                url: `https://www.youtube.com/watch?v=${videoId}`,
                                title: vid.title?.runs?.[0]?.text || 'Video',
                                thumbnail: vid.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
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
        } catch (e) {
            console.error("Youtube scrape error:", e.message);
        }

        // Fallback — direct search page links so they're always clickable
        res.json([
            {
                id: 'search1',
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(term + ' medical educational')}`,
                title: `${term} — Medical & Clinical Explanation`,
                thumbnail: `https://img.youtube.com/vi/default/hqdefault.jpg`,
                duration: '--:--'
            },
            {
                id: 'search2',
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(term + ' pathophysiology')}`,
                title: `${term} Pathophysiology & Mechanisms`,
                thumbnail: `https://img.youtube.com/vi/default/hqdefault.jpg`,
                duration: '--:--'
            }
        ]);
    } catch (err) {
        next(err);
    }
});

// ═══════════════════════════════════════════════
// 5. Knowledge Graph Engine
// ═══════════════════════════════════════════════
app.post('/api/graph', aiLimiter, validateTermInput, async (req, res, next) => {
    try {
        const term = req.sanitizedTerm;

        if (!ai) await new Promise(r => setTimeout(r, 1500));

        const prompt = `Generate a detailed, medically accurate knowledge graph for the term "${term}".
Return ONLY valid JSON in this exact format:
{
  "nodes": [
    { "id": "1", "label": "${term}", "type": "concept" },
    { "id": "2", "label": "NodeName", "type": "disease" }
  ],
  "edges": [
    { "source": "1", "target": "2", "relation": "causes" }
  ]
}

CRITICAL REQUIREMENTS:
- Generate between 8 and 15 UNIQUE nodes specific to "${term}"
- Each node MUST have a real, specific medical name (not generic labels like "Common Drug" or "Related Symptom")
- Node types must be: "disease", "symptom", "drug", or "concept"  
- Include diverse relationships: causes, treats, associated with, manifests as, prevented by, diagnosed with, etc.
- The central node (id "1") MUST be "${term}" itself
- All other nodes must be medically relevant to "${term}" specifically
- Avoid duplicates`;

        const fallback = {
            nodes: [
                { id: "1", label: term, type: "concept" },
                { id: "2", label: "Add GEMINI_API_KEY", type: "symptom" },
                { id: "3", label: "to .env file", type: "drug" },
                { id: "4", label: "for real AI graph", type: "disease" }
            ],
            edges: [
                { source: "1", target: "2", relation: "requires" },
                { source: "2", target: "3", relation: "to enable" },
                { source: "3", target: "4", relation: "which gives" }
            ]
        };

        const data = await generateJSONResponse(prompt, fallback);

        // Safety check for nodes and edges
        if (!data.nodes || !Array.isArray(data.nodes)) data.nodes = fallback.nodes;
        if (!data.edges || !Array.isArray(data.edges)) data.edges = fallback.edges;

        res.json(data);
    } catch (err) {
        next(err);
    }
});

// ═══════════════════════════════════════════════
// 6. Explain Engine (node info)
// ═══════════════════════════════════════════════
app.post('/api/explain', aiLimiter, validateTermInput, async (req, res, next) => {
    try {
        const term = req.sanitizedTerm;

        if (!ai) await new Promise(r => setTimeout(r, 500));

        const prompt = `Provide a concise (2 sentence) medical explanation for the term "${term}". Be specific and accurate. Return JSON format: {"explanation": "..."}`;
        const fallback = {
            explanation: `${term} is a medical concept. Add your GEMINI_API_KEY to .env for AI-powered explanations.`
        };

        const data = await generateJSONResponse(prompt, fallback);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// Centralized secure error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({
        error: "An unexpected error occurred. Please try again later."
    });
});

app.listen(port, () => {
  console.log(`Neural Medix API listening on port ${port}`);
});
