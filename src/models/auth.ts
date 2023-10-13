// User

import { Schema, model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = model<IUser>('User', userSchema);

export default User;
