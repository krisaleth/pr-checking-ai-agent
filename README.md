# PR Checking AI Agent

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![GitHub App](https://img.shields.io/badge/GitHub-App-181717?logo=github\&logoColor=white)](https://github.com/)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-7C3AED)](https://openrouter.ai/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-TBD-lightgrey)](#license)

AI-powered GitHub Pull Request Code Review Agent.

PR Checking AI Agent tự động phân tích Pull Request trên GitHub bằng Large Language Model (LLM), phát hiện các vấn đề tiềm ẩn trong code và trả về các finding có cấu trúc để hỗ trợ developer review code nhanh hơn.

## ✨ Features

* 🔐 GitHub OAuth authentication
* 🤖 AI-powered Pull Request code review
* 🐙 GitHub App integration
* 🔑 GitHub Installation Token authentication
* 📄 Fetch Pull Request files and diffs
* 🔍 Review added/modified code
* 🧠 Structured AI findings
* 💬 Post review results back to GitHub
* 🛡️ Rate limiting
* 🍪 Session-based authentication
* 🔄 Refresh token support
* 📊 Review status and results
* 🔒 Webhook-based Pull Request processing

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       GitHub         │
                         │                      │
                         │ Pull Request / Push  │
                         └──────────┬───────────┘
                                    │
                                    │ Webhook
                                    ▼
                         ┌──────────────────────┐
                         │    Express Backend   │
                         │                      │
                         │  Webhook Controller  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    GitHub Service    │
                         │                      │
                         │ Installation Token   │
                         │ PR Files / Diff      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   AI Review Service  │
                         │                      │
                         │      OpenRouter      │
                         │        + LLM         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  Review Validation   │
                         │                      │
                         │ Parse / Validate     │
                         │ Map Findings         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       GitHub         │
                         │                      │
                         │ PR Review / Comments │
                         └──────────────────────┘
```

## 📁 Project Structure

```text
pr-checking-ai-agent/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── server.js
│   │
│   ├── keys/
│   │   └── *.private-key.pem
│   │
│   ├── .env
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── TODO.md
└── README.md
```

## 🔄 How It Works

### 1. User authenticates with GitHub

The application uses GitHub OAuth to authenticate the user.

```text
User
 │
 ▼
GitHub OAuth
 │
 ▼
OAuth Callback
 │
 ▼
Backend
 │
 ├── Access Token
 ├── Refresh Token
 └── User Session
```

### 2. GitHub App receives Pull Request events

The GitHub App listens for Pull Request webhook events.

For example:

```text
pull_request.opened
pull_request.synchronize
pull_request.reopened
```

The webhook contains information such as:

* Repository
* Pull Request number
* Repository owner
* Head commit SHA
* Installation ID

### 3. Backend authenticates as GitHub App

The backend uses the GitHub App private key to authenticate and obtain an Installation Access Token.

```text
GitHub App Private Key
        │
        ▼
JWT
        │
        ▼
Installation ID
        │
        ▼
Installation Access Token
```

### 4. Fetch Pull Request changes

The GitHub service retrieves the files changed by the Pull Request.

The review focuses primarily on:

* Added lines
* Modified lines
* Relevant surrounding context
* File path
* Pull Request metadata

### 5. Send changes to the LLM

The diff is passed to the AI review service through OpenRouter.

The model is instructed to behave as a senior code reviewer and focus on actionable issues.

The review considers areas such as:

* Correctness
* Security
* Reliability
* Maintainability
* Performance
* Testing
* API contracts
* Schema compatibility

The AI should not invent problems that cannot be supported by the provided code.

### 6. Validate AI output

The AI response is converted into a structured format.

Example:

```json
{
  "summary": "The PR contains several issues that should be addressed.",
  "findings": [
    {
      "file": "src/server.js",
      "line": 42,
      "side": "RIGHT",
      "severity": "medium",
      "confidence": 0.95,
      "title": "Hardcoded server port",
      "explanation": "The server uses a hardcoded port instead of the configured environment variable.",
      "suggested_fix": "Use process.env.PORT with a fallback value.",
      "needs_full_file": false
    }
  ]
}
```

### 7. Map findings to changed lines

AI-generated findings must be mapped back to the actual Pull Request diff.

Only findings that can be reliably associated with changed code should be posted as inline comments.

Unmappable findings can be retained as general review information instead of creating an invalid inline comment.

### 8. Publish the review

Validated findings are sent back to GitHub.

The final result may contain:

* Review summary
* Inline comments
* Severity
* Suggested fixes
* General warnings

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* GitHub REST API
* GitHub App
* GitHub OAuth
* OpenRouter
* OpenAI-compatible SDK

### Frontend

* React
* TypeScript
* Vite

### Authentication

* GitHub OAuth
* Session authentication
* Access tokens
* Refresh tokens
* GitHub App Installation Tokens

### AI

The application uses OpenRouter as the LLM gateway.

The backend communicates with OpenRouter through an OpenAI-compatible API.

## ⚙️ Requirements

Before running the project locally, install:

* Node.js 20+
* npm
* MongoDB
* Git
* A GitHub account
* A GitHub App
* An OpenRouter API key

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/krisaleth/pr-checking-ai-agent.git

cd pr-checking-ai-agent
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## 🔐 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
NODE_ENV=development

PORT=3000

MONGO_URI=mongodb://localhost:27017/pr-checking-ai-agent

SESSION_SECRET=your_session_secret

GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

GITHUB_APP_ID=your_github_app_id
GITHUB_APP_PRIVATE_KEY_PATH=keys/your-private-key.pem

GITHUB_WEBHOOK_SECRET=your_webhook_secret

REDIRECT_URI=http://localhost:3000/api/auth/github/callback

OPENAI_ADMIN_KEY=your_openrouter_api_key
```

> Never commit `.env`, GitHub App private keys, or API keys to Git.

Recommended `.gitignore`:

```gitignore
node_modules/
.env
.env.*
!.env.example

keys/*.pem

dist/
build/
logs/
```

## 🐙 GitHub OAuth Setup

Create a GitHub OAuth App from your GitHub developer settings.

Configure the callback URL:

```text
http://localhost:3000/api/auth/github/callback
```

The application uses OAuth for user authentication.

Typical OAuth scopes:

```text
repo
read:user
user:email
```

For production, use HTTPS and a production callback URL.

## 🤖 GitHub App Setup

Create a GitHub App and configure the required repository permissions.

The application requires Pull Request access in order to:

* Read Pull Requests
* Read changed files
* Read repository information
* Create review comments

Enable the required Pull Request webhook events.

Example:

```text
Pull request
```

The GitHub App private key should be stored locally:

```text
backend/keys/
```

Do not commit the private key to Git.

## 🌐 Webhook Development

For local development, GitHub cannot directly access:

```text
localhost
```

Use a secure tunnel such as Cloudflare Tunnel.

Example:

```bash
cloudflared tunnel --url http://localhost:3000
```

Configure the resulting HTTPS URL as the GitHub App webhook URL.

Example:

```text
https://your-tunnel.example.com/api/github/webhook
```

## ▶️ Running the Backend

Development:

```bash
cd backend
npm run dev
```

Production:

```bash
npm start
```

The backend runs on:

```text
http://localhost:3000
```

unless another `PORT` is configured.

## ▶️ Running the Frontend

```bash
cd frontend
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

## 🧪 Testing

Run backend tests with:

```bash
npm test
```

If a dedicated integration test script is configured:

```bash
npm run test-github-review
```

A GitHub Pull Request can be used to test the complete pipeline:

```text
GitHub PR
   ↓
Webhook
   ↓
Backend
   ↓
GitHub Installation Token
   ↓
Fetch PR Diff
   ↓
AI Review
   ↓
Validate Findings
   ↓
Map Findings
   ↓
GitHub Review
```

## 🔍 AI Review Principles

The AI reviewer should follow these principles:

### Focus on actionable issues

A finding should represent a problem that a developer can reasonably fix.

Avoid:

* Style preferences without impact
* Personal coding preferences
* Speculative problems
* Duplicate findings
* Issues unrelated to the Pull Request

### Do not invent context

The model should only make claims supported by the available code and metadata.

If additional context is required, the finding should indicate that instead of assuming how the rest of the application works.

### Prioritize changed code

The primary review target is code introduced or modified by the Pull Request.

Unchanged code should generally only be discussed when it is directly necessary to explain a problem caused by the changes.

### Security

Potential security issues should be treated carefully.

Examples include:

* Authentication bypass
* Authorization issues
* Secret exposure
* Injection vulnerabilities
* Unsafe input handling
* Insecure configuration

### Reliability

Review for issues that can cause:

* Runtime failures
* Incorrect state
* Race conditions
* Data loss
* Unexpected API behavior

## 📋 Finding Schema

A finding follows this general structure:

```json
{
  "file": "path/to/file.js",
  "line": 10,
  "side": "RIGHT",
  "severity": "high",
  "confidence": 0.92,
  "title": "Short description",
  "explanation": "Why this is a problem.",
  "suggested_fix": "How the issue can be addressed.",
  "needs_full_file": false
}
```

### Severity

Supported severity levels:

```text
critical
high
medium
low
```

### Confidence

`confidence` represents how strongly the model believes the finding is valid.

Example:

```text
0.95
```

means the model has high confidence.

## 🛡️ Security

Security-sensitive configuration must never be committed to the repository.

Do not commit:

```text
.env
*.pem
GitHub App private keys
OAuth client secrets
OpenRouter API keys
JWT secrets
Session secrets
Database credentials
```

Use environment variables or a dedicated secret-management solution in production.

## 📈 Production Considerations

Before deploying to production, consider implementing:

* HTTPS
* Secure cookies
* Webhook signature verification
* Strong session secrets
* Database indexes
* Request validation
* API rate limiting
* AI request timeouts
* Retry handling
* Review queue
* Duplicate review prevention
* Logging
* Monitoring
* Error tracking
* Token/cost limits
* Diff size limits
* AI output validation
* GitHub API retry handling

## 🗺️ Roadmap

### GitHub Integration

* [x] GitHub OAuth
* [x] GitHub App authentication
* [x] Installation Token
* [x] Fetch Pull Request diff
* [ ] Automatic Pull Request review
* [ ] Inline review comments
* [ ] Duplicate review prevention
* [ ] Incremental review

### AI Review

* [x] OpenRouter integration
* [x] Structured review output
* [ ] Strong output validation
* [ ] Finding-to-diff mapping
* [ ] Context-aware review
* [ ] Large PR handling
* [ ] Review cost optimization

### Backend

* [x] Express API
* [x] Session authentication
* [x] Rate limiting
* [ ] Background review queue
* [ ] Better error handling
* [ ] Monitoring
* [ ] Automated tests

### Frontend

* [ ] Authentication UI
* [ ] Repository selection
* [ ] Pull Request selection
* [ ] Review status
* [ ] Review history
* [ ] Finding details
* [ ] Dashboard

### DevOps

* [ ] Production deployment
* [ ] GitHub Actions CI
* [ ] Automated tests
* [ ] Docker
* [ ] Production logging
* [ ] Monitoring

## 🤝 Contributing

Contributions are welcome.

Suggested workflow:

```bash
git checkout -b feature/my-feature

# Make changes

git add .

git commit -m "feat: add my feature"

git push origin feature/my-feature
```

Then create a Pull Request on GitHub.

## 📄 License

This project is currently under development.

Add an appropriate license before distributing the project publicly.

## 👨‍💻 Project

**PR Checking AI Agent**

Repository:

https://github.com/krisaleth/pr-checking-ai-agent

An AI-powered GitHub Pull Request review system designed to help developers identify potential issues before merging code.
