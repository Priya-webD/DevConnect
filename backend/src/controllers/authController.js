import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, bio, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, email, password: hashedPassword, bio, skills,
    });

    const userToSend = newUser.toObject();
    delete userToSend.password;

    res.status(201).json({ message: 'User created', user: userToSend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};