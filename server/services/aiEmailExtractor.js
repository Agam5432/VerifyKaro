// services/aiEmailExtractor.js

const { callGroq } = require("./llmService");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function extractEmailsWithAI(text) {
  if (!text || !text.trim()) {
    return {
      success: false,
      emails: [],
      primarySender: null,
      message: "No text provided",
    };
  }

  const prompt = `
You are the email extraction component of VerifyKaro.

Analyze the complete input and identify EVERY email address that
actually appears in the input.

The input may contain:
- a single email
- a job offer
- an email message
- WhatsApp/SMS text
- headers such as From, To, CC, Reply-To
- multiple contact emails

Your job is ONLY to identify emails and their context.
Do NOT decide whether an email is genuine or fraudulent.

IMPORTANT RULES:

1. Only return email addresses that literally appear in the input.
2. NEVER invent an email.
3. Return ALL unique email addresses.
4. Preserve the email address exactly.
5. Determine the role using surrounding context.
6. Identify the most likely PRIMARY SENDER when the context allows it.
7. If the sender cannot be determined, primarySender must be null.
8. Do not assume the first email is the sender.
9. Do not assume an email is the sender just because it contains words
   like "hr", "recruiter", "support", etc.
10. Confidence must be between 0 and 1.
11. Return ONLY valid JSON.

Possible roles:

sender
recruiter
HR
support
contact
recipient
CC
BCC
reply_to
unknown

PRIMARY SENDER RULES:

If the input contains:

From: recruiter@company.com

then recruiter@company.com is the primary sender.

If the input says:

"Contact our HR at hr@company.com"

then hr@company.com is a contact email, NOT necessarily the sender.

If there is only:

"Please contact hr@company.com"

then primarySender should normally be null because the message
does not prove that hr@company.com actually sent the message.

Return EXACTLY this structure:

{
  "emails": [
    {
      "email": "recruiter@company.com",
      "role": "sender",
      "confidence": 0.99
    },
    {
      "email": "support@gmail.com",
      "role": "support",
      "confidence": 0.95
    }
  ],
  "primarySender": {
    "email": "recruiter@company.com",
    "confidence": 0.99,
    "reason": "Explicitly identified in the From field"
  }
}

If the primary sender cannot be established:

{
  "emails": [
    {
      "email": "hr@company.com",
      "role": "contact",
      "confidence": 0.95
    }
  ],
  "primarySender": null
}

If there are no emails:

{
  "emails": [],
  "primarySender": null
}

USER INPUT:

${text}
`;

  try {
    const result = await callGroq(prompt);

    if (!result || !Array.isArray(result.emails)) {
      return {
        success: false,
        emails: [],
        primarySender: null,
        message: "AI returned an invalid extraction response",
      };
    }

    // Remove duplicates and invalid email addresses.
    const uniqueEmails = new Map();

    for (const item of result.emails) {
      if (!item || typeof item.email !== "string") {
        continue;
      }

      const email = item.email.trim().toLowerCase();

      if (!isValidEmail(email)) {
        continue;
      }

      if (!uniqueEmails.has(email)) {
        uniqueEmails.set(email, {
          email,
          role: item.role || "unknown",
          confidence:
            typeof item.confidence === "number"
              ? Math.min(Math.max(item.confidence, 0), 1)
              : null,
        });
      }
    }

    const emails = Array.from(uniqueEmails.values());

    let primarySender = null;

    if (
      result.primarySender &&
      typeof result.primarySender.email === "string"
    ) {
      const senderEmail =
        result.primarySender.email.trim().toLowerCase();

      if (uniqueEmails.has(senderEmail)) {
        primarySender = {
          email: senderEmail,
          confidence:
            typeof result.primarySender.confidence === "number"
              ? Math.min(
                  Math.max(result.primarySender.confidence, 0),
                  1
                )
              : null,
          reason:
            result.primarySender.reason ||
            "Identified from message context",
        };
      }
    }

    return {
      success: true,
      emails,
      primarySender,
    };
  } catch (error) {
    console.error(
      "AI email extraction error:",
      error.message
    );

    return {
      success: false,
      emails: [],
      primarySender: null,
      message: "Unable to extract emails using AI",
    };
  }
}

module.exports = {
  extractEmailsWithAI,
};