# 🚀 Node‑Express‑TypeScript‑Setup

> A starter boilerplate for building robust, type‑safe REST APIs with Node.js, Express & TypeScript.  
> Includes authentication (JWT + Google OAuth), Prisma ORM, Zod validation, Winston logging & more!  
> 🔥 **Ready in 5 minutes** with `npm init` & `.env` — you’re up and running.

---

<details>
<summary>📑 Table of Contents</summary>

1. [✨ Features](#✨-features)
2. [🛠️ Tech Stack](#🛠️-tech-stack)
3. [⚙️ Quick Start](#⚙️-quick-start)
4. [📝 Configuration](#📝-configuration)
5. [🚀 Usage](#🚀-usage)
6. [📂 Project Structure](#📂-project-structure)
7. [🛡️ Environment Variables](#🛡️-environment-variables)
8. [🤝 Contributing](#🤝-contributing)
9. [📄 License](#📄-license)
10. [✉️ Contact](#✉️-contact)

</details>

---

## ✨ Features

- ✅ **Type‑Safe** — Full TypeScript support with strict `tsconfig.json`
- 🔒 **Auth** — JWT access/refresh tokens + Google OAuth via Passport.js
- 🗃️ **ORM** — Prisma + PostgreSQL with auto‑generated client
- 🔄 **Validation** — Zod schemas for env vars & request bodies
- 📬 **Email** — Nodemailer HTML templates ready to go
- 🛡️ **Security** — Helmet, CORS, rate‑limit, error & not‑found middleware
- 📊 **Logging** — Winston, Morgan & Chalk for colorful, structured logs

---

## 🛠️ Tech Stack

| Layer          | Package(s)                                 |
| -------------- | ------------------------------------------ |
| Runtime        | Node.js                                    |
| HTTP Framework | Express 5                                  |
| Language       | TypeScript                                 |
| DB & ORM       | PostgreSQL + Prisma                        |
| Validation     | Zod                                        |
| Auth           | Passport.js, passport‑jwt, passport‑google |
| Email          | Nodemailer                                 |
| Logging        | Winston, Morgan, Chalk                     |
| Security       | Helmet, CORS, express‑rate-limit           |
| Env Management | dotenv                                     |

---

## ⚙️ Quick Start

```bash
# 1. Clone & install
git clone https://github.com/atharvdange618/Node-Express-Typescript-Setup.git
cd Node-Express-Typescript-Setup
npm install

# 2. Configure env
cp .env.example .env
# ⬇️ Fill in DATABASE_URL, JWT_SECRET, SMTP creds, etc.

# 3. Prisma → generate & migrate
npm run prisma:generate
npm run prisma:migrate

# 4. Run in dev mode
npm run dev

# 5. Build & start (prod)
npm run build
npm start
```

---

## 📝 Configuration

Environment settings live in `.env`. Key variables:

| Name                       | Purpose                       |
| -------------------------- | ----------------------------- |
| `NODE_ENV`                 | `development` \| `production` |
| `PORT`                     | HTTP port (default: `3000`)   |
| `DATABASE_URL`             | PostgreSQL connection string  |
| `JWT_SECRET`               | JWT signing secret            |
| `GOOGLE_CLIENT_ID/SECRET`  | OAuth credentials             |
| `SMTP_HOST/PORT/USER/PASS` | Email server config           |
| `FRONTEND_URL`             | Allowed CORS origin           |
| `APP_URL`                  | Base URL for email links      |

---

## 📂 Project Structure

```
├── prisma/                # Prisma schema & migrations
├── src/
│   ├── config/            # Env, logging, passport setup
│   ├── controllers/       # Route handlers
│   ├── services/          # Business logic (email, auth, etc.)
│   ├── routes/            # Express router definitions
│   ├── middleware/        # Error, rate-limit, CORS, not-found
│   ├── factories/         # ApiResponse & ApiError helpers
│   ├── utils/             # Prisma client, hashing, token utils
│   ├── templates/         # Email HTML templates
│   └── app.ts             # Server bootstrap
├── .env.example           # Sample env vars
├── tsconfig.json          # TS compiler options
└── package.json           # Scripts & dependencies
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (git checkout -b feat/your-feature)
3. Commit your changes (git commit -m "feat: description")
4. Push to origin (git push origin feat/your-feature)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.
Feel free to copy, modify, and extend!

---

## ✉️ Contact

👤 **Atharv Dange**

- GitHub: [@atharvdange618](https://github.com/atharvdange618)
- Email: atharvdange.dev@gmail.com

---
