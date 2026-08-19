const dns = require("dns").promises;
const axios = require("axios");

// --------------------------------------------------
// Basic Email Validation
// --------------------------------------------------

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --------------------------------------------------
// Extract Domain
// --------------------------------------------------

function getDomain(email) {
  return email.split("@")[1]?.toLowerCase();
}

// --------------------------------------------------
// Check Domain
// --------------------------------------------------

async function checkDomain(domain) {
  // dns.resolveAny() is unreliable by design - major DNS providers (Google,
  // Cloudflare, etc.) intentionally don't return full answers to ANY queries
  // anymore (RFC 8482, an anti-abuse measure). That means resolveAny() can
  // come back empty even for a domain as legitimate as gmail.com. We check
  // for a plain A record instead, which every real domain has.
  try {
    const records = await dns.resolve4(domain);
    return { exists: records.length > 0, records, definitive: true };
  } catch (error) {
    const code = error.code || "DNS_LOOKUP_FAILED";
    // ENOTFOUND/ENODATA mean the domain genuinely has no A record - real evidence.
    // Anything else (ETIMEOUT, ESERVFAIL, ECONNREFUSED) means OUR lookup had
    // trouble, not that the domain doesn't exist - don't treat that as proof.
    const definitive = code === "ENOTFOUND" || code === "ENODATA";
    return { exists: false, records: [], error: code, definitive };
  }
}

// --------------------------------------------------
// Check MX Records
// --------------------------------------------------

async function checkMX(domain) {
  try {
    const records = await dns.resolveMx(domain);

    return {
      hasMX: records.length > 0,
      records,
      definitive: true,
    };
  } catch (error) {
    const code = error.code || "MX_LOOKUP_FAILED";
    // Same reasoning as checkDomain: only ENOTFOUND/ENODATA is real proof
    // the domain has no MX record. A timeout or server failure just means
    // our own network/resolver had trouble - it says nothing about the domain.
    const definitive = code === "ENOTFOUND" || code === "ENODATA";
    return {
      hasMX: false,
      records: [],
      error: code,
      definitive,
    };
  }
}

// --------------------------------------------------
// Disposable Email Check
// --------------------------------------------------

function checkDisposableDomain(domain) {
  const disposableDomains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "yopmail.com",
  ];

  return disposableDomains.includes(domain);
}

// --------------------------------------------------
// Abstract API Verification (Email Reputation product)
// --------------------------------------------------

async function verifyWithAbstract(email) {
  try {
    if (!process.env.ABSTRACT_API_KEY) {
      return {
        available: false,
        error: "ABSTRACT_API_KEY is missing from environment variables",
      };
    }

    // IMPORTANT: this must match the product your key is actually subscribed
    // to on the Abstract dashboard. "Email Validation" and "Email Reputation"
    // are separate products with separate keys, even under the same account -
    // calling the wrong endpoint here causes a 401 even with a valid key.
    const response = await axios.get(
      "https://emailreputation.abstractapi.com/v1/",
      {
        params: {
          api_key: process.env.ABSTRACT_API_KEY,
          email,
        },
        timeout: 15000,
      }
    );

    const data = response.data;

    // Email Reputation API returns nested objects (email_deliverability,
    // email_quality, email_domain, ...) - NOT the flat { value: ... } shape
    // used by the separate Email Validation API.
    return {
      available: true,

      deliverability: data.email_deliverability?.status || "UNKNOWN",

      qualityScore: data.email_quality?.score ?? null,

      isValidFormat: data.email_deliverability?.is_format_valid ?? null,

      isFreeProvider: data.email_quality?.is_free_email ?? null,

      isDisposable: data.email_quality?.is_disposable ?? null,

      isMxFound: data.email_deliverability?.is_mx_valid ?? null,

      isSmtpValid: data.email_deliverability?.is_smtp_valid ?? null,

      domain: data.email_domain?.domain || null,
    };
  } catch (error) {
    console.error(
      "Abstract API error:",
      error.response?.status,
      error.response?.data || error.message
    );

    return {
      available: false,

      statusCode: error.response?.status || null,

      error:
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "External email verification unavailable",
    };
  }
}

// --------------------------------------------------
// Main Email Verification
// --------------------------------------------------

async function verifyEmail(
  email,
  companyName = null,
  officialDomain = null
) {
  email = email.trim().toLowerCase();

  // -----------------------------------------------
  // Format validation
  // -----------------------------------------------

  if (!isValidEmail(email)) {
    return {
      email,
      status: "invalid",
      risk: "high",
      score: 100,

      checks: {
        validFormat: false,
      },

      reasons: ["Invalid email address format"],
    };
  }

  const domain = getDomain(email);

  // -----------------------------------------------
  // Internal checks
  // -----------------------------------------------

  const domainCheck = await checkDomain(domain);

  const mxCheck = await checkMX(domain);

  const disposable = checkDisposableDomain(domain);

  // -----------------------------------------------
  // External API
  // -----------------------------------------------

  const abstractCheck = await verifyWithAbstract(email);

  const reasons = [];

  let score = 0;

  // -----------------------------------------------
  // Domain / MX logic
  // -----------------------------------------------

  /*
   * We only penalize "no MX record" when we're actually confident about it.
   * Our own DNS lookup can fail just because OUR server's network/resolver
   * had a hiccup (timeout, blocked port 53, etc.) - that happens even for
   * completely legitimate domains like gmail.com, and doesn't prove anything
   * about the domain itself. So:
   *   - if Abstract (an independent, reliably-reachable service) confirms
   *     MX exists, we trust that over our own possibly-flaky lookup
   *   - we only count our own lookup as evidence when it was "definitive"
   *     (a real ENOTFOUND/ENODATA, not a network-level failure)
   */

  const abstractConfirmsMx = abstractCheck.available && abstractCheck.isMxFound === true;

  const abstractConfirmsNoMx = abstractCheck.available && abstractCheck.isMxFound === false;

  const ownCheckSaysNoMx = mxCheck.hasMX && mxCheck.definitive;

  const noMxConfirmed = !abstractConfirmsMx && (ownCheckSaysNoMx || abstractConfirmsNoMx);

  const effectiveMxVerified = mxCheck.hasMX || abstractConfirmsMx;

  if (noMxConfirmed) {
    score += 50;

    reasons.push(
      "Domain has no valid MX record and cannot receive email"
    );
  }

  // -----------------------------------------------
  // Disposable email
  // -----------------------------------------------

  /*
   * Same principle as the MX check above: our own hardcoded list and
   * Abstract's detection are two independent checks for the SAME fact
   * (is this domain disposable). If both agree, that's more confidence in
   * one fact - not two separate facts - so we score it once, not twice.
   */
  const disposableConfirmed = disposable || abstractCheck.isDisposable === true;

  if (disposableConfirmed) {
    score += 40;

    reasons.push(
      "Disposable/temporary email domain detected"
    );
  }

  // -----------------------------------------------
  // Company Domain Verification
  // -----------------------------------------------

  let companyDomainMatch = null;

  if (officialDomain) {
    const normalizedOfficialDomain = officialDomain
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];

    companyDomainMatch =
      domain === normalizedOfficialDomain;

    if (!companyDomainMatch) {
      score += 40;

      reasons.push(
        "Sender domain does not match the official company domain"
      );
    }
  }

  // -----------------------------------------------
  // Abstract API Signals
  // -----------------------------------------------

  if (abstractCheck.available) {
    // Invalid format
    if (abstractCheck.isValidFormat === false) {
      score += 40;

      reasons.push(
        "External verification marked the email format as invalid"
      );
    }

    // Note: MX-found/not-found from Abstract is already reconciled with our
    // own DNS check above (see noMxConfirmed) - not repeated here, to avoid
    // double-counting the same signal twice.

    // SMTP failure
    if (abstractCheck.isSmtpValid === false) {
      score += 30;

      reasons.push(
        "SMTP verification failed"
      );
    }

    // Note: "disposable" from Abstract is already reconciled with our own
    // list above (see disposableConfirmed) - not repeated here.
  }

  // -----------------------------------------------
  // Final Score
  // -----------------------------------------------

  score = Math.min(score, 100);

  // -----------------------------------------------
  // Final Status
  // -----------------------------------------------

  let status;

  if (score >= 70) {
    status = "suspicious";
  } else if (score >= 30) {
    status = "needs_verification";
  } else {
    status = "likely_legit";
  }

  // -----------------------------------------------
  // Final Response
  // -----------------------------------------------

  return {
    email,

    domain,

    companyName,

    officialDomain,

    status,

    score,

    checks: {
      validFormat: true,

      domainExists:
        domainCheck.exists ||
        (abstractCheck.available &&
          abstractCheck.domain === domain),

      mxRecord: effectiveMxVerified,

      disposable: disposableConfirmed,

      companyDomainMatch,

      abstract: abstractCheck,
    },

    reasons,
  };
}

// --------------------------------------------------
// Export
// --------------------------------------------------

module.exports = {
  verifyEmail,
  verifyWithAbstract,
};