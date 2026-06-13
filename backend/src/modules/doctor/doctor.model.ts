import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
    },
    bio: {
        type: String,
        default: ""
    },
    experience: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;