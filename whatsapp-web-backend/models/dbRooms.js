import mongoose from 'mongoose';

//Creating schema for storing messages
const roomSchema = mongoose.Schema({
    name: String,
    image: String
})

export default mongoose.model('Room', roomSchema);