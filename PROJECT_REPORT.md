# CampusBite – University Cafeteria Management System
## Software Engineering Project Report

**University:** Rajshahi University of Engineering & Technology (RUET)  
**Department:** Computer Science & Engineering  
**Course:** CSE 3206 – Software Engineering Sessional  
**Assignment:** Lab 6 (CO4, PO12)  

---

## 1. Introduction
CampusBite is a lightweight full-stack web application built with React.js, Node.js, Express.js, and MongoDB to digitize food ordering and inventory management at a university cafeteria.

## 2. Problem Statement
Manual cafeteria ordering causes long queues, miscalculated bills, stock mismatches when popular items sell out, and difficulty tracking order readiness.

## 3. Objectives
- Provide role-based access for Students and Cafeteria Admin.
- Maintain accurate real-time food stock and item-snapshot receipts.
- Automate non-combinable discount selection (Combo vs. Threshold) on the backend.
- Apply software design patterns, TDD, automated testing, Swagger/OpenAPI, and CI.

## 4. Scope
Includes 5 core modules (Authentication, Food Management, Cart & Discount, Cash on Pickup Order/Payment, Order Management). Excludes online payment gateways, SMS/email services, and complex analytics.

## 5. Functional Requirements
See [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) (FR-01 through FR-10 covering registration, JWT login, food CRUD, cart, non-combinable discounts, Cash on Pickup ordering, stock deduction/restoration, and status management).

## 6. Non-Functional Requirements
Password hashing (`bcryptjs`), JWT RBAC, atomic-style stock validation (no negative stock), responsive UI with offline SVG fallbacks, and OpenAPI documentation.

## 7. User Stories
Documented in [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) for Students (US-S1 to US-S5) and Admin (US-A1 to US-A3).

## 8. Use Cases
Documented in [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) (UC-1 to UC-4) and visualized in [docs/UML_DIAGRAMS.md](docs/UML_DIAGRAMS.md).

## 9. Process Model and Justification
**Incremental Process Model** (4 increments: Auth & Food → Cart & Discount → Orders & Management → Testing, Swagger & CI). Justified in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) because each increment produces working, testable software aligned with Git feature branches.

## 10. Prototype and UI
Clean responsive interface using a Dark Green (`#1b4332`), Orange (`#e85d04`), Light Cream (`#fdfaf4`), and Dark Charcoal (`#1f2933`) palette across 5 Student pages (`Home`, `Login`, `Register`, `Cart`, `My Orders`) and 3 Admin pages (`Dashboard`, `Food Management`, `Order Management`).

## 11. System Architecture
Three-tier architecture (React + Vite → Express.js REST API + Swagger → MongoDB/Mongoose). See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 12. Database Design
Three MongoDB collections: `Users`, `Foods`, and `Orders` (with embedded item name/price snapshots). See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 13. UML Diagrams
Use Case, UML Class (with Design Patterns), System Architecture, and Order Placement Sequence diagrams are provided in Mermaid format in [docs/UML_DIAGRAMS.md](docs/UML_DIAGRAMS.md).

## 14. Design Patterns
1. **Factory Pattern (`FoodFactory`):** Standardizes food creation, category validation, and default images.
2. **Strategy Pattern (`ComboDiscountStrategy`, `ThresholdDiscountStrategy`, `DiscountService`):** Evaluates promotions independently and picks the lowest payable total.
3. **Observer Pattern (`OrderSubject`, `StudentNotificationObserver`):** Notifies students locally when order status changes.
Full rationale and rejected alternatives are in [docs/DESIGN_PATTERNS.md](docs/DESIGN_PATTERNS.md).

## 15. Implementation Details
- Backend entry: `backend/app.js` and `backend/server.js`.
- Seed script: `backend/config/seed.js` creates 1 admin, 2 students, and 12 food items.
- Frontend entry: `frontend/src/App.jsx` with `AuthContext` and `CartContext`.

## 16. Test-Driven Development (TDD)
Demonstrated Red-Green-Refactor for discount calculation (`DiscountStrategy.test.js`), stock validation, and order placement (`OrderService.test.js`). See [docs/TEST_REPORT.md](docs/TEST_REPORT.md).

## 17. Unit and Integration Testing
- **Unit Tests:** 14 tests across `FoodFactory.test.js`, `DiscountStrategy.test.js`, and `OrderService.test.js` — all passed.
- **Integration Tests:** 9 Supertest tests in `api.test.js` using `mongodb-memory-server` — all passed.

## 18. Mocking
`OrderService.test.js` uses `jest.fn()` mocks for `Food` repository, `Order` repository, and `OrderSubject` to isolate business logic from MongoDB.

## 19. Selenium Testing
`backend/tests/selenium/runSelenium.js` executes 3 headless Chrome workflows (Student Login, Browse & Add to Cart, Place Order & Receipt) — all 3 passed.

## 20. Test Coverage
Actual Jest coverage (`npm run test:coverage`): **71.89% Statements**, **57.20% Branches**, **75.00% Functions**, **72.27% Lines** (core `services/` at 88.60% Stmts, `patterns/` at 88.88% Stmts).

## 21. Git/GitHub Workflow
Branching strategy (`main`, `develop`, `feature/*`, `test/*`), PR checklists, and genuine merge-conflict exercise instructions are in [docs/GITHUB_WORKFLOW.md](docs/GITHUB_WORKFLOW.md).

## 22. Swagger/OpenAPI
Implemented via `swagger-ui-express` at `/api-docs` (`backend/config/swagger.js`), documenting all Auth, Food, and Order endpoints with JWT Bearer support. Chosen to provide interactive, testable API documentation over static docs.

## 23. Challenges
Keeping discount strategies non-combinable, preventing negative stock on failed orders, and isolating unit tests from a live database using mocks.

## 24. Limitations
Notifications are stored in-memory (`StudentNotificationObserver`) rather than persisted to MongoDB or sent via email/SMS; payment is strictly Cash on Pickup.

## 25. Future Improvements
Persist notifications in MongoDB, add order pagination/filtering, and expand controller negative-case test coverage.

## 26. Conclusion
CampusBite fulfills all academic requirements with a clean, understandable architecture suitable for a third-year Software Engineering project and 5-minute viva.

## 27. References
- Express.js Documentation (https://expressjs.com/)
- React & Vite Documentation (https://react.dev/, https://vite.dev/)
- Mongoose Documentation (https://mongoosejs.com/)
- Jest & Supertest Documentation (https://jestjs.io/)
- Swagger / OpenAPI 3.0 Specification (https://swagger.io/specification/)
- Refactoring.Guru Design Patterns (https://refactoring.guru/design-patterns)
