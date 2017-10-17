const mongoose = require('mongoose');
const config = require('./config/environment');

module.exports = () => new Promise((resolve) => {
  const connectionString = `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;
  const connectionOptions = {
    useMongoClient: true,
    keepAlive: config.db.keepAlive,
    socketTimeoutMS: config.db.timeout,
  };
  mongoose.Promise = Promise;
  mongoose.connect(connectionString, connectionOptions);
  resolve();
});
