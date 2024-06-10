"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getMessages = exports.sendMessage = void 0;
const user_1 = __importDefault(require("../models/user"));
const app_1 = require("../app");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, message } = req.body;
    const user = yield user_1.default.findById(userId);
    if (user) {
        user.messages.push(message);
        yield user.save();
        app_1.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'newMessage', message }));
            }
        });
        res.status(200).send({ success: true });
    }
    else {
        res.status(404).send({ success: false, message: 'User not found' });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.status(200).send(user === null || user === void 0 ? void 0 : user.messages);
});
exports.getMessages = getMessages;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).send({ success: false, message: 'An error occurred while fetching users' });
    }
});
exports.getAllUsers = getAllUsers;
