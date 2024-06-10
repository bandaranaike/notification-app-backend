import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const register = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    res.status(201).send({ success: true });
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const SECRET_KEY = process.env.JWT_SECRET_KEY || 'nm6jEOvQ9Y1xDRYV';

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
        res.status(200).send({ success: true, token });
    } else {
        res.status(401).send({ success: false, message: 'Invalid credentials' });
    }
};


