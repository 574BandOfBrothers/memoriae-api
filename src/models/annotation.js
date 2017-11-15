const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const annotationSchema = new Schema({
  id: { type: String, index: true, unique: true },
}, {
  strict: false,
});

module.exports = mongoose.model('annotations', annotationSchema);
