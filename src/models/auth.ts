// User

import { Schema, model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface IUser {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
const User = model<IUser>('User', userSchema);

export default User;
