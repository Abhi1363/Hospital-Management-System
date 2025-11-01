


## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Navigate to backend folder:**
```bash
mkdir hospital-management-system
cd hospital-management-system
mkdir backend
cd backend
```

2. **Initialize and install dependencies:**
```bash
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors multer express-validator
npm install -D nodemon
```

3. **Create .env file:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hospital_db
JWT_SECRET=your_super_secret_key_here_change_in_production
NODE_ENV=development
```

4. **Update package.json scripts:**
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Frontend Setup

1. **Create Vite React app:**
```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom
```

2. **Create .env file:**
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## Default Login Credentials

After starting the backend, these users are auto-created:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Nurse | nurse@hospital.com | nurse123 |
| Receptionist | reception@hospital.com | reception123 |














## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Super Admin, Admin, Doctor, Patient, Nurse, Receptionist)
- Secure password hashing with bcrypt

### User Management
- CRUD operations for users
- Different dashboards per role
- User search and pagination

### Patient Management
- Add, edit, delete patients
- View patient history
- Search and filter patients

### Appointment Management
- Schedule appointments
- View/manage appointments
- Status tracking (Scheduled, Completed, Cancelled)

### Document Management
- Upload medical documents (PDF, images)
- View/download documents
- Role-based document access
- File size validation (max 5MB)

### Analytics Dashboard
- Total patients count
- Appointments today
- Total doctors
- Quick stats overview

### Additional Features
- Global search functionality
- Pagination for all lists
- Form validation (frontend + backend)
- Responsive UI design
- Loading states and error handling

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users` - Get all users (Admin only)
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Patients
- GET `/api/patients` - Get all patients
- POST `/api/patients` - Create patient
- GET `/api/patients/:id` - Get patient by ID
- PUT `/api/patients/:id` - Update patient
- DELETE `/api/patients/:id` - Delete patient

### Appointments
- GET `/api/appointments` - Get all appointments
- POST `/api/appointments` - Create appointment
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Delete appointment

### Documents
- GET `/api/documents` - Get all documents
- POST `/api/documents` - Upload document
- GET `/api/documents/:id` - Download document
- DELETE `/api/documents/:id` - Delete document

## Tech Stack

- **Frontend:** React + Vite, React Router, Context API, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer
- **Styling:** CSS (custom, responsive)

## Security Features

- Password hashing
- JWT token authentication
- Protected routes
- Role-based permissions
- Input validation