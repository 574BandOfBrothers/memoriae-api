// const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const Users = require('../models/users');

const UsersController = {};

UsersController.create = usersData => new Promise((resolve, reject) => {
  const newUser = new Users(usersData);

  newUser.save()
         .then(resolve, reject);
});

/*
UsersController.get = userData => new Promise((resolve, reject) => {
  Users.findById(id).then(resolve, reject);
});
*/

UsersController.list = usersData => new Promise((resolve, reject) => {
  Users.find(usersData)
       .then(resolve, reject);
});

/*
UsersController.update = usersData => new Promise((resolve, reject) => {
});


UsersController.delete = usersData => new Promise((resolve, reject) => {
});
*/

UsersController.authenticate = loginData => new Promise((resolve, reject) => {
  Users.findOne({ email: loginData.email }, (err, user) => {
    if (err) {
      reject();
      return { message: 'Database Error!' };
    }

    if (user && user.comparePassword(loginData.password)) {
      resolve();
      return {
        token: jwt.sign({
          email: user.email,
          fullName: user.fullName,
          _id: user._id,
        }, 'RESTFULAPIs'),
      };
    }

    reject();
    return { message: 'Authentication Failed!' };
  });
});

/*
UsersController.loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};
*/

module.exports = UsersController;
