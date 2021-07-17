import mongoose from 'mongoose';

//Creating schema for storing messages
const messageSchema = new mongoose.Schema({
    roomId: String,
    name: String,
    message: String,
    timestamp: String,
    received: Boolean
})

export default mongoose.model('Message', messageSchema);