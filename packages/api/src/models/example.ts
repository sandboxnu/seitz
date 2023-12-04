// Example model

import { Schema, model } from "mongoose";

export interface ICar {
  make: string;
  model: string;
  year: number;
  miles: number;
}

const carSchema = new Schema<ICar>({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  miles: { type: Number, required: true },
});

export const Car = model<ICar>("Car", carSchema);
