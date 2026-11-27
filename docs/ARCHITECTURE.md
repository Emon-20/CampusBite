# CampusBite – System Architecture & Process Model

## 1. Process Model: Incremental Model

CampusBite is developed using the **Incremental Process Model**, where the system is designed, implemented, and tested in four small, working increments:

- **Increment 1:** User Authentication (`User` model, JWT, `bcryptjs`) & Food Management (`Food` model, `FoodFactory`, CRUD APIs).
- **Increment 2:** Shopping Cart & Discount Engine (`ComboDiscountStrategy`, `ThresholdDiscountStrategy`, `DiscountService`).
- **Increment 3:** Order Placement & Management (`Order` model, Cash on Pickup, stock deduction/restoration, `OrderSubject` & `StudentNotificationObserver`).
- **Increment 4:** Automated Testing (Jest, Supertest, Mocks, Selenium), Swagger/OpenAPI, GitHub Actions CI, and Documentation.

**Justification:** For a small academic team/individual student, the Incremental Model delivers testable working software after each module, reduces integration risk, and aligns directly with feature-branch development in Git.

## 2. Three-Tier Architecture

1. **Presentation Layer (Frontend):** React.js (Vite) single-page application using React Router, Context API (`AuthContext`, `CartContext`), and Axios.
2. **Application Layer (Backend):** Node.js + Express.js REST API organized into Routes → Middleware → Controllers → Services → Design Patterns, plus Swagger UI (`/api-docs`).
3. **Data Layer (Database):** MongoDB with Mongoose ODM managing three collections: `Users`, `Foods`, and `Orders`.

## 3. Database Design (3 Collections)

- **Users:** `name`, `email` (unique), `password` (hashed), `role` (`student` | `admin`), timestamps.
- **Foods:** `name`, `description`, `category` (`Snacks` | `Drinks` | `Fast Food` | `Desserts`), `price`, `stock`, `image`, `isAvailable`, timestamps.
- **Orders:** `orderCode` (unique), `userId` (ref `User`), `items` (`[{ foodId, name, price, quantity }]` snapshot), `subtotal`, `discount`, `total`, `promotionName`, `paymentMethod` (`Cash on Pickup`), `paymentStatus` (`Pending` | `Paid`), `status` (`Pending` | `Preparing` | `Ready` | `Completed` | `Cancelled`), timestamps.
