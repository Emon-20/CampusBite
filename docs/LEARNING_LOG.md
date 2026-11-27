# CampusBite – Self-Directed Learning Log

> **Note:** This log distinguishes between AI-assisted scaffolding/implementation and the personal verification, study, and viva preparation tasks you must complete yourself.

| Project Stage | Topic Learned | Learning Resource | Application in Project | Challenge | Outcome |
|---|---|---|---|---|---|
| Increment 1 (Auth & Food) | JWT & `bcryptjs` password hashing | Express & `jsonwebtoken` official docs | `authController.js`, `authMiddleware.js`, `User.js` | Ensuring normal registration never creates `admin` accounts | Forced `role: 'student'` in `register()` |
| Increment 1 (Design Pattern) | Factory Pattern (Creational) | Refactoring.Guru – Factory Method | `backend/patterns/FoodFactory.js` | Keeping food validation & defaults consistent across controller and seed | Standardized `FoodFactory.createFood()` |
| Increment 2 (Cart & Discount) | Strategy Pattern (Behavioral) | Refactoring.Guru – Strategy Pattern | `DiscountStrategy.js`, `discountService.js` | Ensuring Combo and Threshold discounts never combine | Evaluated strategies independently and selected lowest `total` |
| Increment 3 (Orders) | Observer Pattern & Stock Safety | Refactoring.Guru – Observer Pattern | `OrderObserver.js`, `orderService.js` | Preventing negative stock on failed orders | Validated stock first, deducted only after `Order.create()` |
| Increment 4 (Testing) | Jest Mocks, Supertest & Selenium | Jest Docs, Supertest README, Selenium Docs | `tests/unit/`, `tests/integration/`, `tests/selenium/` | Testing order logic without a live MongoDB | Used `jest.fn()` mocks + `mongodb-memory-server` |
| Increment 4 (New Tool) | Swagger / OpenAPI 3.0 | Swagger OpenAPI 3.0 Guide & `swagger-ui-express` | `backend/config/swagger.js`, `/api-docs` | Configuring JWT Bearer testing inside Swagger UI | Added `components.securitySchemes.bearerAuth` |
| Increment 4 (CI/CD) | GitHub Actions CI | GitHub Actions Node.js Guide | `.github/workflows/ci.yml` | Running backend & frontend tests on every push/PR | Configured multi-step CI workflow |

## Personal Learning & Verification Tasks Remaining for Student

- [ ] Read through `FoodFactory.js`, `DiscountStrategy.js`, and `OrderObserver.js` to explain each pattern in a 5-minute viva.
- [ ] Practice testing endpoints interactively in Swagger UI (`http://localhost:5000/api-docs`).
- [ ] Push branches to GitHub, open two PRs, and resolve one genuine merge conflict yourself.
- [ ] Complete the personal reflection placeholders in `docs/REFLECTION_ESSAY.md`.
