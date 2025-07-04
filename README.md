<div align="center">
  <img src="https://img.icons8.com/external-flat-icons-inmotus-design/67/000000/external-hospital-medical-flat-icons-inmotus-design.png" width="80" height="80" alt="Doclino Logo" />
  <h1>Doclino CMS</h1>
  <p><strong>Doctor Appointment & Management System</strong></p>
  <p>A full-stack medical CMS platform with role-based access for patients, doctors, and admins.</p>
  <br/>
  <a href="#">🧠 View Live Demo</a> • <a href="#">📘 Documentation</a> • <a href="#">📂 Download</a>
</div>

---

## 🚀 Tech Stack

### 🖥️ Frontend
- React.js (Vite powered)
- React Router DOM
- TailwindCSS
- Framer Motion
- Axios

### 🧠 Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Razorpay & Stripe for payments
- Cloudinary (image uploads)
- Socket.IO (real-time capability)

---

## 📦 Features

### 👨‍⚕️ Patient Panel:
- Register / Login with JWT
- Browse and view doctor profiles
- Book / Cancel appointments
- View appointment history
- Profile update with photo upload
- Razorpay and Stripe payment integration

### 🩺 Doctor Panel:
- Added by admin securely
- Toggle availability
- View and manage appointments

### 🔐 Admin Panel:
- Admin login via environment credentials
- Add / remove doctors
- Dashboard with analytics (appointments, users, doctors)
- View all user activities

---

## 🛠️ Setup Instructions

### ⚙️ Environment Variables

#### Backend (`.env`)
```env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
STRIPE_SECRET_KEY=your_stripe_secret
CURRENCY=INR
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000
```

### 🧪 Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/doclino-cms.git
cd doclino-cms
```

#### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)

---

## 📷 Screenshots

| Dashboard | Doctor List | Appointment Booking |
|----------|--------------|----------------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Doctors](./screenshots/doctors.png) | ![Booking](./screenshots/booking.png) |

---

## 🔐 Authentication
- JWT-based for all users
- Admin is validated via `.env` credentials

---

## 🧾 Sample API Endpoints

```
POST   /api/user/register
POST   /api/user/login
GET    /api/user/profile
POST   /api/user/book
GET    /api/admin/all-doctors
POST   /api/admin/add-doctor
POST   /api/admin/cancel-appointment
```

---

## 👨‍💻 Author

Developed with ❤️ by [Sundram Mishra](https://github.com/sundram7865)

- GitHub: [@sundram7865](https://github.com/sundram7865)
- LinkedIn: [linkedin.com/in/sundram7865](https://www.linkedin.com/in/sundram7865)

---

## ⭐ Support & Contributions

If you found this project helpful:

- ⭐ Star it on GitHub
- 🐛 Report bugs or request features via Issues
- 🍴 Fork it and contribute your own features

---
