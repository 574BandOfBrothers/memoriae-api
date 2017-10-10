const Router = require('express').Router;

const annotations = require('./annotations');

const routes = () => {
  const api = Router();

  api.get('/', (req, res) => res.json({ 'Don\'t Worry': 'All is Well!' }));

  // Test jenkins pr hook
  api.use('/annotations', annotations);

  // Not Found
  api.all('*', (req, res) => {
    res.sendStatus(404);
  });

  return api;
};

module.exports = routes;
