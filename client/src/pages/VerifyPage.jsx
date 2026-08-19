import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "../css/VerifyPage.css";
import AnalysisCoverage from "../components/AnalysisCoverage"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/verify`;
const TRANSLATE_URL = `${API_BASE_URL}/translate`;

const MAX_FILE_SIZE_MB = 8;

// --------------------------------------------------
// PDF WORKER
// --------------------------------------------------

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// --------------------------------------------------
// TYPE DETECTION
// --------------------------------------------------

function detectType(text) {
  const t = text.toLowerCase();

  if (
    /pay|deposit|upi/.test(t) &&
    /register|deposit|fee|advance/.test(t)
  ) {
    return "payment";
  }

  if (
    /\botp\b|password|\bpin\b|cvv|banking (login|details|credentials)/.test(
      t
    )
  ) {
    return "credential";
  }

  if (/http|www\.|\.com|\.xyz/.test(t)) {
    return "link";
  }

  if (/job|salary|registration|selected/.test(t)) {
    return "job";
  }

  if (/subject:|dear (sir|customer)/.test(t)) {
    return "email";
  }

  return "whatsapp";
}

// --------------------------------------------------
// RISK META
// --------------------------------------------------

const RISK_META = {
  high: {
    label: "High Risk",
    color: "#DC2626",
    bg: "#FEF2F2",
    desc:
      "This content looks suspicious. Be careful before taking any action.",
  },

  medium: {
    label: "Medium Risk",
    color: "#D97706",
    bg: "#FFFBEB",
    desc:
      "Some risk signals were found. Proceed carefully and verify independently.",
  },

  low: {
    label: "Low Risk",
    color: "#16A34A",
    bg: "#F0FDF4",
    desc:
      "No strong risk signals found, but stay cautious.",
  },
};

// --------------------------------------------------
// LOADING STEPS
// --------------------------------------------------

const LOADING_STEPS = [
  "Reading the message...",
  "Extracting risk signals with AI...",
  "Cross-checking links and domain...",
  "Calculating risk score...",
];

// --------------------------------------------------
// LANGUAGES
// --------------------------------------------------

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "mr", label: "मराठी" },
];

// --------------------------------------------------
// IMAGE OCR
// --------------------------------------------------

async function extractTextFromImage(file) {
  const Tesseract = await import("tesseract.js");

  const { data } = await Tesseract.recognize(file, "eng");

  return data.text;
}

// --------------------------------------------------
// PDF TEXT EXTRACTION
// --------------------------------------------------

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    fullText +=
      content.items.map((item) => item.str).join(" ") + "\n";
  }

  return fullText.trim();
}

// --------------------------------------------------
// SAMPLE MESSAGES
// --------------------------------------------------

const SAMPLE_MESSAGES = [
  {
    key: "job-scam",
    label: "Job scam",
    text: `Congratulations! You have been selected for a remote job. To complete your registration, please pay Rs 2,999 as a security deposit within 30 minutes. Click the link below to pay now.
http://jobsecure-pay.com/register`,
  },

  {
    key: "otp-phishing",
    label: "OTP phishing",
    text: `Dear Customer, your account will be blocked. Please share the OTP you just received to verify your identity and avoid suspension.`,
  },

  {
    key: "clean",
    label: "Normal message",
    text: `Hi team, sharing the meeting notes from today's call. Let me know if I missed anything.`,
  },
];

// --------------------------------------------------
// VERIFY PAGE
// --------------------------------------------------

function VerifyPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [detectedType, setDetectedType] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const [error, setError] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const [activeLang, setActiveLang] = useState("en");
  const [translatedInsight, setTranslatedInsight] = useState(null);
  const [translating, setTranslating] = useState(false);

  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState(null);

  const [animatedTrust, setAnimatedTrust] = useState("");

  useEffect(() => {
    const word = "trust.";
    let index = 0;
    let deleting = false;
    let timeoutId;

    const animate = () => {
      if (!deleting) {
        index++;

        setAnimatedTrust(word.slice(0, index));

        if (index === word.length) {
          deleting = true;
          timeoutId = setTimeout(animate, 1800);
          return;
        }

        timeoutId = setTimeout(animate, 120);
      } else {
        index--;

        setAnimatedTrust(word.slice(0, index));

        if (index === 0) {
          deleting = false;
          timeoutId = setTimeout(animate, 500);
          return;
        }

        timeoutId = setTimeout(animate, 80);
      }
    };

    animate();

    return () => clearTimeout(timeoutId);
  }, []);

  // ------------------------------------------------
  // VERIFY
  // ------------------------------------------------

  const handleVerify = async () => {
    const cleanText = text.trim();

    if (!cleanText) return;

    setLoading(true);
    setLoadingStep(0);

    setError(null);
    setResult(null);
    setAnimatedScore(0);

    setActiveLang("en");
    setTranslatedInsight(null);

    setDetectedType(detectType(cleanText));

    try {
      setLoadingStep(1);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanText,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Server returned an error."
        );
      }

      // AI FAILURE
      if (data?.analysisComplete === false) {
        setResult({
          analysisComplete: false,
          score: null,
          rawScore: null,
          wasCapped: false,
          band: null,
          evidence: [],
          meta: {
            label: "Analysis Incomplete",
            color: "#D97706",
            bg: "#FFFBEB",
            desc:
              "The AI analysis did not complete, so VerifyKaro is not showing a safe/unsafe risk score.",
          },
          reco:
            data.recommendation ||
            "Please try again in a moment for the full analysis.",
          aiInsight: null,
          llmFailed: true,
          urlCheck: data.urlCheck || null,
        });

        return;
      }

      setLoadingStep(2);

      const nextResult = {
        analysisComplete: true,
        score: data.score,
        rawScore: data.rawScore,
        wasCapped: data.wasCapped,
        band: data.riskLevel,
        evidence: data.evidence || [],
        meta:
          RISK_META[data.riskLevel] ||
          RISK_META.medium,
        reco: data.recommendation,
        aiInsight: data.aiInsight,
        llmFailed: false,
        urlCheck: data.urlCheck || null,
        emailResults: data.results || [],
        primarySender: data.primarySender || null,
      };

      setResult(nextResult);

      setAnimatedScore(0);

      window.setTimeout(() => {
        setAnimatedScore(
          Number.isFinite(data.score)
            ? data.score
            : 0
        );
      }, 50);

      setLoadingStep(3);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // FILE UPLOAD
  // ------------------------------------------------

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    e.target.value = "";

    if (!file) return;

    setExtractError(null);

    if (
      file.size >
      MAX_FILE_SIZE_MB * 1024 * 1024
    ) {
      setExtractError(
        `File is too large. Please keep it under ${MAX_FILE_SIZE_MB}MB.`
      );

      return;
    }

    setExtracting(true);

    try {
      let extractedText = "";

      if (file.type.startsWith("image/")) {
        extractedText =
          await extractTextFromImage(file);
      } else if (
        file.type === "application/pdf"
      ) {
        extractedText =
          await extractTextFromPDF(file);
      } else {
        throw new Error(
          "Please upload an image (JPG/PNG) or a PDF file."
        );
      }

      if (!extractedText.trim()) {
        throw new Error(
          "Couldn't find any readable text in this file. Try a clearer image, or paste the text directly."
        );
      }

      const cleanedExtractedText =
        extractedText.trim();

      if (
        cleanedExtractedText.length >
        2000
      ) {
        setText(
          cleanedExtractedText.slice(
            0,
            2000
          )
        );

        setExtractError(
          "Only the first 2,000 characters were loaded because VerifyKaro currently analyzes up to 2,000 characters."
        );
      } else {
        setText(cleanedExtractedText);
      }

      setDetectedType(
        detectType(cleanedExtractedText)
      );
    } catch (err) {
      console.error(err);

      setExtractError(
        err.message ||
          "Could not read this file. Please try again or paste the text directly."
      );
    } finally {
      setExtracting(false);
    }
  };

  // ------------------------------------------------
  // TRANSLATION
  // ------------------------------------------------

  const handleLanguageClick = async (
    langCode,
    langLabel
  ) => {
    setActiveLang(langCode);

    if (langCode === "en") {
      setTranslatedInsight(null);
      return;
    }

    if (!result?.aiInsight) return;

    setTranslating(true);

    try {
      const res = await fetch(
        TRANSLATE_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            text: result.aiInsight,
            language: langLabel,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Translation failed"
        );
      }

      const data = await res.json();

      setTranslatedInsight(
        data.translated
      );
    } catch (err) {
      console.error(err);

      setTranslatedInsight(null);
      setActiveLang("en");
    } finally {
      setTranslating(false);
    }
  };

  // ------------------------------------------------
  // TYPES
  // ------------------------------------------------

  const types = [
    {
      key: "job",
      label: "Job / HR",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "credential",
      label: "OTP / Credentials",
    },
    {
      key: "link",
      label: "Link",
    },
    {
      key: "payment",
      label: "Payment",
    },
    {
      key: "whatsapp",
      label: "SMS / WhatsApp",
    },
  ];

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <main className="verify-page">

      {/* HERO */}

      <section className="verify-hero">

        <div className="verify-eyebrow">
          DIGITAL TRUST CHECK
        </div>

        <h1 className="animated-hero-title">
          Check before you{" "}
          <span className="animated-trust">
            {animatedTrust}
            <span className="typing-cursor" />
          </span>
        </h1>

        <p>
          Got a suspicious message, job offer,
          email, link or payment request?
          Put it here and understand the risk
          before you take action.
        </p>

      </section>


      {/* MAIN VERIFICATION CARD */}

      <section className="verify-card">

        <div className="verify-card-header">

          <div>
            <span className="verify-step">
              STEP 01
            </span>

            <h2>
              What do you want to verify?
            </h2>

            <p>
              Paste the content you received
              or upload a screenshot / PDF.
            </p>
          </div>

          <div className="input-icon">
            ✓
          </div>

        </div>


        {/* SAMPLE OPTIONS */}

        <div className="sample-section">

          <div className="sample-heading">
            <span>Quick examples</span>
            <small>
              Try one to see how it works
            </small>
          </div>

          <div className="sample-row">

            {SAMPLE_MESSAGES.map(
              (sample) => (
                <button
                  key={sample.key}
                  className="sample-chip"
                  onClick={() => {
                    setText(sample.text);
                    setDetectedType(
                      detectType(
                        sample.text
                      )
                    );
                  }}
                >
                  {sample.label}
                </button>
              )
            )}

          </div>

        </div>


        {/* TEXT AREA */}

        <div className="input-wrapper">

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);

              if (!e.target.value.trim()) {
                setDetectedType(null);
              }
            }}
            rows={7}
            maxLength={2000}
            placeholder={
              "What do you want to verify?\n\nPaste a suspicious message, job offer, email, link or payment request here..."
            }
          />

          <div className="textarea-bottom">

            <span className="char-count">
              {text.length}/2000
            </span>

            <label className="upload-action">

              <span>
                {extracting
                  ? "Reading file..."
                  : "📎 Upload image / PDF"}
              </span>

              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={
                  handleFileUpload
                }
                disabled={extracting}
                hidden
              />

            </label>

          </div>

        </div>


        {/* EXTRACTION ERROR */}

        {extractError && (
          <div className="inline-error">
            {extractError}
          </div>
        )}


        {/* DETECTED TYPE */}

        {detectedType && (
          <div className="detected-section">

            <span className="detected-label">
              Detected content
            </span>

            <div className="type-row">

              {types.map((type) => (
                <span
                  key={type.key}
                  className={`chip ${
                    detectedType ===
                    type.key
                      ? "detected"
                      : ""
                  }`}
                >
                  {type.label}
                </span>
              ))}

            </div>

          </div>
        )}


        {/* VERIFY BUTTON */}

        <button
          className="verify-btn"
          onClick={handleVerify}
          disabled={
            !text.trim() || loading
          }
        >
          {loading
            ? "Analysing..."
            : "Verify Now →"}
        </button>

        <p className="privacy-note">
          Your content is used only for this verification request.
        </p>

      </section>


      {/* GENERAL ERROR */}

      {error && (
        <div className="general-error">
          {error}
        </div>
      )}


      {/* ANALYSIS */}

      {loading && (
        <section className="analysis-card">

          <div className="analysis-header">

            <div className="analysis-spinner">
              ↻
            </div>

            <div>
              <span className="verify-step">
                STEP 02
              </span>

              <h2>
                Analysing your content
              </h2>

              <p>
                VerifyKaro is checking the
                available signals.
              </p>
            </div>

          </div>

          <div className="loading-list">

            {LOADING_STEPS.map(
              (step, i) => (
                <div
                  key={i}
                  className={`loading-step ${
                    i < loadingStep
                      ? "done"
                      : i ===
                        loadingStep
                      ? "active"
                      : ""
                  }`}
                >

                  <span className="loading-dot" />

                  <span>
                    {step}
                  </span>

                  {i < loadingStep && (
                    <strong>✓</strong>
                  )}

                </div>
              )
            )}

          </div>

        </section>
      )}


      {/* INCOMPLETE ANALYSIS */}

      {result &&
        !result.analysisComplete && (
          <section className="incomplete-card">

            <div className="incomplete-icon">
              !
            </div>

            <div>
              <h3>
                Analysis incomplete
              </h3>

              <p>
                {result.reco}
              </p>
            </div>

          </section>
        )}


      {/* AI INSIGHT */}

      {result &&
        result.aiInsight && (
          <section className="ai-insight-card">

            <div className="result-section-head">

              <div>
                <span className="verify-step">
                  AI ANALYSIS
                </span>

                <h2>
                  AI's Read
                </h2>
              </div>

              <div className="lang-row">

                {LANGUAGES.map(
                  (lang) => (
                    <button
                      key={
                        lang.code
                      }
                      className={`lang-chip ${
                        activeLang ===
                        lang.code
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleLanguageClick(
                          lang.code,
                          lang.label
                        )
                      }
                      disabled={
                        translating
                      }
                    >
                      {lang.label}
                    </button>
                  )
                )}

              </div>

            </div>

            <p className="ai-insight-text">
              {translating
                ? "Translating..."
                : translatedInsight ||
                  result.aiInsight}
            </p>

          </section>
        )}


      {/* RESULT */}

      {result &&
        result.analysisComplete && (
          <section className="results-section">

            <div className="results-heading">

              <span className="verify-step">
                FINAL RESULT
              </span>

              <h2>
                Here's what VerifyKaro found.
              </h2>

              <p>
                Review the risk level, evidence
                and recommendation before
                deciding what to do next.
              </p>

            </div>

            <AnalysisCoverage
              evidence={result.evidence}
              urlCheck={result.urlCheck}
            />
            {/* EMAIL VERIFICATION */}

{result.emailResults?.length > 0 && (
  <div className="email-verification-card">

    <div className="result-section-head">
      <div>
        <span className="verify-step">
          SENDER VERIFICATION
        </span>

        <h2>
          Email verification
        </h2>

        <p>
          VerifyKaro found{" "}
          <strong>
            {result.emailResults.length}
          </strong>{" "}
          email
          {result.emailResults.length > 1
            ? "s"
            : ""}{" "}
          in the submitted content.
        </p>
      </div>

      <span className="email-count">
        {result.emailResults.length}
      </span>
    </div>


    {/* PRIMARY SENDER */}

    <div className="primary-sender-box">

      <div>
        <span className="email-label">
          PRIMARY SENDER
        </span>

        {result.primarySender ? (
          <>
            <strong className="primary-email">
              {result.primarySender.email}
            </strong>

            <p>
              ✓{" "}
              {result.primarySender.reason ||
                "Sender identified from message context"}
            </p>
          </>
        ) : (
          <>
            <strong className="primary-email">
              Not clearly identified
            </strong>

            <p>
              The message contains email addresses,
              but does not clearly establish which
              address sent the message.
            </p>
          </>
        )}
      </div>

      {result.primarySender?.confidence != null && (
        <div className="ai-confidence">
          <strong>
            {Math.round(
              result.primarySender.confidence * 100
            )}%
          </strong>

          <span>
            AI confidence
          </span>
        </div>
      )}

    </div>


    {/* EMAIL LIST */}

    <div className="email-results-list">

      {result.emailResults.map((emailResult, index) => {

        const statusMap = {
          likely_legit: {
            label: "Likely Legit",
            className: "email-status-legit",
          },

          needs_verification: {
            label: "Needs Verification",
            className: "email-status-warning",
          },

          suspicious: {
            label: "Suspicious",
            className: "email-status-danger",
          },

          invalid: {
            label: "Invalid",
            className: "email-status-danger",
          },
        };

        const status =
          statusMap[emailResult.status] ||
          statusMap.needs_verification;

        return (
          <div
            key={`${emailResult.email}-${index}`}
            className="email-result-item"
          >

            <div className="email-result-main">

              <div className="email-address-row">

                <strong>
                  {emailResult.email}
                </strong>

                {emailResult.aiContext?.role && (
                  <span className="email-role">
                    {emailResult.aiContext.role}
                  </span>
                )}

              </div>

              <span className="email-domain">
                Domain: {emailResult.domain}
              </span>

            </div>


            <div className="email-result-side">

              <span
                className={`email-status ${status.className}`}
              >
                {status.label}
              </span>

              {Number.isFinite(
                emailResult.score
              ) && (
                <span className="email-score">
                  {emailResult.score}/100
                </span>
              )}

            </div>


            {/* CHECKS */}

            <div className="email-checks">

              <span
                className={
                  emailResult.checks?.validFormat
                    ? "email-check pass"
                    : "email-check fail"
                }
              >
                {emailResult.checks?.validFormat
                  ? "✓"
                  : "✕"}{" "}
                Format
              </span>

              <span
                className={
                  emailResult.checks?.domainExists
                    ? "email-check pass"
                    : "email-check fail"
                }
              >
                {emailResult.checks?.domainExists
                  ? "✓"
                  : "✕"}{" "}
                Domain
              </span>

              <span
                className={
                  emailResult.checks?.mxRecord
                    ? "email-check pass"
                    : "email-check fail"
                }
              >
                {emailResult.checks?.mxRecord
                  ? "✓"
                  : "✕"}{" "}
                MX
              </span>

              <span
                className={
                  !emailResult.checks?.disposable
                    ? "email-check pass"
                    : "email-check fail"
                }
              >
                {!emailResult.checks?.disposable
                  ? "✓"
                  : "✕"}{" "}
                Disposable
              </span>

              {emailResult.checks?.abstract
                ?.isSmtpValid != null && (
                <span
                  className={
                    emailResult.checks.abstract
                      .isSmtpValid
                      ? "email-check pass"
                      : "email-check warning"
                  }
                >
                  {emailResult.checks.abstract
                    .isSmtpValid
                    ? "✓"
                    : "⚠"}{" "}
                  SMTP
                </span>
              )}

            </div>


            {/* REASONS */}

            {emailResult.reasons?.length > 0 && (
              <div className="email-reasons">

                <span>
                  Why:
                </span>

                {emailResult.reasons.map(
                  (reason, reasonIndex) => (
                    <p key={reasonIndex}>
                      ⚠ {reason}
                    </p>
                  )
                )}

              </div>
            )}


            {/* AI CONTEXT */}

            {emailResult.aiContext && (
              <div className="email-ai-context">

                <span>
                  🤖 AI identified as{" "}
                  <strong>
                    {emailResult.aiContext.role ||
                      "unknown"}
                  </strong>
                </span>

                {emailResult.aiContext.confidence !=
                  null && (
                  <span>
                    {Math.round(
                      emailResult.aiContext.confidence *
                        100
                    )}
                    % confidence
                  </span>
                )}

              </div>
            )}

          </div>
        );
      })}

    </div>

  </div>
)}
            <div className="result-wrap">

              {/* RESULT CARD */}

              <div className="result-card">

                <div
                  className="risk-head"
                  style={{
                    background:
                      result.meta.bg,
                  }}
                >

                  <div>
                    <p className="risk-level-label">
                      RISK LEVEL
                    </p>

                    <p
                      className="risk-value"
                      style={{
                        color:
                          result.meta
                            .color,
                      }}
                    >
                      {result.meta.label}
                    </p>
                  </div>

                  <div className="risk-score-circle">
                    {animatedScore}
                    <small>/100</small>
                  </div>

                </div>


                <p className="risk-desc">
                  {result.meta.desc}
                </p>


                {/* SCORE */}

                <div className="meter-wrap">

                  <div className="meter-top">
                    <span>
                      RISK SCORE
                    </span>

                    <strong>
                      {animatedScore}%
                    </strong>
                  </div>

                  <div className="meter-track">

                    <div
                      className="meter-marker"
                      style={{
                        left: `${animatedScore}%`,
                      }}
                    />

                  </div>

                  <div className="meter-labels">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>

                </div>


                {/* BREAKDOWN */}

                {result.evidence.length >
                  0 && (
                  <div className="breakdown">

                    <p className="breakdown-title">
                      How this score was
                      calculated
                    </p>

                    {result.evidence.map(
                      (ev, i) => (
                        <div
                          key={i}
                          className="breakdown-row"
                        >

                          <span className="breakdown-label">
                            {ev.category}
                          </span>

                          <span className="breakdown-points">
                            +{ev.points}
                          </span>

                        </div>
                      )
                    )}

                    <div className="breakdown-row breakdown-total">

                      <span>
                        Total
                      </span>

                      <strong>
                        {result.wasCapped
                          ? `${result.rawScore} → 100`
                          : result.score}
                      </strong>

                    </div>

                  </div>
                )}


                {/* RECOMMENDATION */}

                <div className="reco-box">

                  <p className="reco-title">
                    What should you do?
                  </p>

                  <p>
                    {result.reco}
                  </p>

                </div>

              </div>


              {/* EVIDENCE */}

              <div className="evidence-card">

                <div className="result-section-head">

                  <div>
                    <span className="verify-step">
                      EVIDENCE
                    </span>

                    <h2>
                      Why we flagged this
                    </h2>
                  </div>

                  <span className="evidence-count">
                    {result.evidence.length}
                  </span>

                </div>


                {result.evidence.length ===
                0 ? (
                  <div className="no-evidence">
                    <strong>
                      No suspicious signals
                      detected.
                    </strong>

                    <p>
                      No strong risk indicators
                      were found in the submitted
                      content.
                    </p>
                  </div>
                ) : (
                  result.evidence.map(
                    (ev, i) => (
                      <div
                        key={i}
                        className="evidence-item"
                      >

                        <div>

                          <p className="evidence-title">

                            {ev.title}

                            <span
                              className={`source-tag source-${ev.source}`}
                            >
                              {ev.source ===
                              "llm"
                                ? "AI detected"
                                : ev.source ===
                                  "api"
                                ? "Verified"
                                : "System check"}
                            </span>

                          </p>

                          <p
                            className="evidence-category"
                            title={
                              ev.description
                            }
                          >
                            {ev.category}
                            <span className="info-dot">
                              ⓘ
                            </span>
                          </p>

                          {ev.quote && (
                            <p className="evidence-quote">
                              "{ev.quote}"
                            </p>
                          )}

                        </div>

                        <span
                          className={`sev-badge sev-${ev.severity}`}
                        >
                          {ev.severity}
                        </span>

                      </div>
                    )
                  )
                )}

              </div>

            </div>
            {/* <AnalysisCoverage
                        evidence={result.evidence}
                        urlCheck={result.urlCheck}
                      /> */}
          </section>
        )}

    </main>
  );
}

export default VerifyPage;