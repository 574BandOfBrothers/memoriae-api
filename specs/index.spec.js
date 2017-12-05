const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src');

chai.should();

chai.use(chaiHttp);

/*
describe('/GET /', () => {
  it('it should return 200 for health check', (done) => {
    chai.request(app)
    .get('')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });
});
*/

module.exports = app;
