# Lab 6 – Reflection Essay (CO4, PO12)

**Course:** CSE 3206 – Software Engineering Sessional  
**University:** Rajshahi University of Engineering & Technology (RUET)  
**Project:** CampusBite – University Cafeteria Management System  

---

Developing **CampusBite**, a simple university cafeteria management system, provided practical experience in applying full-stack JavaScript development alongside core software engineering practices. Rather than building an overly complex commercial platform, I focused on keeping the architecture clean, modular, and maintainable using the MERN stack (MongoDB, Express.js, React.js, and Node.js) with the Incremental Process Model. Dividing the project into four increments—authentication and food management, cart and discount calculation, order management, and testing with CI—helped verify each module before moving to the next.

Several key technical decisions shaped the system. First, instead of embedding discount rules inside controllers, I implemented the **Strategy Pattern** (`ComboDiscountStrategy` and `ThresholdDiscountStrategy`) inside `DiscountService` so promotions are evaluated independently and never combined, always selecting the lowest payable amount. Second, I applied the **Factory Pattern** (`FoodFactory`) to standardize food creation and default fallback images, and the **Observer Pattern** (`OrderSubject` and `StudentNotificationObserver`) to decouple order status updates from student notifications. Third, to protect data integrity, stock is validated before order creation and deducted only after an order is saved, while item name and price snapshots are stored inside each order receipt.

During development, several technical challenges emerged. One challenge was ensuring that unit tests for order placement and cancellation could run reliably without depending on a live MongoDB instance. This was addressed using **Jest mocks** (`jest.fn()`) for the food and order repositories and `mongodb-memory-server` for Supertest API integration tests. Another challenge was verifying end-to-end browser workflows, which was resolved by configuring **Selenium WebDriver** with headless Chrome to test student login, adding items to the cart, and confirming a Cash on Pickup order.

**[Personal Reflection Placeholder 1 – Challenges & Debugging]:** *(Replace this paragraph with 2–3 sentences describing a specific bug or setup issue you personally debugged while running CampusBite locally, such as configuring `.env`, connecting MongoDB, or resolving a Git merge conflict, and what you learned from fixing it.)*

As a new self-learned tool beyond the sessional syllabus, I integrated **Swagger/OpenAPI** using `swagger-ui-express` at `/api-docs`. Compared to writing static API documentation manually in Markdown or Word, OpenAPI provides an interactive interface where endpoints, HTTP status codes, request/response schemas, and JWT Bearer authentication can be tested directly in the browser. Official Swagger/OpenAPI 3.0 documentation and `swagger-ui-express` guides were clear and practical, though keeping the specification synchronized with route changes requires discipline.

**[Personal Reflection Placeholder 2 – Learning Resources & Self-Directed Study]:** *(Replace this paragraph with 2–3 sentences evaluating which learning resources—such as official React/Express/Jest/Swagger docs or class notes—helped you most, and how you verified your understanding of the three design patterns for your viva.)*

Overall, this project strengthened my ability to learn unfamiliar tools independently, write testable backend logic using TDD and mocks, and automate verification through GitHub Actions CI. For future skill development, I plan to deepen my knowledge of TypeScript for type-safe APIs, learn end-to-end CI deployment pipelines, and explore automated accessibility and performance testing in web applications.
