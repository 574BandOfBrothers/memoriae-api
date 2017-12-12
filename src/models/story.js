const mongoose = require('mongoose');

const MediaSchema = require('./media');
const CommentSchema = require('./comment');

const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title: { type: String, required: true },
  creator: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    nickname: { type: String, required: true },
  },
  time: { type: String },
  tags: { type: [String], index: true },
  body: { type: String },
  media: [MediaSchema],
  comments: [CommentSchema],
  deletedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
