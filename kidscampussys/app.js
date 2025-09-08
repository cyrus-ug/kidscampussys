// app.js (excerpt)
import './scheduler/overdueReminder.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByUsername, createUser } from './models/user.js';
import { checkRole } from './middleware/rbac.js';

const app = express();
app.use(express.json());

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (!user) return res.status(401).json({message:'Invalid credentials'});

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({message:'Invalid credentials'});

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.cookie('token', token, { httpOnly:true, secure:true });
  res.json({message:'Login successful'});
});

app.post('/api/auth/signup', async (req, res) => {
  const { fullName, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      fullName,
      username,
      passwordHash: hashedPassword,
      roleId: 1, // Default to student or adjust as needed
      phone: null
    });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Protect a route
app.get('/api/dashboard', checkRole(['admin','teacher']), (req, res) => {
  res.json({ data: 'Secure dashboard data' });
});
