const UsersController = require('../controllers/users');

const UsersResponder = {};


UsersResponder.create = (req, res) => {
  const resolve = data => res.status(201).json(data);
  const reject = error => res.boom.badImplementation(error);

  UsersController.create(req.body)
                 .then(resolve, reject);
};

UsersResponder.list = (req, res) => {
  const resolve = data => res.status(200).json(data);
  const reject = error => res.boom.badImplementation(error);

  UsersController.list(req.body)
                 .then(resolve, reject);
};

UsersResponder.get = (req, res) => {
  const resolve = data => res.status(200).json(data);
  const reject = error => res.status(500).json(error);

  const slug = req.params.slug;

  UsersController.get(slug)
                 .then(resolve, reject);
};

UsersResponder.update = (req, res) => {
  const resolve = data => res.status(200).json(data);
  const reject = error => res.boom.badImplementation(error);

  const slug = req.params.slug;
  const data = req.body;

  UsersController.update(slug, data)
                 .then(resolve, reject);
};

UsersResponder.delete = (req, res) => {
  const resolve = data => res.status(200).json(data);
  const reject = error => res.boom.badImplementation(error);

  const slug = req.params.slug;
  const data = req.body;

  UsersController.delete(slug, data)
                 .then(resolve, reject);
};


module.exports = UsersResponder;
