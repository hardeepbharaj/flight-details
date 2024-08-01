import mongoose, { Document, Schema } from 'mongoose';

export interface LaunchDocument extends Document {
  flight_number: number;
  name: string;
  date_utc: Date;
}

const launchSchema = new Schema({
  flight_number: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  date_utc: {
    type: Date,
    required: true 
  },
}, { timestamps: true });

const Launch = mongoose.model<LaunchDocument>('launch', launchSchema);

export default Launch;