const StoryController = require('./story');

const searchFields = ['title', 'time', 'tags', 'body', 'location'];

const SearchController = {
  search: (query) => {
    const searchRegExp = new RegExp(query, 'i');

    return StoryController.list({
      search: {
        $or: searchFields.map(field => ({ [field]: searchRegExp })),
      },
    });
  },
};

module.exports = SearchController;
