/*
  We may need this helpers if we want to visualize data as triplets
 */

const tokenizeQuads = (quads, idGenerator) => {
  let tokenizedString = quads;

  const tokens = tokenizedString.match(/_:b\d*/g).reduce((acc, key) => {
    acc[key] = idGenerator();
    return acc;
  }, {});

  Object.keys(tokens).forEach((key) => {
    tokenizedString = tokenizedString.replace(new RegExp(key, 'g'), tokens[key]);
  });

  return tokenizedString;
};

const quadsToTriples = quads =>
  quads
  .slice(0, -3)
  .split('.\n')
  .map((tripleString) => {
    const tripleMatch = tripleString.match(/[^\s"']+|"([^"]*)"|'([^']*)/g);
    const tripleObject = {
      subject: tripleMatch[0],
      predicate: tripleMatch[1],
      object: tripleMatch[2],
    };
    return tripleObject;
  });


module.exports = {
  tokenizeQuads,
  quadsToTriples,
};
