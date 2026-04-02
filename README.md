<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=F75C7E&center=true&vCenter=true&width=500&lines=CodeForum+%F0%9F%92%AC;Ask.+Answer.+Elevate." alt="Typing SVG" />

<br/>

**A full-stack Stack Overflow clone — built to sharpen real-world engineering skills.**

[![Live Demo](https://img.shields.io/badge/%F0%9F%9A%80%20Live%20Demo-code--forum--two.vercel.app-0ea5e9?style=for-the-badge)](https://code-forum-two.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-97%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 🧠 What is CodeForum?

**CodeForum** is a developer Q&A platform inspired by Stack Overflow — where programmers can ask questions, share answers, and vote on the best solutions. Built end-to-end with a modern TypeScript stack, it demonstrates real-world skills in full-stack development, database design, and production deployment.

> *"Built this from scratch to understand how large-scale Q&A platforms are engineered under the hood."*

---

## ⚡ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 14 | SSR, file-based routing, API routes in one place |
| **Language** | TypeScript | End-to-end type safety — 97%+ of the codebase |
| **UI Library** | Magic UI | Animated, production-ready components out of the box |
| **Backend** | Appwrite | Auth, database, storage & serverless functions — all in one |
| **Database** | Appwrite DB | Flexible document-based data storage with real-time support |
| **Auth** | Appwrite Auth | Secure user management with OAuth & email/password |
| **Deployment** | Vercel | Zero-config CI/CD with instant preview deploys |

---

## ✨ Features

- 🔐 **User Authentication** — Sign up, log in, manage sessions securely
- 📝 **Ask Questions** — Rich text editor with tag support
- 💡 **Post Answers** — Community-driven replies with markdown support
- 👍 **Voting System** — Upvote / downvote questions and answers
- 🏷️ **Tag-based Filtering** — Browse content by technology or topic
- 🔍 **Search** — Find questions across the entire platform
- 👤 **User Profiles** — Track reputation, questions, and answers
- 📱 **Responsive Design** — Works across all screen sizes

---

## 🏗️ Project Architecture

```
CodeForum/
├── codeforum/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (root)/            # Main app pages
│   │   └── api/               # Serverless API routes
│   ├── components/            # Reusable UI + Magic UI components
│   ├── lib/
│   │   └── appwrite.ts        # Appwrite client & config
│   └── public/                # Static assets
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

```bash
node -v   # v18+
npm -v    # v9+
```

You'll also need an **Appwrite** project — create a free one at [cloud.appwrite.io](https://cloud.appwrite.io).

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/ayushhhsingh/CodeForum.git
cd CodeForum/codeforum

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with the following:

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_APPWRITE_DATABASE_ID="your-database-id"
NEXT_PUBLIC_APPWRITE_COLLECTION_ID="your-collection-id"
```

### Run the App

```bash
# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live! 🎉

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |

---

## 🌍 Deployment

This project is deployed on **Vercel** with automatic CI/CD on every push to `main`.

To deploy your own fork:

1. Push your repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Deploy — done ✅

---

## 🧩 What I Learned

- Architecting a **full-stack TypeScript application** from scratch using Next.js
- Integrating **Appwrite** as a complete BaaS — handling auth, database, and storage without a custom backend
- Building polished UIs with **Magic UI** animated components for a production-grade feel
- Implementing **secure authentication flows** with Appwrite's built-in user management
- Structuring a **document-based data model** for a complex Q&A system
- Deploying and managing a production app on **Vercel**

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Ayush Singh](https://github.com/ayushhhsingh)**

⭐ If you found this project useful, consider giving it a star!

[![GitHub stars](https://img.shields.io/github/stars/ayushhhsingh/CodeForum?style=social)](https://github.com/ayushhhsingh/CodeForum/stargazers)

</div>
