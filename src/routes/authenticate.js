const Router = require('express').Router;
const AuthenticateResponder = require('../responder/authenticate');

const router = Router();

/**
 * POST /authenticate
 */
router.route('/')
      .post(AuthenticateResponder.authenticate);

module.exports = router;
