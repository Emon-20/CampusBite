# CampusBite – Git & GitHub Workflow Guide

## 1. Branch Structure

- `main`: Stable production/submission branch.
- `develop`: Integration branch for completed features.
- `feature/authentication`: User registration, login, bcrypt, JWT middleware.
- `feature/food-management`: `Food` model, `FoodFactory`, food CRUD & search.
- `feature/cart-discount`: Cart UI, `ComboDiscountStrategy`, `ThresholdDiscountStrategy`, `DiscountService`.
- `feature/order-management`: Order placement, Cash on Pickup, stock deduction/restoration, `OrderObserver`.
- `test/backend-testing`: Unit tests, Supertest integration tests, Jest mocks, Selenium E2E tests.

## 2. Recommended Commit Messages

```text
feat: implement authentication with JWT and bcrypt
feat: add food management with FoodFactory
feat: implement combo and threshold discount strategies
feat: add Cash on Pickup order management and OrderObserver
test: add unit tests for factory, discount strategies, and order mocks
test: add Supertest API integration tests and Selenium workflows
docs: add Swagger OpenAPI specification and project documentation
```

## 3. Suggested Pull Request Descriptions

### PR #1 (Accepted PR Example): `feature/cart-discount` -> `develop`
- **Title:** `feat: implement Strategy Pattern discount calculation and Cart UI`
- **Summary:** Adds `ComboDiscountStrategy` (`Chips + Cake + Juice = ৳150`) and `ThresholdDiscountStrategy` (`10% off >= ৳500`), orchestrated by `DiscountService` so promotions are never combined and the lowest payable total is selected. Includes unit tests.

### PR #2 (Revised/Rejected PR Example): `feature/order-management` -> `develop`
- **Title:** `feat: add order placement endpoint`
- **Review Note (for revision):** Initial version deducted stock before order creation; revised to deduct stock only after `Order.create()` succeeds and added cross-student `403` authorization check.

## 4. Pull Request Review Checklist

- [ ] Code follows project folder structure and naming conventions.
- [ ] Sensitive secrets are not committed (`.env` is in `.gitignore`).
- [ ] Backend unit and integration tests pass (`npm test`).
- [ ] Frontend builds without errors (`npm run build`).
- [ ] GitHub Actions CI workflow passes.

## 5. How to Create and Resolve a Genuine Merge Conflict (Student Exercise)

1. Checkout `develop` and create two branches: `git checkout -b conflict-a` and `git checkout -b conflict-b develop`.
2. On `conflict-a`, edit a line in `README.md` (e.g., the project tagline) and commit.
3. On `conflict-b`, edit the **exact same line** in `README.md` differently and commit.
4. Merge `conflict-a` into `develop`, then run `git merge conflict-b` — Git will report a real `CONFLICT (content)` in `README.md`.
5. Open `README.md`, resolve the `<<<<<<<` / `=======` / `>>>>>>>` markers, run `git add README.md`, and `git commit` to complete the merge.
6. Document the actual terminal output and screenshots in your submission.
