import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ success: false, message: 'No token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).send({ success: false, message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ success: false, message: 'Invalid token' });
    }
};
