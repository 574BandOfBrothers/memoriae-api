const Router = require('express').Router;

const annotations = require('./annotations');
const stories = require('./stories');

const routes = () => {
  const api = Router();

  api.get('/', (req, res) => res.json({ 'Don\'t Worry': 'All is Well!' }));

  api.use('/annotations', annotations);
  api.use('/stories', stories);

  // Not Found
  api.all('*', (req, res) => {
    res.sendStatus(404);
  });

  return api;
};

module.exports = routes;
