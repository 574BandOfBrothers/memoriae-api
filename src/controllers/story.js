const Story = require('../models/story');

const StoryController = {
  list: ({ fields, search = {}, sort = '-id' } = {}) => {
    const searchObject = Object.assign(search, { deletedAt: null });
    return Story
      .find(searchObject)
      .select(fields)
      .sort(sort)
      .exec();
  },

  get: storyId => new Promise((resolve, reject) => {
    Story.findById(storyId)
    .then((story) => {
      if (story === null) {
        return reject();
      }
      resolve(story);
    })
    .catch(reject);
  }),

  getByCreator: creatorId => new Promise((resolve, reject) => {
    Story.find({ creator: creatorId })
    .then((story) => {
      if (story === null) {
        return reject();
      }
      resolve(story);
    })
    .catch(reject);
  }),

  create: data => new Promise((resolve, reject) => {
    const newStory = new Story(data);
    newStory.save()
    .then(resolve)
    .catch(reject);
  }),

  update: (storyId, data) => new Promise((resolve, reject) => {
    Story.findOneAndUpdate({ _id: storyId }, data, { new: true })
    .then((story) => {
      if (story === null) {
        return reject();
      }
      return resolve(story);
    })
    .catch(reject);
  }),

  delete: storyId => new Promise((resolve, reject) => {
    Story.findOneAndUpdate({ _id: storyId },
      { deletedAt: Date() },
      { new: true })
    .then((story) => {
      if (story === null) {
        return reject();
      }

      return resolve(story);
    })
    .catch(reject);
  }),
};

module.exports = StoryController;
