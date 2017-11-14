const UsersController = require('../controllers/users');

const UsersResponder = {};

UsersResponder.create = (req, res) => {
  const resolve = data => res.status(201).json(data);
  const reject = error => res.status(400).json(error);

  UsersController.create(req.body)
                 .then(resolve, reject);
};

UsersResponder.list = (req, res) => {
  const resolve = data => res.status(201).json(data);
  const reject = error => res.status(400).json(error);

  UsersController.list(req.body)
                 .then(resolve, reject);
};


module.exports = UsersResponder;
