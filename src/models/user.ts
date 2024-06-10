import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    role: 'admin' | 'user';
    messages: string[];
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    messages: { type: [String], default: [] }
});

export default mongoose.model<IUser>('User', UserSchema);
