const mongoose = require('mongoose');

const MediaSchema = require('./media');
const CommentSchema = require('./comment');

const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  tags: { type: [String], index: true },
  body: { type: String },
  media: [MediaSchema],
  comments: [CommentSchema],
  deletedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
