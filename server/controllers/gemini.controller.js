import { generateJSONResponse } from '../services/gemini.service.js';
import axios from 'axios';
import prisma from '../config/prisma.js';
import { logAiUsage, logSearch, trackEvent } from '../services/analytics.service.js';

export const defineTerm = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const term = req.sanitizedTerm || req.body.term;
    const prismaId = req.user.prismaId;

    logSearch(prismaId, term, 'definition');

    const prompt = `You are a medical knowledge engine. Provide a detailed JSON response for the medical term "${term}". 
    Format MUST be exactly: {"definition": "...", "pathophysiology": "...", "clinicalRelevance": "...", "correctedTerm": "the correctly spelled term"}
    The content must be medically accurate, detailed (2-4 sentences each), and specific to "${term}". Do not use generic placeholder text.`;

    const data = await generateJSONResponse(prompt);
    
    logAiUsage(prismaId, 'define_term', prompt.length, JSON.stringify(data).length, Date.now() - startTime);
    trackEvent(prismaId, 'TERM_SEARCHED', 'definition', { term });
    await prisma.dashboardActivity.create({
      data: { userId: prismaId, actionType: 'TERM_SEARCHED', details: { term } }
    }).catch(err => console.error("Activity log error:", err));

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getRelatedTerms = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const term = req.sanitizedTerm || req.body.term;
    const prismaId = req.user.prismaId;
    
    const prompt = `Provide exactly 6 related medical terminology concepts for "${term}". These must be real, distinct medical terms closely related to "${term}". Return JSON format: {"terms": ["Term 1", "Term 2", ...]}`;

    const data = await generateJSONResponse(prompt);
    
    logAiUsage(prismaId, 'related_terms', prompt.length, JSON.stringify(data).length, Date.now() - startTime);
    
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const generateQuiz = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const { topic, difficulty, numQuestions } = req.sanitizedQuiz || req.body;
    const prismaId = req.user.prismaId;
    
    const prompt = `Generate exactly ${numQuestions} UNIQUE, DISTINCT, and DIVERSE medical quiz questions on the topic "${topic}" with a difficulty level of "${difficulty}". Ensure no two questions are the same.
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

    const data = await generateJSONResponse(prompt);
    
    logAiUsage(prismaId, 'generate_quiz', prompt.length, JSON.stringify(data).length, Date.now() - startTime);
    trackEvent(prismaId, 'QUIZ_GENERATED', 'quiz', { topic, difficulty, numQuestions });
    
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getGraph = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const term = req.sanitizedTerm || req.body.term;
    const prismaId = req.user.prismaId;
    
    logSearch(prismaId, term, 'graph');
    
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
- Node types must be: "disease", "symptom", "drug", or "concept"  
- Include diverse relationships: causes, treats, associated with, manifests as, prevented by, diagnosed with, etc.
- The central node (id "1") MUST be "${term}" itself`;

    const data = await generateJSONResponse(prompt);
    
    logAiUsage(prismaId, 'knowledge_graph', prompt.length, JSON.stringify(data).length, Date.now() - startTime);
    trackEvent(prismaId, 'GRAPH_VIEWED', 'graph', { term });
    
    res.json(data);
  } catch (err) {
    next(err);
  }
};
