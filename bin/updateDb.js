const axios = require('axios');
const fs = require('fs').promises;
const path = require('path')
const { csvParse } = require('d3');

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1O31IISGSBz9md3m9mS_hHHyIYHA5ewGSQI6H7HJWvqA/export?format=csv'

async function run() {
  const res = await axios.get(CSV_URL);
  const { data: csvData } = res;
  const data = csvParse(csvData)

  // reduce to object {university: geoJSONFeature}
  const featuresByCollege = data.reduce((acc, publication) => {
    const { university, lon, lat } = publication;
    if (!lat || !lon || lat === '#N/A' || 'lon' === '#N/A') {
      console.warn(`No coordinates for ${publication.name} (${university}). Skipping...`);
      return acc;
    }
    if (!acc[university]) {
      acc[university] = {
        type: 'Feature',
        properties: { university, publications: [] },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(lon), parseFloat(lat)]
        }
      };
    }
    acc[university].properties.publications.push(publication)
    return acc;
  }, {})

  const features = Object.values(featuresByCollege);

  const geoJSON = JSON.stringify({ type: 'FeatureCollection', features }, null, 2)

  await fs.writeFile(path.join(__dirname, '../data/pubDB.json'), geoJSON);
}

run()
