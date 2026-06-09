import { createAnthropicClient } from '../ai/clone-engine';

/**
 * AI Marketing Content & Campaign Manager
 * 
 * Generates compliant medical marketing content:
 * - Social media posts (FB, IG, X, YouTube)
 * - Content calendars
 * - Email campaigns
 * - Blog SEO content
 * - Medical advertising compliance guardrails
 */

// Medical advertising compliance rules
const COMPLIANCE_GUARDRAILS = `
## Medical Advertising Compliance Rules

You MUST follow these rules when generating marketing content:

### FDA Compliance
- NEVER make drug claims for non-FDA-approved treatments
- Never promise specific outcomes or use language like "cure," "guaranteed," or "100%"
- Use terms like "may help," "designed to support," "many patients report"
- Always include that results vary and individual outcomes are not guaranteed

### FTC Compliance
- All claims must be truthful and not misleading
- Testimonials must reflect typical results or include a disclaimer
- Before/after photos must be genuine and representative
- Pricing must not be deceptive

### State Medical Board Rules
- California: Cannot use "board certified" unless certified by an ABMS board
- Do not imply a non-physician provider is a physician
- Clearly identify the supervising physician for mid-level providers
- Include practice name and responsible physician name in ads

### Regenerative Medicine Specific
- Stem cells: Avoid claiming FDA approval (most are not FDA-approved for specific conditions)
- Use: "autologous cell therapy" or "regenerative procedures" cautiously
- Peptides: Follow compounding pharmacy regulations in advertising
- IV therapy: Cannot claim to cure or treat disease — focus on wellness/optimization
- Exosomes: Use very careful language — regulatory landscape is evolving
- Hormones: Can discuss bio-identical HRT but not as superior to conventional

### Social Media Specific
- Instagram: No before/after in ads (Meta policy), ok in organic posts with disclaimers
- Facebook: Medical ads may require special ad category
- All platforms: "Results may vary" disclaimer on outcome-related posts
- Never show procedures on minors
- Patient photos require written HIPAA authorization for marketing use

### Required Disclaimers
Add where appropriate:
- "Results may vary. Individual outcomes are not guaranteed."
- "This information is for educational purposes only and is not medical advice."
- "Consult with a qualified healthcare provider before starting any treatment."
`;

// Content tone and voice
const BRAND_VOICE = `
## Dr. Castillo's Brand Voice for Marketing

### Tone
- Authoritative but approachable
- Educational and empowering
- Warm, direct, and real (no corporate speak)
- Confident expertise without arrogance
- Conversational but professional

### Key Themes
- Regenerative medicine is the future of healthcare
- Your body has the capacity to heal itself — we just help optimize the process
- Evidence-based approaches with cutting-edge science
- Whole-person wellness, not just symptom management
- Longevity and performance optimization
- "Radical ownership" of your health

### Vocabulary Preferences
- Use: "optimize," "regenerate," "restore," "support," "enhance"
- Avoid: "cure," "fix," "guarantee," "miracle," "revolutionary"
- Prefer: "evidence-based" over "scientifically proven"
- Use: "providers" not "doctors" when referring to mixed staff

### Hashtags (Instagram/X)
#RegenerativeMedicine #FunctionalMedicine #WellnessOptimization #HRT 
#PeptideTherapy #StemCellTherapy #Biohacking #Longevity #AntiAging
#HormoneHealth #RegenerativeOrtho #IVTherapy #ExosomeTherapy
#WellnessBusiness #MedSpa #IntegrativeMedicine
`;

export type ContentType = 'social_post' | 'story' | 'reel_script' | 'email' | 'blog' | 'ad_copy';
export type Platform = 'facebook' | 'instagram' | 'x' | 'youtube' | 'email' | 'blog';

interface ContentRequest {
    type: ContentType;
    platform: Platform;
    topic: string;
    audience?: string;
    callToAction?: string;
    tone?: string;
    includeHashtags?: boolean;
    wordCount?: number;
    additionalContext?: string;
}

interface ContentPiece {
    content: string;
    platform: Platform;
    type: ContentType;
    hashtags?: string[];
    suggestedMedia?: string;
    disclaimer?: string;
    complianceNotes?: string[];
    seoKeywords?: string[];
}

// Generate a single content piece
export async function generateContent(request: ContentRequest): Promise<ContentPiece> {
    const client = createAnthropicClient();

    const platformInstructions: Record<Platform, string> = {
        facebook: 'Facebook post. 1-3 paragraphs. Engagement-focused with a question or CTA. Can include links.',
        instagram: 'Instagram caption. Start with a hook. Use line breaks for readability. End with CTA. Include relevant hashtags (10-15). No links in caption.',
        x: 'X/Twitter post. Max 280 characters for main tweet. Punchy and attention-grabbing. Can suggest a thread format for educational content.',
        youtube: 'YouTube video title, description (SEO-optimized), and tags. Include timestamps suggestion if educational content.',
        email: 'Email content with subject line, preview text, and body. Professional but warm. Clear CTA.',
        blog: `Blog post. ${request.wordCount || 800}-${(request.wordCount || 800) + 400} words. SEO-optimized with headers (H2, H3). Include meta title and meta description.`,
    };

    const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: `You are Dr. Castillo's marketing content creator for regenerative medicine practices.

${BRAND_VOICE}

${COMPLIANCE_GUARDRAILS}

## Output Format
Generate the content piece, then provide metadata as JSON after a separator "---META---":

{
  "hashtags": ["string"] or null,
  "suggestedMedia": "description of ideal photo/video to accompany this post",
  "disclaimer": "required disclaimer text or null",
  "complianceNotes": ["any compliance concerns to flag for review"],
  "seoKeywords": ["keywords"] or null
}

Platform-specific instructions: ${platformInstructions[request.platform]}`,
        messages: [
            {
                role: 'user',
                content: `Generate ${request.type} content for ${request.platform}:

Topic: ${request.topic}
${request.audience ? `Target audience: ${request.audience}` : ''}
${request.callToAction ? `Call to action: ${request.callToAction}` : ''}
${request.tone ? `Tone override: ${request.tone}` : ''}
${request.additionalContext ? `Additional context: ${request.additionalContext}` : ''}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    const fullText = textContent?.text || '';

    // Parse content and metadata
    const parts = fullText.split('---META---');
    const content = parts[0]?.trim() || fullText;
    let metadata: Partial<ContentPiece> = {};

    if (parts[1]) {
        try {
            metadata = JSON.parse(parts[1].trim());
        } catch { /* proceed without metadata */ }
    }

    return {
        content,
        platform: request.platform,
        type: request.type,
        hashtags: metadata.hashtags as string[] | undefined,
        suggestedMedia: metadata.suggestedMedia as string | undefined,
        disclaimer: metadata.disclaimer as string | undefined,
        complianceNotes: metadata.complianceNotes as string[] | undefined,
        seoKeywords: metadata.seoKeywords as string[] | undefined,
    };
}

// Generate a monthly content calendar
export async function generateContentCalendar({
    month,
    year,
    themes,
    postsPerWeek,
    platforms,
}: {
    month: number; // 1-12
    year: number;
    themes?: string[];
    postsPerWeek?: number;
    platforms: Platform[];
}) {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8192,
        system: `You are a medical marketing strategist for regenerative medicine practices.

${BRAND_VOICE}
${COMPLIANCE_GUARDRAILS}

Generate a complete monthly content calendar as JSON:
{
  "month": number,
  "year": number,
  "theme": "string (overall monthly theme)",
  "weeks": [
    {
      "weekNumber": number,
      "weekTheme": "string",
      "posts": [
        {
          "day": "string (Monday, Tuesday, etc.)",
          "date": "string (YYYY-MM-DD)",
          "platform": "facebook|instagram|x|youtube|email|blog",
          "type": "social_post|story|reel_script|email|blog|ad_copy",
          "topic": "string",
          "hook": "string (first line / attention grabber)",
          "cta": "string (call to action)",
          "mediaType": "photo|video|carousel|infographic|none",
          "bestTimeToPost": "string (e.g., 10am PT)",
          "complianceNote": "string or null"
        }
      ]
    }
  ],
  "monthlyGoals": ["string"],
  "keyDates": ["string (holidays, awareness days, etc.)"]
}

Only output valid JSON.`,
        messages: [
            {
                role: 'user',
                content: `Generate a content calendar for ${month}/${year}:
- Platforms: ${platforms.join(', ')}
- Posts per week: ${postsPerWeek || 4}
${themes ? `- Monthly themes to incorporate: ${themes.join(', ')}` : ''}
- Include seasonal/holiday tie-ins
- Mix of educational, promotional, and engagement content
- Ensure all content passes medical advertising compliance`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    try {
        return JSON.parse(textContent?.text || '{}');
    } catch {
        return { raw: textContent?.text, error: 'Failed to parse calendar' };
    }
}

// Generate email campaign drip sequence
export async function generateEmailCampaign({
    campaignType,
    emails,
    audience,
}: {
    campaignType: 'welcome' | 'nurture' | 'reengagement' | 'treatment_education' | 'seasonal_promo';
    emails: number; // Number of emails in sequence
    audience: string;
}) {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8192,
        system: `You are a medical email marketing specialist.

${BRAND_VOICE}
${COMPLIANCE_GUARDRAILS}

Generate an email drip campaign as JSON:
{
  "campaignName": "string",
  "campaignType": "string",
  "audience": "string",
  "totalEmails": number,
  "emails": [
    {
      "sequenceNumber": number,
      "sendDelay": "string (e.g., 'immediately', 'day 3', 'day 7')",
      "subjectLine": "string",
      "previewText": "string (first 90 chars shown in inbox)",
      "body": "string (full email body in markdown)",
      "cta": { "text": "string", "url": "string (suggested)" },
      "complianceNote": "string or null"
    }
  ],
  "expectedOpenRate": "string",
  "expectedClickRate": "string"
}

Only output valid JSON.`,
        messages: [
            {
                role: 'user',
                content: `Generate a ${emails}-email ${campaignType} campaign for: ${audience}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    try {
        return JSON.parse(textContent?.text || '{}');
    } catch {
        return { raw: textContent?.text, error: 'Failed to parse campaign' };
    }
}

// Compliance check on any marketing content
export async function checkCompliance(content: string, platform: Platform): Promise<{
    approved: boolean;
    issues: Array<{ severity: 'warning' | 'violation'; rule: string; description: string; suggestion: string }>;
}> {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: `You are a medical advertising compliance reviewer. Check the content against FDA, FTC, and state medical board rules for regenerative medicine marketing.

${COMPLIANCE_GUARDRAILS}

Output as JSON:
{
  "approved": boolean,
  "overallRisk": "low" | "medium" | "high",
  "issues": [
    {
      "severity": "warning" | "violation",
      "rule": "string (which rule is affected)",
      "description": "string (what the issue is)",
      "suggestion": "string (how to fix it)"
    }
  ]
}

Only output valid JSON. A "violation" means the content CANNOT be published as-is. A "warning" means it should be reviewed but may be acceptable.`,
        messages: [
            {
                role: 'user',
                content: `Review this ${platform} marketing content for compliance:\n\n${content}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    try {
        return JSON.parse(textContent?.text || '{"approved": false, "issues": []}');
    } catch {
        return { approved: false, issues: [{ severity: 'warning', rule: 'Parse error', description: 'Could not parse compliance check', suggestion: 'Manual review required' }] };
    }
}
