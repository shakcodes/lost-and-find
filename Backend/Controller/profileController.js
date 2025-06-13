import User from '../Models/userSchema.js';

export const getProfile = async (req, res) => {
    try {
      console.log('Request params:', req.params); // Debug log
      console.log('Request user:', req.user); // Debug log
      
      const user = await User.findById(req.params.userId).select('-__v');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { name, bio, avatar },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
