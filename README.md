# 🚀 Secure Node, Express Starter with Mongoose

[![Node.js](https://img.shields.io/badge/node-18.x-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue.svg)](https://www.typescriptlang.org/)
[![Build](https://img.shields.io/github/actions/workflow/status/fahadhossain24/ts-node-server1.0/ci.yml?label=build)](https://github.com/fahadhossain24/ts-node-server1.0/actions)

A secure and scalable Express.js boilerplate built with TypeScript. It features rate limiting, logging with daily rotation, Helmet-based HTTP security headers, and production-ready configurations.

---

## ✨ Features

- ✅ **Helmet CSP** with development/production-friendly policies  
- 🛡️ **Rate Limiting** with detailed IP tracking and request stats  
- 📝 **Winston Logging** with Daily Rotate File setup  
- ⚙️ **Environment-based config management**  
- 📁 **Organized folder structure** for clean architecture  
- 🔧 **Built-in support for Docker, CI/CD, and testing (extendable)**  

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/fahadhossain24/ts-node-server1.0.git
cd ts-node-server1.0

```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Install Depencencies
```bash
yarn install
# or
npm install
```

### 4. Run in Development
```bash
yarn dev
# or
npm run dev
```

### 5. Run in Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```
## 📈 Sample Rate Limiting Log
[RateLimit] | IP: 192.168.12.31 | Total: 42 | First: 4/13/2025, 10:12:30 AM | Last: 10:15:22 AM | Path: /api/user | Hits on path: 12

## 🧰 Technologies what used
- Language — Typescript
- Runtime - NodeJS
- Framework - ExpressJS
- Database - MongoDB with Mongoose ODM
- Authentication - JWT & OAuth with passportJS
- Logging - Winston + Daily Rotate File & morgan
- API Documentation - Swagger & Swagger UI
- Validation - Zod
- Security - Helmet for security headers, CORS and Rate limiting for DDoS protection.
- Performance - compression middleware
- Unit Test - Jest
- Development - Prettier & ESLint
- Containerization - Docker
- Deployment - CICD with Github Actions, AWS-EC2

## 📄 License
This project is licensed under the MIT License.

---

Built with ❤️ by Fahad Hossain

