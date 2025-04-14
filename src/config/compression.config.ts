import compression, { CompressionOptions } from 'compression';
import { Request, Response } from 'express';

export const compressionOptions: CompressionOptions = {
  threshold: 2048, // Only compress responses larger than 2KB
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
};

export const applyCompression = () => compression(compressionOptions);
