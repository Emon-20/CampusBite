# CampusBite – University Cafeteria Management System

**Academic Course:** CSE 3206 – Software Engineering Sessional (Lab 6)  
**University:** Rajshahi University of Engineering & Technology (RUET), Department of CSE

CampusBite is a simple, full-stack JavaScript (MERN) cafeteria management application designed for university students and cafeteria administrators.

## Main Features
1. **User Authentication:** Student registration (role forced to `student`), login/logout, `bcryptjs` password hashing, JWT authentication, and Admin-only route protection.
2. **Food Management:** Student menu browsing with search & category filtering (`Snacks`, `Drinks`, `Fast Food`, `Desserts`), and Admin food CRUD + stock updates.
3. **Shopping Cart & Discount Engine:** Add/remove/update cart items with automatic backend calculation of **Combo Offer** (`Chips + Cake + Juice = ৳150`) and **Threshold Discount** (`10% off ≥ ৳500`), never combined, always selecting the lowest payable total.
4. **Order & Payment (Cash on Pickup):** Stock validation before order creation, stock deduction only after successful order placement, item snapshot receipts, and cross-student access protection.
5. **Order Management:** Student order history, notifications, and `Pending` order cancellation (with stock restoration); Admin dashboard statistics, order status updates (`Pending`, `Preparing`, `Ready`, `Completed`, `Cancelled`), and payment status updates (`Pending`, `Paid`).

## Technologies
- **Frontend:** React.js, Vite, JavaScript, HTML5, CSS3, Axios, React Router
- **Backend:** Node.js, Express.js, JWT, `bcryptjs`, Swagger/OpenAPI (`swagger-ui-express`)
- **Database:** MongoDB, Mongoose
- **Testing:** Jest, Supertest, Jest Mocks, `mongodb-memory-server`, Vitest, Selenium WebDriver
- **CI/CD:** Git, GitHub, GitHub Actions

## Screenshots (Placeholders)
- `[Screenshot Placeholder: Student Menu & Promo Banner]`
- `[Screenshot Placeholder: Shopping Cart & Discount Receipt]`
- `[Screenshot Placeholder: Admin Dashboard & Order Management]`
- `[Screenshot Placeholder: Swagger UI (/api-docs)]`

## Project Structure
```text
CampusBite/
├── backend/
│   ├── config/          # db.js, seed.js, swagger.js
│   ├── controllers/     # authController, foodController, orderController
│   ├── middleware/      # authMiddleware.js (JWT + requireAdmin)
│   ├── models/          # User.js, Food.js, Order.js
│   ├── patterns/        # FoodFactory.js, DiscountStrategy.js, OrderObserver.js
│   ├── routes/          # authRoutes, foodRoutes, orderRoutes
│   ├── services/        # discountService.js, orderService.js
│   ├── tests/           # unit/, integration/, selenium/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/images/   # Local SVG fallback images
│   ├── src/
│   │   ├── components/  # Navbar.jsx, ProtectedRoute.jsx
│   │   ├── context/     # AuthContext.jsx, CartContext.jsx
│   │   ├── pages/       # HomePage, LoginPage, RegisterPage, CartPage, MyOrdersPage, Admin*
│   │   ├── services/    # api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── docs/                # REQUIREMENTS, ARCHITECTURE, DESIGN_PATTERNS, UML_DIAGRAMS, TEST_REPORT, LEARNING_LOG, REFLECTION_ESSAY, GITHUB_WORKFLOW, SUBMISSION_GUIDE
├── .github/workflows/ci.yml
├── .env.example
├── .gitignore
├── PROJECT_REPORT.md
└── README.md
```

## Installation & Environment Configuration
```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```
Copy `.env.example` to `backend/.env` and configure:
- `MONGO_URI=mongodb://127.0.0.1:27017/campusbite` (or set `USE_IN_MEMORY_DB=true` for local demo without MongoDB installed)
- `JWT_SECRET=your_secret_key`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`

## Database Setup & Running the App
```bash
# Seed demo admin, demo students, and 12 food items
cd backend
npm run seed

# Run backend (http://localhost:5000)
npm run dev

# In a second terminal, run frontend (http://localhost:5173)
cd frontend
npm run dev
```

## Demo Login Credentials
- **Admin:** `admin@campusbite.ruet.ac.bd` / `Admin@123`
- **Student 1:** `rahim@student.ruet.ac.bd` / `Password@123`
- **Student 2:** `nusrat@student.ruet.ac.bd` / `Password@123`

## Testing Commands
```bash
# Backend unit + integration tests with coverage
cd backend
npm run test:coverage

# Backend Selenium browser tests (requires backend & frontend running)
npm run test:selenium

# Frontend tests & production build
cd frontend
npm test
npm run build
```

## Swagger API Documentation
Start the backend and visit: `http://localhost:5000/api-docs`

## GitHub Actions CI
Configured in `.github/workflows/ci.yml` to automatically install dependencies, run backend unit & integration tests, run frontend tests, and build the React app on every push or pull request.


## Development Workflow

CampusBite follows a feature-branch workflow.

- `main`: Stable project version.
- `develop`: Integration branch for completed features.
- `feature/*`: Branches for developing new features.
- `test/*`: Branches for testing-related changes.

All feature changes are submitted through Pull Requests before merging into the develop branch.
## Code Review Checklist

Before submitting a Pull Request, contributors should:

- Check that the code follows the project structure.
- Test the changes locally.
- Write a clear Pull Request description.
- Review their own code before requesting approval.
- Include screenshots when UI changes are made.