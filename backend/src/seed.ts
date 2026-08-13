import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectToMongoDB } from './config/mongodb';
import User from './modules/user/user.model';
import Doctor from './modules/doctor/doctor.model';
import Appointment from './modules/appointment/appointment.model';
import Notification from './modules/notification/notification.model';
import { UserRole } from './modules/user/user.type';
import { AppointmentStatus } from './modules/appointment/appointment.types';

dotenv.config();

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToMongoDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Notification.deleteMany({});

    console.log('Creating password hashes...');
    const commonPassword = await bcrypt.hash('Password123!', 10);

    // 1. Create Admin (Ethiopian Name: Amanuel Worku)
    console.log('Seeding Admin user...');
    const adminUser = await User.create({
      name: 'Amanuel Worku',
      email: 'admin@novacare.com',
      password: commonPassword,
      phone: '0911234567',
      role: UserRole.Admin,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanuel'
    });

    // 2. Create Doctors & User Accounts (Ethiopian Names)
    console.log('Seeding Doctors...');
    const doctorUsersData = [
      {
        name: 'Dr. Abebe Bikila',
        email: 'dr.abebe@novacare.com',
        specialization: 'Cardiology',
        experience: 10,
        bio: 'Experienced Ethiopian cardiologist specializing in heart health, diagnostic imaging, and preventative care.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe'
      },
      {
        name: 'Dr. Tigist Assefa',
        email: 'dr.tigist@novacare.com',
        specialization: 'Neurology',
        experience: 12,
        bio: 'Board-certified neurologist focusing on nerve care, brain health, and cognitive wellness.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tigist'
      },
      {
        name: 'Dr. Dawit Solomon',
        email: 'dr.dawit@novacare.com',
        specialization: 'Pediatrics',
        experience: 7,
        bio: 'Compassionate Ethiopian pediatrician dedicated to infant healthcare and child development.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dawit'
      }
    ];

    const createdDoctors = [];
    for (const docData of doctorUsersData) {
      const user = await User.create({
        name: docData.name,
        email: docData.email,
        password: commonPassword,
        role: UserRole.Doctor,
        avatar: docData.avatar
      });

      const doctor = await Doctor.create({
        user: user._id,
        name: docData.name,
        email: docData.email,
        specialization: docData.specialization,
        experience: docData.experience,
        bio: docData.bio
      });

      createdDoctors.push({ user, doctor });
    }

    // 3. Create Patients (Ethiopian Names)
    console.log('Seeding Patients...');
    const patientUsersData = [
      {
        name: 'Kebede Tessema',
        email: 'kebede.t@gmail.com',
        phone: '0912345678',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kebede'
      },
      {
        name: 'Muluwork Gebre',
        email: 'muluwork.g@gmail.com',
        phone: '0923456789',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Muluwork'
      },
      {
        name: 'Yonas Alemu',
        email: 'yonas.a@gmail.com',
        phone: '0934567890',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yonas'
      }
    ];

    const createdPatients = [];
    for (const pData of patientUsersData) {
      const patient = await User.create({
        ...pData,
        password: commonPassword,
        role: UserRole.Patient
      });
      createdPatients.push(patient);
    }

    // 4. Create Appointments
    console.log('Seeding Appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsData = [
      {
        doctor: createdDoctors[0].doctor._id,
        patient: createdPatients[0]._id,
        date: today.toISOString().split('T')[0],
        time: '09:00',
        status: AppointmentStatus.Booked
      },
      {
        doctor: createdDoctors[1].doctor._id,
        patient: createdPatients[1]._id,
        date: today.toISOString().split('T')[0],
        time: '11:30',
        status: AppointmentStatus.Completed
      },
      {
        doctor: createdDoctors[2].doctor._id,
        patient: createdPatients[2]._id,
        date: tomorrow.toISOString().split('T')[0],
        time: '14:00',
        status: AppointmentStatus.Booked
      },
      {
        doctor: createdDoctors[0].doctor._id,
        patient: createdPatients[2]._id,
        date: tomorrow.toISOString().split('T')[0],
        time: '16:00',
        status: AppointmentStatus.Cancelled
      }
    ];

    const createdAppointments = await Appointment.insertMany(appointmentsData);

    // 5. Create Sample Notifications
    console.log('Seeding Notifications...');
    const notificationsData = [
      {
        user: createdDoctors[0].user._id,
        type: 'info',
        title: 'New Appointment Booked',
        message: `Kebede Tessema booked an appointment for ${today.toISOString().split('T')[0]} at 09:00`,
        isRead: false
      },
      {
        user: createdDoctors[0].user._id,
        type: 'warning',
        title: 'Appointment Cancelled',
        message: `Yonas Alemu cancelled the appointment scheduled for ${tomorrow.toISOString().split('T')[0]} at 16:00`,
        isRead: true
      },
      {
        user: createdPatients[0]._id,
        type: 'info',
        title: 'Appointment Confirmed',
        message: `Your appointment with Dr. Abebe Bikila is scheduled for ${today.toISOString().split('T')[0]} at 09:00`,
        isRead: false
      },
      {
        user: createdPatients[1]._id,
        type: 'success',
        title: 'Appointment Completed',
        message: 'Dr. Tigist Assefa marked your appointment at 11:30 as completed.',
        isRead: true
      },
      {
        user: adminUser._id,
        type: 'info',
        title: 'System Activity',
        message: 'Database seed completed with Ethiopian demo records.',
        isRead: false
      }
    ];

    await Notification.insertMany(notificationsData);

    console.log('\n==============================================');
    console.log('ETHIOPIAN DATA SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==============================================');
    console.log('Demo Login Credentials (Password for all: Password123!):');
    console.log('----------------------------------------------');
    console.log('ADMIN:');
    console.log(' - Email: admin@novacare.com  (Amanuel Worku)');
    console.log('DOCTORS:');
    console.log(' - Email: dr.abebe@novacare.com  (Dr. Abebe Bikila - Cardiology)');
    console.log(' - Email: dr.tigist@novacare.com (Dr. Tigist Assefa - Neurology)');
    console.log(' - Email: dr.dawit@novacare.com  (Dr. Dawit Solomon - Pediatrics)');
    console.log('PATIENTS:');
    console.log(' - Email: kebede.t@gmail.com  (Kebede Tessema)');
    console.log(' - Email: muluwork.g@gmail.com (Muluwork Gebre)');
    console.log(' - Email: yonas.a@gmail.com    (Yonas Alemu)');
    console.log('==============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
