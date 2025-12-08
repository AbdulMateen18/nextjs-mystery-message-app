import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Exit with failure
    process.exit(1);
  }
}

export default dbConnect;
