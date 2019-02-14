require('whatwg-fetch');
const {getFetch, GQLClient} = require('./fetch');
module.exports = getFetch;
module.exports.GQLClient = GQLClient;
