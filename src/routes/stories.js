const Router = require('express').Router;

const StoryController = require('../controllers/story');

const router = Router();

// List Storys
router.get('/', (req, res) => {
  StoryController.list()
  .then(storys => res.json(storys))
  .catch(error => res.boom.badImplementation(error.message));
});

// Get Story
router.get('/:storyId', (req, res) => {
  const storyId = req.params.storyId;

  StoryController.get(storyId)
  .then(story => res.json(story))
  .catch(error => res.boom.badImplementation(error.message));
});

// Create Story
router.post('/', (req, res) => {
  const data = req.body;

  if (req.user) {
    data.creator = req.user._id;
  }

  StoryController.create(data)
  .then(story => res.status(201).json(story))
  .catch(error => res.boom.badImplementation(error.message));
});

// Update Story
router.put('/:storyId', (req, res) => {
  const storyId = req.params.storyId;
  const data = req.body;

  if (Object.prototype.hasOwnProperty.call(data, '_id')) {
    delete data._id;
  }

  StoryController.update(storyId, data)
  .then(story => res.json(story))
  .catch(error => res.boom.badImplementation(error.message));
});

// Delete Story
router.delete('/:storyId', (req, res) => {
  const storyId = req.params.storyId;

  StoryController.delete(storyId)
  .then(story => res.json(story))
  .catch(error => res.boom.badImplementation(error.message));
});

module.exports = router;
