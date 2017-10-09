const Router = require('express').Router;

const router = Router();

// List Annotations
router.get('/', (req, res) => res.json({ annotations: '' }));

module.exports = router;
