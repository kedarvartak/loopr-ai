# Penta -> Financial Analytics Dashboard

This is an assignment submission for full stack intern position at loopr-ai (https://www.loopr.ai/). 


![jist of the soln](images/dassh.png)


- Name - Kedar Vartak
- Linkedin - www.linkedin.com/in/kedar-vartak20
- Mail ID - kedar.vartak22@vit.edu
- Submission video - https://www.youtube.com/watch?v=yuaLJT-A-gc

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Tech Stack](#tech-stack)
3.  [Key Features & Technical Highlights](#key-features--technical-highlights)
    -   [Interactive Analytics Dashboard](#interactive-analytics-dashboard)
    -   [Scalable CSV Export Job System](#scalable-csv-export-job-system)
    -   [Performant Search with Debouncing](#performant-search-with-debouncing)
    -   [Data Architecture: Normalization with Aggregation Pipelines](#data-architecture-normalization-with-aggregation-pipelines)
    -   [Privacy-First AI Analyst with On-Premise LLM](#privacy-first-ai-analyst-with-on-premise-llm)
    -   [Secure JWT Authentication with HTTP-Only Cookies](#secure-jwt-authentication-with-http-only-cookies)
4.  [API Documentation](#api-documentation)
5.  [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Running the Development Environment](#running-the-development-environment)
6.  [Project Structure](#project-structure)

---

## 1. Project Overview

Penta is a simple and user-friendly web app that helps you manage your money. You can check your balance, see your income and expenses, and view insights on a dashboard. It has a clean, responsive design with customizable colors. The app is built with three parts: the frontend you see, a backend server, and a background worker for handling longer tasks.


![jist of the soln](images/jist.png)


## 2. Tech Stack

The application is built upon a robust, modern technology stack to ensure scalability, maintainability, and a high-quality user experience.

| Category      | Technology    | Purpose in this Project                                                                                             |
| :------------ | :------------ | :------------------------------------------------------------------------------------------------------------------ |
| **Frontend**  | React         | A JavaScript library for building the user interface with a component-based architecture.                           |
|               | TypeScript    | A statically typed superset of JavaScript that enhances code quality and maintainability.                           |
|               | Tailwind CSS  | A utility-first CSS framework used for rapidly building custom user interfaces with a consistent design system.         |
| **Backend**   | Node.js       | A JavaScript runtime environment that allows for building fast and scalable server-side applications.                 |
|               | Express.js    | A minimal and flexible Node.js web application framework used to build the RESTful API server.                      |
| **Database**  | MongoDB       | The primary NoSQL database used for storing all user and transactional data.                                         |
| **Job Queue** | BullMQ        | A robust job queue system for Node.js, used to manage and process long-running background tasks like CSV exports.     |
|               | Redis         | An in-memory data store used as the high-performance backend for BullMQ and for caching job statuses.               |

## 3. Key Features & Technical Highlights

### Interactive Analytics Dashboard

The application features a comprehensive analytics dashboard that provides users with multiple ways to visualize their financial data. This includes interactive charts for analyzing income vs. expenses over time, breaking down spending by category, and tracking monthly financial trends.

### Scalable CSV Export Job System

A key feature of the application is its ability to export large transaction histories to CSV without freezing the user interface. This is achieved through an asynchronous, scalable architecture:

1.  **Job Queuing**: When a user requests a CSV export, the Express server does not generate the file directly. Instead, it places a job onto a **BullMQ** queue, which is managed by **Redis**. This action is instantaneous, and the server immediately returns a unique `jobId` to the client.
2.  **Background Processing**: A dedicated **worker process** listens to the queue, picks up the job, and performs the heavy lifting of fetching data from the database and compiling the CSV file.
3.  **Client-Side Polling**: The frontend uses the `jobId` to periodically poll a status endpoint on the server. The server, in turn, checks the job's status in Redis.
4.  **Automatic Download**: Once the worker completes the job, it updates the status in Redis and provides a download URL. The next time the client polls, it receives the "completed" status and the URL, automatically triggering the file download for the user.

This decoupled system ensures that the application remains fast and responsive, regardless of the size of the export, and can be easily scaled by adding more worker processes.

![scalability of csv solution](images/scalable.png)

### Performant Search with Debouncing

To optimize performance and reduce server load, the transaction search functionality implements a debouncing mechanism.

-   **How it Works**: As a user types in the search input field, an API request is not sent for every keystroke. Instead, a timer is set. If the user continues to type, the timer is reset. The API request is only fired after the user has paused typing for a set duration (e.g., 500ms).
-   **Benefits**: This technique dramatically reduces the number of API calls, leading to a smoother user experience and a more efficient backend. It prevents the UI from re-rendering on every keystroke and saves significant server and database resources.

![search debouncing](images/debounce.png)

### Data Architecture: Normalization with Aggregation Pipelines

For this application, we chose a **normalized** data model over a denormalized one. In our MongoDB database, `users` and `transactions` are stored in separate collections, linked by a `userId`.

**Why Normalization?**
-   **Data Integrity**: It eliminates data redundancy. A user's name is stored only once in the `users` collection. If it needs to be updated, it's a single, atomic operation, ensuring consistency across all related transactions. With denormalization, updating a user's name would require finding and updating every single transaction record associated with that user, which is inefficient and error-prone.
-   **Flexibility**: A normalized structure is highly flexible. We can easily introduce new relationships and data models (e.g., adding `accounts` or `budgets`) without restructuring large, denormalized documents.

**The Power of Aggregation Pipelines**

We overcome the read-performance challenge of normalization by using MongoDB's powerful **aggregation pipelines**. When we need to fetch transactions with user details (e.g., for display in the transaction table), we use a `$lookup` stage. This stage performs a left outer join to the `users` collection, dynamically embedding the user information into the transaction data at query time.

This approach gives us the best of both worlds: the data integrity and flexibility of a normalized schema, with the high performance of on-demand data aggregation, perfectly suited for complex queries and analytics.


![aggregation pipeline](images/normalisation.png)


### Privacy-First AI Analyst with On-Premise LLM

The "AI Analyst" feature provides users with natural language-powered insights into their financial data. To ensure maximum data privacy and security, we have implemented this feature using a locally-run Large Language Model (LLM), Llama 3, via Ollama.

**How It Works:**

1.  **No Data Leaves Your System**: Unlike solutions that rely on third-party AI APIs (like OpenAI), all processing happens on the backend server. User transaction data is never sent to external services.
2.  **Two-Stage Querying**: The system uses a sophisticated two-stage process. First, the backend pre-processes the user's question and transaction data to calculate key metrics (like total income, average expense, transaction counts).
3.  **Structured Prompting**: These pre-calculated metrics are then inserted into a highly structured prompt. The local LLM's task is not to perform calculations, but simply to "fill in the blanks" and present the already-crunched numbers in a clear, human-readable narrative.
4.  **Backend Control**: This architecture ensures accuracy and prevents AI "hallucinations" (making up incorrect facts). The backend remains the source of truth for all data and calculations, while the LLM acts as a natural language presentation layer.

This on-premise, privacy-first approach provides powerful AI-driven analytics without compromising user data security.


![llama3](images/llama3.png)


![llm response](images/llm.png)


### Secure JWT Authentication with HTTP-Only Cookies

The application uses JSON Web Tokens (JWT) for stateless, secure user authentication, delivered via `HttpOnly` cookies. This modern approach enhances security by preventing client-side scripts from accessing the token, thus mitigating XSS (Cross-Site Scripting) attacks.

1.  **Login**: When a user logs in with their credentials, the Express server validates them.
2.  **Token Generation**: Upon successful validation, the server generates a signed JWT containing the user's ID.
3.  **Secure Cookie Delivery**: Instead of sending the token in the response body, the server sets it in an `HttpOnly`, `secure`, and `samesite` cookie. This cookie is automatically sent by the browser with every subsequent request to the backend.
4.  **Server-Side Verification**: A custom middleware on the server automatically reads the JWT from the cookie on incoming requests, verifies its signature, and extracts the user's identity. If the token is valid, the request is authorized and processed. This entire process is seamless and secure, requiring no manual token handling on the client side.


![jwt auth](images/jwt.png)


## 4. API Documentation

The following tables provide documentation for the core REST API endpoints. All authenticated routes are protected by an HttpOnly cookie that is automatically handled by the browser after login.

### Authentication

| Method | Endpoint              | Description                      | Auth Required | Request Body                            |
| :----- | :-------------------- | :------------------------------- | :------------ | :-------------------------------------- |
| `POST` | `/api/users/register` | Registers a new user            | No            | `{ "username", "email", "password" }`   |
| `POST` | `/api/users/login`    | Logs in an existing user        | No            | `{ "email", "password" }`               |
| `POST` | `/api/users/logout`   | Logs out the current user       | No            | None                                    |
| `GET`  | `/api/users/profile`  | Gets the current user's profile | Yes           | None                                    |

### Transactions

| Method | Endpoint                    | Description                                                                                                   | Auth Required | Request/Query Parameters                                                                                      |
| :----- | :-------------------------- | :------------------------------------------------------------------------------------------------------------ | :------------ | :----------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/transactions`         | Fetches a paginated, sorted, and filtered list of transactions                                               | Yes           | `page`, `limit`, `sortBy`, `order`, `search`, `startDate`, `endDate`, `category`, `status`, `minAmount`, `maxAmount` |
| `GET`  | `/api/transactions/stats`   | Gets transaction statistics                                                                                  | Yes           | None                                                                                                         |
| `GET`  | `/api/transactions/overview`| Gets overview statistics for dashboard                                                                       | Yes           | None                                                                                                         |
| `GET`  | `/api/transactions/categories`| Gets spending breakdown by categories                                                                      | Yes           | None                                                                                                         |
| `POST` | `/api/transactions/export`  | Initiates an asynchronous job to export transactions to a CSV file                                           | Yes           | `{ "columns": [], "filters": {}, "sort": {}, "search": "" }`                                                  |

### AI Analysis

| Method | Endpoint          | Description                                                                                | Auth Required | Request Body                            |
| :----- | :---------------- | :----------------------------------------------------------------------------------------- | :------------ | :-------------------------------------- |
| `POST` | `/api/ai/chat`    | Analyzes financial data and answers questions using the local LLM                          | Yes           | `{ "question": "string" }`               |

### Export Jobs

| Method | Endpoint                   | Description                                  | Auth Required | Response Body                                                 |
| :----- | :------------------------- | :------------------------------------------- | :------------ | :------------------------------------------------------------ |
| `GET`  | `/api/export-status/:jobId` | Polls for the status of a CSV export job    | Yes           | `{ "status": "completed" \| "pending" \| "failed", "url?": "..." }` | 

## 5. Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   Node.js (v18.x or later)
-   npm (v9.x or later)
-   Redis Cloud configuration in the env file 
-   A configured `.env` file in the `express` directory with your database connection string and other environment variables.
-   env file should contain redis cloud console uri, mongodb uri, jwt secret

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/kedarvartak/loopr-ai
    cd loopr-ai
    ```
2.  Install frontend dependencies:
    ```bash
    cd frontend
    npm install
    ```
3.  Install backend and worker dependencies:
    ```bash
    cd ../express
    npm install
    ```

### Running the Development Environment

To simplify the startup process, a batch file is provided in the root directory. This script will open three separate terminal windows and run the development servers for all required services.

From the **root directory** of the project, run:
```bash
start.bat
```

This will execute the following commands:
1.  **Frontend**: `npm run dev` in the `/frontend` directory.
2.  **Backend**: `npm run dev` in the `/express` directory.
3.  **Worker**: `npm run worker:dev` in the `/express` directory.

## 6. Project Structure

The project is organized as a monorepo with the following high-level directory structure:

```
/
├── express/        # Backend Express.js server and Worker logic
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/       # Frontend React client
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   └── package.json
├── start.bat   # Batch script to start all services
└── README.md
``` 
