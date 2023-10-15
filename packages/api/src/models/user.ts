import { Schema, Types, model } from "mongoose";

export interface IUser {
  activitiesCreated: Types.ObjectId[];
  studies: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  activitiesCreated: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
  studies: [{ type: Schema.Types.ObjectId, ref: "Study" }],
});

const User = model<IUser>("User", userSchema);

export default User;
