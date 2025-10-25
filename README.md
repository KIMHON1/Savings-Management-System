# Savings-Management-System
#The solution that  enable customers to register, log in, manage savings, and perform transactions securely, while administrators can verify users and monitor activities
# Savings Management System - Client Backend

## Setup Instructions
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in the values (e.g., `MONGO_URI`, `JWT_SECRET`).
4. Start MongoDB locally or via Docker.
5. Run the server: `npm start`

## Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `POST /api/savings/deposit` - Deposit money
- `POST /api/savings/withdraw` - Withdraw money
- `GET /api/savings/balance` - Get balance
- `GET /api/savings/history` - Get transaction history

## Running with Docker
1. Build and run: `docker-compose up`
2. Access at `http://localhost:5000`

## Testing
Run tests with: `npm test`
