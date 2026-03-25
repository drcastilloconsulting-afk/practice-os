import { createAnthropicClient } from './clone-engine';

/**
 * Treatment Follow-Up Engine
 * 
 * Generates treatment-specific follow-up messages, analyzes patient responses,
 * and determines when to escalate to provider.
 */

// Follow-up cadence templates per treatment type
export const FOLLOW_UP_CADENCES: Record<string, Array<{
    dayOffset: number;
    type: string;
    channel: string;
    description: string;
}>> = {
    HRT_MALE: [
        { dayOffset: 1, type: 'INITIAL_CHECK', channel: 'SMS', description: 'Day 1 - Injection site check, initial side effects' },
        { dayOffset: 3, type: 'SIDE_EFFECT_CHECK', channel: 'SMS', description: 'Day 3 - Early side effects assessment' },
        { dayOffset: 7, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 1 - Energy, mood, sleep baseline comparison' },
        { dayOffset: 14, type: 'PROGRESS_CHECK', channel: 'EMAIL', description: 'Week 2 - Symptom improvement tracking' },
        { dayOffset: 28, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 4 - Comprehensive symptom reassessment' },
        { dayOffset: 42, type: 'LAB_REMINDER', channel: 'EMAIL', description: 'Week 6 - Lab work reminder (Total T, Free T, E2, CBC, CMP)' },
        { dayOffset: 49, type: 'DOSAGE_CHECK', channel: 'IN_APP', description: 'Week 7 - Compliance check & dosage adjustment review' },
        { dayOffset: 56, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 8 - Provider review trigger, outcome scoring' },
        { dayOffset: 84, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Month 3 - Quarterly check-in' },
        { dayOffset: 168, type: 'LAB_REMINDER', channel: 'EMAIL', description: 'Month 6 - Semi-annual labs' },
    ],
    HRT_FEMALE: [
        { dayOffset: 1, type: 'INITIAL_CHECK', channel: 'SMS', description: 'Day 1 - Application/injection check' },
        { dayOffset: 3, type: 'SIDE_EFFECT_CHECK', channel: 'SMS', description: 'Day 3 - Mood, bleeding, breast tenderness' },
        { dayOffset: 7, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 1 - Hot flash/night sweat frequency' },
        { dayOffset: 14, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 2 - Sleep, mood, energy tracking' },
        { dayOffset: 28, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 4 - Full symptom reassessment' },
        { dayOffset: 42, type: 'LAB_REMINDER', channel: 'EMAIL', description: 'Week 6 - Labs (E2, Progesterone, T, DHEA-S, thyroid)' },
        { dayOffset: 56, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 8 - Provider review, plan adjustment' },
        { dayOffset: 84, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Month 3 - Quarterly wellness check' },
    ],
    PEPTIDE_THERAPY: [
        { dayOffset: 1, type: 'INITIAL_CHECK', channel: 'SMS', description: 'Day 1 - Injection technique, storage confirmation' },
        { dayOffset: 3, type: 'SIDE_EFFECT_CHECK', channel: 'SMS', description: 'Day 3 - Injection site reactions, nausea, flushing' },
        { dayOffset: 7, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 1 - Sleep quality changes (common with GH peptides)' },
        { dayOffset: 21, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 3 - Healing/recovery/energy changes' },
        { dayOffset: 42, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 6 - Comprehensive progress, continue/adjust' },
        { dayOffset: 84, type: 'LAB_REMINDER', channel: 'EMAIL', description: 'Month 3 - Labs if applicable (IGF-1 for GH peptides)' },
    ],
    STEM_CELL_JOINT: [
        { dayOffset: 1, type: 'INITIAL_CHECK', channel: 'SMS', description: 'Day 1 - Pain level, swelling, ice protocol' },
        { dayOffset: 3, type: 'SIDE_EFFECT_CHECK', channel: 'SMS', description: 'Day 3 - Flare-up check, activity restriction reminder' },
        { dayOffset: 7, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 1 - Pain trend, mobility assessment' },
        { dayOffset: 14, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 2 - Gradual activity return guidance' },
        { dayOffset: 30, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Month 1 - Functional improvement scoring' },
        { dayOffset: 60, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Month 2 - Outcome assessment, PT recommendation' },
        { dayOffset: 90, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Month 3 - Follow-up imaging discussion' },
        { dayOffset: 180, type: 'PROGRESS_CHECK', channel: 'EMAIL', description: 'Month 6 - Long-term outcome, booster discussion' },
    ],
    IV_NAD: [
        { dayOffset: 0, type: 'INITIAL_CHECK', channel: 'SMS', description: 'Same day - Post-infusion side effects (nausea, flushing, chest tightness)' },
        { dayOffset: 1, type: 'SIDE_EFFECT_CHECK', channel: 'SMS', description: 'Day 1 - Recovery, energy changes' },
        { dayOffset: 7, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 1 - Cognitive clarity, energy, sleep changes' },
        { dayOffset: 14, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 2 - Sustained benefits assessment' },
        { dayOffset: 28, type: 'REFILL_REMINDER', channel: 'EMAIL', description: 'Month 1 - Next infusion scheduling' },
    ],
    DEFAULT: [
        { dayOffset: 1, type: 'INITIAL_CHECK', channel: 'SMS', description: 'Day 1 - Post-treatment check' },
        { dayOffset: 7, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Week 1 - Initial progress' },
        { dayOffset: 30, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Month 1 - Progress review' },
        { dayOffset: 60, type: 'PROGRESS_CHECK', channel: 'IN_APP', description: 'Month 2 - Outcome assessment' },
        { dayOffset: 90, type: 'LAB_REMINDER', channel: 'EMAIL', description: 'Month 3 - Lab work & review' },
    ],
};

// Generate a follow-up message based on treatment context
export async function generateFollowUpMessage({
    patientName,
    treatmentType,
    treatmentName,
    followUpType,
    daysSinceTreatment,
    previousScores,
    medications,
}: {
    patientName: string;
    treatmentType: string;
    treatmentName: string;
    followUpType: string;
    daysSinceTreatment: number;
    previousScores?: Record<string, number>;
    medications?: Array<{ name: string; dose: string; frequency: string }>;
}) {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are Dr. Castillo's follow-up care assistant. Generate personalized, warm follow-up messages for patients.

Rules:
- Be warm and caring, not clinical or robotic
- Ask specific questions relevant to their treatment
- Use their name
- Keep messages concise (2-4 short paragraphs)
- Include relevant symptom scoring questions (1-10 scales)
- NEVER give medical advice or adjust dosages — always defer to their provider
- If asking about side effects, be reassuring that most are temporary
- Include a clear call-to-action (respond to this message, call office if urgent)`,
        messages: [
            {
                role: 'user',
                content: `Generate a follow-up message for:
- Patient: ${patientName}
- Treatment: ${treatmentName} (${treatmentType})
- Follow-up type: ${followUpType}
- Days since treatment started: ${daysSinceTreatment}
${previousScores ? `- Previous symptom scores: ${JSON.stringify(previousScores)}` : ''}
${medications ? `- Current medications: ${medications.map(m => `${m.name} ${m.dose} ${m.frequency}`).join(', ')}` : ''}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    return textContent?.text || '';
}

// Analyze a patient's follow-up response and determine if escalation is needed
export async function analyzeFollowUpResponse({
    patientName,
    treatmentType,
    treatmentName,
    daysSinceTreatment,
    patientResponse,
    previousScores,
    currentScores,
}: {
    patientName: string;
    treatmentType: string;
    treatmentName: string;
    daysSinceTreatment: number;
    patientResponse: string;
    previousScores?: Record<string, number>;
    currentScores?: Record<string, number>;
}) {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: `You are a clinical follow-up analyst. Analyze a patient's response to a follow-up check and determine:
1. Whether the patient is progressing as expected
2. Whether any side effects require attention
3. Whether escalation to the provider is needed

Output your analysis as JSON:
{
  "progressAssessment": "string (1-2 sentences)",
  "complianceScore": number (1-10),
  "sideEffectsConcern": "none" | "mild" | "moderate" | "severe",
  "sideEffectsDetail": "string or null",
  "escalationNeeded": boolean,
  "escalationReason": "string or null",
  "escalationUrgency": "routine" | "urgent" | "emergency",
  "recommendedAction": "string",
  "nextFollowUpSuggestion": "string"
}

Escalation triggers:
- Patient reports severe pain (>7/10) that wasn't expected
- Allergic reaction symptoms (difficulty breathing, swelling, rash)
- Significant mood changes (suicidal ideation is ALWAYS emergency)
- Symptoms worsening instead of improving after expected timeline
- Patient reports not taking medications / non-compliance
- Any mention of chest pain, shortness of breath, or neurological symptoms
- Patient expresses desire to stop treatment
- Lab values significantly outside expected range

Only output valid JSON.`,
        messages: [
            {
                role: 'user',
                content: `Analyze this follow-up response:
- Patient: ${patientName}
- Treatment: ${treatmentName} (${treatmentType})
- Days since treatment: ${daysSinceTreatment}
- Patient response: "${patientResponse}"
${previousScores ? `- Previous scores: ${JSON.stringify(previousScores)}` : ''}
${currentScores ? `- Current scores: ${JSON.stringify(currentScores)}` : ''}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    try {
        return JSON.parse(textContent?.text || '{}');
    } catch {
        return { progressAssessment: textContent?.text, escalationNeeded: false };
    }
}
