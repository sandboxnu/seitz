import { Schema, model } from "mongoose";

export interface IActivity {
  name: string;
}

const activitySchema = new Schema<IActivity>({
  name: { type: String, required: true}
});

const Activity = model<IActivity>('Activity', activitySchema);
