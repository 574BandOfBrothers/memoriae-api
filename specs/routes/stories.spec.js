const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../index.spec');
const Story = require('../../src/models/story');

chai.should();
chai.use(chaiHttp);

function createTestCommentObject() {
  return {
    creator: mongoose.Types.ObjectId().toString(),
    title: 'test comment',
    body: 'test comment body',
  };
}

function createTestStoryObject() {
  const testStory = new Story();
  testStory.title = 'Test Title';
  testStory.creator = mongoose.Types.ObjectId().toString();
  testStory.tags = ['tag1', 'tag2'];
  testStory.body = 'text body';
  testStory.media = {
    creator: mongoose.Types.ObjectId().toString(),
    type: 'image/jpg',
    url: 'testurl',
  };

  for (let i = 0; i < 5; i += 1) {
    testStory.comments.push(createTestCommentObject());
  }

  return testStory;
}

function createTestStory() {
  return new Promise((resolve, reject) => {
    createTestStoryObject().save().then(resolve, reject);
  });
}

describe('Resource: Stories', () => {
  beforeEach((done) => {
    Story.remove({})
      .then(() => done()).catch(() => done());
  });

  // List Boards
  describe('/GET stories', () => {
    it('it should return empty array if no stories', (done) => {
      chai.request(app)
      .get('/stories')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });

    it('it should get all stories', (done) => {
      createTestStory()
      .then(() => {
        chai.request(app)
        .get('/stories')
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

  // Get Board
  describe('/GET stories/:id', () => {
    it('it should get story with given id', (done) => {
      createTestStory()
      .then((story) => {
        chai.request(app)
        .get(`/stories/${story._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
      })
      .catch(() => done());
    });

    it('it should fail 500 when given id is not mongo object id', (done) => {
      chai.request(app)
      .get('/stories/story1')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
    });
  });

  // Create Board
  describe('/POST stories', () => {
    it('it should create story', (done) => {
      const storyObject = createTestStoryObject();
      chai.request(app)
      .post('/stories')
      .set('content-type', 'application/json')
      .send(storyObject.toJSON())
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        done();
      });
    });

    it('it should fail 500 when required fields are not provided', (done) => {
      const storyObject = createTestStoryObject();
      storyObject.title = null;
      chai.request(app)
      .post('/stories')
      .set('content-type', 'application/json')
      .send(storyObject.toJSON())
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
    });
  });

  // Update Board
  describe('/PUT stories/:id', () => {
    it('it should update story with given id', (done) => {
      createTestStory()
      .then((story) => {
        const updatedBoard = story.toObject();
        updatedBoard.body = 'modified';
        chai.request(app)
        .put(`/stories/${story._id}`)
        .set('content-type', 'application/json')
        .send(JSON.stringify(updatedBoard))
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.body.should.be.eql('modified');
          done();
        });
      })
      .catch(() => done());
    });
  });

  // Delete Board
  describe('/DELETE stories/:id', () => {
    it('it should delete story with given id', (done) => {
      createTestStory()
      .then((story) => {
        chai.request(app)
        .delete(`/stories/${story._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('deletedAt');
          done();
        });
      })
      .catch(() => done());
    });
  });
});
