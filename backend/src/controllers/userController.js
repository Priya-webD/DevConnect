import User from '../models/User.js';

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, skills, avatar } = req.body;

    if (bio && bio.length > 300) {
      return res.status(400).json({ message: 'Bio must be under 300 characters' });
    }
    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, skills, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.skill) filter.skills = req.query.skill;
    const users = await User.find(filter).select('-password');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};