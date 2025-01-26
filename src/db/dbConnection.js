import mongoose from "mongoose";

async function connectDb() {
  try {
    const dbInstance = await mongoose
      .connect(process.env.MONGO_DB_URI)
      console.log(`🔗 MongoDb connected!: ${dbInstance}`);
  } catch (err) {
    console.log(`Error connecting mongoDb!: `,err);
    process.exit(1);
  }
}

export default connectDb;