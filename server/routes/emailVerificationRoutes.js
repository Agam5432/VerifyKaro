const express = require("express");

const {
  verifyEmail,
} = require("../services/emailVerificationService");

const {
  extractEmailsWithAI,
} = require("../services/aiEmailExtractor");

const router = express.Router();

router.post("/verify-email", async (req, res) => {
  try {
    const {
      input,
      email,
      companyName,
      officialDomain,
    } = req.body;

    // ------------------------------------------------
    // Backward compatibility:
    // Direct email field bhi accept karenge
    // ------------------------------------------------

    const userInput = (input || email || "").trim();

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: "Email or text input is required",
      });
    }

    // ------------------------------------------------
    // AI extracts email(s) from the input
    // ------------------------------------------------

    const extraction = await extractEmailsWithAI(userInput);

    if (!extraction.success) {
      return res.status(500).json({
        success: false,
        message: extraction.message,
      });
    }

    const detectedEmails = extraction.emails || [];

    // ------------------------------------------------
    // No email found
    // ------------------------------------------------

    if (detectedEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No email address found in the provided input",
      });
    }

    // ------------------------------------------------
    // Verify every detected email
    // ------------------------------------------------

    const results = [];

    for (const item of detectedEmails) {
      const result = await verifyEmail(
        item.email,
        companyName,
        officialDomain
      );

      results.push({
        ...result,

        aiContext: {
          role: item.role || "unknown",
          confidence: item.confidence ?? null,
        },
      });
    }

    // ------------------------------------------------
    // Final response
    // ------------------------------------------------

    return res.json({
  success: true,

  input: userInput,

  detectedEmails: detectedEmails.length,

  primarySender:
    extraction.primarySender || null,

  results,
});
  } catch (error) {
    console.error(
      "Email verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify email input",
    });
  }
});

module.exports = router;