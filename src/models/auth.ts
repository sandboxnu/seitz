// User

import { Schema, model } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    verifyPassword: (password: string) => boolean;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

// TODO: Implement encryption
userSchema.methods.verifyPassword = function (password: string) {
    return this.password === password;
};

const User = model<IUser>("User", userSchema);

export default User;
