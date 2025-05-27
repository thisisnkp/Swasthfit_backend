// authController.js
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;

    if (role === 'user') {
      newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'user'
      });
    } else if (role === 'restaurant') {
      newUser = new Restaurant({
        name,
        email,
        password: hashedPassword,
        role: 'restaurant'
      });
    } else if (role === 'admin') {
      newUser = new Admin({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    await newUser.save();

 
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email:username, password } = req.body;

    let user = await User.findOne({ email });
    
    if (!user) {
      user = await Restaurant.findOne({ email });
    }
    
    if (!user) {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// वर्तमान यूजर की जानकारी प्राप्त करें
exports.getCurrentUser = async (req, res) => {
  try {
    let user;
    
    if (req.user.role === 'user') {
      user = await User.findById(req.user.id).select('-password');
    } else if (req.user.role === 'restaurant') {
      user = await Restaurant.findById(req.user.id).select('-password');
    } else if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};