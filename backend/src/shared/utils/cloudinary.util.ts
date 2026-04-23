import cloudinary from "../../config/cloudinary.config.js";
import fs from "fs/promises";

export interface UploadResult {
  public_id: string;
  secure_url: string;
}

export class CloudinaryService {
  // Upload file (from local disk - multer)
  uploadToCloudinary = async (
    filePath: string,
    folder: string = "uploads",
  ): Promise<UploadResult> => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
      });

      // delete local file AFTER successful upload
      await fs.unlink(filePath).catch(() => {
        console.warn("Failed to delete local file:", filePath);
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    } catch (error) {
      // still try deleting file even if upload fails
      await fs.unlink(filePath).catch(() => {
        console.warn(
          "Failed to delete local file after failed upload:",
          filePath,
        );
      });

      throw new Error("Cloudinary upload failed");
    }
  };

  // Delete from Cloudinary
  deleteFromCloudinary = async (url: string): Promise<void> => {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.split(".")[0];
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error("Cloudinary deletion failed");
    }
  };
}
