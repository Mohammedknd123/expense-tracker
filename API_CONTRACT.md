# API Contract: Expense Tracker

## Base URL
`http://localhost:5000/api`

## Authentication
| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Register a new user | `{name, email, password}` | `201 Created` |
| **POST** | `/auth/login` | Login and get token | `{email, password}` | `{token, user}` |

## Expenses
*Requires Authorization Header: `Bearer <JWT_TOKEN>`*

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/expenses` | Get all expenses | - | `[Expense]` |
| **POST** | `/expenses` | Create new expense | `{title, amount, category, date, description}` | `Expense` |
| **PUT** | `/expenses/:id` | Update expense | `{title, amount, ...}` | `Updated Expense` |
| **DELETE** | `/expenses/:id` | Delete expense | - | `200 OK` |

## Categories
| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/categories` | Get all available categories | - | `[Category]` |
