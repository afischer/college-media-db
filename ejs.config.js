const pubGeoJson = require('./data/pubDB.json');

const pubs = pubGeoJson.features.map(({ properties }) => properties)

module.exports = {
  locals: {
    pubs,
  },
};
