import { Schema, model } from "mongoose";
import { ENCRYPTION_CONSTANTS as EC } from "../util/constants";
import bcrypt from "bcrypt";
import { Role, type IUser } from "@seitz/shared";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: function () {
      return this.verified === true;
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(Role),
    required: true,
    default: Role.BasicUser,
  },
  studies: [{ type: Schema.Types.ObjectId, ref: "Study" }],
  //idk if this is too convoluted
  recentStudyIds: {
    type: [String],
    default: null,
    set: (val: unknown) => {
      if (val == null) return null;
      if (!Array.isArray(val)) return [];
      // takes the last 3 unique IDs with newest first
      // Example: input [a,b,a,c,b] -> result [b,c,a]
      const arr = (val as unknown[]).map((v) => String(v)).filter(Boolean);
      const seen = new Set<string>();
      const recentStudyIds: string[] = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        const id = arr[i];
        if (!seen.has(id)) {
          seen.add(id);
          recentStudyIds.push(id); // push to collect in reverse order
        }
      }
      return recentStudyIds.slice(0, 3); // in newest-first order
    },
  },
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
