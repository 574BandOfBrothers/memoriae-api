const Router = require('express').Router;

const config = require('../config/environment');

const AnnotationController = require('../controllers/annotation');

const ListTypes = {
  Minimal: 'return=representation;include="http://www.w3.org/ns/ldp#PreferMinimalContainer"',
  ContainedIRIs: 'return=representation;include="http://www.w3.org/ns/oa#PreferContainedIRIs"',
  ContainedDescription: 'return=representation;include="http://www.w3.org/ns/oa#PreferContainedDescriptions"',
};

const annotationsPerPage = 20;

const router = Router();

/**
 *  Set standart response headers to all annotation routes
 */
router.use('*', (req, res, next) => {
  res.set('Content-Type', 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"');
  res.set('Allow', 'POST,PUT,GET,OPTIONS,HEAD,DELETE,PATCH');
  next();
});

/**
 * GET /annotations
 * https://www.w3.org/TR/annotation-protocol/#annotation-containers
 */
router.get('/', (req, res) => {
  const preferedListType = req.get('Prefer') || ListTypes.Minimal;

  res.set('Link', [
    '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
    '<http://www.w3.org/TR/annotation-protocol/>; rel="http://www.w3.org/ns/ldp#constrainedBy"']);
  res.set('Vary', 'Accept, Prefer');

  const responseData = {
    '@context': [
      'http://www.w3.org/ns/anno.jsonld',
      'http://www.w3.org/ns/ldp.jsonld',
    ],
    id: config.api.annotationEndpoint,
    type: ['BasicContainer', 'AnnotationCollection'],
    modified: new Date(),
    label: 'Memoriae Annotation Database',
  };

  AnnotationController.count()
  .then((totalAnnotationCount) => {
    const totalPages = Math.ceil(totalAnnotationCount / annotationsPerPage);
    responseData.total = totalAnnotationCount;
    responseData.last = `${config.api.annotationEndpoint}/page/${totalPages}`;

    switch (preferedListType) {
      case ListTypes.ContainedIRIs:
        AnnotationController.list('_id')
        .then((annotationList) => {
          const computedList = Object.assign({
            first: {
              id: `${config.api.annotationEndpoint}/page/1`,
              type: 'AnnotationPage',
              items: annotationList.map(annotation => `${config.api.annotationEndpoint}/${annotation._id}`),
            },
          }, responseData);

          if (totalPages > 1) {
            computedList.first.next = `${config.api.annotationEndpoint}/page/2`;
          }

          res.json(computedList);
        })
        .catch();
        break;

      case ListTypes.ContainedDescription:
        AnnotationController.list()
        .then((annotationList) => {
          const computedList = Object.assign({
            first: {
              id: `${config.api.annotationEndpoint}/page/1`,
              type: 'AnnotationPage',
              items: annotationList.map((annotation) => {
                const computedAnnotation = annotation.toObject();
                computedAnnotation.type = 'Annotation';
                computedAnnotation.id = `${config.api.annotationEndpoint}/${computedAnnotation._id}`;

                delete computedAnnotation._id;
                delete computedAnnotation.__v;

                return computedAnnotation;
              }),
            },
          }, responseData);

          if (totalPages > 1) {
            computedList.first.next = `${config.api.annotationEndpoint}/page/2`;
          }

          return res.json(computedList);
        })
        .catch();
        break;

      default:
        return res.json(Object.assign({
          first: `${config.api.annotationEndpoint}/page/1`,
        }, responseData));
    }
  })
  .catch(error => res.json(error));
});

/**
 * GET /annotations/:annotationId
 * https://www.w3.org/TR/annotation-protocol/#annotation-retrieval
 */
router.get('/:annotationId', (req, res) => {
  res.set('Link', '<http://www.w3.org/ns/ldp#Resource>; rel="type"');
  AnnotationController.getById(req.params.annotationId)
  .then(annotation => res.json(annotation))
  .catch(error => res.json(error));
});

/**
 * POST /annotations/
 * https://www.w3.org/TR/annotation-protocol/#create-a-new-annotation
 */
router.post('/', (req, res) => {
  AnnotationController.create(req.body)
  .then(data => res.status(201).json(data))
  .catch(error => res.status(400).json(error));
});

module.exports = router;
