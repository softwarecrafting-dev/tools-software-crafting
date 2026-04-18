import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function PasswordResetEmail({
  name,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your SoftwareCrafting Tools password</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={sectionStyle}>
            <Heading style={headingStyle}>SoftwareCrafting Tools</Heading>
            <Text style={textStyle}>Hi {name},</Text>
            <Text style={textStyle}>
              We received a request to reset your password. Click the button below to
              set a new one.
            </Text>
            <Button href={resetUrl} style={buttonStyle}>
              Reset Password
            </Button>
            <Text style={helperStyle}>
              This link expires in 1 hour. If you didn&apos;t request this, you can
              safely ignore this email.
            </Text>
            <Hr style={hrStyle} />
            <Text style={footerTextStyle}>Or copy this link:</Text>
            <Text style={linkStyle}>{resetUrl}</Text>
            <Hr style={hrStyle} />
            <Text style={footerTextStyle}>
              For security, this link can only be used once.
            </Text>
            <Text style={footerTextStyle}>
              tools.softwarecrafting.in · SoftwareCrafting · © 2026
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: "#FAFAFA",
  fontFamily: "Inter, -apple-system, Helvetica Neue, sans-serif",
};

const containerStyle = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const sectionStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  padding: "40px",
};

const headingStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#6366F1",
  marginBottom: "24px",
};

const textStyle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#374151",
  marginBottom: "16px",
};

const buttonStyle = {
  backgroundColor: "#6366F1",
  borderRadius: "6px",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
  display: "block",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const helperStyle = {
  fontSize: "13px",
  color: "#6B7280",
  marginBottom: "16px",
};

const hrStyle = {
  borderColor: "#E5E7EB",
  marginTop: "16px",
  marginBottom: "16px",
};

const linkStyle = {
  fontSize: "12px",
  color: "#6366F1",
  fontFamily: "monospace",
  wordBreak: "break-all" as const,
  marginBottom: "16px",
};

const footerTextStyle = {
  fontSize: "12px",
  color: "#9CA3AF",
  marginBottom: "8px",
};
