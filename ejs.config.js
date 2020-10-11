const pubGeoJson = require('./data/pubDB.json');

const properties = pubGeoJson.features.map(({ properties }) => properties)

module.exports = {
  locals: {
    properties,
  },
};
