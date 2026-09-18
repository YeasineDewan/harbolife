# Rochetta - Online Pharmacy Platform

Rochetta is a full-stack MERN web application designed to simulate a real-world pharmacy environment. It enables users to browse and purchase medications and provides administrators with a dashboard to manage catalog operations.

---

## Table of Contents
1. [Key Features](#key-features)
   - [Customer Features](#customer-features)
   - [Courier Features](#courier-features)
   - [Administrator Features](#administrator-features)
   - [AI Assistant Features](#ai-assistant-features)
2. [Technical Interface Preview](#technical-interface-preview)
3. [System Architecture and Tech Stack](#system-architecture-and-tech-stack)
4. [Directory Structure](#directory-structure)
5. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
6. [Quality Assurance and CI Pipelines](#quality-assurance-and-ci-pipelines)
7. [Database Design (ERD)](#database-design-erd)
8. [Contributors](#contributors)

---

## Key Features

### Customer Features
* **Catalog Exploration:** Browse and filter medications by therapeutic categories.
* **Flexible Purchasing:** Purchase medicines by the individual strip or by the full box.
* **Prescription Control:** Certain medications are marked as requiring a prescription and cannot be checked out without upload/pharmacist review.
* **Cart and Orders:** Live management of cart quantities and real-time checkout flows.
* **Optimized Shopping Experience:** Fully optimized and rewritten cart backend ensuring atomic database updates, handles inventory reservation edge-cases, and speeds up shopping cart load times.
* **Profile Management:** View order histories, manage delivery addresses, and track pending prescriptions.
* **Responsive Styling:** Fully optimized for mobile, tablet, and desktop views.

### Courier Features
* **Delivery Dashboard:** View delivery metrics such as active, completed, and canceled assignments.
* **Order Management & Tracking:** Search and filter assigned deliveries by ID, customer name, phone, or status.
* **Real-time Status Updates:** Update delivery progress states directly (e.g., from Pending to Out for Delivery or Delivered).
* **Detailed Order Modals:** Instantly view customer contacts, delivery addresses, payment types (COD amounts to collect), and specific order items.

### Administrator Features
* **Catalog Management:** Create, read, update, and delete products, including product images uploaded directly to Cloudinary.
* **Inventory Control:** Monitor stock, change pricing structures, and manage categories.
* **AI-Powered Analytics:** Real-time revenue telemetry charts, inventory management tables, and a specialized AI Analytics Tab for sales prediction and forecasting.
* **Authentication Controls:** View and manage user accounts and system permissions.

### AI Assistant Features
* **Interactive AI Help:** Ask medical or platform questions directly to Rochetta Assistant via a floating chat widget.
* **Persistent Chat History:** Seamlessly retrieve and browse past conversation history.
* **Secure Access Control:** Requires user authentication to prevent unauthorized API requests and manage chat history safely.

---

## Technical Interface Preview


<img width="494" height="737" alt="image" src="https://github.com/user-attachments/assets/db454160-9713-4c48-a8ca-697eae5992f6" />

<img width="1868" height="893" alt="image" src="https://github.com/user-attachments/assets/cc0f599d-717d-4452-b8d9-349084c9d4b5" />

<img width="1411" height="588" alt="image" src="https://github.com/user-attachments/assets/98c452f9-6330-4e88-9a29-0abc8d0806e0" />

<img width="1851" height="864" alt="image" src="https://github.com/user-attachments/assets/9fe6d263-7a11-4926-a3b5-8ef553e780dc" />

<img width="1678" height="703" alt="image" src="https://github.com/user-attachments/assets/41bc233f-9dc0-42b8-9cb9-3c75c3f9b960" />

<img width="1884" height="895" alt="image" src="https://github.com/user-attachments/assets/6fac547c-f1ab-4804-ac41-6d561d7f7154" />

<img width="1906" height="902" alt="image" src="https://github.com/user-attachments/assets/b056feea-f395-4d37-8815-459f94f0a05c" />


---

## System Architecture and Tech Stack

### Frontend (Web)
* **Framework:** React.js (Vite bundler)
* **State Management:** Redux Toolkit & RTK Query
* **Routing:** React Router DOM
* **Form Handling:** React Hook Form & Zod Validation
* **Styling:** Tailwind CSS

### Backend (Server)
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database Access:** Mongoose (MongoDB ODM)
* **Security:** Helmet, Express Rate Limit, Express Mongo Sanitize, HPP (HTTP Parameter Pollution protection), and XSS-clean.
* **Storage Provider:** Cloudinary (for media uploads)
* **API Documentation:** Swagger UI (integrated with swagger-jsdoc)

---

## Directory Structure

```text
├── Web/                     # Frontend application (Vite + React)
│   ├── src/                 # React source code (components, store, router, pages)
│   ├── eslint.config.js     # Frontend linting rules
│   └── package.json         # Frontend dependencies and scripts
├── Server/                  # Backend application (Express)
│   ├── config/              # Database and environment configurations
│   ├── controllers/         # Request handling logic
│   ├── models/              # Mongoose schemas
│   ├── routers/             # API route definitions
│   ├── services/            # Services (AI, Email, JWT)
│   ├── eslint.config.js     # Backend linting rules
│   └── package.json         # Backend dependencies and scripts
└── .github/
    └── workflows/           # CI/CD GitHub Actions pipelines
```

---

## Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
* Node.js (v18.x or above)
* npm (v9.x or above)
* MongoDB (Local instance or MongoDB Atlas URI)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/aelaraby6/PharmaXpress.git
   cd PharmaXpress
   ```

2. **Configure the Backend (Server):**
   Navigate to the `Server` folder and install dependencies:
   ```bash
   cd Server
   # Install dependencies
   npm install
   ```
   Create a `.env` file in the `Server` directory based on the following template:
   ```env
   NODE_ENV=development
   PORT=4000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_smtp_email_address
   EMAIL_PASS=your_smtp_app_password
   GROQ_API_KEY=your_groq_ai_api_key
   ```

3. **Configure the Frontend (Web):**
   Navigate to the `Web` folder and install dependencies:
   ```bash
   cd ../Web
   # Install dependencies
   npm install
   ```

### Running the Application

* **Start Backend Server:**
   Navigate to the `Server` folder and run:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:4000`.

* **Start Frontend Web:**
   Navigate to the `Web` folder and run:
   ```bash
   cd ../Web
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## Quality Assurance and CI Pipelines

This repository is configured with automated Continuous Integration (CI) checks on GitHub Actions that trigger on pushes and pull requests targeting the main branch.

* **Frontend Quality Check:** Verifies that the web project compiles without any ESLint warnings or build-time compilation errors.
* **Backend Quality Check:** Runs ESLint on the Express server folder to ensure consistency, variable safety, and code quality.

To run the linters locally:
* For Web: `cd Web && npm run lint`
* For Backend: `cd Server && npm run lint`

---

## Database Design (ERD)

The entity relationships mapping the collection schemas (Users, Products, Orders, Carts, etc.) are illustrated below:

<img width="3300" height="3043" alt="test_16_08_2026" src="https://github.com/user-attachments/assets/204d6680-0c88-45a1-9cd7-440cad34a6ac" />


---


## Contributors

The Rochetta project is developed and maintained by the following contributors:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/aelaraby6">
        <img src="https://avatars.githubusercontent.com/u/154278999?v=4" width="100px;" alt=""/>
        <br /><sub><b>Abdelrahman Elaraby</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Abdelrahman-M-Selim">
        <img src="https://avatars.githubusercontent.com/u/223935419?v=4" width="100px;" alt=""/>
        <br /><sub><b>Abdelrahman Selim</b></sub>
      </a>
    </td>
  </tr>
</table>
