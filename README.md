# NexusERP — Enterprise Resource Planning System
### Built with Java Spring Boot 3 + Angular 17

---

## Architecture Overview

```
erp-system/
├── backend/          ← Spring Boot 3 (Java 17)
│   └── src/main/java/com/erp/
│       ├── model/          Entity classes (JPA)
│       ├── repository/     Spring Data JPA repositories
│       ├── controller/     REST API controllers
│       ├── security/       JWT auth + filters
│       ├── config/         Security config + data seeder
│       └── dto/            Request/response DTOs
└── frontend/         ← Angular 17 (Standalone Components)
    └── src/app/
        ├── core/           Auth service, JWT interceptor, guards
        ├── modules/        Feature modules (HR, Inventory, Finance, Sales)
        └── shared/         Layout, reusable components
```

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Backend      | Java 17, Spring Boot 3.2            |
| Security     | Spring Security 6 + JWT (JJWT)      |
| Database     | H2 (dev) / MySQL (prod)             |
| ORM          | Spring Data JPA + Hibernate         |
| Frontend     | Angular 17 (Standalone Components)  |
| HTTP Client  | Angular HttpClient + Interceptors   |
| Routing      | Angular Router (lazy loading)       |
| Forms        | Angular FormsModule (ngModel)       |

---

## Prerequisites

- Java 17+ → https://adoptium.net
- Maven 3.8+ → https://maven.apache.org
- Node.js 18+ → https://nodejs.org
- Angular CLI 17 → `npm install -g @angular/cli`

---

## Quick Start

### 1. Start the Backend

```bash
cd erp-system/backend
mvn spring-boot:run
```

Backend runs on: http://localhost:8080
H2 Console: http://localhost:8080/h2-console

### 2. Start the Frontend

```bash
cd erp-system/frontend
npm install
ng serve
```

Frontend runs on: http://localhost:4200

### 3. Login

| Username     | Password    | Role          |
|--------------|-------------|---------------|
| admin        | admin123    | Full Access   |
| hrmanager    | hr123       | HR Module     |
| salesmanager | sales123    | Sales Module  |

---

## REST API Endpoints

### Auth
| Method | Endpoint              | Description      |
|--------|-----------------------|------------------|
| POST   | /api/auth/login       | Login → JWT      |
| POST   | /api/auth/register    | Register user    |

### HR Module
| Method | Endpoint                | Description         |
|--------|-------------------------|---------------------|
| GET    | /api/hr/employees       | List employees      |
| GET    | /api/hr/employees/{id}  | Get employee        |
| POST   | /api/hr/employees       | Create employee     |
| PUT    | /api/hr/employees/{id}  | Update employee     |
| DELETE | /api/hr/employees/{id}  | Delete employee     |
| GET    | /api/hr/dashboard       | HR KPI stats        |

### Inventory Module
| Method | Endpoint                   | Description      |
|--------|----------------------------|------------------|
| GET    | /api/inventory/products    | List products    |
| POST   | /api/inventory/products    | Create product   |
| PUT    | /api/inventory/products/{id} | Update product |
| DELETE | /api/inventory/products/{id} | Delete product |
| GET    | /api/inventory/low-stock   | Low stock alert  |
| GET    | /api/inventory/dashboard   | Inventory KPIs   |

### Finance Module
| Method | Endpoint                      | Description         |
|--------|-------------------------------|---------------------|
| GET    | /api/finance/transactions     | List transactions   |
| POST   | /api/finance/transactions     | Create transaction  |
| PUT    | /api/finance/transactions/{id}| Update transaction  |
| DELETE | /api/finance/transactions/{id}| Delete transaction  |
| GET    | /api/finance/dashboard        | Finance KPIs        |

### Sales Module
| Method | Endpoint               | Description      |
|--------|------------------------|------------------|
| GET    | /api/sales/orders      | List orders      |
| POST   | /api/sales/orders      | Create order     |
| PUT    | /api/sales/orders/{id} | Update order     |
| DELETE | /api/sales/orders/{id} | Delete order     |
| GET    | /api/sales/dashboard   | Sales KPIs       |

---

## Switch to MySQL (Production)

1. Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/erpdb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

2. Uncomment MySQL dependency in `pom.xml`

3. Create database: `CREATE DATABASE erpdb;`

---

## Security Model

- JWT tokens expire after 24 hours
- Role-based access control (RBAC):
  - ADMIN → all modules
  - HR_MANAGER → HR module only
  - INVENTORY_MANAGER → Inventory module
  - FINANCE_MANAGER → Finance module
  - SALES_MANAGER → Sales module

