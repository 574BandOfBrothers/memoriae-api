const Router = require('express').Router;
const authMiddleware = require('../middlewares/auth');

const authenticate = require('./authenticate');
const users = require('./users');
const annotations = require('./annotations');
const stories = require('./stories');
const uploads = require('./uploads');


const routes = (app) => {
  if (process.env.NODE_ENV.indexOf('test') < 0) {
    app.use(authMiddleware());
  }

  const api = Router();

  api.get('/', (req, res) => res.json({ 'Don\'t Worry': 'All is Well!' }));

  api.use('/authenticate', authenticate);
  api.use('/users', users);
  api.use('/annotations', annotations);
  api.use('/stories', stories);
  api.use('/uploads', uploads);

  // Not Found
  api.all('*', (req, res) => {
    res.sendStatus(404);
  });

  return api;
};

module.exports = routes;
