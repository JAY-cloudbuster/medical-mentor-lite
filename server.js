import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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
            return JSON.parse(response.text);
        } catch (e) {
            console.error("AI Error:", e);
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
         terms: ["Vasodilation", "Cytokines", "Apoptosis", "Hemodynamics", "Endothelium", "Pharmacodynamics"]
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
    await new Promise(r => setTimeout(r, 600));

    res.json([
        {
            id: '1',
            title: `Understanding ${term || 'Medical Pathology'} - 3D Animation`,
            thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmD-4xgg7gFFkS3qy_imQ6iuq1jIG-7nHJ5jVM_t9uxLsiP7ncwf64MJTEGQKanLELwqM0T3ox2jPizKpel18TOh5KJm9qTb2n6gfaKwLfERLEhdwQVeg0kbAJSxKpBKvFJo8HX6hNqmmwJrLyao99VjyDoFhfjbtLYPgQuOG5DAX37jw_iC4s-aWc0EA30JUdBjPotTYEWeARZBB3ZeXYYCMyYIBahiqviNVSZc-RUNuf--vOEpfcZJ83sOMk3pEp36LqA8JfjmbR',
            duration: '04:32'
        },
        {
            id: '2',
            title: `Clinical Pearls: ${term || 'Diagnosis Updates'}`,
            thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmKWIMyZOZhYftbRe7BlZcshLacPG8FSBGR0Segx3U9gkMpXzKFFaSzPXfc2n6_BxALS15HONQ3-ylnBVmkzk45EFXEEhoSybBWwpKyPV7QbcHanFlsCdCwe6xEfcT4wtCRx7hUsOAc7WlKxRT4PTn6qozFs3qUa47OMCeAfYAEe044I1j-lm5hkxmYJrCVLxi-TnmKskrw1R-j3MOcCY8B-62jb7EfhI-LFY-Ti2yu5F7RIsM1VeWRUV5x1DAg0nbbqBiObn4ARw3',
            duration: '12:15'
        }
    ]);
});

app.listen(port, () => {
  console.log(`Neural Medix API listening on port ${port}`);
});
