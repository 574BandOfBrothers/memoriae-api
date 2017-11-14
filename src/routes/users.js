const Router = require('express').Router;
const UsersResponder = require('../responder/users');

const router = Router();

/**
 *  Set standart response headers to all annotation routes
 */
router.use('*', UsersResponder.header);

/**
 * GET & POST /users
 */
router.route('/')
      .get(UsersResponder.list)
      .post(UsersResponder.create);

/**
 * GET /users/:userId
 */
// router.route('/:annotationId')
//       .get(UsersResponder.get);

module.exports = router;
