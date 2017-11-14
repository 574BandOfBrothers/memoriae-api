const Router = require('express').Router;

const users = require('./users');
const annotations = require('./annotations');

const routes = () => {
  const api = Router();

  api.get('/', (req, res) => res.json({ 'Don\'t Worry': 'All is Well!' }));

  api.use('/users', users);
  api.use('/annotations', annotations);

  // Not Found
  api.all('*', (req, res) => {
    res.sendStatus(404);
  });

  return api;
};

module.exports = routes;
