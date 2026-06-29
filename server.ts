import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Ontology from types for fallback matching
const LOCAL_ONTOLOGY = [
  { term: 'sustainability', category: 'direct', synonyms: ['keberlanjutan', 'sustainable development', 'sustainability management'] },
  { term: 'ESG', category: 'direct', synonyms: ['esg compliance', 'esg reporting', 'environmental social governance'] },
  { term: 'renewable energy', category: 'direct', synonyms: ['energi terbarukan', 'solar energy', 'wind power', 'biomass', 'solar PV'] },
  { term: 'carbon accounting', category: 'direct', synonyms: ['audit karbon', 'carbon footprint', 'greenhouse gas', 'GHG accounting', 'jejak karbon'] },
  { term: 'net zero', category: 'direct', synonyms: ['net-zero carbon', 'carbon neutrality', 'emisi nol bersih', 'dekarbonisasi'] },
  { term: 'circular economy', category: 'direct', synonyms: ['ekonomi sirkular', 'closed loop', 'cradle to cradle', 'waste-to-resource'] },
  { term: 'green manufacturing', category: 'direct', synonyms: ['manufaktur hijau', 'eco-friendly production', 'clean production', 'green assembly'] },
  
  { term: 'energy efficiency', category: 'indirect', synonyms: ['efisiensi energi', 'energy saving', 'power optimization', 'energy conservation'] },
  { term: 'waste reduction', category: 'indirect', synonyms: ['pengurangan limbah', 'waste minimization', 'zero waste', 'limbah nihil', 'toxic waste'] },
  { term: 'environmental compliance', category: 'indirect', synonyms: ['kepatuhan lingkungan', 'AMDAL', 'UKL-UPL', 'PROPER', 'regulasi lingkungan'] },
  { term: 'ISO 14001', category: 'indirect', synonyms: ['iso14001', 'sistem manajemen lingkungan', 'environmental management system', 'EMS'] },
  { term: 'sustainable sourcing', category: 'indirect', synonyms: ['green procurement', 'sustainable supply chain', 'pembelian ramah lingkungan'] },
  { term: 'eco-design', category: 'indirect', synonyms: ['desain ekologis', 'design for environment', 'green product design'] },
  
  { term: 'smart manufacturing', category: 'transition', synonyms: ['manufaktur cerdas', 'industry 4.0', 'factory automation', 'cyber-physical systems'] },
  { term: 'IoT energy monitoring', category: 'transition', synonyms: ['monitoring energi pintar', 'smart grid', 'sub-metering', 'IoT power analytics'] },
  { term: 'environmental analytics', category: 'transition', synonyms: ['analisis lingkungan', 'environmental data science', 'pollution telemetry'] },
  { term: 'sustainable supply chain', category: 'transition', synonyms: ['logistik hijau', 'green logistics', 'sustainable logistics', 'emission-tracked transport'] }
];

const GENERAL_KEYWORDS = [
  'management', 'communication', 'leadership', 'teamwork', 'analytical', 'programming', 
  'problem solving', 'reporting', 'auditing', 'engineering', 'finance', 'operations',
  'marketing', 'recruitment', 'administration', 'budgeting', 'coordination'
];

// Helper for local regex-based NLP matching
function fallbackExtractSkills(text: string, title: string): any[] {
  const extracted: any[] = [];
  const lowerText = (title + ' ' + text).toLowerCase();
  
  // Check our Green Ontology terms & synonyms
  LOCAL_ONTOLOGY.forEach(item => {
    let matched = false;
    // Check main term
    if (lowerText.includes(item.term.toLowerCase())) {
      matched = true;
    }
    // Check synonyms
    if (!matched) {
      for (const syn of item.synonyms) {
        if (lowerText.includes(syn.toLowerCase())) {
          matched = true;
          break;
        }
      }
    }
    
    if (matched) {
      extracted.push({
        name: item.term,
        category: item.category,
        confidence: 0.85 + Math.random() * 0.1
      });
    }
  });
  
  // Check generic terms for diversity
  GENERAL_KEYWORDS.forEach(kw => {
    if (lowerText.includes(kw)) {
      extracted.push({
        name: kw.charAt(0).toUpperCase() + kw.slice(1),
        category: 'general',
        confidence: 0.75 + Math.random() * 0.15
      });
    }
  });
  
  return extracted;
}

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Real-time NLP skill extractor route using Gemini
app.post('/api/nlp/extract-skills', async (req, res) => {
  const { job_title = '', job_description = '', qualifications = '' } = req.body;
  const fullText = `${job_title}\n\n${job_description}\n\n${qualifications}`;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    // Fallback if key is missing or placeholder
    const skills = fallbackExtractSkills(fullText, job_title);
    return res.json({
      success: true,
      provider: 'local-regex-fallback',
      skills
    });
  }
  
  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `You are a professional Industrial Green Labor Market NLP AI specialized in Indonesia. 
Analyze the provided job vacancy text (Title, Description, and Qualifications).
Extract all technical skills, certifications, and operational qualifications.
Map each extracted skill into one of four specific categories:
1. 'direct': Explicit sustainable technologies or direct green metrics. E.g. Sustainability, ESG, Renewable Energy, Carbon Accounting, Solar PV, Circular Economy, Carbon footprint, Net Zero, Green Manufacturing.
2. 'indirect': Indirect practices for environmental protection. E.g. Energy Efficiency, Waste Reduction, AMDAL, UKL-UPL, ISO 14001, Environmental compliance, Sustainable sourcing, Green procurement, Eco-design.
3. 'transition': Industrial/Industry 4.0 techniques that drive ecological transition. E.g. Smart manufacturing, IoT energy monitoring, environmental analytics, sustainable supply chain, smart grid.
4. 'general': Conventional non-environmental skills. E.g. leadership, programming, budgeting, accounting, management, team collaboration.

For each skill, determine a confidence score between 0.0 and 1.0. 
Only output valid JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Job Title: ${job_title}\nJob Text:\n${fullText}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.ARRAY,
              description: 'List of extracted skills with their categories and confidence.',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: 'The standard name of the skill.'
                  },
                  category: {
                    type: Type.STRING,
                    enum: ['direct', 'indirect', 'transition', 'general'],
                    description: 'The green classification of the skill.'
                  },
                  confidence: {
                    type: Type.NUMBER,
                    description: 'AI confidence score between 0.0 and 1.0.'
                  }
                },
                required: ['name', 'category', 'confidence']
              }
            }
          },
          required: ['skills']
        }
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsed = JSON.parse(resultText);
    
    return res.json({
      success: true,
      provider: 'gemini-3.5-flash',
      skills: parsed.skills || []
    });
    
  } catch (err: any) {
    console.error('Gemini NLP extraction error:', err);
    // Graceful fallback on error so the app never crashes
    const skills = fallbackExtractSkills(fullText, job_title);
    return res.json({
      success: true,
      provider: 'local-regex-fallback-after-error',
      skills,
      error: err.message
    });
  }
});

// Setup Vite & Static Files routing
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
