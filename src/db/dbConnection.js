import mongoose from "mongoose";

async function connectDb(uri) {
  try {
    const dbInstance = await mongoose.connect(uri);
    console.log(`🔗 MongoDb connected!: ${dbInstance}`);
  } catch (err) {
    console.log(`Error while connecting mongoDb!: `, err);
    process.exit(1);
  }
}

export default connectDb;
