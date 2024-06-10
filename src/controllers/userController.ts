import { Request, Response } from 'express';
import User from '../models/user';
import { wss } from '../app';
import WebSocket from 'ws';

export const sendMessage = async (req: Request, res: Response) => {
    const { userId, message } = req.body;
    const user = await User.findById(userId);

    if (user) {
        user.messages.push(message);
        await user.save();

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'newMessage', message, userId }));
            }
        });

        res.status(200).send({ success: true });
    } else {
        res.status(404).send({ success: false, message: 'User not found' });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id);
    res.status(200).send(user?.messages);
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ success: false, message: 'An error occurred while fetching users' });
    }
};
export const getUser = async (req: Request, res: Response) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send({ success: false, message: 'An error occurred' });
    }
};
