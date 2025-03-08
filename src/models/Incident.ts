import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Incident document
export interface IIncident extends Document {
  title: string;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  dogBreed: string;
  severity: 'low' | 'medium' | 'high';
  date: Date;
  reportedBy: mongoose.Types.ObjectId;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const IncidentSchema = new Schema<IIncident>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    dogBreed: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    date: {
      type: Date,
      required: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export default mongoose.model<IIncident>('Incident', IncidentSchema); 