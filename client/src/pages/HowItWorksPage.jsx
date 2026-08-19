import { Link } from "react-router-dom";
import "../css/HowItWorks.css";

function ImagePlaceholder({
  description = "Illustration will be placed here",
}) {
  return (
    <div className="how-image-placeholder">
      <div className="how-image-circle">
        IMAGE
      </div>

      <strong>Image goes here</strong>

      <span>{description}</span>
    </div>
  );
}

function HowItWorksPage() {
  return (
    <main className="how-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="how-hero">

        <div>

          <span className="how-eyebrow">
            HOW VERIFIKARO WORKS
          </span>

          <h1>
            Understand the risk
            <span> before you act.</span>
          </h1>

          <p>
            VerifyKaro is designed for one simple problem:
            people receive messages, links, job offers and
            payment requests that can look completely genuine,
            making it difficult to know whether they are safe
            or suspicious.
          </p>

          <p>
            Instead of asking users to make that decision on
            their own, VerifyKaro analyses the content,
            identifies risk signals, verifies available
            evidence and explains the result in a way that
            is easier to understand.
          </p>

          <Link
            to="/"
            className="how-primary-btn"
          >
            Try VerifyKaro
          </Link>

        </div>

        <div className="about-image-container">
          <img 
            src="/image1.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

      </section>


      {/* =====================================================
          PROBLEM WE ARE SOLVING
      ===================================================== */}

      <section className="how-process">

        <span className="how-eyebrow">
          THE PROBLEM
        </span>

        <h2>
          Digital scams are designed
          <br />
          to look trustworthy.
        </h2>

        <div className="how-step-list">

          <article className="how-step">

            <div className="how-step-number">
              01
            </div>

            <div className="how-step-content">

              <h3>
                Scammers create urgency
              </h3>

              <p>
                Messages often use phrases such as "act now",
                "limited time", "account will be blocked",
                or "pay within 30 minutes". This pressure
                encourages people to act before verifying the
                information.
              </p>

            </div>

            <div className="about-image-container">
          <img 
            src="/image2.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

          </article>


          <article className="how-step">

            <div className="how-step-number">
              02
            </div>

            <div className="how-step-content">

              <h3>
                Fake offers can look genuine
              </h3>

              <p>
                A fraudulent job offer can contain a company
                name, salary, HR-style language and even a
                professional-looking email or website. Looking
                legitimate does not automatically make an offer
                trustworthy.
              </p>

            </div>

            <div className="about-image-container">
          <img 
            src="/image3.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

          </article>


          <article className="how-step">

            <div className="how-step-number">
              03
            </div>

            <div className="how-step-content">

              <h3>
                Risk signals are easy to miss
              </h3>

              <p>
                Users may not notice suspicious links, requests
                for OTPs or passwords, unexpected payment demands,
                unusual domains or other indicators hidden inside
                a long message.
              </p>

            </div>

            <div className="about-image-container">
          <img 
            src="/image4.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          HOW VERIFYKARO SOLVES THE PROBLEM
      ===================================================== */}

      <section className="how-architecture">

        <div>

          <span className="how-eyebrow">
            THE SOLUTION
          </span>

          <h2>
            VerifyKaro turns
            <span> uncertainty into evidence.</span>
          </h2>

          <p>
            The goal is not simply to tell a user "this is a
            scam". A useful verification tool should explain
            <strong> why</strong> something looks suspicious and
            what the user should consider before taking action.
          </p>

          <p>
            VerifyKaro therefore uses multiple stages instead
            of depending on a single AI response.
          </p>

          <div className="how-points">

            <div>
              <strong>Input</strong>
              <span>
                Message, email, link, image or PDF
              </span>
            </div>

            <div>
              <strong>AI Analysis</strong>
              <span>
                Understands the content and identifies signals
              </span>
            </div>

            <div>
              <strong>Evidence Checks</strong>
              <span>
                Verifies available external indicators
              </span>
            </div>

            <div>
              <strong>Risk Engine</strong>
              <span>
                Applies deterministic scoring rules
              </span>
            </div>

            <div>
              <strong>Explanation</strong>
              <span>
                Shows evidence, score and recommendation
              </span>
            </div>

          </div>

        </div>

        <div className="about-image-container">
          <img 
            src="/image5.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

      </section>


      {/* =====================================================
          STEP 1
      ===================================================== */}

      <section className="how-process">

        <span className="how-eyebrow">
          STEP 01 — INPUT
        </span>

        <h2>
          Start with anything
          <br />
          that looks suspicious.
        </h2>

        <div className="how-step-list">

          <article className="how-step">

            <div className="how-step-number">
              01
            </div>

            <div className="how-step-content">

              <h3>
                Paste text or upload evidence
              </h3>

              <p>
                Users can paste a suspicious WhatsApp message,
                SMS, email, job offer, payment request or
                website link directly into VerifyKaro.
              </p>

              <p>
                If the information exists inside a screenshot
                or document, users can also upload an image or
                PDF. VerifyKaro extracts readable text from the
                uploaded file before sending it for analysis.
              </p>

            </div>

            <div className="about-image-container">
          <img 
            src="/image6.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          STEP 2
      ===================================================== */}

      <section className="how-process">

        <span className="how-eyebrow">
          STEP 02 — AI UNDERSTANDING
        </span>

        <h2>
          AI looks beyond
          <br />
          individual keywords.
        </h2>

        <div className="how-step-list">

          <article className="how-step">

            <div className="how-step-number">
              02
            </div>

            <div className="how-step-content">

              <h3>
                Identify meaningful risk signals
              </h3>

              <p>
                The AI analyses the overall context of the
                submitted content instead of relying only on
                individual keywords.
              </p>

              <p>
                For example, a request to pay money may not
                always be suspicious. But when payment is combined
                with a job offer, urgency and a registration fee,
                the combination becomes a much stronger risk
                signal.
              </p>

              <p>
                The AI can therefore help identify signals such
                as payment pressure, credential requests,
                suspicious claims, urgency, impersonation-style
                language and other contextual indicators.
              </p>

            </div>

            <div className="about-image-container">
          <img 
            src="/image7.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          STEP 3
      ===================================================== */}

      <section className="how-process">

        <span className="how-eyebrow">
          STEP 03 — VERIFICATION
        </span>

        <h2>
          When possible,
          <br />
          evidence is checked externally.
        </h2>

        <div className="how-step-list">

          <article className="how-step">

            <div className="how-step-number">
              03
            </div>

            <div className="how-step-content">

              <h3>
                Cross-check links and other indicators
              </h3>

              <p>
                Some information can be evaluated beyond the
                message itself. For example, a suspicious URL
                may contain indicators that deserve additional
                verification.
              </p>

              <p>
                Where an external verification source is
                available, VerifyKaro can use that information
                as supporting evidence rather than treating
                the AI's interpretation as the only source of
                truth.
              </p>

              <p>
                This creates a separation between what the AI
                believes it sees and what can actually be
                checked through another source.
              </p>

            </div>

            <div className="about-image-container">
          <img 
            src="/image8.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          STEP 4
      ===================================================== */}

      <section className="how-process">

        <span className="how-eyebrow">
          STEP 04 — RISK SCORING
        </span>

        <h2>
          The final score is not
          <br />
          simply generated by AI.
        </h2>

        <div className="how-step-list">

          <article className="how-step">

            <div className="how-step-number">
              04
            </div>

            <div className="how-step-content">

              <h3>
                Deterministic risk engine
              </h3>

              <p>
                VerifyKaro uses fixed scoring rules to convert
                identified risk signals into a final risk score.
              </p>

              <p>
                This is important because the same set of
                signals should lead to a consistent risk result.
                The AI helps understand the content, while the
                scoring layer provides predictable decision logic.
              </p>

              <p>
                The score is then mapped into a simple risk level:
                Low, Medium or High.
              </p>

            </div>

            <div className="about-image-container">
          <img 
            src="/image1.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          WHY AI + RULES
      ===================================================== */}

      <section className="how-architecture">

        <div>

          <span className="how-eyebrow">
            WHY THIS APPROACH
          </span>

          <h2>
            AI helps understand.
            <span> Rules help decide.</span>
          </h2>

          <p>
            Large language models are useful for understanding
            natural language and context, but an AI-generated
            answer can change between requests.
          </p>

          <p>
            For a verification product, consistency matters.
            That is why VerifyKaro separates the two jobs:
          </p>

          <div className="how-points">

            <div>
              <strong>AI</strong>
              <span>
                Understands complex human language
              </span>
            </div>

            <div>
              <strong>Evidence</strong>
              <span>
                Adds supporting information from available checks
              </span>
            </div>

            <div>
              <strong>Rules</strong>
              <span>
                Apply consistent scoring logic
              </span>
            </div>

            <div>
              <strong>UI</strong>
              <span>
                Converts technical signals into a simple explanation
              </span>
            </div>

          </div>

        </div>

        <div className="about-image-container">
          <img 
            src="/image2.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

      </section>


      {/* =====================================================
          WHAT USER ACTUALLY SEES
      ===================================================== */}

      <section className="how-results">

        <span className="how-eyebrow">
          THE FINAL RESULT
        </span>

        <h2>
          We don't just say
          <br />
          "safe" or "scam".
        </h2>

        <div className="how-result-grid">

          <article>

            <span>01</span>

            <h3>
              Risk Level
            </h3>

            <p>
              A simple Low, Medium or High risk indication
              helps users quickly understand the overall
              situation.
            </p>

          </article>


          <article>

            <span>02</span>

            <h3>
              Risk Score
            </h3>

            <p>
              A numerical score communicates the strength
              of the detected risk signals.
            </p>

          </article>


          <article>

            <span>03</span>

            <h3>
              Evidence
            </h3>

            <p>
              Users can see which signals contributed to the
              result instead of receiving an unexplained verdict.
            </p>

          </article>


          <article>

            <span>04</span>

            <h3>
              Recommendation
            </h3>

            <p>
              The product provides practical guidance about
              what the user should consider doing next.
            </p>

          </article>

        </div>

      </section>


      {/* =====================================================
          REAL WORLD EXAMPLE
      ===================================================== */}

      <section className="how-architecture">

        <div>

          <span className="how-eyebrow">
            REAL-WORLD EXAMPLE
          </span>

          <h2>
            A fake job offer
            <span> can tell the whole story.</span>
          </h2>

          <p>
            Imagine receiving a message saying that you have
            been selected for a remote job and need to pay
            ₹2,999 as a "security deposit" within 30 minutes.
          </p>

          <p>
            Instead of simply detecting the word "job", VerifyKaro
            can look at the combination of signals: an unsolicited
            job offer, payment demand, urgency and a payment link.
          </p>

          <p>
            These signals are then combined by the risk engine
            and presented as evidence so the user can understand
            why the message deserves caution.
          </p>

        </div>

        <div className="about-image-container">
          <img 
            src="/image3.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

      </section>


      {/* =====================================================
          USER PROBLEM → PRODUCT SOLUTION
      ===================================================== */}

      <section className="how-process">

        <span className="how-eyebrow">
          FROM PROBLEM TO SOLUTION
        </span>

        <h2>
          What users struggle with
          <br />
          and what VerifyKaro changes.
        </h2>

        <div className="how-step-list">

          <article className="how-step">

            <div className="how-step-number">
              01
            </div>

            <div className="how-step-content">

              <h3>
                "I don't know whether this is genuine."
              </h3>

              <p>
                VerifyKaro provides a structured risk assessment
                instead of forcing the user to make the decision
                completely on their own.
              </p>

            </div>

            <div className="about-image-container">
          <img 
            src="/image3.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

          </article>


          <article className="how-step">

            <div className="how-step-number">
              02
            </div>

            <div className="how-step-content">

              <h3>
                "I don't understand why it looks suspicious."
              </h3>

              <p>
                VerifyKaro shows evidence and explains the signals
                contributing to the result.
              </p>

            </div>

            <div className="about-image-container">
              <img 
                src="/hero_illustration.png" 
                alt="Digital Trust Protection" 
                className="about-section-image" 
              />
            </div>

          </article>


          <article className="how-step">

            <div className="how-step-number">
              03
            </div>

            <div className="how-step-content">

              <h3>
                "What should I do next?"
              </h3>

              <p>
                Instead of stopping at detection, VerifyKaro
                provides a recommendation that helps the user
                make a more informed next decision.
              </p>

            </div>

            <div className="about-image-container">
              <img 
                src="/problem_illustration.png" 
                alt="Digital Trust Protection" 
                className="about-section-image" 
              />
            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          IMPORTANT LIMITATION
      ===================================================== */}

      <section className="how-architecture">

        <div>

          <span className="how-eyebrow">
            IMPORTANT TO UNDERSTAND
          </span>

          <h2>
            VerifyKaro is a
            <span> decision-support tool.</span>
          </h2>

          <p>
            No automated system can guarantee that a message,
            website or person is completely safe. New scams
            appear constantly and attackers can change their
            techniques.
          </p>

          <p>
            VerifyKaro is therefore designed to help users
            identify warning signs, understand available
            evidence and make a more informed decision.
          </p>

          <p>
            A low-risk result should never be treated as a
            guarantee of safety.
          </p>

        </div>

        <div className="about-image-container">
          <img 
            src="/mission_illustration.png" 
            alt="Digital Trust Protection" 
            className="about-section-image" 
          />
        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="how-cta">

        <h2>
          Received something suspicious?
        </h2>

        <p>
          Don't guess. Understand the signals before you act.
        </p>

        <Link
          to="/"
          className="how-primary-btn"
        >
          Check with VerifyKaro
        </Link>

      </section>

    </main>
  );
}

export default HowItWorksPage;