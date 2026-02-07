import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import notFound from './app/middlewares/notFound';
import routers from './app/routers';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { errorHandler, successHandler } from './config/morgan';
import CustomError from './app/errors';
import rootDesign from './app/middlewares/rootDesign';
import { applyRateLimit } from './config/rateLimit.config';
import { helmetConfig } from './config/helmet.config';
import { compressionOptions } from './config/compression.config';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

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
app.use(compression(compressionOptions));
app.use(helmetConfig);
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 5 MB
    abortOnLimit: true, // IMPORTANT
    // createParentPath: true,
  }),
);

app.use('/v1/uploads', express.static(path.join('uploads')));
app.use(applyRateLimit());

// application middleware
app.use('/', routers);

// send html design with a button 'click to see server health' and integrate an api to check server healthh
app.get('/', rootDesign);

// swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
