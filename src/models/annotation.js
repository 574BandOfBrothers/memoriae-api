const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const annotationSchema = new Schema({
}, {
  strict: false,
});

module.exports = mongoose.model('Annotation', annotationSchema);
