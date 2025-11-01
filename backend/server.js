const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


connectDB().then(() => createDefaultUsers());


async function createDefaultUsers() {
  try {
  
    const users = [
      { name: 'Super Admin', email: 'admin@hospital.com', password: 'admin123', role: 'admin', phone: '1234567890' },
      { name: 'Dr. John Smith', email: 'doctor@hospital.com', password: 'doctor123', role: 'doctor', phone: '1234567891', specialization: 'Cardiology' },
      { name: 'Dr. Emily Turner', email: 'doctor2@hospital.com', password: 'doctor234', role: 'doctor', phone: '1234567894', specialization: 'Pediatrics' },
      { name: 'Dr. Michael Lee', email: 'doctor3@hospital.com', password: 'doctor345', role: 'doctor', phone: '1234567895', specialization: 'Neurology' },
      { name: 'Nurse Sarah', email: 'nurse@hospital.com', password: 'nurse123', role: 'nurse', phone: '1234567892' },
      { name: 'Nurse Anna', email: 'nurse2@hospital.com', password: 'nurse234', role: 'nurse', phone: '1234567896' },
      { name: 'Nurse Ben', email: 'nurse3@hospital.com', password: 'nurse345', role: 'nurse', phone: '1234567897' },
      { name: 'Nurse Carlos', email: 'nurse4@hospital.com', password: 'nurse456', role: 'nurse', phone: '1234567898' },
      { name: 'Receptionist Mary', email: 'reception@hospital.com', password: 'reception123', role: 'receptionist', phone: '1234567893' },
    ];

    for (let u of users) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashedPassword });
      
      }
    }

  } catch (error) {
    console.error(' Error creating default users:', error);
  }
}


app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/documents', require('./routes/documents'));


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hospital Management System API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
