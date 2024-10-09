// Example model

import { Schema, model } from "mongoose";
import type { ICar } from "@seitz/shared";

const carSchema = new Schema<ICar>({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  miles: { type: Number, required: true },
});

export const Car = model<ICar>("Car", carSchema);
