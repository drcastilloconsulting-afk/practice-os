import { createAnthropicClient } from './clone-engine';

/**
 * Dynamic Pricing & Schedule Optimization Engine
 * 
 * AI-driven pricing adjustments and schedule optimization
 * based on demand, margins, and revenue goals.
 */

// Service catalog with cost-of-goods data for regenerative medicine
export const DEFAULT_SERVICE_CATALOG: Array<{
    name: string;
    category: string;
    basePriceRange: [number, number]; // [min, max]
    typicalCOGS: number; // Cost of goods/supplies
    durationMinutes: number;
    marginTarget: number; // Target margin percentage
}> = [
        // Hormone Optimization
        { name: 'HRT Initial Consultation', category: 'HORMONE_OPTIMIZATION', basePriceRange: [250, 500], typicalCOGS: 15, durationMinutes: 60, marginTarget: 0.85 },
        { name: 'Testosterone Cypionate (10-week supply)', category: 'HORMONE_OPTIMIZATION', basePriceRange: [200, 400], typicalCOGS: 35, durationMinutes: 30, marginTarget: 0.80 },
        { name: 'Female HRT Panel + Consultation', category: 'HORMONE_OPTIMIZATION', basePriceRange: [300, 600], typicalCOGS: 120, durationMinutes: 60, marginTarget: 0.70 },
        { name: 'Thyroid Optimization Program', category: 'HORMONE_OPTIMIZATION', basePriceRange: [250, 450], typicalCOGS: 80, durationMinutes: 45, marginTarget: 0.75 },

        // Peptide Therapy
        { name: 'BPC-157 (30-day protocol)', category: 'PEPTIDE_THERAPY', basePriceRange: [300, 600], typicalCOGS: 75, durationMinutes: 30, marginTarget: 0.80 },
        { name: 'CJC-1295/Ipamorelin (30 days)', category: 'PEPTIDE_THERAPY', basePriceRange: [350, 700], typicalCOGS: 90, durationMinutes: 30, marginTarget: 0.80 },
        { name: 'Peptide Consultation', category: 'PEPTIDE_THERAPY', basePriceRange: [200, 400], typicalCOGS: 10, durationMinutes: 45, marginTarget: 0.90 },

        // Stem Cell & Exosomes
        { name: 'Stem Cell Therapy - Joint (single)', category: 'STEM_CELL', basePriceRange: [3000, 7000], typicalCOGS: 1200, durationMinutes: 60, marginTarget: 0.70 },
        { name: 'Stem Cell Therapy - IV Systemic', category: 'STEM_CELL', basePriceRange: [5000, 12000], typicalCOGS: 2500, durationMinutes: 90, marginTarget: 0.65 },
        { name: 'Exosome Therapy - IV', category: 'EXOSOME_THERAPY', basePriceRange: [2000, 5000], typicalCOGS: 800, durationMinutes: 60, marginTarget: 0.70 },
        { name: 'Exosome Therapy - Intranasal', category: 'EXOSOME_THERAPY', basePriceRange: [1500, 3500], typicalCOGS: 600, durationMinutes: 30, marginTarget: 0.70 },
        { name: 'Exosome Therapy - Joint', category: 'EXOSOME_THERAPY', basePriceRange: [2000, 5000], typicalCOGS: 800, durationMinutes: 45, marginTarget: 0.70 },

        // IV Therapy
        { name: 'NAD+ IV (500mg)', category: 'IV_THERAPY', basePriceRange: [500, 1200], typicalCOGS: 150, durationMinutes: 180, marginTarget: 0.75 },
        { name: 'Myers Cocktail IV', category: 'IV_THERAPY', basePriceRange: [150, 350], typicalCOGS: 40, durationMinutes: 45, marginTarget: 0.80 },
        { name: 'Amino Acid IV', category: 'IV_THERAPY', basePriceRange: [200, 450], typicalCOGS: 55, durationMinutes: 60, marginTarget: 0.80 },
        { name: 'Glutathione Push', category: 'IV_THERAPY', basePriceRange: [75, 200], typicalCOGS: 20, durationMinutes: 15, marginTarget: 0.85 },

        // Regenerative Ortho
        { name: 'PRP Joint Injection', category: 'REGENERATIVE_ORTHO', basePriceRange: [500, 1500], typicalCOGS: 120, durationMinutes: 45, marginTarget: 0.75 },
        { name: 'PRP Facial (Vampire Facial)', category: 'AESTHETICS', basePriceRange: [600, 1500], typicalCOGS: 150, durationMinutes: 60, marginTarget: 0.75 },
        { name: 'Prolotherapy Session', category: 'REGENERATIVE_ORTHO', basePriceRange: [300, 700], typicalCOGS: 30, durationMinutes: 30, marginTarget: 0.85 },

        // Weight Management
        { name: 'Weight Loss Consultation + Labs', category: 'WEIGHT_MANAGEMENT', basePriceRange: [300, 600], typicalCOGS: 100, durationMinutes: 60, marginTarget: 0.75 },
        { name: 'Semaglutide (4-week supply)', category: 'WEIGHT_MANAGEMENT', basePriceRange: [300, 600], typicalCOGS: 100, durationMinutes: 15, marginTarget: 0.75 },
        { name: 'Tirzepatide (4-week supply)', category: 'WEIGHT_MANAGEMENT', basePriceRange: [400, 800], typicalCOGS: 150, durationMinutes: 15, marginTarget: 0.75 },
    ];

// Calculate dynamic pricing based on demand factors
export function calculateDynamicPrice({
    basePrice,
    costOfGoods,
    minPrice,
    maxPrice,
    demandFactors,
}: {
    basePrice: number;
    costOfGoods: number;
    minPrice?: number;
    maxPrice?: number;
    demandFactors: {
        dayOfWeek: number; // 0=Sunday, 6=Saturday
        hourOfDay: number; // 0-23
        bookingLeadDays: number; // How far in advance booked
        currentUtilization: number; // 0-1 how full the schedule is
        waitlistCount: number; // People on waitlist for this service
        seasonalDemand: number; // 0-1 seasonal demand factor
        inventoryLevel: number; // 0-1 product inventory level
    };
}) {
    let multiplier = 1.0;

    // Peak hours premium (10am-2pm weekdays)
    const isPeakHour = demandFactors.hourOfDay >= 10 && demandFactors.hourOfDay <= 14;
    const isWeekday = demandFactors.dayOfWeek >= 1 && demandFactors.dayOfWeek <= 5;
    if (isPeakHour && isWeekday) {
        multiplier += 0.05; // 5% peak premium
    }

    // Saturday premium
    if (demandFactors.dayOfWeek === 6) {
        multiplier += 0.10; // 10% weekend premium
    }

    // High utilization surge
    if (demandFactors.currentUtilization > 0.85) {
        multiplier += 0.10; // 10% surge when nearly full
    } else if (demandFactors.currentUtilization < 0.40) {
        multiplier -= 0.05; // 5% discount when underbooked
    }

    // Waitlist demand indicator
    if (demandFactors.waitlistCount > 5) {
        multiplier += 0.08;
    } else if (demandFactors.waitlistCount > 2) {
        multiplier += 0.04;
    }

    // Last-minute booking premium
    if (demandFactors.bookingLeadDays < 1) {
        multiplier += 0.05; // Same-day premium
    } else if (demandFactors.bookingLeadDays > 14) {
        multiplier -= 0.03; // Advance booking discount
    }

    // Seasonal adjustment
    multiplier += (demandFactors.seasonalDemand - 0.5) * 0.1;

    // Low inventory premium (economics of scarcity)
    if (demandFactors.inventoryLevel < 0.2) {
        multiplier += 0.05;
    }

    // Calculate adjusted price
    let adjustedPrice = Math.round(basePrice * multiplier);

    // Enforce floor (must exceed COGS with margin)
    const floor = Math.max(minPrice || 0, costOfGoods * 1.3); // At least 30% margin
    const ceiling = maxPrice || basePrice * 1.5;

    adjustedPrice = Math.max(floor, Math.min(ceiling, adjustedPrice));

    return {
        adjustedPrice,
        multiplier: Math.round(multiplier * 100) / 100,
        margin: Math.round(((adjustedPrice - costOfGoods) / adjustedPrice) * 100),
        revenuePerHour: 0, // Will be calculated by caller based on service duration
        explanation: generatePriceExplanation(multiplier, demandFactors),
    };
}

function generatePriceExplanation(
    multiplier: number,
    factors: Record<string, number>
): string {
    const explanations: string[] = [];

    if (multiplier > 1.0) {
        if (factors.currentUtilization > 0.85) explanations.push('High schedule utilization');
        if (factors.waitlistCount > 2) explanations.push('Strong demand (waitlist active)');
        if (factors.bookingLeadDays < 1) explanations.push('Same-day booking premium');
        if (factors.dayOfWeek === 6) explanations.push('Weekend premium');
    } else if (multiplier < 1.0) {
        if (factors.currentUtilization < 0.40) explanations.push('Low utilization discount');
        if (factors.bookingLeadDays > 14) explanations.push('Advance booking discount');
    }

    return explanations.length > 0
        ? explanations.join('; ')
        : 'Standard pricing';
}

// Optimize schedule for maximum revenue
export async function optimizeSchedule({
    services,
    availableSlots,
    bookings,
    revenueGoal,
}: {
    services: Array<{
        name: string;
        price: number;
        costOfGoods: number;
        durationMinutes: number;
        averageDemand: number; // Bookings per week
    }>;
    availableSlots: Array<{
        date: string;
        startHour: number;
        endHour: number;
        provider: string;
    }>;
    bookings: Array<{
        service: string;
        date: string;
        hour: number;
    }>;
    revenueGoal: number; // Monthly revenue target
}) {
    const client = createAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `You are a healthcare scheduling optimization AI. Analyze the practice's services, schedule, and booking patterns to maximize revenue while maintaining good patient access.

Output a JSON optimization report:
{
  "currentWeeklyRevenue": number,
  "projectedMonthlyRevenue": number,
  "revenueGap": number,
  "utilization": number (0-1),
  "recommendations": [
    {
      "type": "scheduling" | "pricing" | "bundling" | "staffing",
      "description": "string",
      "estimatedImpact": number,
      "priority": "high" | "medium" | "low"
    }
  ],
  "optimalSchedule": {
    "peakServices": ["string"],
    "offPeakDiscountSuggestions": ["string"],
    "bundleOpportunities": [{ "services": ["string"], "discountPercent": number, "rationale": "string" }],
    "staffingAdjustments": ["string"]
  },
  "revenueForecasts": {
    "current": number,
    "optimized": number,
    "percentIncrease": number
  }
}

Only output valid JSON.`,
        messages: [
            {
                role: 'user',
                content: `Optimize this practice's schedule:

Services:
${services.map(s => `- ${s.name}: $${s.price} (COGS: $${s.costOfGoods}, Duration: ${s.durationMinutes}min, Avg demand: ${s.averageDemand}/week)`).join('\n')}

Available Slots:
${availableSlots.map(s => `- ${s.date} ${s.startHour}:00-${s.endHour}:00 (${s.provider})`).join('\n')}

Current Bookings:
${bookings.map(b => `- ${b.service} on ${b.date} at ${b.hour}:00`).join('\n')}

Monthly Revenue Goal: $${revenueGoal}`,
            },
        ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    try {
        return JSON.parse(textContent?.text || '{}');
    } catch {
        return { error: 'Failed to parse optimization data', raw: textContent?.text };
    }
}
