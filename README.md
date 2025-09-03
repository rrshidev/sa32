# <img src="https://github.com/rrshidev/sa32/blob/main/frontend/public/logo.png" alt="SA32 Logo" width="80" /> SA32 (ServiceAuto32)  
**Open-source car service booking platform**  
*"Don't panic! Just book it."*  

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) 
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/) 
[![Next.js](https://img.shields.io/badge/Next.js-14-blue)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rrshidev/sa32/pulls)  

![SA32 Screenshot](./assets/app-demo.png)  

## ✨ Features  
- 📅 **1-click bookings** via Telegram bot or web app  
- 🔧 **Garage dashboard** to manage slots and clients  
- 🤖 **Auto-reminders** via Telegram  
- 📱 **Telegram Mini App** integration  

## 🚀 Tech Stack  
- **Backend**: Node.js 18 (Express.js)  
- **Frontend**: Next.js 14 + TypeScript  
- **Telegram**: Telegraf + Telegram Mini App  
- **Database**: PostgreSQL + TypeORM  
- **Styling**: Tailwind CSS  
- **Deployment**: Docker  

## �‍💻 Local Development  
```bash
# 1. Clone repo
git clone https://github.com/rrshidev/sa32.git
cd sa32

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Fill in required values in .env

# 4. Start services
docker-compose up -d

# 5. Run applications
npm run dev  # Starts both backend and frontend

🌟 Project Structure

sa32/
├── backend/           # Node.js backend (Express + TypeORM)
├── frontend/          # Next.js frontend application
├── tg_miniapp/        # Telegram Mini App components
├── logo/              # Project logo assets
├── docker-compose.yml # Docker configuration
├── .env.example       # Environment variables template
└── README.md          # Project documentation

🧪 Running Tests
bash

npm test     # Run all Jest tests
npm run test:watch  # Watch mode

🤝 How to Contribute

    Fork the repository

    Create a feature branch (git checkout -b feature/your-feature)

    Commit your changes (git commit -m 'feat: add new feature')

    Push to the branch (git push origin feature/your-feature)

    Open a Pull Request

📜 License

MIT © 2024 rrshidev

