import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: 'Software Engineer' },
    initials: { type: String, default: 'TM' },
    color: { type: String, default: '#8b5cf6' },
    status: { type: String, enum: ['online', 'offline'], default: 'online' },
    activeTasksCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Member', memberSchema);
