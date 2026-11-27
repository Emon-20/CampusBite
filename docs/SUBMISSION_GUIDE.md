# CampusBite – Submission & Viva Guide

## 1. What to Submit
1. GitHub Repository link containing `frontend/`, `backend/`, `docs/`, `.github/workflows/ci.yml`, `README.md`, and `PROJECT_REPORT.md`.
2. Completed `PROJECT_REPORT.md` and `docs/REFLECTION_ESSAY.md` (with personal placeholders filled in; target 500–700 words).
3. Screenshots of:
   - Running React UI (Menu, Cart with discount, Order Receipt, Admin Dashboard).
   - Swagger UI (`/api-docs`).
   - Jest test & coverage output + Selenium test pass output.
   - GitHub Actions green CI run + GitHub PRs & merge conflict resolution.

## 2. How to Run Locally
1. Copy `.env.example` to `backend/.env` (set `MONGO_URI` to your local MongoDB or MongoDB Atlas URI; or set `USE_IN_MEMORY_DB=true` for zero-setup demo).
2. Seed database: `cd backend && npm run seed`
3. Start backend: `cd backend && npm run dev` (runs on `http://localhost:5000`)
4. Start frontend: `cd frontend && npm run dev` (runs on `http://localhost:5173`)

## 3. How to Push to GitHub & Create Genuine PRs
```bash
git init
git add .
git commit -m "chore: initial CampusBite project"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/CampusBite.git
git push -u origin main

git checkout -b develop
git push -u origin develop
```
Then create feature branches (`feature/authentication`, `feature/food-management`, `feature/cart-discount`, `feature/order-management`, `test/backend-testing`), push them, and open Pull Requests into `develop` on GitHub. Follow `docs/GITHUB_WORKFLOW.md` to create and resolve a genuine merge conflict.

## 4. How to Show GitHub Actions & Swagger
- **GitHub Actions:** Open the **Actions** tab in your GitHub repository to view the `CampusBite CI` workflow results on every push/PR.
- **Swagger:** Start the backend and open `http://localhost:5000/api-docs`. Click **Authorize**, paste a JWT token from `/api/auth/login`, and test protected endpoints live.

## 5. Five-Minute Viva Preparation Checklist
- Explain the **3 MongoDB collections** (`Users`, `Foods`, `Orders`) and why item price/name snapshots are saved in `Orders`.
- Explain the **3 Design Patterns**: `FoodFactory` (Creational), `DiscountStrategy` (Behavioral), and `OrderSubject`/`StudentNotificationObserver` (Behavioral).
- Explain why **Combo** and **Threshold** discounts are never combined and how `DiscountService` picks the lowest total.
- Explain **TDD**, **Jest mocks** (isolating `Food`/`Order` repos and `OrderSubject`), **Supertest**, and **Selenium**.
