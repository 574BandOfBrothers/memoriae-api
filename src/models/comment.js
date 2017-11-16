const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  creator: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  deletedAt: Date,
}, { timestamps: true });

module.exports = CommentSchema;
