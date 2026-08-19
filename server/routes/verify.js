// routes/verify.js
// Main VerifyKaro analysis route.
//
// Flow:
// 1) Groq extracts message-level signals.
// 2) Local deterministic checks inspect sender/domain details.
// 3) Google Safe Browsing checks explicit URLs when configured.
// 4) Fixed weights calculate the score.
// 5) The frontend receives grounded evidence + the calculation.
//
// Important: if the AI extraction fails, we do NOT present a rule-only result
// as "Low Risk". The response is marked analysisComplete=false.

const express = require("express");
const router = express.Router();

const { SIGNALS, getRiskBand } = require("../config/signals.config");
const {
  extractSignalsFromLLM,
  translateText,
} = require("../services/llmService");
const {
  checkMaliciousUrl,
} = require("../services/safeBrowsingService");

const MAX_TEXT_LENGTH = 2000;

router.post("/verify", async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        error: "Please provide some text to check.",
      });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        error: `That's too long to check (${text.length} characters). Please paste the relevant part only, under ${MAX_TEXT_LENGTH} characters.`,
      });
    }

    const cleanText = text.trim();

    // Run independent checks even if one service fails.
    const [llmSignals, urlCheck] = await Promise.all([
      extractSignalsFromLLM(cleanText),
      checkMaliciousUrl(cleanText),
    ]);

    // If the AI failed, don't turn "no AI signals" into a false Low Risk.
    if (llmSignals.llm_failed) {
      return res.json({
        analysisComplete: false,
        score: null,
        rawScore: null,
        wasCapped: false,
        riskLevel: null,
        riskLabel: "Analysis Incomplete",
        evidence: [],
        recommendation:
          "The AI analysis could not be completed. No safe/unsafe conclusion is being shown. Please try again in a moment.",
        aiInsight: null,
        claimedCompany: null,
        llmFailed: true,
        urlCheck: {
          checked: urlCheck.urls?.length > 0,
          apiVerified: Boolean(
            urlCheck.urls?.length > 0 && !urlCheck.apiFailed
          ),
          malicious: Boolean(urlCheck.flagged),
        },
      });
    }

    // ---- Grounding: company name ----
    if (
      llmSignals.claimed_company &&
      !cleanText
        .toLowerCase()
        .includes(String(llmSignals.claimed_company).toLowerCase())
    ) {
      llmSignals.claimed_company = null;
    }

    // ---- Grounding: evidence quotes ----
    // Case-insensitive containment is intentionally used here. We never show
    // an AI-generated quote unless that text literally exists in the input.
    const groundedQuotes = {};
    const rawEvidence = llmSignals.evidence || {};

    for (const key of Object.keys(rawEvidence)) {
      const quote = rawEvidence[key];

      groundedQuotes[key] =
        typeof quote === "string" &&
        quote.trim() &&
        cleanText.toLowerCase().includes(quote.trim().toLowerCase())
          ? quote.trim()
          : null;
    }

    const headlines = llmSignals.evidence_headline || {};

    // ---- Deterministic sender/domain checks ----
    const ruleSignals = {};

    const domainCheck = checkSenderDomainMismatch(
      cleanText,
      llmSignals.claimed_company
    );

    ruleSignals.sender_domain_mismatch = domainCheck.mismatch;

    if (domainCheck.evidence) {
      groundedQuotes.sender_domain_mismatch = domainCheck.evidence;
    }

    // ---- External URL verification ----
    //
    // malicious_url=true ONLY when Safe Browsing actually confirms a threat.
    // A failed/unconfigured API cannot create a +35 "Known Malicious URL".
    ruleSignals.malicious_url = Boolean(urlCheck.flagged);

    if (urlCheck.evidence) {
      groundedQuotes.malicious_url = urlCheck.evidence;
    }

    // Weak fallback patterns get their own low-weight signal.
    ruleSignals.suspicious_url_pattern = Boolean(
      urlCheck.suspiciousPattern
    );

    if (urlCheck.patternEvidence) {
      groundedQuotes.suspicious_url_pattern = urlCheck.patternEvidence;
    }

    const sourceOverrides = {};

    if (urlCheck.apiFailed) {
      sourceOverrides.malicious_url = "rule";
      sourceOverrides.suspicious_url_pattern = "rule";
    }

    // ---- Score ----
    const allSignals = {
      ...llmSignals,
      ...ruleSignals,
    };

    const {
      score,
      matchedSignals,
      wasCapped,
      rawScore,
    } = calculateScore(
      allSignals,
      groundedQuotes,
      sourceOverrides,
      headlines
    );

    const riskBand = getRiskBand(score);

    if (!riskBand) {
      throw new Error(`Could not map score ${score} to a risk band.`);
    }

    const recommendation = getRecommendation(riskBand.level);

    return res.json({
      analysisComplete: true,
      score,
      rawScore,
      wasCapped,
      riskLevel: riskBand.level,
      riskLabel: riskBand.label,
      evidence: matchedSignals,
      recommendation,
      aiInsight: llmSignals.specific_advice || null,
      claimedCompany: llmSignals.claimed_company || null,
      llmFailed: false,
      urlCheck: {
        checked: urlCheck.urls?.length > 0,
        apiVerified: Boolean(
          urlCheck.urls?.length > 0 && !urlCheck.apiFailed
        ),
        malicious: Boolean(urlCheck.flagged),
        urlsFound: urlCheck.urls?.length || 0,
      },
    });
  } catch (err) {
    console.error("Error in /verify:", err);
    return res.status(500).json({
      error: "Something went wrong while checking this. Please try again.",
    });
  }
});

function calculateScore(
  signals,
  quotes = {},
  sourceOverrides = {},
  headlines = {}
) {
  let score = 0;
  const matchedSignals = [];

  for (const key of Object.keys(SIGNALS)) {
    if (signals[key] !== true) continue;

    const definition = SIGNALS[key];
    const points = definition.weight;

    score += points;

    matchedSignals.push({
      key,
      title: headlines[key] || definition.label,
      category: definition.label,
      description: definition.description,
      quote: quotes[key] || null,
      severity: definition.severity,
      points,
      source: sourceOverrides[key] || definition.source,
    });
  }

  const rawScore = score;
  const finalScore = Math.min(100, Math.max(0, score));

  return {
    score: finalScore,
    matchedSignals,
    wasCapped: rawScore > 100,
    rawScore,
  };
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "hotmail.com",
  "outlook.com",
  "protonmail.com",
  "icloud.com",
  "rediffmail.com",
  "aol.com",
]);

const COMPANY_SUFFIX_WORDS = new Set([
  "solutions",
  "technologies",
  "technology",
  "tech",
  "pvt",
  "ltd",
  "llp",
  "inc",
  "corp",
  "group",
  "services",
  "consultancy",
  "consulting",
  "systems",
  "enterprises",
  "industries",
  "company",
  "co",
  "the",
]);

function normalizeCompanyWords(company) {
  return String(company)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 && !COMPANY_SUFFIX_WORDS.has(word)
    );
}

function getRegistrableDomain(hostname) {
  const parts = hostname.toLowerCase().split(".").filter(Boolean);

  if (parts.length < 2) return hostname.toLowerCase();

  // Handles common two-level public suffixes without pretending this is a
  // complete Public Suffix List implementation.
  const knownSecondLevelTlds = new Set([
    "co.in",
    "co.uk",
    "com.au",
    "co.nz",
    "com.br",
  ]);

  const lastTwo = parts.slice(-2).join(" ");

  if (knownSecondLevelTlds.has(lastTwo.replace(" ", "."))) {
    return parts.slice(-3).join(".");
  }

  return parts.slice(-2).join(".");
}

function checkSenderDomainMismatch(text, claimedCompany) {
  const emailMatch = text.match(
    /\b[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,63})\b/
  );

  if (!emailMatch) {
    return { mismatch: false, evidence: null };
  }

  const fullEmail = emailMatch[0];
  const domain = emailMatch[1].toLowerCase();
  const domainParts = domain.split(".");
  const domainRoot = getRegistrableDomain(domain);
  const domainCore = domainRoot
    .split(".")[0]
    .replace(/[^a-z0-9]/g, "");

  // A free provider is only useful as a warning when the message claims to
  // represent an organisation. We therefore require a claimed company here.
  if (claimedCompany && FREE_EMAIL_DOMAINS.has(domain)) {
    return {
      mismatch: true,
      evidence: fullEmail,
    };
  }

  if (!claimedCompany || FREE_EMAIL_DOMAINS.has(domain)) {
    return {
      mismatch: false,
      evidence: null,
    };
  }

  const companyWords = normalizeCompanyWords(claimedCompany);

  if (companyWords.length === 0) {
    return {
      mismatch: false,
      evidence: null,
    };
  }

  // Require a meaningful company token to match the domain root. This is still
  // a heuristic, not proof that the sender is authentic.
  const domainMatchesCompany = companyWords.some(
    (word) =>
      word.length >= 4 &&
      (domainCore === word ||
        domainCore.startsWith(word) ||
        domainCore.endsWith(word))
  );

  if (!domainMatchesCompany) {
    return {
      mismatch: true,
      evidence: fullEmail,
    };
  }

  return {
    mismatch: false,
    evidence: null,
  };
}

function getRecommendation(level) {
  if (level === "high") {
    return "This looks risky. Do not make any payment or share personal details. Verify the sender or company independently before taking any action.";
  }

  if (level === "medium") {
    return "Some suspicious signs were found. Proceed carefully and verify the sender through an official channel before trusting this.";
  }

  return "No major red flags were found in this analysis, but a Low Risk result does not prove that the message is genuine.";
}

router.post("/translate", async (req, res) => {
  try {
    const { text, language } = req.body;

    if (
      typeof text !== "string" ||
      !text.trim() ||
      typeof language !== "string" ||
      !language.trim()
    ) {
      return res.status(400).json({
        error: "Missing text or language.",
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        error: "Text is too long to translate.",
      });
    }

    const translated = await translateText(text.trim(), language.trim());

    return res.json({ translated });
  } catch (err) {
    console.error("Error in /translate:", err);
    return res.status(500).json({
      error: "Could not translate right now. Please try again.",
    });
  }
});

module.exports = router;
