const mongoose = require('mongoose');

const MediaSchema = require('./media');
const CommentSchema = require('./comment');

const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title: { type: String, required: true },
  // TODO: Will be implemented when access token is available
  // creator: { type: String, required: true },
  time: { type: String },
  tags: { type: [String], index: true },
  body: { type: String },
  media: [MediaSchema],
  comments: [CommentSchema],
  location: { type: String },
  deletedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
