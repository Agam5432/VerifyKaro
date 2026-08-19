import { Link } from "react-router-dom";
import "../css/About.css";

function ImagePlaceholder({
  label = "IMAGE",
  description = "Illustration will be placed here",
}) {
  return (
    <div className="about-image-placeholder">
      <div className="about-image-circle">
        {label}
      </div>

      <strong>Image goes here</strong>

      <span>{description}</span>
    </div>
  );
}

function AboutPage() {
  return (
    <main className="about-page">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-eyebrow">
            ABOUT VERIFIKARO
          </span>

          <h1>
            Check before you
            <span> trust.</span>
          </h1>

          <p className="about-hero-text">
            VerifyKaro is a digital safety tool designed to help
            people make better decisions when they receive
            something that feels suspicious — whether it's a
            job offer, email, SMS, WhatsApp message, payment
            request, OTP request or unfamiliar link.
          </p>

          <p className="about-hero-subtext">
            Instead of asking users to blindly trust a message
            or simply label it as a scam, VerifyKaro looks at
            the available signals, explains what stands out,
            and helps users understand what they should check
            before taking action.
          </p>

          <Link
            to="/"
            className="about-primary-btn"
          >
            Start Verification
          </Link>

        </div>

        <div className="about-image-container">
          <img 
            src="/hero_illustration.png" 
            alt="VerifyKaro Analysis" 
            className="about-section-image" 
          />
        </div>

      </section>


      {/* ==================================================
          THE PROBLEM
      ================================================== */}

      <section className="about-two-column">

        <div>

          <span className="about-eyebrow">
            THE PROBLEM
          </span>

          <h2>
            Scams don't always
            <br />
            look like scams.
          </h2>

          <p>
            Digital scams have become much more convincing.
            A fraudulent job offer can look like a genuine
            recruitment message. A phishing email can use
            professional language and familiar branding.
            A payment request can create urgency before the
            recipient has enough time to think.
          </p>

          <p>
            The problem is not always that people cannot
            recognise a scam. The problem is that they often
            have to make a decision quickly, with incomplete
            information and without knowing what signals they
            should look for.
          </p>

          <p>
            A message saying
            <strong> "pay now", "share your OTP", or
            "your account will be blocked"</strong>
            can create pressure that makes careful verification
            much harder.
          </p>

        </div>

        <div className="about-image-container">
          <img 
            src="/problem_illustration.png" 
            alt="Scam versus Safe Messages" 
            className="about-section-image" 
          />
        </div>

      </section>


      {/* ==================================================
          WHY WE BUILT IT
      ================================================== */}

      <section className="about-story">

        <div className="about-story-header">

          <span className="about-eyebrow">
            WHY VERIFIKARO WAS BUILT
          </span>

          <h2>
            The goal is simple:
            <br />
            <span>help people pause before they act.</span>
          </h2>

        </div>

        <div className="about-story-content">

          <p>
            When people receive a suspicious message, the first
            question is often: <strong>"Is this real?"</strong>
          </p>

          <p>
            But answering that question can require checking
            several things at once — the language used in the
            message, the request being made, the urgency,
            the sender, links, payment instructions and other
            contextual signals.
          </p>

          <p>
            VerifyKaro was created around this exact problem.
            Instead of making users search through different
            tools or rely entirely on intuition, the idea is to
            bring useful verification signals together in one
            simple interface.
          </p>

          <p>
            The goal isn't to replace human judgement. The goal
            is to give people better information so they can
            make that judgement with more confidence.
          </p>

        </div>

      </section>


      {/* ==================================================
          WHAT VERIFIKARO DOES
      ================================================== */}

      <section className="about-values">

        <span className="about-eyebrow">
          WHAT VERIFIKARO DOES
        </span>

        <h2>
          One place to check
          <br />
          different types of suspicious content.
        </h2>

        <p className="about-section-intro">
          VerifyKaro is designed around the situations where
          people commonly need a second opinion before taking
          action.
        </p>


        <div className="about-value-grid">

          <article className="about-value-card">

            <span>01</span>

            <h3>
              Job & HR Messages
            </h3>

            <p>
              Check suspicious job offers, recruitment messages,
              registration requests, interview-related messages
              and offers that ask for money or personal
              information.
            </p>

          </article>


          <article className="about-value-card">

            <span>02</span>

            <h3>
              Links & Websites
            </h3>

            <p>
              Identify suspicious links and, where supported,
              cross-check relevant indicators instead of relying
              only on how a URL looks.
            </p>

          </article>


          <article className="about-value-card">

            <span>03</span>

            <h3>
              Payment Requests
            </h3>

            <p>
              Understand messages asking for deposits, advance
              payments, registration fees, UPI payments or other
              financial actions.
            </p>

          </article>


          <article className="about-value-card">

            <span>04</span>

            <h3>
              OTP & Credentials
            </h3>

            <p>
              Highlight messages that request sensitive
              information such as OTPs, passwords, PINs,
              CVVs or banking credentials.
            </p>

          </article>


          <article className="about-value-card">

            <span>05</span>

            <h3>
              Emails & Messages
            </h3>

            <p>
              Review suspicious emails, SMS messages and
              WhatsApp-style messages for language, urgency,
              requests and other warning signals.
            </p>

          </article>


          <article className="about-value-card">

            <span>06</span>

            <h3>
              Uploaded Files
            </h3>

            <p>
              Users can upload supported images or PDFs so that
              readable content can be extracted and analysed
              without manually typing the entire message.
            </p>

          </article>

        </div>

      </section>


      {/* ==================================================
          HOW WE APPROACH VERIFICATION
      ================================================== */}

      <section className="about-two-column about-approach">

        <div className="about-image-container">
          <img 
            src="/approach_illustration.png" 
            alt="AI and Rules Engine Workflow" 
            className="about-section-image" 
          />
        </div>

        <div>

          <span className="about-eyebrow">
            OUR APPROACH
          </span>

          <h2>
            AI helps identify signals.
            <br />
            <span>Rules help keep scoring consistent.</span>
          </h2>

          <p>
            VerifyKaro uses AI where it is useful — for example,
            to understand the context of a message and identify
            potentially suspicious signals that may not be captured
            by simple keyword matching.
          </p>

          <p>
            But the AI is not given complete control over the
            final risk score. The identified signals can be passed
            through deterministic scoring logic so that the same
            set of signals produces a consistent result.
          </p>

          <p>
            This approach is important because a verification
            product should not randomly change its answer simply
            because an AI model responded differently to the same
            situation.
          </p>

        </div>

      </section>


      {/* ==================================================
          WHAT MAKES IT DIFFERENT
      ================================================== */}

      <section className="about-values about-difference">

        <span className="about-eyebrow">
          OUR PRINCIPLE
        </span>

        <h2>
          Don't just give a verdict.
          <br />
          <span>Show the reasoning.</span>
        </h2>

        <div className="about-value-grid">

          <article className="about-value-card">

            <span>01</span>

            <h3>
              Evidence over guesses
            </h3>

            <p>
              Whenever possible, VerifyKaro aims to show the
              signals behind a result instead of presenting an
              unexplained "safe" or "unsafe" label.
            </p>

          </article>


          <article className="about-value-card">

            <span>02</span>

            <h3>
              Clear risk indication
            </h3>

            <p>
              A risk score and risk level help users quickly
              understand whether they should proceed carefully,
              investigate further or avoid taking immediate action.
            </p>

          </article>


          <article className="about-value-card">

            <span>03</span>

            <h3>
              Practical next steps
            </h3>

            <p>
              The purpose of verification is not just to identify
              a problem. Users should also understand what they
              should do next.
            </p>

          </article>

        </div>

      </section>


      {/* ==================================================
          OUR MISSION
      ================================================== */}

      <section className="about-two-column about-mission">

        <div>

          <span className="about-eyebrow">
            OUR MISSION
          </span>

          <h2>
            Make digital trust
            <br />
            <span>easier for everyone.</span>
          </h2>

          <p>
            You shouldn't need to be a cybersecurity expert to
            question a suspicious message.
          </p>

          <p>
            Our mission with VerifyKaro is to make everyday
            digital verification simpler, faster and easier
            to understand.
          </p>

          <p>
            Whether someone is checking a job offer, a payment
            request, an unfamiliar link or a message asking for
            sensitive information, the objective is the same:
            give them useful context before they act.
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


      {/* ==================================================
          WHAT VERIFIKARO IS NOT
      ================================================== */}

      <section className="about-not">

        <div>

          <span className="about-eyebrow">
            AN IMPORTANT NOTE
          </span>

          <h2>
            VerifyKaro is a decision-support
            <br />
            <span>tool, not a guarantee.</span>
          </h2>

        </div>

        <div className="about-not-content">

          <p>
            No automated system can guarantee that every message
            is genuine or fraudulent. Real-world scams constantly
            change, and some legitimate messages can also contain
            signals that look suspicious.
          </p>

          <p>
            That's why VerifyKaro focuses on showing risk signals,
            evidence and recommendations rather than claiming
            absolute certainty.
          </p>

          <p>
            When something looks suspicious, the safest approach
            is still to independently verify the sender or
            organisation through an official channel before
            sharing information, clicking links or making payments.
          </p>

        </div>

      </section>


      {/* ==================================================
          FINAL CTA
      ================================================== */}

      <section className="about-cta">

        <span className="about-eyebrow">
          BEFORE YOU CLICK. BEFORE YOU PAY.
        </span>

        <h2>
          When something feels off,
          <br />
          <span>check it first.</span>
        </h2>

        <p>
          Paste a suspicious message or upload an image/PDF
          and see what VerifyKaro finds.
        </p>

        <Link
          to="/"
          className="about-primary-btn"
        >
          Check Something Suspicious
        </Link>

      </section>

    </main>
  );
}

export default AboutPage;