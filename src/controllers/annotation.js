const jsonLD = require('jsonld').promises;

const Annotation = require('../models/annotation');

const AnnotationController = {};

AnnotationController.list = ({ search, fields, limit = 20, page = 0, sort } = {}) =>
  Annotation
    .find(search)
    .select(fields)
    .limit(limit)
    .skip(page * limit)
    .sort(sort)
    .exec();

AnnotationController.count = () => Annotation.count();

AnnotationController.create = annotationData => new Promise((resolve, reject) => {
  jsonLD.compact(annotationData, 'http://www.w3.org/ns/anno.jsonld')
  .then((compactAnnotationData) => {
    const newAnnotation = new Annotation(compactAnnotationData);

    newAnnotation.save().then(resolve, reject);
  })
  .catch(reject);
});

AnnotationController.getById = id => Annotation.findById(id);

AnnotationController.removeById = id =>
  AnnotationController.getById(id)
  .remove()
  .exec();

module.exports = AnnotationController;
