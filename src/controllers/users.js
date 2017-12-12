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
       .then((user) => {
         if (user === null) {
           return reject();
         }

         resolve(user);
       })
       .catch(reject);
});


UsersController.list = () => new Promise((resolve, reject) => {
  Users.find()
       .then(resolve, reject);
});


UsersController.update = (slug, data) => new Promise((resolve, reject) => {
  const userData = data;

  if (Object.prototype.hasOwnProperty.call(data, '_id')) {
    // eslint-disable-next-line
    delete data._id;
  }

  if (Object.prototype.hasOwnProperty.call(data, '__v')) {
    // eslint-disable-next-line
    delete data.__v;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'slug')) {
    // eslint-disable-next-line
    delete data.slug;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'slugs')) {
    // eslint-disable-next-line
    delete data.slugs;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'password')) {
    const hashPassword = bcrypt.hashSync(data.password);
    userData.password = hashPassword;
  }

  Users.findOneAndUpdate({ slug }, userData, { new: true })
       .then((user) => {
         if (user === null) {
           return reject();
         }
         return resolve(user);
       })
       .catch(reject);
});


UsersController.delete = slug_ => new Promise((resolve, reject) => {
  Users.findOneAndUpdate({ slug: slug_ },
                         { deleted: Date() },
                         { new: true })
        .then((user) => {
          if (user === null) {
            return reject();
          }

          return resolve(user);
        })
        .catch(reject);
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
