# VerifyKaro

### Check before you trust.

VerifyKaro is a decision-support platform designed to help users identify suspicious messages, job offers, payment requests, links, emails, images, and documents.

Instead of simply returning **"Safe"** or **"Scam"**, VerifyKaro analyzes the submitted content, identifies potential risk signals, performs available verification checks, calculates a deterministic risk score, and explains why something may deserve caution.

> **VerifyKaro does not guarantee that something is completely safe. It helps users make a more informed decision.**

---

## ✨ Features

* 🔍 Suspicious message analysis
* 💼 Fake job offer detection
* 💳 Payment request and fee detection
* 🔗 Suspicious URL analysis
* 📧 Email verification checks
* 🖼️ Image/screenshot analysis
* 📄 PDF text extraction and analysis
* 🤖 AI-powered contextual analysis
* 🧠 Risk signal detection
* ⚙️ Deterministic risk scoring
* 📊 Low / Medium / High risk classification
* 📝 Evidence-based explanations
* 💡 Action recommendations
* 🛡️ Rate limiting and API protection

---

## 🧠 How VerifyKaro Works

VerifyKaro uses multiple stages instead of relying entirely on a single AI response.

```text
User Input
    ↓
Text / Image / PDF / Link
    ↓
Content Extraction
    ↓
AI Analysis
    ↓
Risk Signal Detection
    ↓
External Verification
    ↓
Deterministic Risk Engine
    ↓
Risk Score
    ↓
Evidence + Explanation
    ↓
Recommendation
```

### AI + Rules

The AI is responsible for understanding the content and identifying contextual signals.

The final risk assessment is handled through deterministic rules so that the same set of signals can produce a consistent result.

```text
AI
↓
Understands context

Evidence
↓
Adds supporting information

Rules
↓
Calculate risk

UI
↓
Explains the result
```

---

## 🏗️ Project Structure

```text
VerifyKaro/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* React
* React Router
* JavaScript
* CSS
* Vite

### Backend

* Node.js
* Express.js
* REST APIs
* Axios
* CORS
* Express Rate Limit

### AI

* Groq API
* LLM-based contextual analysis

### Verification

* URL/link verification
* Email verification
* External verification APIs
* Rule-based risk scoring

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Agam5432/VerifyKaro.git
```

```bash
cd VerifyKaro
```

---

# 💻 Frontend Setup

Go to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

Open another terminal and go to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

Example:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

SAFE_BROWSING_API_KEY=your_api_key
ABSTRACT_API_KEY=your_api_key

PORT=5000

CLIENT_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

The backend will normally run on:

```text
http://localhost:5000
```

---

# 🔐 Environment Variables

Never commit your `.env` file to GitHub.

The project uses environment variables for API credentials and deployment configuration.

| Variable                | Description                       |
| ----------------------- | --------------------------------- |
| `GROQ_API_KEY`          | Groq API key                      |
| `GROQ_MODEL`            | LLM model used by VerifyKaro      |
| `SAFE_BROWSING_API_KEY` | Safe Browsing API key             |
| `ABSTRACT_API_KEY`      | Email/domain verification API key |
| `PORT`                  | Backend server port               |
| `CLIENT_ORIGIN`         | Allowed frontend origin           |

A template is available in:

```text
server/.env.example
```

---

# 🔌 API

The backend exposes REST endpoints under:

```text
/api
```

The verification API processes submitted content and returns a structured risk report.

A typical result contains information such as:

```json
{
  "riskLevel": "HIGH",
  "riskScore": 82,
  "signals": [],
  "evidence": [],
  "recommendation": ""
}
```

The exact response depends on the submitted content and available verification checks.

---

# 🛡️ Security Considerations

VerifyKaro includes several basic protections:

* Environment variables for API credentials
* CORS configuration
* Request rate limiting
* JSON payload size limits
* Separation of frontend and backend
* Deterministic scoring logic

API keys are never intended to be exposed to the frontend.

---

# ⚠️ Important Limitation

VerifyKaro is a **decision-support tool**, not a guarantee of safety.

Scammers continuously change their techniques, domains, messages, and identities.

A low-risk result does not guarantee that a message, website, person, or offer is legitimate.

Users should always verify important information through trusted official sources before making payments, sharing credentials, or taking sensitive actions.

---

# 🔮 Future Improvements

Potential future improvements include:

* More verification providers
* Advanced domain reputation analysis
* Better OCR for screenshots
* Improved PDF analysis
* Browser extension
* WhatsApp message import
* Email forwarding analysis
* Historical scam pattern detection
* More advanced risk scoring
* User reporting and community signals
* Multilingual scam detection

---

# 📸 Screenshots

Screenshots and live demo links can be added here after deployment.

---

# 🌐 Deployment

VerifyKaro is designed to use a separate deployment architecture:

```text
Frontend
   ↓
Vercel
   ↓
Backend API
   ↓
Render
```

### Frontend

Deploy the `client` directory using Vercel.

### Backend

Deploy the `server` directory using Render.

Environment variables should be configured separately in each deployment platform.

---

# 👨‍💻 Author

**Agam Tyagi**

Built as a practical AI-powered verification platform focused on helping users understand suspicious digital interactions.

---

## 📄 License

This project is currently intended for demonstration and development purposes.
