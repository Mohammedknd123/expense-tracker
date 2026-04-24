# System Architecture: Expense Tracker

## Technology Stack
- **Frontend:** React + Tailwind CSS (v4)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## Project Structure
- **Frontend:** Single Page Application (SPA)
  - **Pages:**
    - `Login`: Authentication entry point.
    - `Dashboard`: Overview of spending, charts, and summary.
    - `Expenses`: CRUD management for expense items.
- **Backend:** RESTful API
  - **Auth Middleware:** Verifies JWT for protected routes.
  - **Models:** User, Expense, Category.

## Integration
- The Frontend communicates with the Backend via HTTP requests.
- **Backend URL:** `http://localhost:5000`
- All protected requests must include the JWT in the `Authorization` header.
- Frontend state management will handle the user session and expense data.
