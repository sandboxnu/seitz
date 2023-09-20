// Example model

import { Schema, model, connect } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const User = model<IUser>('User', userSchema);

export default User;
