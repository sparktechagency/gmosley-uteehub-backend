// import fs from 'fs';
// import path from 'path';
// import { FileArray, UploadedFile } from 'express-fileupload';
// import CustomError from '../app/errors';
// import config from '../config';

// interface FileUploader {
//   (files: FileArray, directory: string, imageName: string): Promise<string | string[]>;
// }

// const fileUploader: FileUploader = async (files, directory, imageName) => {
//   // check the file
//   if (!files || Object.keys(files).length === 0) {
//     throw new CustomError.NotFoundError('No files were uploaded!');
//   }

//   const folderPath = path.join('uploads', directory);

//   // Ensure the directory exists, if not, create it
//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath, { recursive: true });
//   }

//   // check one image or two image
//   if (!Array.isArray(files[imageName])) {
//     const file = files[imageName] as UploadedFile;
//     const fileName = file.name;
//     const filePath = path.join(folderPath, fileName);
//     await file.mv(filePath);

//     return `${config.server_url}/v1/${filePath}`;
//   } else if (files[imageName].length > 0) {
//     // Handle multiple file uploads
//     const filePaths: string[] = [];
//     for (const item of files[imageName] as UploadedFile[]) {
//       const fileName = item.name;
//       const filePath = path.join(folderPath, fileName);
//       await item.mv(filePath);
//       filePaths.push(`${config.server_url}/v1/${filePath}`); // Collect all file paths
//     }

//     return filePaths;
//   } else {
//     throw new CustomError.BadRequestError('Invalid file format!');
//   }
// };

// export default fileUploader;

// ............................................upload file to s3 bucket...............................................

import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { FileArray } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import CustomError from '../app/errors';

const s3 = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  maxAttempts: 5, // retries on failure
  requestHandler: undefined, // default NodeHttpHandler
});

const fileUploader = async (files: FileArray, directory: string, imageName: string): Promise<string | string[]> => {
  if (!files || Object.keys(files).length === 0) {
    throw new CustomError.NotFoundError('No files were uploaded!');
  }

  const fileItems = Array.isArray(files[imageName]) ? files[imageName] : [files[imageName]];

  if (!fileItems || fileItems.length === 0) {
    throw new CustomError.BadRequestError('Invalid file format!');
  }

  const uploadedUrls: string[] = [];

  for (const file of fileItems) {
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const s3Key = `${directory}/${uniqueFileName}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.BUCKET!,
      Key: s3Key,
      Body: file.data,
      ContentType: file.mimetype || 'application/octet-stream',
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      // Fixed URL generation
      const url = `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/${s3Key}`;
      uploadedUrls.push(url);
    } catch (error: any) {
      console.error('S3 upload error:', error.message || error);
      throw new CustomError.BadRequestError(`Failed to upload file "${file.name}" to S3!`);
    }
  }

  return uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls;
};

export default fileUploader;
