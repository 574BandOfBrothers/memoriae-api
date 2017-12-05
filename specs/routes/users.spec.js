const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../index.spec');
const Users = require('../../src/models/users');


chai.should();
chai.use(chaiHttp);


function createTestUserObject() {
  const testUser = new Users();

  testUser.name = 'Test User';
  testUser.email = 'user@test.com';
  testUser.password = '123456';
  testUser.birthday = Date(1985, 1, 1);
  testUser.created = Date.now();
  testUser.updated = Date.now();
  testUser.deleted = null;

  return testUser;
}

function createTestUser() {
  return new Promise((resolve, reject) => {
    createTestUserObject().save().then(resolve, reject);
  });
}

describe('Resource: Users', () => {
  beforeEach((done) => {
    Users.remove({})
      .then(() => done())
      .catch(() => done());
  });

  // List Users
  describe('/GET users', () => {
    it('it should return empty array if no users', (done) => {
      chai.request(app)
      .get('/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });

    it('it should get all users', (done) => {
      createTestUser()
      .then(() => {
        chai.request(app)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(1);
          done();
        });
      })
      .catch(() => done());
    });
  });

  // Get User
  describe('/GET users/:slug', () => {
    it('it should get user with given slug', (done) => {
      createTestUser()
      .then((user) => {
        chai.request(app)
        .get(`/users/${user.slug}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
      })
      .catch(() => done());
    });

    it('it should fail 500 when given slug is not mongo object slug', (done) => {
      chai.request(app)
      .get('/users/mythievingheart')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
    });
  });

  // Create User
  describe('/POST user', () => {
    it('it should create user', (done) => {
      const userObject = createTestUserObject();
      chai.request(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send(userObject.toJSON())
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        done();
      });
    });

    it('it should fail 500 when required fields are not provided', (done) => {
      const userObject = createTestUserObject();
      userObject.name = null;
      chai.request(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send(userObject.toJSON())
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
    });
  });

  // Update User
  describe('/PUT users/:slug', () => {
    it('it should update user with given slug', (done) => {
      createTestUser()
      .then((user) => {
        const updatedUser = user.toObject();
        updatedUser.name = 'modified';
        chai.request(app)
        .put(`/users/${user.slug}`)
        .set('content-type', 'application/json')
        .send(JSON.stringify(updatedUser))
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.name.should.be.eql('modified');
          done();
        });
      })
      .catch(() => done());
    });
  });

  // Delete User
  describe('/DELETE users/:slug', () => {
    it('it should delete user with given slug', (done) => {
      createTestUser()
      .then((user) => {
        chai.request(app)
        .delete(`/users/${user.slug}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('deleted');
          done();
        });
      })
      .catch(() => done());
    });
  });
});
