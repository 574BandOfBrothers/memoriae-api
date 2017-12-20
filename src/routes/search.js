const Router = require('express').Router;
const SearchController = require('../controllers/search');

const router = Router();

/**
 * GET  /search?query
 */
router.get('/', (req, res) => {
  SearchController.search(req.query.query)
  .then(storys => res.json(storys))
  .catch(error => res.boom.badImplementation(error.message));
});

module.exports = router;
