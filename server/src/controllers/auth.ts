import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from "bcrypt";
const cloudinary = require("../configs/cloudinary.config");

/* REGISTER USER */
export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    // Upload Picture to Cloudinary and Save URL to Picture Path
    if (!req.file) {
      res.status(400).send("No Picture Uploaded");
      return;
    }

    const result = await cloudinary.uploader.upload(req.file?.path, {
      public_id: firstName+lastName,
      folder: `amigram`
    });

    // Generate salt and hash password

    // Create new User instance
    const newUser = new User({
      firstname : firstName,
      lastname : lastName,
      email,
      password,
      picturepath: result.secure_url,
      friends: friends || [],
      location,
      occupation,
      viewedprofile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Return the saved user
    res.status(201).json(savedUser);
  } catch (err:any ) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ msg: 'User does not exist.' });

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h', // Token expiration time
    });

    // Remove password before sending the user object
    const { password: _, ...userWithoutPassword } = user;

    // Return token and user data
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};