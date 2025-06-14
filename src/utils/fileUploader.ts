import fs from 'fs';
import path from 'path';
import { FileArray, UploadedFile } from 'express-fileupload';
import CustomError from '../app/errors';
import config from '../config';

interface FileUploader {
  (files: FileArray, directory: string, imageName: string): Promise<string | string[]>;
}

const fileUploader: FileUploader = async (files, directory, imageName) => {
  // check the file
  if (!files || Object.keys(files).length === 0) {
    throw new CustomError.NotFoundError('No files were uploaded!');
  }

  const folderPath = path.join('uploads', directory);

  // Ensure the directory exists, if not, create it
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // check one image or two image
  if (!Array.isArray(files[imageName])) {
    const file = files[imageName] as UploadedFile;
    const fileName = file.name;
    const filePath = path.join(folderPath, fileName);
    await file.mv(filePath);

    return `${config.server_url}/v1/${filePath}`;
  } else if (files[imageName].length > 0) {
    // Handle multiple file uploads
    const filePaths: string[] = [];
    for (const item of files[imageName] as UploadedFile[]) {
      const fileName = item.name;
      const filePath = path.join(folderPath, fileName);
      await item.mv(filePath);
      filePaths.push(`${config.server_url}/v1/${filePath}`); // Collect all file paths
    }

    return filePaths;
  } else {
    throw new CustomError.BadRequestError('Invalid file format!');
  }
};

export default fileUploader;
