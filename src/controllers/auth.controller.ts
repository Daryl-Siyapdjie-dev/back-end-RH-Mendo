import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

export const login = async (req: Request, res: Response) => {
  const { matricule, password } = req.body;
  const user = await User.findOne({ matricule });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return res.status(400).json({ message: 'Wrong password' });
  }
  const token = jwt.sign({ _id: user._id }, 'YOUR_SECRET', { expiresIn: '1d' });
  res.json({ token });
};