import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client for server-side operations
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'My Personal Cloud (MPC) Operations API',
    timestamp: new Date().toISOString(),
  });
});

// AI Content Refinement & Bio Polish Endpoint
app.post('/api/ai/refine-content', async (req: Request, res: Response) => {
  try {
    const { rawText, contentType, tone, customerName, businessName } = req.body;

    if (!rawText || typeof rawText !== 'string') {
      res.status(400).json({ error: 'rawText is required and must be a string' });
      return;
    }

    const systemPrompt = `You are a professional brand editor and executive copywriter for "My Personal Cloud (MPC)".
Your task is to refine, polish, and enhance structured content for a customer's professional online presence and website.

CRITICAL INSTRUCTIONAL CONSTRAINTS:
1. NEVER invent or fabricate facts, qualifications, degrees, company names, employment dates, or certifications.
2. Only polish the flow, tone, grammar, and compelling clarity of the facts provided by the customer.
3. Keep the voice executive, clear, credible, and modern.
4. Output concise, polished copy suitable for modern responsive web templates.`;

    const userPrompt = `Content Type: ${contentType || 'General Biography'}
Customer / Brand Name: ${customerName || businessName || 'Client'}
Tone: ${tone || 'Professional & Modern'}
Raw Input Draft:
"""
${rawText}
"""

Please provide a polished version of this text that is engaging, professional, and strictly faithful to the customer's stated information.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const refinedText = response.text || rawText;
    res.json({
      success: true,
      original: rawText,
      refined: refinedText.trim(),
    });
  } catch (error) {
    console.error('Error refining content with Gemini:', error);
    res.status(500).json({
      error: 'Failed to polish content with AI. Please check your Gemini API key or try again.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// AI Service Descriptions Generator
app.post('/api/ai/generate-services', async (req: Request, res: Response) => {
  try {
    const { skillsOrOfferings, industry } = req.body;

    if (!skillsOrOfferings) {
      res.status(400).json({ error: 'skillsOrOfferings is required' });
      return;
    }

    const prompt = `Based on the following skills and real offerings: "${skillsOrOfferings}" in the industry "${industry || 'Professional Services'}", format up to 4 structured service items with:
- title (short, 2-5 words)
- description (concise 1-2 sentences)
- iconCategory (one of: 'consulting', 'digital', 'management', 'creative', 'technology', 'finance')

Do not invent imaginary credentials. Return clean JSON array: [{ "title": "...", "description": "...", "iconCategory": "..." }]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, services: parsed });
  } catch (error) {
    console.error('Error generating services:', error);
    res.status(500).json({
      error: 'Failed to generate services.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Paystack / Billing Verification Simulator Endpoint
app.post('/api/billing/verify-payment', (req: Request, res: Response) => {
  const { reference, customerId, packageId, amountNgn, storeAddon } = req.body;

  if (!reference || !customerId || !packageId) {
    res.status(400).json({ error: 'Missing required payment verification parameters' });
    return;
  }

  // Simulated Paystack webhook verification response
  res.json({
    success: true,
    status: 'success',
    gateway: 'Paystack NGN',
    transactionId: `PSTK_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`,
    reference,
    customerId,
    packageId,
    amountNgn: amountNgn || 10000,
    storeAddon: Boolean(storeAddon),
    paidAt: new Date().toISOString(),
    message: 'Payment verified successfully and credited to customer account.',
  });
});

// In development, hook Vite middleware; in production, serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MPC Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[MPC Server] Startup failed:', err);
  process.exit(1);
});
