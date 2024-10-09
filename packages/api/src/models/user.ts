import { Schema, model } from "mongoose";
import { ENCRYPTION_CONSTANTS as EC } from "../util/constants";
import bcrypt from "bcrypt";
import type { IUser } from "@seitz/shared";

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  studies: [{ type: Schema.Types.ObjectId, ref: "Study" }],
  token: { type: String },
  verified: { type: Boolean, required: true, default: false },
});

userSchema.methods.verifyPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const hashedPassword = bcrypt.hashSync(this.password, EC.SALT_ROUNDS);
    this.password = hashedPassword;
  }
  return next();
});

export const User = model<IUser>("User", userSchema);
