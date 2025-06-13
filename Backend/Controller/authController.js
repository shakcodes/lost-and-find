import bcrypt from 'bcryptjs';
import User from "../Models/userSchema.js";
import jwt from 'jsonwebtoken';
import validator from 'validator';
import dotenv from 'dotenv';
dotenv.config();

// ========== SIGNUP ==========
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: validator.escape(name),
      email: validator.normalizeEmail(email),
      password: hashedPassword
    });

    // Generate token
    const token = user.getJwtToken();

    // Set cookie
    const cookieOptions = {
      expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES || 3) * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = user.getJwtToken();
    user.password = undefined;

    const cookieOptions = {
      expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES || 3) * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict',
      domain: process.env.COOKIE_DOMAIN || 'localhost'
    });

    return res.status(200).json({ 
      success: true,
      message: "Logout successful" 
    });

  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error"
    });
  }
};
