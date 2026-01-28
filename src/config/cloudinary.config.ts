import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import "dotenv/config.js"

const uploadOnCloudinary = async (localFilePath: any) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME!, 
        api_key: process.env.API_KEY!, 
        api_secret: process.env.API_SECRET!
        });
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
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        console.log("error ", error);
        return null;
    }
}