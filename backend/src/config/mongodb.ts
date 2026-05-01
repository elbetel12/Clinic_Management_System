import mongoose from 'mongoose';

export const connectToMongoDB = async () => {
  const uri: string = process.env.MONGO_URI || '';

  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(uri);

    console.log('Connected to MongoDB successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB runtime error:', err);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
};