# Savings-Management-System
#The solution that  enable customers to register, log in, manage savings, and perform transactions securely, while administrators can verify users and monitor activities
# Savings Management System - Client Backend

## Setup Instructions
1. Clone the repository: git clone https://github.com/KIMHON1/Savings-Management-System-Client-Application
2. Install dependencies: npm install
3. For frontend cd frontend. 
- Run the server: npm start.
4. For backend cd backend. 
- Run the server: npm run dev.

# Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get JWT
- POST /api/savings/deposit - Deposit money
- POST /api/savings/withdraw - Withdraw money
- GET /api/savings/balance - Get balance
- GET /api/savings/history - Get transaction history

