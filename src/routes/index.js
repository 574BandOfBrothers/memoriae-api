const Router = require('express').Router;

const authenticate = require('./authenticate');
const authMiddleware = require('../middlewares/auth');

const users = require('./users');
const annotations = require('./annotations');
const stories = require('./stories');
const uploads = require('./uploads');
const me = require('./me');

const routes = () => {
  const api = Router();

  api.get('/', (req, res) => res.json({ 'Don\'t Worry': 'All is Well!' }));

  api.use('/authenticate', authenticate);
  api.use('/users', users);
  api.use('/annotations', annotations);

  // Authenticated Routes
  api.use(authMiddleware);
  api.use('/stories', stories);
  api.use('/me', me);
  api.use('/uploads', uploads);

  // Not Found
  api.all('*', (req, res) => {
    res.sendStatus(404);
  });

  return api;
};

module.exports = routes;
