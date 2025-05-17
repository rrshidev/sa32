# <img src="https://via.placeholder.com/40x40.png?text=SA32&font=roboto" alt="SA32 Logo" width="30"/> SA32 (ServiceAuto32)  
**Open-source car service booking platform**  
*"Don’t panic! Just book it."*  

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) 
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/) 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rrshidev/sa32/pulls)  

![SA32 Architecture](https://via.placeholder.com/800x400.png?text=SA32+Next.js+%2B+Telegram+Bot+%2B+PostgreSQL)  

## ✨ Features  
- 📅 **1-click bookings** via Telegram bot or Next.js web app.  
- 🔧 **Garage dashboard** to manage slots and clients.  
- 🤖 **Auto-reminders** via Telegraf (Telegram bot).  
- 🛠️ **Google Calendar sync** (planned).  

## 🚀 Tech Stack  
- **Backend**: Node.js (Express.js/NestJS) + Telegraf for Telegram bot.  
- **Frontend**: Next.js (React) + Tailwind CSS.  
- **Database**: PostgreSQL + Prisma ORM.  
- **Testing**: Jest + Supertest.  
- **Deployment**: Docker + VPS (или Railway/Vercel).  

## �‍💻 Local Development  
```bash
# 1. Clone repo
git clone https://github.com/rrshidev/sa32.git
cd sa32

# 2. Install dependencies
npm install

# 3. Set up .env (copy from .env.example)
cp .env.example .env

# 4. Run PostgreSQL via Docker
docker-compose up -d

# 5. Start dev servers
npm run dev  # Next.js
npm run bot  # Telegram bot (Telegraf)

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

