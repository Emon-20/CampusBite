# CampusBite – UML & System Diagrams

All four diagrams below reflect the actual CampusBite implementation.

## 1. Use Case Diagram

```mermaid
flowchart LR
    Student([Student])
    Admin([Admin])

    subgraph CampusBite System
        UC1[Register & Login]
        UC2[Browse & Search Menu]
        UC3[Manage Cart & View Best Discount]
        UC4[Place Cash on Pickup Order]
        UC5[View My Orders & Cancel Pending]
        UC6[Manage Food CRUD & Stock]
        UC7[View All Orders & Update Status/Payment]
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5

    Admin --> UC1
    Admin --> UC2
    Admin --> UC6
    Admin --> UC7
```

## 2. UML Class Diagram (Including Design Patterns)

```mermaid
classDiagram
    class User {
        +String name
        +String email
        +String password
        +String role
        +comparePassword(candidate)
    }

    class Food {
        +String name
        +String description
        +String category
        +Number price
        +Number stock
        +String image
        +Boolean isAvailable
    }

    class Order {
        +String orderCode
        +ObjectId userId
        +Array items
        +Number subtotal
        +Number discount
        +Number total
        +String promotionName
        +String paymentMethod
        +String paymentStatus
        +String status
    }

    class FoodFactory {
        +getSupportedCategories()
        +createFood(input)
    }

    class DiscountStrategy {
        +calculate(items, subtotal)
    }
    class ComboDiscountStrategy {
        +calculate(items, subtotal)
    }
    class ThresholdDiscountStrategy {
        +calculate(items, subtotal)
    }
    class DiscountService {
        -Array strategies
        +calculateBestDiscount(items)
    }

    class OrderSubject {
        -Array observers
        +attach(observer)
        +detach(observer)
        +notify(eventData)
    }
    class StudentNotificationObserver {
        -Array notifications
        +update(eventData)
        +getByUser(userId)
    }

    DiscountStrategy <|-- ComboDiscountStrategy
    DiscountStrategy <|-- ThresholdDiscountStrategy
    DiscountService --> DiscountStrategy : evaluates
    FoodFactory ..> Food : creates payload
    OrderSubject o-- StudentNotificationObserver : notifies
    User "1" --> "*" Order : places
```

## 3. System Architecture Diagram

```mermaid
flowchart TB
    Browser["React + Vite Frontend (localhost:5173)"] -->|Axios REST + JWT| Express["Express.js REST API (localhost:5000)"]
    Express -->|/api-docs| Swagger["Swagger UI (OpenAPI 3.0)"]
    Express --> Auth["Auth Middleware (JWT + Role Check)"]
    Auth --> Controllers["Controllers (Auth, Food, Order)"]
    Controllers --> Services["Services (DiscountService, OrderService)"]
    Services --> Patterns["Patterns (FoodFactory, Strategies, OrderObserver)"]
    Controllers --> Mongoose["Mongoose ODM"]
    Services --> Mongoose
    Mongoose --> MongoDB[("MongoDB: Users, Foods, Orders")]
```

## 4. Order Placement Sequence Diagram

```mermaid
sequenceDiagram
    actor Student
    participant UI as React CartPage
    participant API as OrderController
    participant OS as OrderService
    participant DS as DiscountService
    participant DB as MongoDB

    Student->>UI: Click Confirm Order (Cash on Pickup)
    UI->>API: POST /api/orders (JWT + items)
    API->>OS: placeOrder(userId, items)
    OS->>DB: Find each Food & check stock/isAvailable
    alt Insufficient stock or unavailable
        DB-->>OS: stock < quantity
        OS-->>API: Throw 400 Error (no stock deducted)
        API-->>UI: 400 Insufficient stock
    else Stock sufficient
        OS->>DS: calculateBestDiscount(snapshotItems)
        DS-->>OS: { subtotal, discount, total, promotionName }
        OS->>DB: Order.create(...)
        DB-->>OS: Saved Order
        OS->>DB: Deduct Food.stock & save()
        OS-->>API: Created Order
        API-->>UI: 201 Order Confirmation & Receipt
    end
```
