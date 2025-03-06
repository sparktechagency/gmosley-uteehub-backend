import morgan, { StreamOptions } from 'morgan';
import config from './index';
import logger from './logger';
import { Request, Response } from 'express';

morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

const getIpFormat = (): string => (config.node_env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const stream: StreamOptions = {
  write: (message: string) => logger.info(message.trim()),
};

const errorStream: StreamOptions = {
  write: (message: string) => logger.error(message.trim()),
};

export const successHandler = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode >= 400,
  stream,
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 400,
  stream: errorStream,
});
