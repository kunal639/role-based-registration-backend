# UnscriptedPitch Backend

## Overview
UnscriptedPitch is a robust, production-ready backend system designed to handle high-stakes registration workflows. Built as a **Unified Monolith**, it manages everything from public user submissions to a secure administrative dashboard, ensuring data integrity and system availability under load.

## Features
*   **Role-Based Registration**: Distinct handling for different user types with automated validation logic.
*   **Admin APIs**: Secure endpoints for managing application data and system oversight.
*   **JWT Authentication**: Stateless session management using JSON Web Tokens to secure administrative routes.
*   **Rate Limiting**: Integrated throttling (via `express-rate-limit`) to prevent API abuse and brute-force registration attempts.
*   **Validation**: Strict data parsing using custom middleware to ensure structural integrity of incoming requests.
*   **Duplicate Prevention**: Backend verification logic to ensure unique entries and prevent redundant database records.
*   **Data Export**: Built-in functionality to retrieve and export registration data for external analysis.

## Tech Stack
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB Atlas (NoSQL)
*   **Security**: Helmet.js (CSP & Header protection), JWT
*   **Utilities**: Dotenv, CORS, Path, Express-Rate-Limit

## Architecture Flow

```text
Client (Frontend)  ──►  API Gateway (Express)  ──►  Database (MongoDB)
      ▲                        │                         │
      └────────────────────────┴─────────────────────────┘
          (JWT Auth & Rate Limiting Middleware Layers)
