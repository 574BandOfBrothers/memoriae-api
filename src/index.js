const http = require('http');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const boom = require('express-boom');

const config = require('./config/environment');
const initializeDb = require('./db');
const routes = require('./routes');

let isShuttingDown = false;
// Test Jenkins PR
const app = express();
app.disable('x-powered-by');
app.server = http.createServer(app);

// Third party middlewares
app.use(boom());
app.use(compression());
app.use(cors(config.cors));
app.use(bodyParser.json({
  limit: config.body.limit,
}));

// Shutdown Proccess
app.use((req, res, next) => {
  if (!isShuttingDown) {
    return next();
  }
  res.set('Connection', 'close');
  return res.sendStatus(503);
});

initializeDb()
.then(() => {
  app.use('/', routes(app));

  app.use('*', (req, res) => {
    res.boom.notFound();
  });

  app.server.listen(process.env.PORT || config.env.port);

  if (process.env.NODE_ENV === 'development') {
    console.log(`Started on port ${config.env.port}`); // eslint-disable-line no-console
  }
});

const gracefullShutdown = () => {
  if (!config.env.gracefullShutdown) {
    return process.exit();
  }

  if (isShuttingDown) {
    return false;
  }

  isShuttingDown = true;

  setTimeout(() => process.exit(1), config.env.gracefullTimeout);
  app.server.close(() => process.exit());

  return true;
};

process.on('SIGINT', gracefullShutdown);
process.on('SIGTERM', gracefullShutdown);

module.exports = app;
