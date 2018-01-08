const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const authenticatedMethods = ['POST', 'PUT', 'DELETE'];
const fullValidationPaths = ['me'];

const User = require('../models/users');

const authMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV.indexOf('test') >= 0) {
    return next();
  }

  const path = req.path.split('/')[1];

  if (path === 'users' && req.method === 'POST') {
    return next();
  }

  const shouldValidate = authenticatedMethods.indexOf(req.method) > -1 ||
    fullValidationPaths.indexOf(path) > -1;

  if (shouldValidate) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.boom.unauthorized();
    }

    const authParts = authHeader.split(' ');

    if (authParts.length !== 2) {
      return res.boom.unauthorized();
    }

    if (!(/^Bearer$/i.test(authParts[0]))) {
      return res.boom.unauthorized();
    }

    const token = authParts[1];

    jwt.verify(token, config.jwt.key, (jwtError, decoded) => {
      if (jwtError) {
        return res.boom.unauthorized();
      }

      User.findById(decoded._id, '-password -__v', (findUserError, user) => {
        if (findUserError || user === null) {
          return res.boom.unauthorized();
        }

        req.user = user;
        return next();
      });
    });
  } else {
    return next();
  }
};

module.exports = authMiddleware;
