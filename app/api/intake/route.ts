import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: NextRequest) {
  const { messages, category, patientName } = await req.json();

  const system = `You are Dr. Castillo's AI intake concierge for a regenerative medicine practice. Your job is to conduct a warm, thorough pre-visit intake conversation with a patient.

## Your Role
- Gather the patient's chief complaint, symptoms, timeline, previous treatments, goals, and basic health history
- Recommend appropriate treatments from the practice menu based on their answers
- Pre-qualify them for a treatment consult
- Be warm, empathetic, and professional — not robotic or clinical
- Use plain language, not medical jargon
- Keep each response concise — 2-4 short paragraphs max
- Ask one focused question at a time

## Practice Services
${category ? `Focus on: ${category.replace(/_/g, ' ')}` : 'All services: Hormone Optimization (HRT), Peptide Therapy, Stem Cell Therapy, Exosomes, IV Therapy (NAD+, Myers), Weight Management, Regenerative Orthopaedics, Aesthetics'}

## Patient
${patientName ? `Patient name: ${patientName}` : 'Unknown patient — gather their name naturally'}

## Rules
- NEVER give medical advice or diagnose
- NEVER recommend specific medications or doses
- When you have enough information, generate a pre-visit summary in this format:
  **PRE-VISIT SUMMARY READY**
  - Patient: [name]
  - Chief Concern: [summary]  
  - Recommended Services: [list]
  - Readiness Score: [1-100]
  - Key Notes for Provider: [bullet points]`;

  const stream = client.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  });
}
