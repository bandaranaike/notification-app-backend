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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = new user_1.default({ username, password: hashedPassword, role });
    yield user.save();
    res.status(201).send({ success: true });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield user_1.default.findOne({ username });
    const SECRET_KEY = process.env.JWT_SECRET_KEY || 'nm6jEOvQ9Y1xDRYV';
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, SECRET_KEY);
        res.status(200).send({ success: true, token });
    }
    else {
        res.status(401).send({ success: false, message: 'Invalid credentials' });
    }
});
exports.login = login;
