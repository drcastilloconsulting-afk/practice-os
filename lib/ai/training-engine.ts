import { createAnthropicClient } from '../ai/clone-engine';

/**
 * AI Staff Training & Protocol Compliance System
 * 
 * Interactive training with scenarios, quizzes, and certification logging.
 */

// Training module categories
export const TRAINING_CATEGORIES = {
    CLINICAL_PROCEDURES: {
        label: 'Clinical Procedures',
        description: 'Injection techniques, IV setup, wound care, patient positioning',
        modules: [
            'IM Injection Technique',
            'SubQ Injection Technique',
            'IV Catheter Insertion & Management',
            'PRP Preparation & Centrifuge Operation',
            'Stem Cell Handling & Storage Protocol',
            'Exosome Reconstitution & Administration',
            'Vital Signs Assessment',
            'Phlebotomy & Blood Draw',
            'Before/After Photo Documentation',
        ],
    },
    PATIENT_CONSULTATION: {
        label: 'Patient Consultation',
        description: 'Communication, intake, expectation setting, informed consent',
        modules: [
            'Initial Consultation Framework',
            'Setting Realistic Expectations',
            'Informed Consent Process',
            'Explaining Treatment Options',
            'Handling Price Objections',
            'Follow-Up Call Protocol',
            'Dealing with Difficult Patients',
        ],
    },
    SAFETY_PROTOCOLS: {
        label: 'Safety & Emergency',
        description: 'Adverse reactions, emergency procedures, safety protocols',
        modules: [
            'Anaphylaxis Recognition & Response',
            'Vasovagal Episode Management',
            'IV Infiltration Response',
            'Adverse Reaction Documentation',
            'Emergency Equipment Location & Use',
            'CPR/BLS Refresher Scenario',
            'Needle Stick Protocol',
        ],
    },
    HIPAA_COMPLIANCE: {
        label: 'HIPAA & Privacy',
        description: 'Patient privacy, data handling, breach response',
        modules: [
            'HIPAA Fundamentals',
            'PHI Handling & Storage',
            'Patient Photo Consent for Marketing',
            'Social Media PHI Pitfalls',
            'Breach Identification & Response',
            'Minimum Necessary Standard',
            'Front Desk Privacy Practices',
        ],
    },
    REGULATORY: {
        label: 'Regulatory Compliance',
        description: 'Medical waste, OSHA, state regulations',
        modules: [
            'Medical Waste Disposal',
            'OSHA Bloodborne Pathogen Standard',
            'Sharps Disposal Protocol',
            'Autoclave & Sterilization',
            'State-Specific Practice Regulations',
            'DEA Controlled Substance Handling',
            'Product Storage & Temperature Monitoring',
        ],
    },
    CUSTOMER_SERVICE: {
        label: 'Customer Service',
        description: 'Patient experience, retention, satisfaction',
        modules: [
            'The Patient Experience Journey',
            'First Impression Protocol',
            'Phone/Text Communication Standards',
            'Managing Complaints & Escalations',
            'Patient Retention Strategies',
            'Review Request Protocol',
            'VIP Patient Management',
        ],
    },
};

interface TrainingScenario {
    scenario: string;
    context: string;
    correctApproach: string;
    commonMistakes: string[];
    keyTakeaways: string[];
}

interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    category: string;
}

interface TrainingResult {
    moduleId: string;
    userId: string;
    score: number;
    passingScore: number;
    passed: boolean;
    questionsTotal: number;
    questionsCorrect: number;
    completedAt: string;
    certificateId?: string;
    expiresAt?: string;
}

// Generate interactive training scenario
export async function generateTrainingScenario({
    category,
    module,
    difficultyLevel,
    providerRole,
}: {
    category: string;
    module: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    providerRole: string;
}): Promise<TrainingScenario> {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `You are a medical training scenario designer for regenerative medicine practices. Create realistic, interactive training scenarios.

Rules:
- Scenarios must be clinically accurate
- Include realistic patient dialogue and situations
- Adapt complexity to the specified difficulty level
- Consider the provider's role and scope of practice
- Include subtle details that test attention to protocol
- Never include anything that could cause harm if misapplied

Output as JSON:
{
  "scenario": "string (detailed scenario description with patient dialogue)",
  "context": "string (clinical setting and relevant background)",
  "correctApproach": "string (step-by-step correct response)",
  "commonMistakes": ["string (mistakes trainees commonly make)"],
  "keyTakeaways": ["string (key learning points)"]
}

Only output valid JSON.`,
        messages: [
            {
                role: 'user',
                content: `Generate a ${difficultyLevel} training scenario:
- Category: ${category}
- Module: ${module}
- Provider role: ${providerRole}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    try {
        return JSON.parse(textContent?.text || '{}');
    } catch {
        return {
            scenario: textContent?.text || 'Failed to generate scenario',
            context: '',
            correctApproach: '',
            commonMistakes: [],
            keyTakeaways: [],
        };
    }
}

// Generate a quiz for a training module
export async function generateQuiz({
    category,
    module,
    questionCount,
    providerRole,
}: {
    category: string;
    module: string;
    questionCount: number;
    providerRole: string;
}): Promise<QuizQuestion[]> {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `You are a medical training quiz generator. Create accurate, challenging quiz questions for healthcare staff.

Rules:
- All questions must be clinically accurate
- Include a mix of recall, application, and analysis questions
- Wrong answers should be plausible but clearly distinguishable
- Explanations should teach, not just state the answer
- Consider scope of practice for the provider role

Output as JSON array:
[
  {
    "question": "string",
    "options": ["A. string", "B. string", "C. string", "D. string"],
    "correctIndex": number (0-3),
    "explanation": "string (why the answer is correct and others are wrong)",
    "category": "string"
  }
]

Generate exactly ${questionCount} questions. Only output valid JSON array.`,
        messages: [
            {
                role: 'user',
                content: `Generate ${questionCount} quiz questions:
- Category: ${category}
- Module: ${module}
- Provider role: ${providerRole}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    try {
        return JSON.parse(textContent?.text || '[]');
    } catch {
        return [];
    }
}

// Stream an interactive role-play training session
export async function streamTrainingRoleplay({
    messages,
    category,
    module,
    providerRole,
}: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    category: string;
    module: string;
    providerRole: string;
}) {
    const client = createAnthropicClient();

    const stream = client.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: `You are a training simulator for regenerative medicine practices. You role-play as a PATIENT in a training scenario to help the staff member practice their skills.

## Training Module: ${module}
## Category: ${category}
## Trainee Role: ${providerRole}

## Your Role
- You play the patient in the scenario
- Respond naturally and realistically
- Present symptoms, concerns, and behaviors typical of real patients
- If the trainee handles something incorrectly, stay in character but let the situation play out
- After 6-8 exchanges, break character and provide a performance review

## Performance Review Format (after the role-play):
---REVIEW---
**Overall Score:** X/10
**Strengths:** What they did well
**Areas for Improvement:** What to work on
**Compliance Check:** Any protocol violations
**Key Learning Points:** Takeaways for the trainee
---END REVIEW---

## Rules
- Start with a realistic patient greeting/presentation
- Gradually introduce complexity (new symptoms, concerns, questions)
- Test their ability to handle the specific module's content
- Be a realistic patient — sometimes anxious, sometimes chatty, sometimes difficult
- Never break character until the review phase`,
        messages: messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        })),
    });

    return stream;
}

// Score a completed quiz and generate certification
export function scoreQuiz({
    questions,
    answers,
    userId,
    moduleId,
    passingScore = 80,
}: {
    questions: QuizQuestion[];
    answers: number[];
    userId: string;
    moduleId: string;
    passingScore?: number;
}): TrainingResult {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].correctIndex) {
            correct++;
        }
    }

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= passingScore;

    return {
        moduleId,
        userId,
        score,
        passingScore,
        passed,
        questionsTotal: questions.length,
        questionsCorrect: correct,
        completedAt: new Date().toISOString(),
        certificateId: passed ? `CERT-${moduleId}-${userId}-${Date.now()}` : undefined,
        expiresAt: passed
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year expiry
            : undefined,
    };
}
