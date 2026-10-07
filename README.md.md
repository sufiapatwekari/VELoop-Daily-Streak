# VELoop Rewards — Daily Streak System

## 1. Project Overview

VELoop Rewards is a full-stack MERN web application that provides a daily streak and reward system.

Users can register, log in, check in every 24 hours, maintain their daily streak, and receive rewards for completing consecutive days.

The main rule of the project is:

> The React frontend displays the data, but the backend controls the streak and rewards.

The backend checks the user's identity, claim time, streak day, reward, wallet balance, and eligibility before giving a reward.

---

## 2. Main Objectives

The main objectives of the project are:

* User registration and login
* JWT-based authentication
* Daily streak tracking
* Seven-day reward cycle
* Backend-controlled reward system
* 24-hour claim interval
* 48-hour missed-day reset
* VES wallet management
* Transaction history
* Streak history
* Duplicate claim protection
* Protection against fake day or reward values
* Server-based claim timing
* Responsive user interface
* MongoDB data storage
* Audit records for important actions

---

## 3. Technology Stack

### Frontend

* React.js
* Vite
* Bootstrap
* CSS Modules
* React Router
* Axios
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt/bcryptjs
* express-rate-limit

### Tools

* MongoDB Atlas
* Postman
* Visual Studio Code
* Git/GitHub
* npm

---

## 4. System Architecture

User
  ↓
React Frontend
  ↓
Axios API Service
  ↓
Express.js Backend
  ↓
Authentication & Validation
  ↓
Streak and Reward Logic
  ↓
MongoDB
  ↓
Wallet / Transactions / History / Audit Logs


The frontend sends requests to the backend.

The backend checks the request and gets the required information from MongoDB. It then sends the latest result back to the frontend.

The frontend does not decide the reward amount, streak day, or claim eligibility.

---

## 5. Project Structure

VELoop-Daily-Streak/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── AuditLog.js
│   │   ├── Reward.js
│   │   ├── Streak.js
│   │   ├── StreakConfig.js
│   │   ├── StreakHistory.js
│   │   ├── Transaction.js
│   │   ├── User.js
│   │   └── Wallet.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── Postman Collection
│
└── README.md


---

# 6. Main Data Models

The project uses the following MongoDB collections:

### User

Stores:

* User name
* Email
* Password hash

### Wallet

Stores:

* User ID
* VES balance

### Streak

Stores:

* User ID
* Current streak
* Longest streak
* Current day
* Cycle ID
* Last claim date

### StreakConfig

Stores the main streak rules:

* Total days: 7
* Claim interval: 24 hours
* Missed reset time: 48 hours
* Active configuration

### Reward

Stores the reward for each day.

### StreakHistory

Stores the user's daily claim history.

### Transaction

Stores wallet reward transactions.

### AuditLog

Stores important actions such as successful claims, rejected claims, duplicate claims, and streak resets.

---

# 7. Seven-Day Reward Cycle

| Day   | Reward              |
| ----- | ------------------- |
| Day 1 | +5 VES              |
| Day 2 | +10 VES             |
| Day 3 | +15 VES             |
| Day 4 | ₹1 Amazon Gift Card |
| Day 5 | ₹2 Amazon Gift Card |
| Day 6 | +30 VES             |
| Day 7 | ₹5 Amazon Gift Card |

The reward values are stored in the backend database.

The frontend does not send the reward amount when claiming.

---

# 8. Streak Rules

The streak follows a seven-day cycle.

### Day 1

A new user starts with Day 1 available.

After a successful claim:

Current Streak = 1
Current Day = 1
Reward = +5 VES


### Next Claim

The user must wait 24 hours before making the next claim.

The backend checks the previous claim time before allowing the next claim.

### Sequential Claims

The user must complete the days in order.

For example:

Day 1 → Day 2 → Day 3 → Day 4


The user cannot directly claim Day 4 without completing the earlier days.

---

# 9. Missed-Day Reset

The project uses a 48-hour missed-day rule.

If the user does not claim within the allowed time and the missed period reaches the reset limit, the streak is reset.

The user then starts a new cycle from Day 1.

The reset is handled by the backend.

Refreshing the browser does not reset the streak because the streak information is stored in MongoDB.

---

# 10. Claim Flow

When the user clicks the claim button:

User clicks Claim
        ↓
JWT authentication
        ↓
Check user
        ↓
Check streak
        ↓
Check claim timing
        ↓
Check previous day
        ↓
Check duplicate claim
        ↓
Get reward from database
        ↓
Update wallet if reward is VES
        ↓
Create transaction
        ↓
Save streak history
        ↓
Save audit log
        ↓
Return updated data
        ↓
Frontend displays new state


The backend performs these checks before giving the reward.

---

# 11. Backend-Controlled Data

The following values are controlled by the backend:

* Current streak
* Longest streak
* Current day
* Reward
* Reward status
* Claim eligibility
* Next claim time
* Server time
* Wallet balance
* Transaction records
* Streak history

The frontend only displays the values returned by the backend.

This prevents users from changing important reward information through the browser.

---

# 12. Claim Timer

The backend sends:

* `serverTime`
* `nextClaimAt`

The frontend uses this information to display the countdown.

After the countdown finishes, the frontend requests the latest streak status from the backend.

This makes the backend the source of the actual claim time.

---

# 13. Security

The project includes the following security measures:

### JWT Authentication

After login, the backend provides a JWT token.

Protected requests must send:


Authorization: Bearer <JWT>

### Password Hashing

Passwords are stored as hashes using bcrypt.

### User-Specific Data

The backend gets the user ID from the authenticated token and uses it when accessing user data.

### Backend Reward Validation

The user cannot send their own reward amount or day number to claim a reward.

### Duplicate Claim Protection

The backend checks whether the reward for the current day has already been claimed.

### Concurrent Claim Protection

MongoDB transactions help prevent multiple requests from giving the same reward.

### Rate Limiting

The claim endpoint has rate limiting to reduce repeated requests.

### Audit Logs

Important streak actions are stored in the audit log.

---

# 14. Wallet and Transaction System

VES rewards are added to the user's wallet.

For example:

Previous Balance: 0 VES
Day 1 Reward: +5 VES
New Balance: 5 VES


The transaction record stores information such as:

* User
* Reward type
* Amount
* Currency
* Source
* Streak day
* Previous balance
* New balance
* Transaction status

Gift card rewards are recorded as reward entries and do not increase the VES wallet balance.

---

# 15. Frontend Pages

The application contains pages for:

* Home
* Register
* Login
* Dashboard
* Daily Streak
* Streak History
* Wallet
* Transactions
* Privacy Policy
* Terms and Conditions

The dashboard displays the latest streak, reward, wallet, and claim information received from the backend.

---

# 16. Responsive Design

The frontend is designed to work on different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile

The layout adjusts according to the screen size so that the main features remain easy to use.

---

# 17. API Endpoints

The main API endpoints are:

| Method | Endpoint          | Purpose                   |
| ------ | ----------------- | ------------------------- |
| POST   | `/register`       | Register a new user       |
| POST   | `/login`          | Login                     |
| GET    | `/profile`        | Get user profile          |
| GET    | `/streak/status`  | Get current streak status |
| POST   | `/streak/claim`   | Claim the current reward  |
| GET    | `/streak/history` | Get streak history        |
| POST   | `/streak/create`  | Create streak data        |
| GET    | `/wallet`         | Get wallet balance        |
| GET    | `/transactions`   | Get transaction history   |
| GET    | `/`               | Check backend status      |

Protected endpoints require a valid JWT token.

---

# 18. Environment Variables

The backend uses environment variables for sensitive configuration.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


The frontend uses:

VITE_API_URL=http://localhost:5000


The real `.env` file should not be included in the final project submission or uploaded to GitHub.

An `.env.example` file can be included instead.

---

# 19. Installation and Setup

## Backend

Open the terminal:

bash
cd backend
npm install


Create the `.env` file and add the required values.

Then start the backend:

bash
npm start


Backend URL:

http://localhost:5000


---

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 20. Database Collections

The main MongoDB collections are:

```text
users
wallets
streaks
streakconfigs
rewards
streakhistories
transactions
auditlogs
```

---

# 21. Testing

The project was tested using Postman and manual frontend testing.

Important test cases include:

* User registration
* User login
* Valid Day 1 claim
* Duplicate claim
* Waiting period
* Sequential day validation
* Fake reward value
* Fake day value
* Fake user ID
* Missing token
* Invalid token
* Browser refresh
* Logout and login
* Multiple tabs
* Next-day claim
* Missed-day reset
* Rate limiting
* Wallet update
* Transaction creation
* Streak history
* Concurrent claim requests

The final system was tested to confirm that the backend controls the important streak and reward data.

---

# 22. Postman Testing

Postman was used to test the backend APIs.

The main flow tested was:

Register
   ↓
Login
   ↓
Get JWT
   ↓
Get Streak Status
   ↓
Claim Reward
   ↓
Check Wallet
   ↓
Check Transaction
   ↓
Check Streak History


Negative cases were also tested to make sure invalid requests are rejected.

---

# 23. Important Project Rule

The most important rule of the project is:

> The frontend displays the streak, rewards, wallet and countdown. The backend checks whether the user can claim and updates the database.

This prevents the user from simply changing frontend values to get a different reward.

---

# 24. Current Limitations

The project is mainly designed as an internship/academic project.

Current limitations include:

* Automated backend test cases are not included.
* Some testing/development endpoints are intended only for local development.
* The current reward system uses demo reward values.
* Real Amazon gift card delivery is outside the current project scope.
* Production deployment would require additional configuration for security, domain-based CORS, environment variables and monitoring.

---

# 25. Future Improvements

Possible future improvements include:

* Admin dashboard for reward management
* Automated backend tests
* Production deployment
* Email notifications
* Real gift card integration
* Better monitoring and error reporting
* HTTP-only cookie authentication
* More reward cycles
* Additional reward types

---

# 26. Final Summary

VELoop Rewards is a MERN-based daily streak application where users can check in every 24 hours and receive rewards for maintaining their streak.

The system stores streaks, rewards, wallet information, transactions, history and audit records in MongoDB.

The main focus of the project is backend-controlled streak and reward validation. The frontend provides the user interface, while the backend makes the final decision about claims and updates the database.

This makes the system more reliable and reduces the chance of users changing reward or streak values from the browser.
