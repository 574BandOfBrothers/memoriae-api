const jsonLD = require('jsonld').promises;

const Annotation = require('../models/annotation');

const AnnotationController = {};

AnnotationController.list = fields => Annotation.find(fields);
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

module.exports = AnnotationController;
