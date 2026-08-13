import dotenv from 'dotenv';
import { connectToMongoDB } from './src/config/mongodb';
import {server} from "./src/app"
dotenv.config();


const startserver = async () => {
  try {
    await connectToMongoDB();
    const PORT = process.env.PORT || 3000;
    
    server.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}`);
    });
  } catch (error : Error | unknown) {
    console.error('Failed to start server:', error instanceof Error ? error.message : 'An unexpected error occurred');
    process.exit(1);
  }
}

startserver();