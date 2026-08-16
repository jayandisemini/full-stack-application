import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    columnId: { type: String, enum: ['backlog', 'todo', 'inprogress', 'completed'], default: 'backlog' },
    priority: { type: String, enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
    category: { type: String, default: 'Frontend' },
    assigneeId: { type: String },
    assigneeName: { type: String },
    dueDate: { type: String, default: 'Aug 30, 2026' },
    storyPoints: { type: Number, default: 5 },
    isOverdue: { type: Boolean, default: false },
    notice: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
