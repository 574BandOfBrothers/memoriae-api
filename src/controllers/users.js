const bcrypt = require('bcryptjs');
const Users = require('../models/users');

const UsersController = {};

UsersController.create = data => new Promise((resolve, reject) => {
  const hashPassword = bcrypt.hashSync(data.password);

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


UsersController.update = (slug, data) => new Promise((resolve, reject) => {
  // TODO mustafa: complete here
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
