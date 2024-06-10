"use strict";
// src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
app.use(express_1.default.json());
const users = [
    { username: 'admin', password: bcryptjs_1.default.hashSync('admin123', 8), role: 'admin' },
    { username: 'user', password: bcryptjs_1.default.hashSync('user123', 8), role: 'user' }
];
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && bcryptjs_1.default.compareSync(password, user.password)) {
        const token = jsonwebtoken_1.default.sign({ username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    }
    else {
        res.status(401).send('Invalid credentials');
    }
});
wss.on('connection', (ws) => {
    console.log('Client connected');
});
app.post('/notify', (req, res) => {
    const { message } = req.body;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message }));
        }
    });
    res.send('Notification sent');
});
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
