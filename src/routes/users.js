const Router = require('express').Router;
const UsersResponder = require('../responder/users');

const router = Router();

/**
 * GET  /users
 * POST /users
 */
router.route('/')
      .get(UsersResponder.list)
      .post(UsersResponder.create);

/**
 * GET /users/:slug
 * PUT /users/:slug
 */
router.route('/:slug')
      .get(UsersResponder.get)
      .put(UsersResponder.update)
      .delete(UsersResponder.delete);

module.exports = router;
