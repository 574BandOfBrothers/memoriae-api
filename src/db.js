import mongoose from 'mongoose';
import config from './config/environment';

export default () => new Promise((resolve) => {
  const connectionString = `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;
  const connectionOptions = {
    server: {
      socketOptions: {
        keepAlive: config.db.keepAlive,
        connectTimeOutMS: config.db.timeout,
      },
    },
    replset: {
      socketOptions: {
        keepAlive: config.db.keepAlive,
        connectTimeOutMS: config.db.timeout,
      },
    },
  };
  mongoose.Promise = Promise;
  mongoose.connect(connectionString, connectionOptions);
  resolve();
});
