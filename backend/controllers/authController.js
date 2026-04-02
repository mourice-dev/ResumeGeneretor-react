import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  const { full_name, email, password } = req.body;
  try {
    const userExists = await sql.unsafe('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await sql.unsafe(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [full_name, email, hashedPassword]
    );

    res.status(201).json({
      id: newUser[0].id,
      full_name,
      email,
      token: generateToken(newUser[0].id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await sql.unsafe('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userResult = await sql.unsafe(
      'SELECT id, full_name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.length > 0) {
      res.json(userResult[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
