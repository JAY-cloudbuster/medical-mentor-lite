/**
 * Backend validators to secure API endpoints from prompt injection, 
 * type confusion, resource-exhaustion DoS, and malicious HTML/scripts.
 */

// Helper to check if value is a safe string with length limits
export function isSafeString(val, maxLength = 100) {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return false;
  
  // Prevent any tags <script>, <html> etc. by rejecting angle brackets
  if (/[<>]/.test(trimmed)) return false;
  
  return true;
}

// Helper to sanitize/clean a string for logging or prompt safety
export function sanitizeString(val) {
  if (typeof val !== 'string') return '';
  return val.replace(/[<>]/g, '').trim();
}

/**
 * Validates search term input for define, related, graph, explain, and youtube endpoints
 */
export function validateTermInput(req, res, next) {
  // Can be in body or query
  const term = req.body?.term !== undefined ? req.body.term : req.query?.term;

  if (term === undefined || term === null) {
    return res.status(400).json({ error: "Term parameter is required" });
  }

  if (!isSafeString(term, 100)) {
    return res.status(400).json({ 
      error: "Invalid term parameter. Must be a non-empty string under 100 characters, containing no HTML angle brackets." 
    });
  }

  // Attach sanitized term to request object for downstream use
  req.sanitizedTerm = sanitizeString(term);
  next();
}

/**
 * Validates inputs for the Quiz generation endpoint
 */
export function validateQuizInput(req, res, next) {
  const { topic, difficulty, numQuestions } = req.body;

  // 1. Topic validation
  if (topic === undefined || topic === null) {
    return res.status(400).json({ error: "Topic is required" });
  }

  if (!isSafeString(topic, 100)) {
    return res.status(400).json({ 
      error: "Invalid topic parameter. Must be a non-empty string under 100 characters, containing no HTML angle brackets." 
    });
  }

  // 2. Difficulty validation
  const allowedDifficulties = ['Easy', 'Medium', 'Hard'];
  let validDifficulty = 'Medium'; // default
  if (difficulty !== undefined) {
    if (typeof difficulty !== 'string') {
      return res.status(400).json({ error: "Difficulty must be a string value" });
    }
    const matched = allowedDifficulties.find(d => d.toLowerCase() === difficulty.toLowerCase());
    if (!matched) {
      return res.status(400).json({ 
        error: `Invalid difficulty. Must be one of: ${allowedDifficulties.join(', ')}` 
      });
    }
    validDifficulty = matched;
  }

  // 3. Number of questions validation
  let validNumQuestions = 5; // default
  if (numQuestions !== undefined) {
    const parsed = Number(numQuestions);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10) {
      return res.status(400).json({ 
        error: "Number of questions must be an integer between 1 and 10." 
      });
    }
    validNumQuestions = parsed;
  }

  // Attach sanitized inputs
  req.sanitizedQuiz = {
    topic: sanitizeString(topic),
    difficulty: validDifficulty,
    numQuestions: validNumQuestions
  };

  next();
}
