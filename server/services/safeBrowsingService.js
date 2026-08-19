// services/safeBrowsingService.js
// Extracts URLs from user text and checks them against Google Safe Browsing.
// Important: a Safe Browsing "clean" result means "not known to be malicious",
// NOT "this is an official or trustworthy website".

const SAFE_BROWSING_URL =
  "https://safebrowsing.googleapis.com/v4/threatMatches:find";

const URL_MAX_COUNT = 10;

// Keep a small list of URL punctuation that commonly appears after a link in
// normal prose. We strip it before sending the URL to Safe Browsing.
function cleanUrlCandidate(value) {
  return value
    .trim()
    .replace(/^[("'`<\[]+/, "")
    .replace(/[)\]}>,.!?;:'"`]+$/g, "");
}

function normalizeUrl(value) {
  let candidate = cleanUrlCandidate(value);

  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `http://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    return url.toString();
  } catch {
    return null;
  }
}

// Extracts:
//   https://example.com/path
//   http://example.in
//   www.example.com/login
//   example.com/login
//
// This intentionally accepts normal TLDs instead of maintaining a small list
// of "suspicious" TLDs. The domain itself is not evidence of maliciousness.
function extractUrls(text) {
  const urls = new Set();

  const explicitRegex = /\bhttps?:\/\/[^\s"'<>]+/gi;
  let match;

  while ((match = explicitRegex.exec(text)) && urls.size < URL_MAX_COUNT) {
    const normalized = normalizeUrl(match[0]);
    if (normalized) urls.add(normalized);
  }

  const wwwRegex = /\bwww\.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s"'<>]*)?/gi;

  while ((match = wwwRegex.exec(text)) && urls.size < URL_MAX_COUNT) {
    const normalized = normalizeUrl(match[0]);
    if (normalized) urls.add(normalized);
  }

  // Bare domains. Requiring a dot + a plausible TLD avoids treating ordinary
  // words such as "pay now" as URLs.
  const bareDomainRegex =
    /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}(?:\/[^\s"'<>]*)?/g;

  while ((match = bareDomainRegex.exec(text)) && urls.size < URL_MAX_COUNT) {
    const normalized = normalizeUrl(match[0]);
    if (normalized) urls.add(normalized);
  }

  return [...urls];
}

// This is ONLY a fallback indicator. It must never be represented as a
// "known malicious URL" or receive the API's +35 weight.
//
// These patterns are weak signals, not proof of a threat.
function fallbackUrlCheck(urls) {
  const suspicious = urls.find((url) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();

      return (
        hostname.includes("bit.ly") ||
        hostname.includes("tinyurl.com") ||
        hostname.endsWith(".tk") ||
        hostname.endsWith(".ml") ||
        hostname.endsWith(".ga") ||
        hostname.endsWith(".cf")
      );
    } catch {
      return false;
    }
  });

  return {
    flagged: false,
    evidence: null,
    suspiciousPattern: Boolean(suspicious),
    patternEvidence: suspicious || null,
    apiFailed: true,
    urls,
  };
}

async function checkMaliciousUrl(text) {
  const urls = extractUrls(text);

  if (urls.length === 0) {
    return {
      flagged: false,
      evidence: null,
      suspiciousPattern: false,
      patternEvidence: null,
      apiFailed: false,
      urls: [],
    };
  }

  const apiKey = process.env.SAFE_BROWSING_API_KEY;

  if (!apiKey) {
    console.warn(
      "SAFE_BROWSING_API_KEY not set - Safe Browsing verification is unavailable."
    );
    return fallbackUrlCheck(urls);
  }

  try {
    const response = await fetch(`${SAFE_BROWSING_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: {
          clientId: "verifykaro",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: urls.map((url) => ({ url })),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Safe Browsing responded with status ${response.status}`
      );
    }

    const data = await response.json();
    const match = data.matches?.[0];

    if (match) {
      const threatType = String(match.threatType || "unknown")
        .replace(/_/g, " ")
        .toLowerCase();

      return {
        flagged: true,
        evidence: `${match.threat.url} (flagged: ${threatType})`,
        suspiciousPattern: false,
        patternEvidence: null,
        apiFailed: false,
        urls,
      };
    }

    // A successful empty response means Safe Browsing did not know these URLs
    // to be malicious. It does NOT prove that the site is legitimate.
    return {
      flagged: false,
      evidence: null,
      suspiciousPattern: false,
      patternEvidence: null,
      apiFailed: false,
      urls,
    };
  } catch (err) {
    console.error("Safe Browsing check failed:", err.message);
    return fallbackUrlCheck(urls);
  }
}

module.exports = { checkMaliciousUrl, extractUrls };
