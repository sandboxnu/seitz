import { Schema, Types, model } from "mongoose";
import { ENCRYPTION_CONSTANTS as EC } from "../util/constants";
import bcrypt from "bcrypt";

export interface IUser {
  email: string;
  password: string;
  verifyPassword: (password: string) => Promise<boolean>;
  activitiesCreated: Types.ObjectId[];
  studies: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activitiesCreated: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
  studies: [{ type: Schema.Types.ObjectId, ref: "Study" }],
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

const User = model<IUser>("User", userSchema);

export default User;
