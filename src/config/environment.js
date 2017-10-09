const configurations = require(`./environments/${process.env.NODE_ENV}.json`); // eslint-disable-line import/no-dynamic-require
module.exports = configurations;
