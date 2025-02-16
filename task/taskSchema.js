import mongoose from 'mongoose';
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    userId: {type: mongoose.Types.ObjectId, ref: 'users'}
});

export default mongoose.model('tasks', taskSchema)