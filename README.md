# Loop: Financial Analytics Dashboard

Welcome to Loop, a comprehensive financial analytics dashboard designed to provide users with a clear and insightful overview of their transactional data. This document serves as a guide to the project's architecture, core features, and setup procedures.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Core Architecture](#core-architecture)
    -   [Frontend: React & TypeScript](#frontend-react--typescript)
    -   [Backend: Express & Node.js](#backend-express--nodejs)
    -   [Asynchronous Task Processing: Worker & BullMQ](#asynchronous-task-processing-worker--bullmq)
3.  [Key Features & Technical Highlights](#key-features--technical-highlights)
    -   [Interactive Analytics Dashboard](#interactive-analytics-dashboard)
    -   [Scalable CSV Export Job System](#scalable-csv-export-job-system)
    -   [Performant Search with Debouncing](#performant-search-with-debouncing)
    -   [Custom-Styled UI Components](#custom-styled-ui-components)
4.  [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Running the Development Environment](#running-the-development-environment)
5.  [Project Structure](#project-structure)

---

## 1. Project Overview

Loop is a modern web application engineered to offer a seamless and intuitive experience for financial data management and visualization. The platform allows users to monitor their balance, track income and expenses, and gain deeper insights through a dedicated analytics dashboard. The user interface is designed to be clean, responsive, and fully consistent with a custom, themeable color scheme. The application is architected as a monorepo containing three primary services: a frontend client, a backend API server, and a background worker process for handling long-running tasks.


## 2. Core Architecture

The application is built upon a robust, decoupled architecture that ensures scalability, maintainability, and a smooth user experience.

### Frontend: React & TypeScript

The user interface is a single-page application (SPA) built with React and TypeScript. This combination provides a strong foundation for creating dynamic, type-safe, and maintainable components.

-   **State Management**: Component-level state is managed via React Hooks (`useState`, `useEffect`), while global user authentication state is handled through a dedicated `AuthContext`.
-   **Styling**: The UI is styled using Tailwind CSS, with a custom, themable color scheme defined in `index.css` through CSS variables. This allows for consistent branding and easy toggling between light and dark modes.
-   **Component Library**: Core UI elements, such as charts and tables, are encapsulated into reusable components to ensure a consistent look and feel across the application.

### Backend: Express & Node.js

The backend is a RESTful API server powered by Express.js. It is responsible for handling all business logic, including user authentication, data fetching from the database, and processing API requests from the frontend client.

### Asynchronous Task Processing: Worker & BullMQ

To handle computationally intensive tasks without degrading the user experience, the system includes a dedicated worker process and a job queue.

-   **BullMQ**: A powerful job queue library that uses Redis as its backend. It provides a reliable mechanism for queuing, processing, and managing background jobs.
-   **Redis**: Serves as the high-performance backbone for BullMQ, managing the state of all jobs in the queue.
-   **Worker Process**: A separate Node.js process that listens exclusively to the BullMQ job queue. It picks up and executes long-running tasks, such as generating large CSV files, completely independent of the main web server. This ensures the main server remains responsive to user requests at all times.


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


## 4. Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   Node.js (v18.x or later)
-   npm (v9.x or later)
-   Redis (running on the default port)
-   A configured `.env` file in the `express` directory with your database connection string and other environment variables.

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone <your-repository-url>
    cd <project-directory>
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
start-dev.bat
```

This will execute the following commands:
1.  **Frontend**: `npm run dev` in the `/frontend` directory.
2.  **Backend**: `npm run dev` in the `/express` directory.
3.  **Worker**: `npm run worker:dev` in the `/express` directory.


## 5. Project Structure

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
├── start-dev.bat   # Batch script to start all services
└── README.md
``` 