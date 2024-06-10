import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'ws';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

// Allow requests from http://localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // For legacy browser support
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const server = createServer(app);
const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });
});

mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

export { app, server, wss };
