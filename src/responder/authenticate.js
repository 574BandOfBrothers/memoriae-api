const AuthenticateController = require('../controllers/authenticate');

const AuthenticateResponder = {};

AuthenticateResponder.authenticate = (req, res) => {
  const resolve = data => res.status(201).json(data);  // TODO mustafa: use boom
  const reject = error => res.status(400).json(error); // TODO mustafa: use boom

  const email = req.body.email;
  const password = req.body.password;

  AuthenticateController.authenticate(email, password)
                        .then(resolve, reject);
};


module.exports = AuthenticateResponder;
