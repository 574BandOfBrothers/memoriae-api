const mongoose = require('mongoose');
const config = require('./config/environment');

module.exports = () => new Promise((resolve, reject) => {
  let connectionString;

  switch (process.env.NODE_ENV) {
    case 'docker':
      connectionString = 'mongodb://mongo:27017';
      break;
    case 'test_docker':
      connectionString = 'mongodb://mongo:27017/test';
      break;
    default:
      connectionString = `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;
  }

  const connectionOptions = {
    useMongoClient: true,
    keepAlive: config.db.keepAlive,
    socketTimeoutMS: config.db.timeout,
  };

  mongoose.Promise = Promise;

  const connection = mongoose.connect(connectionString, connectionOptions);

  connection.on('error', reject);
  connection.once('open', resolve);
});
