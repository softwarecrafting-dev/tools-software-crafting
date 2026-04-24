import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface InvoiceEmailProps {
  businessName: string;
  invoiceNumber: string;
  amount: string;
  message?: string;
}

export function InvoiceEmail({
  businessName,
  invoiceNumber,
  amount,
  message,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Invoice {invoiceNumber} from {businessName}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={sectionStyle}>
            <Heading style={headingStyle}>{businessName}</Heading>
            <Text style={textStyle}>
              {message || `Please find attached invoice ${invoiceNumber} for ${amount}.`}
            </Text>
            <Hr style={hrStyle} />
            <Text style={footerTextStyle}>
              If you have any questions, please reply to this email.
            </Text>
            <Text style={footerTextStyle}>
              Sent via SoftwareCrafting Tools
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

const hrStyle = {
  borderColor: "#E5E7EB",
  marginTop: "16px",
  marginBottom: "16px",
};

const footerTextStyle = {
  fontSize: "12px",
  color: "#9CA3AF",
  marginBottom: "8px",
};
