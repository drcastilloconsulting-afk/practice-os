import { createAnthropicClient } from './clone-engine';

/**
 * AI Documentation Assistant
 * 
 * Generates clinical documentation tailored to provider role (MD, NP, RN).
 * SOAP notes, procedure notes, treatment plans, MD oversight docs.
 */

// Role-specific documentation constraints
const ROLE_CONSTRAINTS: Record<string, string> = {
    PHYSICIAN: `You are documenting for a physician (MD/DO). Full scope of practice:
- Can diagnose, prescribe, and treat independently
- Can order any test or procedure
- Can perform and sign off on Good Faith Exams
- Provides medical director oversight for NP/RN staff
- Signs off as supervising physician when required
- Uses full diagnostic formulation in assessments`,

    NURSE_PRACTITIONER: `You are documenting for a Nurse Practitioner (NP/ARNP). Scope considerations:
- Can diagnose and treat within scope (state-dependent)
- May require collaborative agreement with supervising physician
- Can prescribe (including controlled substances in most states)
- Document collaborative/supervisory relationship when required
- Include reference to treatment protocols approved by medical director
- Note when treatments are performed under medical director oversight`,

    REGISTERED_NURSE: `You are documenting for a Registered Nurse (RN). Scope considerations:
- CANNOT diagnose, prescribe, or independently create treatment plans
- Can document patient assessments, observations, and responses
- Can document procedural assistance and administration of ordered treatments
- Must reference physician/NP orders for all treatments
- Document "per order of [physician name]" for medications
- Focus on nursing assessments, interventions, and patient education
- Cannot sign off on treatment plans — must route to NP or MD`,

    PHYSICIAN_ASSISTANT: `You are documenting for a Physician Assistant (PA). Scope considerations:
- Can diagnose and treat under supervising physician
- Must reference supervising physician in documentation
- Can prescribe (state-dependent)
- Document supervisory relationship
- Include reference to protocols and collaborative agreements`,
};

// Document type templates
const DOC_TYPE_INSTRUCTIONS: Record<string, string> = {
    SOAP_NOTE: `Generate a SOAP note with these sections:

**SUBJECTIVE:**
- Chief complaint
- History of present illness (HPI)
- Review of systems (ROS)
- Past medical/surgical history
- Medications, allergies, supplements
- Social history

**OBJECTIVE:**
- Vital signs
- Physical examination findings
- Lab results (if available)
- Assessment tools/scores

**ASSESSMENT:**
- Diagnosis/diagnoses with ICD-10 codes
- Clinical reasoning
- Differential diagnoses if applicable

**PLAN:**
- Treatment plan with specifics (medications, doses, frequency)
- CPT codes for procedures/services
- Labs ordered
- Referrals
- Patient education provided
- Follow-up plan
- Return visit timing`,

    PROCEDURE_NOTE: `Generate a Procedure Note with these sections:

**PROCEDURE:** Name and CPT code
**DATE:** 
**PROVIDER:** Name, credentials, license
**INDICATION:** Why the procedure was performed
**CONSENT:** Informed consent obtained (yes/no, type)
**TECHNIQUE:**
- Patient positioning
- Sterile preparation
- Anesthesia (type, amount, lot number)
- Step-by-step procedure description
- Products used (name, lot number, expiration, amount, manufacturer)
- Injection sites/areas treated (be specific with anatomical landmarks)
**INTRA-PROCEDURE:** Patient tolerance, any complications
**POST-PROCEDURE:** Instructions given, restrictions, follow-up
**OUTCOME:** Immediate result
**COMPLICATIONS:** None, or describe
**SPECIMENS:** If applicable`,

    TREATMENT_PLAN_DOC: `Generate a Treatment Plan document with:

**PATIENT:** Name, DOB, date
**PROVIDER:** Name, credentials
**DIAGNOSIS:** Primary and secondary with ICD-10
**TREATMENT GOALS:** Specific, measurable outcomes
**TREATMENT PROTOCOL:**
- Medications/hormones with exact dosing
- Procedures scheduled with frequency
- Supplements recommended
- Lifestyle modifications
- Monitoring schedule (labs, follow-ups)
**EXPECTED TIMELINE:** When to expect results
**RISKS & BENEFITS:** Of the proposed treatment
**ALTERNATIVES:** Other treatment options discussed
**PATIENT UNDERSTANDING:** Education provided, questions addressed
**CONSENT:** Patient agrees to plan
**FOLLOW-UP:** Next appointment, when to call office`,

    MD_OVERSIGHT_NOTE: `Generate a Medical Director Oversight Note:

**OVERSIGHT TYPE:** Chart review / Protocol review / Direct supervision
**DATE OF REVIEW:**
**MEDICAL DIRECTOR:** Name, MD, license number
**PRACTITIONER REVIEWED:** Name, credentials (NP/RN)

**PATIENTS REVIEWED:** [List if chart review]
**PROTOCOLS REVIEWED:** [List if protocol review]

**FINDINGS:**
- Adherence to treatment protocols: Yes/No + details
- Documentation completeness: Adequate/Needs improvement
- Patient outcomes tracking: On track/Concerns noted
- Scope of practice compliance: Within scope/Concerns

**RECOMMENDATIONS:**
- Continue current protocols
- Modifications recommended
- Additional training needed
- Follow-up items

**MEDICAL DIRECTOR SIGNATURE:** _______________
**DATE:** _______________`,

    INITIAL_CONSULTATION: `Generate an Initial Consultation Note:

**PATIENT:** Name, DOB, age, gender
**DATE OF VISIT:**
**PROVIDER:** Name, credentials
**REFERRAL SOURCE:** Self-referral / physician referral / marketing

**CHIEF COMPLAINT:** In patient's words
**HISTORY OF PRESENT ILLNESS:** Detailed narrative
**PAST MEDICAL HISTORY:** Conditions, surgeries, hospitalizations
**MEDICATIONS:** Complete list with doses
**ALLERGIES:** Drug and other
**FAMILY HISTORY:** Relevant conditions
**SOCIAL HISTORY:** Occupation, exercise, diet, substances

**REVIEW OF SYSTEMS:** Complete 14-point ROS

**PHYSICAL EXAMINATION:**
- General appearance
- Vitals
- System-specific exam based on complaint

**LABS REVIEWED:** If available
**IMAGING REVIEWED:** If available

**ASSESSMENT:**
- Primary diagnosis/diagnoses with ICD-10
- Clinical reasoning

**PLAN:**
- Recommended treatment protocol
- Labs ordered
- Imaging ordered
- Patient education
- Follow-up
- Referrals if any`,

    GOOD_FAITH_EXAM: `Generate a Good Faith Examination document. This is a state-required examination before certain aesthetic/regenerative procedures.

**GOOD FAITH EXAMINATION**
**Date:** 
**Patient:** Name, DOB
**Examining Provider:** Name, MD, license number

**I. HEALTH HISTORY REVIEW**
- Medical conditions reviewed
- Medications reviewed
- Allergies reviewed
- Previous treatments reviewed
- Contraindications assessment

**II. PHYSICAL EXAMINATION**
- General appearance
- Skin assessment (type, condition, concerns)
- Area-specific examination
- Vital signs if indicated

**III. CLINICAL ASSESSMENT**
- Patient is/is not a candidate for requested procedure
- Contraindications: none identified / identified (specify)
- Risk factors: (list)

**IV. TREATMENT RECOMMENDATION**
- Recommended procedure(s)
- Alternatives discussed
- Expected outcomes
- Limitations

**V. RISKS & BENEFITS DISCLOSURE**
- Risks discussed: (list)
- Benefits discussed: (list)
- Patient verbalized understanding

**VI. INFORMED CONSENT**
- Patient consents to recommended treatment
- All questions addressed

**VII. PROVIDER ATTESTATION**
I have performed a good faith examination of this patient and determined they are an appropriate candidate for the requested treatment.

Provider Signature: _______________
License #: _______________
Date/Time: _______________`,
};

// Generate a clinical document
export async function generateClinicalDocument({
    documentType,
    providerRole,
    providerName,
    providerLicense,
    patientName,
    visitData,
    state,
}: {
    documentType: string;
    providerRole: string;
    providerName: string;
    providerLicense?: string;
    patientName: string;
    visitData: string; // Free-text or structured visit information
    state?: string;
}) {
    const client = createAnthropicClient();

    const roleConstraint = ROLE_CONSTRAINTS[providerRole] || ROLE_CONSTRAINTS.PHYSICIAN;
    const docTemplate = DOC_TYPE_INSTRUCTIONS[documentType] || '';

    const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8192,
        system: `You are an expert medical documentation assistant for regenerative medicine and wellness practices. Generate precise, compliant clinical documentation.

${roleConstraint}

## Documentation Standards
- Use proper medical terminology
- Include ICD-10 diagnosis codes where applicable
- Include CPT procedure codes where applicable
- Be specific with dosages, frequencies, routes of administration
- Include lot numbers and expiration dates for injectables when provided
- Document informed consent
- Include time spent (for E/M coding purposes)
- Note medical necessity for all treatments
- State: ${state || 'Not specified'} (apply state-specific requirements)

## Format
${docTemplate}

## Rules
1. Generate COMPLETE documentation — never use placeholders like "[insert here]"
2. Use the visit data provided to fill in all fields
3. If information is missing, note "Not documented" rather than inventing data
4. For medications, always include name, dose, frequency, and route
5. Include provider credentials and license number
6. Date all entries
7. Professional, concise language — no unnecessary verbosity`,
        messages: [
            {
                role: 'user',
                content: `Generate a ${documentType} document.

Provider: ${providerName} (${providerRole})${providerLicense ? `, License: ${providerLicense}` : ''}
Patient: ${patientName}
State: ${state || 'CA'}

Visit Information:
${visitData}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    return textContent?.text || '';
}

// Generate structured data (ICD-10, CPT codes) from a clinical document
export async function extractClinicalCodes(documentContent: string) {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: `You are a medical coding specialist. Extract all ICD-10 diagnosis codes and CPT procedure codes from the clinical document. Also extract key structured data.

Output as JSON:
{
  "icd10Codes": [{ "code": "string", "description": "string", "primary": boolean }],
  "cptCodes": [{ "code": "string", "description": "string", "units": number }],
  "medications": [{ "name": "string", "dose": "string", "frequency": "string", "route": "string" }],
  "labsOrdered": [{ "name": "string", "cptCode": "string" }],
  "proceduresPerformed": [{ "name": "string", "site": "string" }],
  "followUpDays": number or null,
  "emLevel": "string or null (99201-99215)"
}

Only output valid JSON.`,
        messages: [
            { role: 'user', content: `Extract clinical codes from:\n\n${documentContent}` },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    try {
        return JSON.parse(textContent?.text || '{}');
    } catch {
        return { error: 'Failed to extract codes' };
    }
}
