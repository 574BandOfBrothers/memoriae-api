const UsersController = require('../controllers/users');

const UsersResponder = {};

UsersResponder.create = (req, res) => {
  const resolve = data => res.status(201).json(data);  // TODO mustafa: use boom
  const reject = error => res.status(400).json(error); // TODO mustafa: use boom

  UsersController.create(req.body)
                 .then(resolve, reject);
};

UsersResponder.list = (req, res) => {
  const resolve = data => res.status(201).json(data);  // TODO mustafa: use boom
  const reject = error => res.status(400).json(error); // TODO mustafa: use boom


  UsersController.list(req.body)
                 .then(resolve, reject);
};

UsersResponder.get = (req, res) => {
  const resolve = data => res.status(201).json(data);  // TODO mustafa: use boom
  const reject = error => res.status(400).json(error); // TODO mustafa: use boom

  const slug = req.params.userId;

  UsersController.get(slug)
                 .then(resolve, reject);
};

UsersResponder.update = (req, res) => {
  const resolve = data => res.status(201).json(data);  // TODO mustafa: use boom
  const reject = error => res.status(400).json(error); // TODO mustafa: use boom

  const slug = req.params.userId;
  const data = req.body;

  UsersController.update(slug, data)
                 .then(resolve, reject);
};


module.exports = UsersResponder;
