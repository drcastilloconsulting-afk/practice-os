import Anthropic from '@anthropic-ai/sdk';

// ─────────────────────────────────────────────────────────
// UA Squad AI Engine — Empathetic Health Strategist
// ─────────────────────────────────────────────────────────

const MODEL = 'claude-3-5-haiku-20241022';

// ─── System Prompt ────────────────────────────────────────

const UA_SQUAD_SYSTEM_PROMPT = `You are the **UA Squad Protocol Designer** — an empathetic, science-literate health strategist embedded in the UA Squad leaderboard program.

## Your Personality & Philosophy
- You NEVER judge lifestyle choices. Period.
- Instead you find **biological workarounds** ("offsets") that let subscribers keep the habits they love while still improving their biomarkers.
- You negotiate constraints like a coach, not a drill sergeant: wine at dinner, late meals, no morning workouts, 10+ hours seated, travel schedules — all of these are **inputs**, not excuses.
- You propose **mitigations with an evidence basis** — cite mechanisms, not just rules.
- You are warm, direct, and practical. You speak like a trusted advisor who genuinely wants the subscriber to win their cohort.

## Knowledge Domains
- **Sleep science**: sleep stages, adenosine clearance, melatonin timing, blue-light hygiene, sleep pressure, temperature regulation
- **Circadian rhythms**: light exposure timing, cortisol awakening response, meal timing windows, chronotype adaptation
- **Zone 2 cardio**: mitochondrial biogenesis, fat oxidation, lactate threshold, MAF method, conversational pace
- **Hydration**: electrolyte balance, sodium-potassium ratios, intracellular vs extracellular hydration, urine specific gravity
- **Supplements**: magnesium forms, omega-3 DHA/EPA

## Mitigation Output Format
When proposing a specific habit mitigation or offset, include it in this exact structured format so the system can parse it:
[MITIGATION]{"choice":"...","mitigation":"...","confidence":"high|medium|low","evidenceBasis":"..."}[/MITIGATION]
Make sure this block is valid JSON.`;

// Initialize the Anthropic client
function createAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  });
}

export async function streamUASquadChat({
  messages,
  subscriberContext,
}: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  subscriberContext?: {
    habits?: string[];
    wearableDataSummary?: string;
    cohortRank?: string;
  };
}) {
  const client = createAnthropicClient();

  let systemPrompt = UA_SQUAD_SYSTEM_PROMPT;
  if (subscriberContext) {
    systemPrompt += `\n\n## Subscriber Context\n`;
    if (subscriberContext.habits) {
      systemPrompt += `- Current Habits: ${subscriberContext.habits.join(', ')}\n`;
    }
    if (subscriberContext.wearableDataSummary) {
      systemPrompt += `- Wearable Data Summary: ${subscriberContext.wearableDataSummary}\n`;
    }
    if (subscriberContext.cohortRank) {
      systemPrompt += `- Cohort Standings: ${subscriberContext.cohortRank}\n`;
    }
  }

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  return stream;
}

export async function generateWeeklyReport({
  subscriberName,
  habits,
  wearableData,
  leaderboardData,
}: {
  subscriberName: string;
  habits: Array<{ habitName: string; description?: string; targetMetric?: string; mitigationStrategy?: string; complianceRate?: number }>;
  wearableData?: Record<string, unknown>;
  leaderboardData?: { rank?: number; score?: number; delta?: number; cohortSize?: number };
}) {
  const client = createAnthropicClient();

  const habitsList = habits
    .map(
      (h, i) =>
        `${i + 1}. **${h.habitName}**${h.targetMetric ? ` (Target: ${h.targetMetric})` : ''}
   - Strategy: ${h.mitigationStrategy || 'Not specified'}
   - Compliance: ${h.complianceRate !== undefined ? `${h.complianceRate}%` : 'Not tracked'}`
    )
    .join('\n');

  const systemPrompt = `You are a UA Squad Weekly Report Analyst. Summarize the subscriber's weekly performance in markdown. Ensure the tone is encouraging, objective, and analytical.`;

  const userMessage = `Generate a weekly report for ${subscriberName}.
  
## Current Habits
${habitsList}

## Wearable Telemetry
${wearableData ? JSON.stringify(wearableData, null, 2) : 'No wearable data recorded this week.'}

## Leaderboard Standings
- Rank: ${leaderboardData?.rank ?? 'N/A'} of ${leaderboardData?.cohortSize ?? 'N/A'}
- IPS Score: ${leaderboardData?.score ?? 'N/A'}%
- Improvement Delta: ${leaderboardData?.delta !== undefined ? (leaderboardData.delta > 0 ? '+' : '') + leaderboardData.delta + '%' : 'N/A'}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  return textContent?.text || 'Unable to generate weekly report.';
}

export async function generateMitigationProposal(constraint: string): Promise<{
  choice: string;
  mitigation: string;
  confidence: 'high' | 'medium' | 'low';
  evidenceBasis: string;
} | null> {
  const client = createAnthropicClient();

  const systemPrompt = `You are a longevity physiologist. Given a lifestyle constraint, propose a direct physiological offset mitigation. Respond ONLY with a valid JSON object matching this schema:
  {
    "choice": "the lifestyle constraint",
    "mitigation": "the biological workaround/mitigation strategy",
    "confidence": "high" | "medium" | "low",
    "evidenceBasis": "scientific mechanism justifying this workaround"
  }`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Constraint: ${constraint}`,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent) return null;

    return JSON.parse(textContent.text.trim());
  } catch (error) {
    console.error('Error generating mitigation proposal:', error);
    return null;
  }
}
