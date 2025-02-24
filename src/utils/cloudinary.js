import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
async function uploadOnCloudinary(localFilePath) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    if (!localFilePath) {
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    return null;
  }
}

async function deleteCloudinaryFile(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    return false;
  }
}

export  {uploadOnCloudinary, deleteCloudinaryFile};
