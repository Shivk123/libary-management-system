# 📚 Library Management System

A modern full-stack library management platform built with **React**, **Express.js**, **Prisma**, and **SQLite**.  
It enables efficient book catalog management, user borrowing, fine calculation, and group-based collaboration — featuring role-based access and real-time interface updates.

---

## 📚 Library Management System — Walkthrough

### 👨‍💼 Admin Features

#### 🧑‍🔧 Editing User Details
[![Admin-Editing User Admin Details](https://img.youtube.com/vi/3c5WKe9TP_E/0.jpg)](https://youtu.be/3c5WKe9TP_E)  
*The admin updates user information such as name, email, and role through the dashboard.*

#### 📘 Adding a New Book
[![Admin-Adding a new Book](https://img.youtube.com/vi/qRo-aS78Rt8/0.jpg)](https://youtu.be/qRo-aS78Rt8)  
*The admin adds new books to the library by entering title, author, ISBN, and category details.*

#### ✏️ Editing Book Details
[![Admin-Editing Book Details](https://img.youtube.com/vi/sagaKQOkNvc/0.jpg)](https://youtu.be/sagaKQOkNvc)  
*The admin modifies existing book records, such as updating titles, authors, or availability.*

#### 🗑️ Deleting a Book
[![Admin-Deleting Book](https://img.youtube.com/vi/tXm5zDe-610/0.jpg)](https://youtu.be/tXm5zDe-610)  
*The admin removes outdated or unavailable books from the system.*

#### ✅ Approving Book Returns
[![Admin-Approving Returns](https://img.youtube.com/vi/WTSjs5ohDHk/0.jpg)](https://youtu.be/WTSjs5ohDHk)  
*The admin reviews and approves book return requests submitted by users.*

---

### 👤 User Features

#### 👥 Creating a Group
[![User Creating Group](https://img.youtube.com/vi/yOI9VnxV5mk/0.jpg)](https://youtu.be/yOI9VnxV5mk)  
*Users can form groups to manage shared book borrowing activities.*

#### 📚 Borrowing Books Individually
[![User Borrowing Books](https://img.youtube.com/vi/jAsuGk-movU/0.jpg)](https://youtu.be/jAsuGk-movU)  
*A user borrows available books directly from the library catalog.*

#### 🤝 Borrowing Books in a Group
[![User Borrowing Books in a Group](https://img.youtube.com/vi/tiSrAEdgwrc/0.jpg)](https://youtu.be/tiSrAEdgwrc)  
*A user borrows books on behalf of their group for collaborative study or sharing.*

---

## Features

### Authentication & Authorization
- Secure login system with **Role-Based Access Control (RBAC)**
- Roles: **Admin** and **User**, each with unique privileges
- Profile management: edit **name, email, address, and phone number**
- Protected routes and secure session handling

---

### Browse Books Section
- Displays all books available in the library
- Each book card includes title, author, rating, and availability
- Borrow options:
  - **Individual Borrowing** — Users can borrow up to **3 books** at a time  
  - **Group Borrowing** — Users can borrow books via joined groups  
- All new borrow requests require **admin authorization**
- Real-time update of available and borrowed books

---

### User Dashboard
The main user hub that gives quick access to:
1. **Browse Books Tab** – Explore and request books  
2. **My Groups Tab** – Create or manage groups (minimum 3 members)  
3. **My Borrowings Tab** – Track all borrowed books and fine details  

**Dashboard Highlights:**
- Currently borrowed books (max 3)
- Total borrow history
- Active and cleared fines
- Groups joined and group stats

---

### Group Management
- Users can **create** or **join** groups for collaborative borrowing  
- Requires **at least 3 members** to be valid  
- Displays:
  - Group members
  - Books borrowed by the group
  - Overall borrowing history of the group

---

### My Borrowings Page
- Displays:
  - **Currently borrowed books**
  - **Previously borrowed books**
  - **Fine details (paid/pending)**  
  - **Damage percentage:** 10%, 50%, or stolen  
- Tracks:
  - Active borrowings
  - Total borrowing history
  - Fine accumulated over time

---

### Fine & Damage Management
- Automatic fine calculation for overdue books  
- Admin can **clear** or **modify fines**
- Fine and damage status visible to both user and admin  
- Damage levels:
  - 10% → ₹50 fine
  - 50% → ₹200 fine
  - Stolen → ₹500 or replacement cost  
- Overdue fine: ₹10/day beyond due date

---

### Admin Panel
The **Admin Panel** offers complete system control with three key sections:
1. **Dashboard Tab**  
   - Quick shortcuts to user management, book catalog, and analytics  
   - Displays summaries like total books, active users, fines, and pending approvals  

2. **Book Catalogue Tab**  
   - View, edit, or remove books  
   - Edit **reviews**, **summary**, **cover image**, and **ratings**  
   - Track book availability, borrow frequency, and popularity  

3. **User Management Tab**  
   - Monitor all students’ borrowing and fine status  
   - Track fined vs non-fined users  
   - Edit or delete user details  
   - Clear fines directly from the panel  
   - View each student’s borrowing and fine record  

4. **Reports & Analytics Tab**  
   - Comprehensive system analytics:
     - Total books and users  
     - Popular books (based on borrow count)  
     - Fine reports: active, overdue, and collected fines  
     - Students with active fines and returned books  
   - Visual charts for borrow and fine trends  

---

### Real-Time Updates
- Reflects admin and user actions instantly  
- Live updates for book availability, fines, and group status  
- Powered by **React Hooks**, **Context API**, and **ShadCN UI**

---

## Architecture Overview

| Layer          | Technology                         | Description                   |
|----------------|------------------------------------|-------------------------------|
| Frontend       | React (TypeScript) + Tailwind CSS  | Responsive, modern UI          |
| Backend        | Express.js (Node.js)               | REST API for business logic    |
| Database       | SQLite + Prisma ORM                | Lightweight relational data    |
| Authentication | Role-Based Access Control          | Secure route protection        |

---

## ⚙️ Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```
Server runs on: **http://localhost:3001**

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

## Default Accounts

### Admin Account
| Role | Email | Password |
|------|--------|-----------|
| Administrator | admin@library.com | admin123 |

### User Accounts
| Name | Email | Password |
|------|--------|-----------|
| John Doe | john@example.com | john123 |
| Jane Smith | jane@example.com | jane123 |
| Mike Johnson | mike@example.com | mike123 |
| Sarah Wilson | sarah@example.com | sarah123 |
| Tom Brown | tom@example.com | tom123 |
| Lisa Davis | lisa@example.com | lisa123 |

---

## API Endpoints

| Endpoint | Description |
|-----------|-------------|
| `/api/users` | User management |
| `/api/books` | Book catalog operations |
| `/api/borrowings` | Borrowing system |
| `/api/groups` | Group management |
| `/api/fine-settings` | Fine configuration |

---

## Currency & Localization
- All transactions use **Indian Rupees (₹)**
- Localized for **India Standard Time (IST)**

---

## Fine Calculation Logic

| Condition | Action | Fine |
|------------|---------|------|
| Returned after due date | ₹10 per day | Auto-calculated |
| Damage – 10% | Add ₹50 fine | Manual or auto |
| Damage – 50% | Add ₹200 fine | Manual or auto |
| Stolen | ₹500 or replacement | Manual |
| Fine removed by admin | ₹0 | Manual override |

---

## Future Enhancements

- 📧 Email notifications for due/overdue books  
- 📄 PDF report generation for borrow history  
- ☁️ Migration to PostgreSQL for scalability  
- 📊 Admin analytics dashboard  

---

## License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute it with attribution.