const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../models/users');

const UsersController = {};

UsersController.create = data => new Promise((resolve, reject) => {
  const hashPassword = bcrypt.hashSync(data.password, 10);

  const usersData = {
    slug: data.slug,
    name: data.name,
    email: data.email,
    password: hashPassword,
  };

  const newUser = new Users(usersData);

  newUser.save()
         .then(resolve, reject);
});


UsersController.get = data => new Promise((resolve, reject) => {
  const usersData = {
    slug: data,
  };

  Users.findOne(usersData)
       .then(resolve, reject);
});


UsersController.list = () => new Promise((resolve, reject) => {
  Users.find()
       .then(resolve, reject);
});


UsersController.update = (slug_, data) => new Promise((resolve, reject) => {
  const usersData = {
    slug: data,
  };

  // TODO mustafa: complete here
  Users.findOne(usersData)
       .then(resolve, reject);
});

/*
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
