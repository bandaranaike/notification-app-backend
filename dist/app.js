"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const ws_1 = require("ws");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
// Allow requests from http://localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // For legacy browser support
};
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use('/api/users', userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
const server = (0, http_1.createServer)(app);
exports.server = server;
const wss = new ws_1.Server({ server });
exports.wss = wss;
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });
});
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
