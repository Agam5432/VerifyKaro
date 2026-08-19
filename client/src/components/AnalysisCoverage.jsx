import "../css/AnalysisCoverage.css";

function AnalysisCoverage({ result }) {
  if (!result) {
    return null;
  }

  const aiCompleted = result.analysisComplete === true;

  const urlDetected =
    result.urlCheck?.checked === true ||
    Number(result.urlCheck?.urlsFound || 0) > 0;

  const urlVerified =
    result.urlCheck?.apiVerified === true;

  const evidenceGrounded =
    Array.isArray(result.evidence) &&
    result.evidence.every(
      (item) =>
        !item.quote ||
        typeof item.quote === "string"
    );

  return (
    <section className="analysis-coverage-card">

      <div className="analysis-coverage-header">

        <div>
          <p className="analysis-coverage-eyebrow">
            ANALYSIS COVERAGE
          </p>

          <h3>
            What VerifyKaro checked
          </h3>
        </div>

        <span
          className={`coverage-status ${
            aiCompleted ? "complete" : "incomplete"
          }`}
        >
          {aiCompleted ? "Analysis complete" : "Analysis incomplete"}
        </span>

      </div>


      <div className="coverage-checks">

        {/* AI ANALYSIS */}

        <div className="coverage-item">

          <div
            className={`coverage-icon ${
              aiCompleted ? "success" : "warning"
            }`}
          >
            {aiCompleted ? "✓" : "!"}
          </div>

          <div className="coverage-content">

            <strong>
              AI signal analysis
            </strong>

            <p>
              {aiCompleted
                ? "The message was analyzed for relevant risk signals."
                : "AI analysis could not be completed, so no final risk conclusion was shown."}
            </p>

          </div>

        </div>


        {/* EVIDENCE */}

        <div className="coverage-item">

          <div
            className={`coverage-icon ${
              evidenceGrounded ? "success" : "warning"
            }`}
          >
            {evidenceGrounded ? "✓" : "!"}
          </div>

          <div className="coverage-content">

            <strong>
              Evidence grounding
            </strong>

            <p>
              {evidenceGrounded
                ? "Evidence shown in the result is tied back to the submitted content."
                : "Some evidence could not be fully verified against the submitted content."}
            </p>

          </div>

        </div>


        {/* URL CHECK */}

        <div className="coverage-item">

          <div
            className={`coverage-icon ${
              urlVerified
                ? "success"
                : urlDetected
                ? "warning"
                : "neutral"
            }`}
          >
            {urlVerified
              ? "✓"
              : urlDetected
              ? "!"
              : "—"}
          </div>

          <div className="coverage-content">

            <strong>
              Link / domain check
            </strong>

            <p>
              {!urlDetected &&
                "No URL was detected in the submitted content."}

              {urlDetected &&
                urlVerified &&
                "The detected URL was checked against the configured external threat service."}

              {urlDetected &&
                !urlVerified &&
                "A URL was detected, but external threat verification was unavailable. A local pattern check may still be used."}
            </p>

          </div>

        </div>


        {/* SCORING */}

        <div className="coverage-item">

          <div className="coverage-icon success">
            ✓
          </div>

          <div className="coverage-content">

            <strong>
              Deterministic risk scoring
            </strong>

            <p>
              The final risk score is calculated using fixed
              scoring rules rather than asking the AI to decide
              the final risk level.
            </p>

          </div>

        </div>

      </div>


      {/* TRANSPARENCY NOTE */}

      <div className="coverage-note">

        <span className="coverage-note-icon">
          i
        </span>

        <p>
          VerifyKaro provides an analysis based on the signals
          and checks available at the time of verification.
          A Low Risk result does not guarantee that a message
          or sender is legitimate.
        </p>

      </div>

    </section>
  );
}

export default AnalysisCoverage;