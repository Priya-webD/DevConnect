import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        reruired: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: { 
        type: String,
         default: '' 
    },
    skills: { 
        type: [String],
        default: []
    },
    avatar: { 
        type: String,
        default: '' 
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
