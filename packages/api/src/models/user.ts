import { Schema, Types, model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  verifyPassword: (password: string) => boolean;
  activitiesCreated: Types.ObjectId[];
  studies: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activitiesCreated: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
  studies: [{ type: Schema.Types.ObjectId, ref: "Study" }],
});

// TODO: Implement encryption
userSchema.methods.verifyPassword = function (password: string) {
  return this.password === password;
};

const User = model<IUser>("User", userSchema);

export default User;
