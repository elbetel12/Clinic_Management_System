import Doctor from './doctor.model';
import User from '../user/user.model';
import bcrypt from 'bcrypt';
import { CreateDoctorInput } from './doctor.types';
import { UserRole } from '../user/user.type';

export const createDoctorByAdmin = async (doctorData: { name: string; email: string; specialization: string; password?: string }) => {
    // 1. Create the User account first
    const existingUser = await User.findOne({ email: doctorData.email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const defaultPassword = doctorData.password || 'Doctor@123'; // Default password if not provided
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const newUser = new User({
        name: doctorData.name,
        email: doctorData.email,
        password: passwordHash,
        role: UserRole.Doctor
    });
    await newUser.save();

    // 2. Create the Doctor profile linked to the User
    const newDoctor = new Doctor({
        user: newUser._id,
        name: doctorData.name,
        email: doctorData.email,
        specialization: doctorData.specialization
    });
    await newDoctor.save();

    return { doctor: newDoctor, user: newUser, tempPassword: defaultPassword };
}

export const createDoctor = async (doctorData: CreateDoctorInput) => {
    const { userId, ...rest } = doctorData;
    const newDoctor = new Doctor({
        user: userId,
        ...rest
    });
    await newDoctor.save();
    return newDoctor;
}

export const getDoctors = async () => {
    const doctors = await Doctor.find().populate('user');

    // Safety check/Sync: ensure doctors have email if it was missing from older versions
    for (const doc of doctors) {
        if (!doc.email && (doc.user as any)?.email) {
            doc.email = (doc.user as any).email;
            await (doc as any).save();
        }
    }

    return doctors;
}

export const updateDoctorProfile = async (userId: string, data: { bio?: string; experience?: number; specialization?: string; name?: string }) => {
    return await Doctor.findOneAndUpdate(
        { user: userId },
        { $set: data },
        { returnDocument: 'after', runValidators: true }
    ).populate('user');
}