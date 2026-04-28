import {MongoClient}  from 'mongodb';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const  connectToMongoDB = async () => {
const uri:string = process.env.MONGO_URI || '';
if (!uri){
  console.error('MONGO_URI is not defined in environment variables');
}
await mongoose.connect(uri)
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((err: Error) => {
    console.error('Failed to connect to MongoDB', err);
});
}