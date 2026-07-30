import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

//sign up

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

//login 

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'Invalid credentials'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        const token = jwt.sign({id: user._id},
             process.env.JWT_SECRET, {expiresIn: '7d'});

        res.status(200).json({
            token, 
            user: { id: user._id, name: user.name, email: user.email},
        });

    }catch(err){
        res.status(500).json({message: err.message});
    }
};

export const getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ user });
    }catch(err){
        res.status(500).json({message: err.message});
    }
}