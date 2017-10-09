const http = require('http');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config/environment');

const routes = require('./routes');

let isShuttingDown = false;

const app = express();
app.disable('x-powered-by');
app.server = http.createServer(app);

// Third party middlewares
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

// Routes
app.use('/', routes(app));

app.server.listen(config.env.port);

if (process.env.NODE_ENV === 'development') {
  console.log(`Started on port ${config.env.port}`); // eslint-disable-line no-console
}

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
