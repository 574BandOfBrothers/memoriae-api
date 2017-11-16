let env = process.env.NODE_ENV;
env = env.indexOf('docker') > -1 ? 'development' : env;
const configurations = require(`./environments/${env}.json`); // eslint-disable-line import/no-dynamic-require
module.exports = configurations;
