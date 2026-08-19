/**
 * VerifyKaro — Signal Definitions & Weights
 * ------------------------------------------
 * Different checks detect different risk signals.
 * The LLM never sets the final risk score.
 */

const SIGNALS = {
  // -------------------------------
  // AI MESSAGE SIGNALS
  // -------------------------------

  upfront_payment: {
    label: "Upfront Payment Request",
    description:
      "Message asks the user to pay before receiving any service, job, or product.",
    weight: 30,
    severity: "high",
    source: "llm",
  },

  credential_request: {
    label: "Credential / OTP Request",
    description:
      "Message asks for OTP, password, PIN, CVV, or similar sensitive credentials.",
    weight: 30,
    severity: "high",
    source: "llm",
  },

  urgency_pressure: {
    label: "Urgency / Pressure Tactics",
    description:
      "Message creates artificial time pressure to force a quick decision.",
    weight: 20,
    severity: "medium",
    source: "llm",
  },

  unrealistic_offer: {
    label: "Unrealistic Offer",
    description:
      "Salary, prize, or terms are unusually favorable for what is being asked.",
    weight: 20,
    severity: "medium",
    source: "llm",
  },

  vague_identity: {
    label: "Vague / Unverifiable Identity",
    description:
      "The message does not provide a clear, verifiable identity or official contact context.",
    weight: 15,
    severity: "low",
    source: "llm",
  },

  // -------------------------------
  // SENDER / DOMAIN SIGNALS
  // -------------------------------

  sender_domain_mismatch: {
    label: "Sender/Domain Mismatch",
    description:
      "Claimed organisation name does not reasonably match the sender's email domain.",
    weight: 25,
    severity: "medium",
    source: "rule",
  },

  email_no_mx: {
    label: "Email Domain Cannot Receive Mail",
    description:
      "The sender's domain does not have a valid MX record.",
    weight: 20,
    severity: "high",
    source: "api",
  },

  email_disposable: {
    label: "Disposable Email Address",
    description:
      "The sender uses a disposable or temporary email domain.",
    weight: 25,
    severity: "high",
    source: "api",
  },

  email_smtp_failed: {
    label: "Email SMTP Verification Failed",
    description:
      "Independent email verification could not confirm that the sender mailbox can receive email.",
    weight: 15,
    severity: "medium",
    source: "api",
  },

  // -------------------------------
  // URL SIGNALS
  // -------------------------------

  malicious_url: {
    label: "Known Malicious URL",
    description:
      "URL was flagged by Google Safe Browsing as a known threat.",
    weight: 35,
    severity: "high",
    source: "api",
  },

  suspicious_url_pattern: {
    label: "Suspicious URL Pattern",
    description:
      "The URL matched a weak local pattern check because external threat verification was unavailable. This is not proof that the URL is malicious.",
    weight: 10,
    severity: "low",
    source: "rule",
  },
};

// -------------------------------
// RISK BANDS
// -------------------------------

const RISK_BANDS = [
  {
    level: "low",
    min: 0,
    max: 34,
    label: "Low Risk",
  },

  {
    level: "medium",
    min: 35,
    max: 64,
    label: "Medium Risk",
  },

  {
    level: "high",
    min: 65,
    max: 100,
    label: "High Risk",
  },
];

function getRiskBand(score) {
  if (
    !Number.isFinite(score) ||
    score < 0 ||
    score > 100
  ) {
    console.error(
      `getRiskBand received an invalid score: ${score}. Returning null.`
    );

    return null;
  }

  return (
    RISK_BANDS.find(
      (band) =>
        score >= band.min &&
        score <= band.max
    ) || null
  );
}

module.exports = {
  SIGNALS,
  RISK_BANDS,
  getRiskBand,
};