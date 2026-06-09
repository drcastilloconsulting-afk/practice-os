import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Img,
  Preview,
} from '@react-email/components';

interface WeeklyDigestProps {
  subscriberName: string;
  reportContent: string;
  rank: number;
  delta: string;
  compliance: string;
  cohortLabel: string;
}

export default function WeeklyDigest({
  subscriberName = 'Dr. Castillo',
  reportContent = 'Your practice performed above average this week with strong follow-up rates and improved scheduling utilization.',
  rank = 12,
  delta = '+4',
  compliance = '94%',
  cohortLabel = 'Regenerative Medicine — Southwest US',
}: WeeklyDigestProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your PracticeOS Weekly Performance Digest — Rank #${rank} (${delta})`}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* ── Header with gradient accent ── */}
          <Section style={headerSection}>
            <div style={gradientBar} />
            <Heading style={headerTitle}>
              PracticeOS
            </Heading>
            <Text style={headerSubtitle}>
              Weekly Performance Digest
            </Text>
          </Section>

          {/* ── Greeting ── */}
          <Section style={contentSection}>
            <Text style={greeting}>
              {subscriberName},
            </Text>
            <Text style={bodyText}>
              Here&apos;s your practice performance summary for the week. Keep up the great work.
            </Text>
          </Section>

          {/* ── Performance Summary KPIs ── */}
          <Section style={kpiSection}>
            <Heading as="h2" style={sectionHeading}>
              Performance Summary
            </Heading>

            <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  {/* Rank */}
                  <td style={kpiCell}>
                    <Text style={kpiValue}>{`#${rank}`}</Text>
                    <Text style={kpiLabel}>Practice Rank</Text>
                  </td>
                  {/* Delta */}
                  <td style={kpiCell}>
                    <Text style={{
                      ...kpiValue,
                      color: delta.startsWith('+') ? '#34D399' : '#FB7185',
                    }}>
                      {delta}
                    </Text>
                    <Text style={kpiLabel}>Rank Change</Text>
                  </td>
                  {/* Compliance */}
                  <td style={kpiCell}>
                    <Text style={kpiValue}>{compliance}</Text>
                    <Text style={kpiLabel}>Compliance Score</Text>
                  </td>
                </tr>
              </tbody>
            </table>

            <Text style={cohortBadge}>
              Cohort: {cohortLabel}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* ── Report Content ── */}
          <Section style={contentSection}>
            <Heading as="h2" style={sectionHeading}>
              Weekly Insights
            </Heading>
            <Text style={bodyText}>
              {reportContent}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* ── CTA ── */}
          <Section style={{ ...contentSection, textAlign: 'center' as const }}>
            <Text style={bodyText}>
              Dive deeper into your analytics and AI module performance.
            </Text>
            <Button
              href="https://app.practiceos.com/dashboard"
              style={ctaButton}
            >
              Open Dashboard →
            </Button>
          </Section>

          <Hr style={divider} />

          {/* ── Footer ── */}
          <Section style={footerSection}>
            <Text style={footerText}>
              PracticeOS · AI-Powered Practice Management
            </Text>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed to weekly digests.
            </Text>
            <Text style={unsubscribeText}>
              <a href="https://app.practiceos.com/settings/notifications" style={unsubscribeLink}>
                Manage email preferences
              </a>
              {' · '}
              <a href="{{unsubscribeUrl}}" style={unsubscribeLink}>
                Unsubscribe
              </a>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

/* ─── Inline Styles ─── */

const body: React.CSSProperties = {
  backgroundColor: '#080B15',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#0F1221',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(99, 102, 241, 0.12)',
  marginTop: '40px',
  marginBottom: '40px',
};

const headerSection: React.CSSProperties = {
  padding: '0',
  textAlign: 'center' as const,
  position: 'relative' as const,
};

const gradientBar: React.CSSProperties = {
  height: '4px',
  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #8B5CF6 100%)',
  width: '100%',
};

const headerTitle: React.CSSProperties = {
  fontFamily: "'Outfit', 'Inter', sans-serif",
  fontSize: '28px',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '28px 0 0 0',
  letterSpacing: '-0.5px',
};

const headerSubtitle: React.CSSProperties = {
  color: '#94A3B8',
  fontSize: '14px',
  margin: '4px 0 24px 0',
  fontWeight: 500,
};

const contentSection: React.CSSProperties = {
  padding: '24px 32px',
};

const greeting: React.CSSProperties = {
  color: '#F1F5F9',
  fontSize: '16px',
  fontWeight: 600,
  margin: '0 0 8px 0',
};

const bodyText: React.CSSProperties = {
  color: '#94A3B8',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0 0 16px 0',
};

const sectionHeading: React.CSSProperties = {
  fontFamily: "'Outfit', 'Inter', sans-serif",
  color: '#F1F5F9',
  fontSize: '18px',
  fontWeight: 700,
  margin: '0 0 16px 0',
  letterSpacing: '-0.3px',
};

const kpiSection: React.CSSProperties = {
  padding: '24px 32px',
  backgroundColor: 'rgba(24, 28, 46, 0.8)',
  margin: '0 16px',
  borderRadius: '12px',
  border: '1px solid rgba(99, 102, 241, 0.12)',
};

const kpiCell: React.CSSProperties = {
  textAlign: 'center' as const,
  padding: '12px 8px',
  width: '33.33%',
};

const kpiValue: React.CSSProperties = {
  fontFamily: "'Outfit', 'Inter', sans-serif",
  fontSize: '32px',
  fontWeight: 800,
  color: '#818CF8',
  margin: '0 0 4px 0',
  lineHeight: '1',
};

const kpiLabel: React.CSSProperties = {
  color: '#64748B',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: 0,
};

const cohortBadge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(79, 70, 229, 0.15)',
  color: '#818CF8',
  fontSize: '11px',
  fontWeight: 600,
  padding: '4px 12px',
  borderRadius: '9999px',
  border: '1px solid rgba(79, 70, 229, 0.2)',
  textAlign: 'center' as const,
  margin: '16px 0 0 0',
};

const divider: React.CSSProperties = {
  borderColor: 'rgba(99, 102, 241, 0.12)',
  borderTop: '1px solid rgba(99, 102, 241, 0.12)',
  margin: '0 32px',
};

const ctaButton: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
  color: '#FFFFFF',
  fontWeight: 600,
  padding: '14px 32px',
  borderRadius: '10px',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'inline-block',
  marginTop: '8px',
};

const footerSection: React.CSSProperties = {
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const footerText: React.CSSProperties = {
  color: '#64748B',
  fontSize: '12px',
  margin: '0 0 4px 0',
  lineHeight: '1.5',
};

const unsubscribeText: React.CSSProperties = {
  marginTop: '12px',
  fontSize: '12px',
};

const unsubscribeLink: React.CSSProperties = {
  color: '#818CF8',
  textDecoration: 'underline',
};
