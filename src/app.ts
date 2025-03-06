import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import config from './config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import rateLimit from 'express-rate-limit';
import notFound from './app/middlewares/notFound';
import routers from './app/routers';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { errorHandler, successHandler } from './config/morgan';
import logger from './config/logger';
import CustomError from './app/errors';
import rootDesign from './app/middlewares/rootDesign';

const app: Application = express();

// global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.node_env !== 'test') {
  app.use(successHandler);
  app.use(errorHandler);
}

app.use(cookieParser());
app.use(fileUpload());
app.use('/v1/uploads', express.static(path.join('uploads')));
const limiter = rateLimit({
  max: 150,
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many request found from your IP. Please try again after 15 minutes.',
});
// app.use(limiter);

// application middleware
app.use('/', routers);

// send html design with a button 'click to see server health' and integrate an api to check server health
app.get('/', rootDesign);

app.get('/health_check', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Welcome to the server. Server health is good.',
  });
});

// Example error logging
app.get('/error', (req, res, next) => {
  next(new CustomError.BadRequestError('Testin error'));
});

app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end(); // No Content
});

// Error handling middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;
