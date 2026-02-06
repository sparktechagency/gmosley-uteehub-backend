import mongoose from 'mongoose';
import config from './config';
import app from './app';
import http from 'http';
import { initSocket } from './app/socket/config.socket';
import cron from 'node-cron';
import orderServices from './app/modules/orderModule/order.services';

// let server: any;
const server = http.createServer(app);

initSocket(server);

// handle uncaught exception error
process.on('uncaughtException', (error) => {
  console.log('uncaughtException error', error);
  process.exit(1);
});

// schedully update order status (make cancelled when order is past using node-cron)
cron.schedule('0 0 * * *', async () => {
  await orderServices.updateAllPastOrders();
  console.log(`[CRON] Cancelled overdue orders`);

  await orderServices.autoAcceptDeliveredOrders();
  console.log(`[CRON] Auto accepted overdue orders`);
});

const startServer = async () => {
  await mongoose.connect(config.mongodb_url as string);
  console.log('\x1b[36mDatabase connection successfull\x1b[0m');

  server.listen(config.server_port || 5007, () => {
    console.log('baseUrl:', `http://localhost:${config.server_port}/v1`);
    console.log(`\x1b[32mServer is listening on port ${config.server_port || 5007}\x1b[0m`);
  });
};

// handle unhandled rejection
process.on('unhandledRejection', (reason, promise) => {
  console.log(`unhandle rejection at ${promise} and reason ${reason}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// gracefull shoutdown on SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
  server.close(() => {
    console.log('Server closed.');
  });
});

startServer();
