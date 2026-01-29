import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import "dotenv/config.js"

cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME!, 
        api_key: process.env.API_KEY!, 
        api_secret: process.env.API_SECRET!
        });

export const uploadOnCloudinary = async (localFilePath: any) => {
    try {
        if(!localFilePath) return null;

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file uploaded successfully
        console.log("File uploaded successfully ", response);
        return response;
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }
        console.log("error ", error);
    }
}