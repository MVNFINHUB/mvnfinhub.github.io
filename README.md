# MVN FinHub | Financial Process Support Platform

![Project Status](https://img.shields.io/badge/Status-Live-success) ![Security](https://img.shields.io/badge/Security-RLS%20Enabled-blue) ![Stack](https://img.shields.io/badge/Stack-Cloudflare%2BSupabase-orange)

**MVN FinHub** is an independent, non-advisory platform designed to simplify complex financial documentation workflows. The platform specializes in **Legacy Share Recovery (Physical to Demat)**, **IEPF Claims**, and **NRI Banking Process Support**.

## 🚀 Project Philosophy
This project is engineered with a **"Security-First, Zero-Cost"** architecture. It moves away from heavy frameworks to a lean, high-performance static build that ensures maximum speed, security, and long-term stability.

* **Strictly Non-Advisory:** The platform logic is designed to provide process support only, with no investment recommendation algorithms.
* **Bank-Grade Security:** Frontend inputs are sanitized, and the backend is protected via strict Row Level Security (RLS) policies.

## 🛠️ Tech Stack & Architecture

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3 (Variables), ES6 Modules | Zero-dependency, blazing fast load times (<1s). |
| **Backend** | Supabase (PostgreSQL) | Enterprise-grade database with built-in Auth & APIs. |
| **Security** | Row Level Security (RLS) + CSP | "Mail-slot" architecture (Public Insert / No Public Read). |
| **Hosting** | Cloudflare Pages | Global CDN distribution with DDoS protection. |
| **Icons** | Phosphor Icons | Lightweight SVG icon system. |

## 🔐 Key Security Features
1.  **Content Security Policy (CSP):** Strict whitelist implementation to prevent XSS.
2.  **Honeypot Strategy:** Accessible, invisible input fields to trap bots without CAPTCHA friction.
3.  **Rate Limiting:** Frontend `localStorage` cooldowns to prevent API abuse.
4.  **Noopener Protocol:** All external links secured against reverse tabnabbing.

## 📂 Project Structure
```text
mvnfinhub-web/
├── assets/          # Compressed images & PWA icons
├── css/             # Global variables & Print-ready styles
├── js/              # Modular ES6 logic (Config + App)
├── index.html       # Semantic HTML5 entry point
└── manifest.json    # PWA definition for Android/iOS
