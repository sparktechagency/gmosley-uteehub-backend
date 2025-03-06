import express from 'express';
import routersVersionOne from './version1';

const routers = express.Router();

routers.use('/v1', routersVersionOne);

export default routers;
