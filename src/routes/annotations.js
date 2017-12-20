const Router = require('express').Router;

const config = require('../config/environment');

const AnnotationController = require('../controllers/annotation');

const ListTypes = {
  Minimal: {
    header: 'return=representation;include="http://www.w3.org/ns/ldp#PreferMinimalContainer"',
    id: 1,
  },
  ContainedIRIs: {
    header: 'return=representation;include="http://www.w3.org/ns/oa#PreferContainedIRIs"',
    id: 1,
  },
  ContainedDescription: {
    header: 'return=representation;include="http://www.w3.org/ns/oa#PreferContainedDescriptions"',
    id: 0,
  },
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
  const requiredIris = req.query.iris;

  const requiredType = typeof requiredIris !== 'undefined' && ListTypes[Object.keys(ListTypes)
    .find(key => ListTypes[key].id === parseInt(requiredIris, 10))];

  const preferedListType = requiredType ? requiredType.header : (req.get('Prefer') || ListTypes.Minimal.header);

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

    const iris = ListTypes[Object.keys(ListTypes)
      .find(key => ListTypes[key].header === preferedListType)].id;

    if (totalPages > 1) {
      responseData.last = `${config.api.annotationEndpoint}/page/${totalPages}?iris=${iris}`;
    }

    switch (preferedListType) {
      case ListTypes.ContainedIRIs.header:
        AnnotationController.list({ fields: '_id' })
        .then((annotationList) => {
          const computedList = Object.assign({
            first: {
              id: `${config.api.annotationEndpoint}/page/1?iris=${iris}`,
              type: 'AnnotationPage',
              items: annotationList.map(annotation => `${config.api.annotationEndpoint}/${annotation._id}`),
            },
          }, responseData);

          if (totalPages > 1) {
            computedList.first.next = `${config.api.annotationEndpoint}/page/2?iris=${iris}`;
          }

          res.json(computedList);
        })
        .catch();
        break;

      case ListTypes.ContainedDescription.header:
        AnnotationController.list()
        .then((annotationList) => {
          const computedList = Object.assign({
            first: {
              id: `${config.api.annotationEndpoint}/page/1?iris=${iris}`,
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
            computedList.first.next = `${config.api.annotationEndpoint}/page/2?iris=${iris}`;
          }

          return res.json(computedList);
        })
        .catch();
        break;

      default:
        return res.json(Object.assign({
          first: `${config.api.annotationEndpoint}/page/1?iris=${iris}`,
        }, responseData));
    }
  })
  .catch(error => res.json(error));
});

/**
 * GET /annotations/page/:id?iris=type
 * https://www.w3.org/TR/annotation-protocol/#annotation-retrieval
 */
router.get('/page/:pageNumber', (req, res) => {
  const pageNumber = parseInt(req.params.pageNumber, 10);
  if (!pageNumber) {
    return res.boom.badRequest();
  }

  const iris = parseInt(req.query.iris || 0, 10);

  const responseData = {
    '@context': [
      'http://www.w3.org/ns/anno.jsonld',
      'http://www.w3.org/ns/ldp.jsonld',
    ],
    id: `${config.api.annotationEndpoint}/page/${pageNumber}?iris=${iris}`,
    type: 'AnnotationPage',
    partOf: {
      id: `${config.api.annotationEndpoint}?iris=${iris}`,
      modified: new Date(),
    },
    startIndex: (pageNumber - 1) * annotationsPerPage,
  };

  AnnotationController.count()
  .then((totalAnnotationCount) => {
    const totalPages = Math.ceil(totalAnnotationCount / annotationsPerPage);

    responseData.partOf.total = totalAnnotationCount;

    if (pageNumber > 1) {
      let prevPage = pageNumber - 1;
      prevPage = prevPage > totalPages ? totalPages : prevPage;
      responseData.prev = `${config.api.annotationEndpoint}/page/${prevPage}?iris=${iris}`;
    }

    if (pageNumber < totalPages) {
      responseData.next = `${config.api.annotationEndpoint}/page/${pageNumber + 1}?iris=${iris}`;
    }

    AnnotationController.list({ page: pageNumber - 1, limit: annotationsPerPage })
    .then((annotationList) => {
      responseData.items = annotationList.map((annotation) => {
        const computedAnnotation = annotation.toObject();
        computedAnnotation.type = 'Annotation';
        computedAnnotation.id = `${config.api.annotationEndpoint}/${computedAnnotation._id}`;

        delete computedAnnotation._id;
        delete computedAnnotation.__v;

        return iris === 1 ? computedAnnotation.id : computedAnnotation;
      });

      return res.json(responseData);
    })
    .catch();
  })
  .catch(error => res.json(error));
});

/**
 * GET /annotations/:annotationId
 * https://www.w3.org/TR/annotation-protocol/#annotation-pages
 */
router.get('/:annotationId', (req, res) => {
  res.set('Link', '<http://www.w3.org/ns/ldp#Resource>; rel="type"');
  AnnotationController.getById(req.params.annotationId)
  .then((annotation) => {
    const modifiedAnnotation = annotation.toObject();
    modifiedAnnotation.id = `${config.api.annotationEndpoint}/${modifiedAnnotation._id}`;
    delete modifiedAnnotation._id;
    delete modifiedAnnotation.__v;
    res.json(modifiedAnnotation);
  })
  .catch(() => res.boom.notFound());
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

/**
 * DELETE /annotations/:annotationId
 * https://www.w3.org/TR/annotation-protocol/#annotation-pages
 */
router.delete('/:annotationId', (req, res) => {
  AnnotationController.removeById(req.params.annotationId)
  .then(() => res.sendStatus(204))
  .catch(() => res.boom.notFound());
});

module.exports = router;
