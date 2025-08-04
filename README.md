    💰 Personal Expense Tracker

A modern, mobile-responsive personal expense tracking app built with React (Vite), Tailwind CSS, and a secure Node.js + Express + MongoDB backend. Users can log in, track income and expenses, view history with pagination and filters, and edit/delete past entries.

---

🚀 Features

🔐 User authentication (Signup/Login with JWT)

📥 Add income and multiple expenses per entry

🧾 History list with:

Inline editing & deletion

Pagination

Filtering by month & keyword

📊 Real-time saving calculations

📱 Fully responsive UI with modern design and animations

---

📦 Tech Stack

Frontend

React + Vite

Tailwind CSS

React Router DOM

Lucide Icons

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcryptjs

---

📁 Project Structure

personal-expense-tracker/
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/ # Navbar, DashboardForm, HistoryList
│ │ ├── pages/ # Login, Signup, Dashboard
│ │ ├── services/ # api.js for frontend API logic
│ │ ├── context/ # AuthContext
│ │ └── App.jsx # App Router
│ └── index.css # Tailwind CSS + animations
├── server/ # Node Backend
│ ├── models/ # User.js, Entry.js
│ ├── controllers/ # authController.js, entryController.js
│ ├── routes/ # authRoutes.js, entryRoutes.js
│ ├── middleware/ # authMiddleware.js
│ └── server.js # Express app bootstrap
└── .env # Environment variables

---

🛠 Installation

1. Clone the repository

git clone https://github.com/your-username/personal-expense-tracker.git
cd personal-expense-tracker

2. Install backend dependencies

cd server
npm install

3. Install frontend dependencies

cd ../client
npm install

---

⚙ Configuration

Create a .env file inside server/:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_secret_key_here

---

Running the App

Start Backend

cd server
npm run dev

Start Frontend

cd client
npm run dev

Frontend: http://localhost:5173
Backend: http://localhost:5000

---

API Endpoints

Auth

POST /api/auth/signup – Create new user

POST /api/auth/login – Login with email or mobile

Entries

POST /api/entries/add – Add income & expenses

GET /api/entries/history?page=&limit= – Get paginated entries

PUT /api/entries/:id – Edit an entry

DELETE /api/entries/:id – Delete an entry

---

Notes

All entries are linked to the logged-in user via JWT auth.

Uses localStorage to persist user login across sessions.

Tailwind's custom utility classes for theme styling & animations.

Backend secured with middleware and user-specific entry filtering.
