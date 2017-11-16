const Router = require('express').Router;

const UploadController = require('../controllers/upload');

const router = Router();

// Get signed Url
router.get('/request', (req, res) => {
  UploadController.getSignedUrl({
    prefix: 'story',
  })
  .then(data => res.json(data))
  .catch(error => res.json(error.message));
});

module.exports = router;
