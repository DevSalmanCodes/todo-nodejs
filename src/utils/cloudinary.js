import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
async function uploadOnCloudinary(localFilePath) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  if(!localFilePath){
    return null;
  }
    const uploadResult = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
    fs.unlinkSync(localFilePath);
    return uploadResult.url;
  } catch (err) {
    fs.unlinkSync(localFilePath);
   return null;
  }
}

export default uploadOnCloudinary;
