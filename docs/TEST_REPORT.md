# CampusBite – Test Report

## 1. Testing Methodology

CampusBite follows a multi-layered testing approach:
- **Test-Driven Development (TDD):** Red-Green-Refactor cycle applied to discount calculation, stock validation, and order placement.
- **Unit Testing (Jest):** Isolated testing of `FoodFactory`, `ComboDiscountStrategy`, `ThresholdDiscountStrategy`, `DiscountService`, and `orderService`.
- **Mocking (Jest `jest.fn()`):** Mocked `Food` repository, `Order` repository, and `OrderSubject` to test `orderService` without a database.
- **API Integration Testing (Supertest + `mongodb-memory-server`):** End-to-end HTTP tests across authentication, food CRUD, authorization, stock rejection, order placement, and status updates.
- **Browser E2E Testing (Selenium WebDriver):** Automated headless Chrome workflows against the live React + Express application.

## 2. TDD Demonstration (Red-Green-Refactor)

1. **Red:** Wrote `backend/tests/unit/DiscountStrategy.test.js` asserting that `ComboDiscountStrategy` turns `Chips (30) + Cake (80) + Juice (70)` into `৳150`, `ThresholdDiscountStrategy` applies 10% off `>= ৳500`, and `DiscountService` picks the lowest total without combining promotions. Initial run failed before strategy classes were implemented.
2. **Green:** Implemented `ComboDiscountStrategy`, `ThresholdDiscountStrategy`, and `DiscountService` to pass all 6 discount tests.
3. **Refactor:** Extracted `DEFAULT_COMBOS` configuration array and clean `Map`-based item aggregation in `ComboDiscountStrategy.calculate()`.

## 3. Actual Test Execution Results

### Backend Jest Unit & Integration Tests (`npm run test:coverage`)
- **Test Suites:** 4 passed, 4 total (`FoodFactory.test.js`, `DiscountStrategy.test.js`, `OrderService.test.js`, `api.test.js`)
- **Tests:** 23 passed, 23 total
- **Status:** All passed

### Jest Coverage Report (Actual Output)

| Scope | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| **All files (Backend Core)** | **71.89%** | **57.20%** | **75.00%** | **72.27%** |
| `patterns/FoodFactory.js` | 94.11% | 81.25% | 100% | 94.11% |
| `patterns/DiscountStrategy.js` | 90.24% | 82.75% | 80.00% | 92.50% |
| `patterns/OrderObserver.js` | 82.60% | 64.28% | 72.72% | 85.71% |
| `services/discountService.js` | 100% | 75.00% | 100% | 100% |
| `services/orderService.js` | 86.36% | 73.33% | 100% | 86.36% |
| `middleware/authMiddleware.js` | 86.66% | 90.00% | 100% | 86.66% |

### Frontend Unit Tests (`npm test` via Vitest)
- **Test Files:** 1 passed (`src/App.test.jsx`)
- **Tests:** 1 passed, 1 total

### Selenium WebDriver Browser Tests (`npm run test:selenium` in Headless Chrome)
1. **Workflow 1 (Student Login):** PASS — Student logged in (`rahim@student.ruet.ac.bd`) and redirected to menu.
2. **Workflow 2 (Browse & Add to Cart):** PASS — `Chips` added to cart, badge updated to `1`, navigated to `/cart`.
3. **Workflow 3 (Place Order & Receipt):** PASS — Confirmed `Cash on Pickup` order and verified receipt (`Order Confirmed!`).

## 4. Known Limitations

- Branch coverage on HTTP controllers (`49.61%` overall across `controllers/`) is lower than core services (`88.60%`) because some error-handling catch blocks and admin edit/delete endpoints were verified via UI/manual checks rather than dedicated negative Supertest cases.
- Selenium tests require both backend and frontend servers to be running locally.
