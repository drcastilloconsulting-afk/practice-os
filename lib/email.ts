import { Resend } from 'resend';

// ─────────────────────────────────────────────────────────
// Email Service — UA Squad Notifications via Resend
// ─────────────────────────────────────────────────────────

const FROM_ADDRESS = 'UA Squad <onboarding@practiceos.com>';

function getResendClient(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

/** Standard return type for all email operations */
export interface EmailResult {
  success: boolean;
  error?: string;
}

// ─── Weekly Digest ────────────────────────────────────────

/**
 * Send the weekly performance digest email to a subscriber.
 * `reportHtml` should be pre-rendered HTML (e.g. from markdown → HTML).
 */
export async function sendWeeklyDigest({
  to,
  subscriberName,
  reportHtml,
}: {
  to: string;
  subscriberName: string;
  reportHtml: string;
}): Promise<EmailResult> {
  try {
    const resend = getResendClient();

    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Your Weekly UA Squad Report — ${subscriberName}`,
      html: wrapInLayout(`
        <h1 style="color: #F1F5F9; margin-bottom: 8px;">Weekly Performance Report</h1>
        <p style="color: #94A3B8; margin-bottom: 24px;">Hey ${subscriberName}, here's how your week went.</p>
        <div style="color: #CBD5E1; line-height: 1.7;">
          ${reportHtml}
        </div>
        <hr style="border: none; border-top: 1px solid rgba(99,102,241,0.2); margin: 32px 0;" />
        <p style="color: #64748B; font-size: 13px;">
          Keep pushing — every delta counts. 🚀
        </p>
      `),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[email] sendWeeklyDigest failed:', message);
    return { success: false, error: message };
  }
}

// ─── Winner Notification ──────────────────────────────────

/**
 * Send a winner announcement email when a subscriber wins their cohort.
 * `prizeAmount` is in **cents** and will be formatted to dollars.
 */
export async function sendWinnerNotification({
  to,
  subscriberName,
  cohortLabel,
  prizeAmount,
}: {
  to: string;
  subscriberName: string;
  cohortLabel: string;
  prizeAmount: number;
}): Promise<EmailResult> {
  try {
    const resend = getResendClient();
    const prizeDollars = (prizeAmount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `🏆 You Won the UA Squad — ${cohortLabel}!`,
      html: wrapInLayout(`
        <div style="text-align: center; padding: 24px 0;">
          <span style="font-size: 64px;">🏆</span>
          <h1 style="color: #F1F5F9; margin: 16px 0 8px;">Congratulations, ${subscriberName}!</h1>
          <p style="color: #8B5CF6; font-size: 20px; font-weight: 600; margin-bottom: 4px;">
            You're the UA Squad winner for ${cohortLabel}
          </p>
          <p style="color: #94A3B8; font-size: 16px; margin-bottom: 32px;">
            Your improvement delta was the highest in your cohort. That's real, measurable progress.
          </p>
        </div>
        <div style="background: rgba(79,70,229,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: #94A3B8; font-size: 14px; margin-bottom: 8px;">Your Prize</p>
          <p style="color: #4F46E5; font-size: 36px; font-weight: 700; margin: 0;">${prizeDollars}</p>
          <p style="color: #64748B; font-size: 14px; margin-top: 8px;">Wellness Package</p>
        </div>
        <p style="color: #94A3B8; text-align: center;">
          Our team will reach out within 48 hours to coordinate your prize fulfillment.
        </p>
      `),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[email] sendWinnerNotification failed:', message);
    return { success: false, error: message };
  }
}

// ─── Welcome Email ────────────────────────────────────────

/**
 * Send the onboarding welcome email when a subscriber joins UA Squad.
 */
export async function sendWelcomeEmail({
  to,
  subscriberName,
  cohortLabel,
}: {
  to: string;
  subscriberName: string;
  cohortLabel: string;
}): Promise<EmailResult> {
  try {
    const resend = getResendClient();

    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Welcome to the UA Squad, ${subscriberName}! 🧬`,
      html: wrapInLayout(`
        <h1 style="color: #F1F5F9; margin-bottom: 8px;">Welcome to the UA Squad</h1>
        <p style="color: #94A3B8; margin-bottom: 24px;">
          Hey ${subscriberName} — you're officially in. Let's get to work.
        </p>
        <div style="background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #8B5CF6; font-weight: 600; margin-bottom: 4px;">Your Cohort</p>
          <p style="color: #F1F5F9; font-size: 18px; margin: 0;">${cohortLabel}</p>
        </div>
        <h2 style="color: #F1F5F9; font-size: 18px; margin-bottom: 12px;">What Happens Next</h2>
        <ol style="color: #CBD5E1; line-height: 2; padding-left: 20px;">
          <li>Complete your health intake with our AI Protocol Designer</li>
          <li>Connect your wearable device (Oura, Whoop, Apple Watch, etc.)</li>
          <li>Get your baseline biomarker score</li>
          <li>Start competing — biggest improvement delta wins</li>
        </ol>
        <p style="color: #64748B; font-size: 13px; margin-top: 32px;">
          Mixed gender competition. No genetic advantages — just effort, consistency, and smart strategy.
        </p>
      `),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[email] sendWelcomeEmail failed:', message);
    return { success: false, error: message };
  }
}

// ─── Email Layout ─────────────────────────────────────────

/**
 * Wraps email body content in a branded HTML layout
 * that matches the PracticeOS dark design system.
 */
function wrapInLayout(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>UA Squad — PracticeOS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B15; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
    <!-- Header -->
    <div style="margin-bottom: 32px;">
      <span style="color: #4F46E5; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
        UA Squad
      </span>
    </div>
    <!-- Content -->
    <div style="background-color: #0F1221; border: 1px solid rgba(99,102,241,0.12); border-radius: 16px; padding: 32px;">
      ${bodyContent}
    </div>
    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px;">
      <p style="color: #64748B; font-size: 12px;">
        PracticeOS · UA Squad Program<br />
        <a href="https://practiceos.com" style="color: #4F46E5; text-decoration: none;">practiceos.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
