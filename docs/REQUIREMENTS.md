# CampusBite – Requirements & User Stories

## 1. Functional Requirements

| ID | Requirement | Role |
|---|---|---|
| FR-01 | Students can register an account (role strictly forced to `student`). | Student |
| FR-02 | Students and Admin can log in using email and password with JWT authentication. | Both |
| FR-03 | Users can log out and clear their session. | Both |
| FR-04 | Students can view all available food items, prices, stock, and search by name or filter by category. | Student |
| FR-05 | Admin can add, edit, delete food items, and update prices and stock. | Admin |
| FR-06 | Students can add food to cart, remove food, and increase/decrease quantities. | Student |
| FR-07 | System calculates subtotal and evaluates Combo Offer and Threshold Discount independently, selecting the lowest payable total without combining promotions. | System |
| FR-08 | Students can confirm an order using **Cash on Pickup**; backend validates stock, recalculates total, saves order with item snapshots, and deducts stock only on success. | Student |
| FR-09 | Students can view their own order history, receipts, and status notifications, and cancel `Pending` orders (restoring stock). | Student |
| FR-10 | Admin can view all orders, update order status (`Pending`, `Preparing`, `Ready`, `Completed`, `Cancelled`), and mark payment status (`Pending`, `Paid`). | Admin |

## 2. Non-Functional Requirements

- **Security:** Passwords hashed with `bcryptjs`; protected routes enforce JWT verification and role-based access control (`requireAdmin`); students cannot view or cancel another student's orders.
- **Reliability & Data Integrity:** Negative stock is never allowed; failed orders never deduct stock; order receipts store item name and price snapshots.
- **Usability:** Clean responsive React UI with dark green/orange/cream theme, loading/error states, confirmation dialogs, and offline SVG fallback images.
- **Maintainability:** Modular MVC-like backend (`models`, `controllers`, `services`, `patterns`, `routes`) with three GoF design patterns.
- **Documentation:** Interactive OpenAPI 3.0 documentation via Swagger UI at `/api-docs`.

## 3. User Stories

### Student User Stories
- **US-S1:** As a student, I want to register and log in so I can place cafeteria orders securely.
- **US-S2:** As a student, I want to search and filter food items so I can quickly find snacks or meals.
- **US-S3:** As a student, I want the cart to automatically apply the best eligible discount (Combo or 10% Threshold) so I pay the lowest price.
- **US-S4:** As a student, I want to place a Cash on Pickup order and receive a receipt so I can collect my food at the counter.
- **US-S5:** As a student, I want to track my order status and cancel a Pending order if needed.

### Admin User Stories
- **US-A1:** As an admin, I want to view cafeteria statistics (total foods, out-of-stock count, pending orders, revenue) on a dashboard.
- **US-A2:** As an admin, I want to add, edit, and delete food items and update stock levels.
- **US-A3:** As an admin, I want to update order statuses (`Pending` → `Preparing` → `Ready` → `Completed` / `Cancelled`) and mark Cash on Pickup payments as `Paid`.

## 4. Basic Use Cases

1. **UC-1: Student Registration & Login** — Student submits credentials; backend validates, hashes password (`bcryptjs`), and returns a signed JWT.
2. **UC-2: Browse & Search Menu** — Student queries `GET /api/foods?search=...&category=...` and adds available items to cart.
3. **UC-3: Place Order (Cash on Pickup)** — Student confirms cart; backend validates stock, applies `DiscountService`, creates `Order` document, and deducts `Food.stock`.
4. **UC-4: Manage Order Status** — Admin updates status via `PATCH /api/orders/:id/status`; `OrderSubject` notifies `StudentNotificationObserver`.
