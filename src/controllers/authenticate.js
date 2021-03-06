const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const Users = require('../models/users');


const AuthenticateController = {};


AuthenticateController.authenticate = (email_, password) => new Promise((resolve, reject) => {
  const userData = {
    email: email_,
  };

  Users.findOne(userData, (err, user) => {
    // Error
    if (err) {
      return reject({
        success: false,
        message: 'Authentication failed. Database Error!',
      });
    }

    // User not found
    if (!user) {
      return reject({
        success: false,
        message: 'Authentication failed. User not found.',
      });
    }

    // Wrong password
    if (!user.comparePassword(password)) {
      return reject({
        success: false,
        message: 'Authentication failed. Wrong password.',
      });
    }

    // Correct password
    const payload = {
      slug: user.slug,
      _id: user._id,
    };

    const secret = config.jwt.key;
    const expire = config.jwt.expire;
    const token_ = jwt.sign(payload, secret, { expiresIn: expire });

    return resolve({
      slug: user.slug,
      name: user.name,
      accessToken: token_,
    });
  }).select('+password').exec();
});


module.exports = AuthenticateController;
