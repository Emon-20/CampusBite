# CampusBite – Software Design Patterns

CampusBite implements **three** genuine GoF design patterns across two categories (Creational and Behavioral).

---

## 1. Factory Pattern (Creational) — `FoodFactory`

- **File:** `backend/patterns/FoodFactory.js`
- **Problem Solved:** Food items arrive from admin forms and seed scripts with inconsistent optional fields (missing description, missing image URL, string numbers, or `isAvailable: true` when `stock === 0`).
- **How It Works:** `FoodFactory.createFood(input)` validates the category (`Snacks`, `Drinks`, `Fast Food`, `Desserts`), coerces numeric `price` and integer `stock`, assigns category-specific default SVG images and descriptions, and ensures `isAvailable` is `false` whenever `stock === 0`.
- **Why It Is Useful:** Centralizes food object creation and validation in one place, used by both `foodController.js` and `config/seed.js`.
- **Alternative Rejected:** Directly constructing and validating plain `{ ...req.body }` objects inside every controller and seed script, which duplicates validation and defaults.

---

## 2. Strategy Pattern (Behavioral) — `DiscountStrategy`

- **Files:** `backend/patterns/DiscountStrategy.js`, `backend/services/discountService.js`
- **Problem Solved:** CampusBite supports two non-combinable promotions (Combo Offer and Threshold Discount) and must always select the single promotion giving the lowest payable total.
- **How It Works:** `ComboDiscountStrategy` and `ThresholdDiscountStrategy` each implement `calculate(items, subtotal)`. `DiscountService.calculateBestDiscount(items)` iterates over all registered strategies, never combines them, and picks the result with the minimum `total`.
- **Why It Is Useful:** Adding a new promotion (e.g., a Festival Discount) only requires adding a new strategy class without modifying existing discount logic (Open/Closed Principle).
- **Alternative Rejected:** Writing a long `if-else` chain inside `orderController.js`, which tightly couples pricing rules to HTTP handling and makes unit testing harder.

---

## 3. Observer Pattern (Behavioral) — `OrderSubject` & `StudentNotificationObserver`

- **File:** `backend/patterns/OrderObserver.js`
- **Problem Solved:** Students need status updates when an admin changes an order's status (`Pending` → `Preparing` → `Ready` → `Completed` / `Cancelled`), without coupling notification logic to `orderService.js`.
- **How It Works:** `OrderSubject` maintains a list of observers (`attach`, `detach`, `notify`). When `orderService.updateOrderStatus()` changes an order's status, it calls `subject.notify(eventData)`. `StudentNotificationObserver.update(eventData)` formats and stores a local notification entry queryable via `GET /api/orders/notifications`.
- **Why It Is Useful:** Keeps `orderService` focused on order state and stock restoration, and makes the notification mechanism easy to mock in unit tests.
- **Alternative Rejected:** Embedding notification array pushes directly inside every controller or service method.
