# <img src="https://github.com/rrshidev/sa32/blob/main/logo/logo.png" alt="SA32 Logo" width="80" /> SA32 (ServiceAuto32)  
**Open-source car service booking platform**  
*"Don’t panic! Just book it."*  

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) 
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/) 
[![Next.js](https://img.shields.io/badge/Next.js-14-blue)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rrshidev/sa32/pulls)  

![SA32 Screenshot](./assets/app-demo.png)  

## ✨ Features  
- 📅 **1-click bookings** via Telegram bot or Next.js web app.  
- 🔧 **Garage dashboard** to manage slots and clients.  
- 🤖 **Auto-reminders** via Telegraf.  
- 🛠️ **Google Calendar sync** (planned).  

## 🚀 Tech Stack  
- **Backend**: Node.js 18 (Express.js) + Telegraf.  
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS.  
- **Database**: PostgreSQL 15 + Prisma ORM.  
- **Testing**: Jest + Supertest.  
- **Deployment**: Docker + Vercel.  

## �‍💻 Local Development  
```bash
# 1. Clone repo
git clone https://github.com/rrshidev/sa32.git
cd sa32

# 2. Install dependencies
npm install

# 3. Set up .env
cp .env.example .env

# 4. Run PostgreSQL
docker-compose up -d

# 5. Apply database migrations
npx prisma migrate dev --name init

# 6. Start dev servers
npm run dev  # Next.js
npm run bot  # Telegram bot

🌟 Project Structure

sa32/
├── bot/               # Telegram bot (Telegraf)
├── web/               # Next.js app
├── prisma/            # PostgreSQL schema
├── tests/             # Jest tests
└── docker-compose.yml # PostgreSQL config

🧪 Running Tests
bash

npm test     # Run all Jest tests
npm run test:watch  # Watch mode

🤝 How to Contribute

    Fork the repo → create a feature branch.

    Follow code style:

        JavaScript: Airbnb ESLint config.

        Git: Conventional commits (e.g., feat: add booking form).

    Test your changes → submit a PR.

📜 License

MIT © 2024 rrshidev

