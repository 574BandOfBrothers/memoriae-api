const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MediaSchema = new Schema({
  creator: { type: String, required: true },
  type: { type: String, reuired: true },
  url: { type: String, reuired: true },
  meta: { type: String },
  deletedAt: Date,
}, { timestamps: true });

module.exports = MediaSchema;
