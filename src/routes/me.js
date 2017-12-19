const Router = require('express').Router;

const StoryController = require('../controllers/story');

const router = Router();

// Get Profile Info
router.get('/', (req, res) => {
  if (req.user) {
    return res.json(req.user);
  }
  res.boom.unauthorized();
});

// Get User Profiles
router.get('/stories', (req, res) => {
  if (req.user) {
    return StoryController.getByCreator(req.user._id)
    .then(stories => res.json(stories))
    .catch(error => res.boom.badImplementation(error.message));
  }
  res.boom.unauthorized();
});

module.exports = router;
