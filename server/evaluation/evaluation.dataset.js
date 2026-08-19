/**
 * VerifyKaro — Evaluation Dataset
 * --------------------------------
 * This dataset is used to validate VerifyKaro's
 * signal extraction and risk classification.
 *
 * IMPORTANT:
 * This is NOT training data.
 * It is an evaluation / regression dataset.
 */

const EVALUATION_DATASET = [
  // --------------------------------------------------
  // HIGH RISK — JOB / PAYMENT SCAMS
  // --------------------------------------------------

  {
    id: "job-payment-001",

    category: "job_scam",

    text:
      "Congratulations! You have been selected for a remote job. " +
      "To complete your registration, please pay Rs 2,999 as a security " +
      "deposit within 30 minutes. Click the link below to pay now. " +
      "http://jobsecure-pay.com/register",

    expectedSignals: [
      "upfront_payment",
      "urgency_pressure",
    ],

    expectedRisk: "high",
  },

  {
    id: "job-payment-002",

    category: "job_scam",

    text:
      "Congratulations! You have been selected for the position of " +
      "Senior Software Engineer with a salary of Rs 18 LPA. " +
      "To process your joining documents, please pay a refundable " +
      "registration fee of Rs 4,999 today.",

    expectedSignals: [
      "upfront_payment",
      "unrealistic_offer",
    ],

    expectedRisk: "high",
  },

  {
    id: "job-payment-003",

    category: "job_scam",

    text:
      "Your application has been shortlisted. Pay Rs 1,500 immediately " +
      "to confirm your interview slot. This offer expires in 15 minutes.",

    expectedSignals: [
      "upfront_payment",
      "urgency_pressure",
    ],

    expectedRisk: "high",
  },

  // --------------------------------------------------
  // HIGH RISK — OTP / CREDENTIAL PHISHING
  // --------------------------------------------------

  {
    id: "otp-001",

    category: "credential_phishing",

    text:
      "Dear Customer, your bank account will be blocked today. " +
      "Please share the OTP you just received to verify your identity " +
      "and avoid suspension.",

    expectedSignals: [
      "credential_request",
      "urgency_pressure",
    ],

    expectedRisk: "high",
  },

  {
    id: "otp-002",

    category: "credential_phishing",

    text:
      "Your account verification is pending. Reply with your OTP, " +
      "ATM PIN and CVV to complete KYC verification immediately.",

    expectedSignals: [
      "credential_request",
      "urgency_pressure",
    ],

    expectedRisk: "high",
  },

  // --------------------------------------------------
  // HIGH RISK — PAYMENT REQUEST
  // --------------------------------------------------

  {
    id: "payment-001",

    category: "payment_scam",

    text:
      "Your parcel is waiting for delivery. Pay Rs 49 through the " +
      "link below within 10 minutes to avoid cancellation.",

    expectedSignals: [
      "upfront_payment",
      "urgency_pressure",
    ],

    expectedRisk: "high",
  },

  // --------------------------------------------------
  // MEDIUM RISK
  // --------------------------------------------------

  {
    id: "medium-001",

    category: "suspicious_offer",

    text:
      "You have been selected for a special work-from-home opportunity. " +
      "Please contact our recruitment team for further details.",

    expectedSignals: [
      "vague_identity",
    ],

    expectedRisk: "medium",
  },

  {
    id: "medium-002",

    category: "suspicious_message",

    text:
      "Limited seats are available for our exclusive investment program. " +
      "Contact the representative today to learn how you can earn high returns.",

    expectedSignals: [
      "urgency_pressure",
      "vague_identity",
    ],

    expectedRisk: "medium",
  },

  // --------------------------------------------------
  // LOW RISK — NORMAL COMMUNICATION
  // --------------------------------------------------

  {
    id: "clean-001",

    category: "benign",

    text:
      "Hi team, sharing the meeting notes from today's call. " +
      "Please let me know if I missed anything.",

    expectedSignals: [],

    expectedRisk: "low",
  },

  {
    id: "clean-002",

    category: "benign",

    text:
      "Hi Rahul, the project documentation has been updated. " +
      "You can review the latest version whenever you have time.",

    expectedSignals: [],

    expectedRisk: "low",
  },

  {
    id: "clean-003",

    category: "benign",

    text:
      "Your interview is scheduled for Monday at 11 AM. " +
      "Please join the meeting using the calendar invitation.",

    expectedSignals: [],

    expectedRisk: "low",
  },

  // --------------------------------------------------
  // BOUNDARY CASES
  // --------------------------------------------------

  {
    id: "boundary-001",

    category: "job_scam",

    text:
      "Congratulations! You have been selected for the position. " +
      "Please complete the onboarding process using the official " +
      "company portal before your joining date.",

    expectedSignals: [],

    expectedRisk: "low",
  },

  {
    id: "boundary-002",

    category: "payment",

    text:
      "Your subscription renewal of Rs 499 is due on 25 August. " +
      "You can manage your subscription from your account dashboard.",

    expectedSignals: [],

    expectedRisk: "low",
  },

  {
    id: "boundary-003",

    category: "urgency",

    text:
      "Please submit the project report by 5 PM today so that the team " +
      "can complete the review process.",

    expectedSignals: [],

    expectedRisk: "low",
  },
];

module.exports = EVALUATION_DATASET;