import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { env } from '../config/env.config.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

/**
 * Uploads a local file to Cloudinary.
 * @param {string} localFilePath - Path to the local file.
 * @returns {Promise<object|null>} Cloudinary response object or null if failed.
 */
export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // File has been uploaded successfully
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload operation failed
    console.error('Cloudinary upload failed:', error);
    return null;
  }
};

/**
 * Deletes a file from Cloudinary.
 * @param {string} publicId - Public ID of the file to delete.
 * @param {string} resourceType - Type of resource ('image', 'video', etc.).
 * @returns {Promise<object|null>} Cloudinary response object or null if failed.
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return response;
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    return null;
  }
};
