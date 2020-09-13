import pubGeoJSON from '../data/pubDB.json';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

export default () => {
  console.log(pubGeoJSON);
  // restricted token
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWZpc2NoZXIxNSIsImEiOiJja2YxYmVveTQwcmM5MnhsbmFpZzN0cG12In0.ODgJerfBfyVURmzQhHwR_A';
  const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    style: 'mapbox://styles/afischer15/ckf1bkh3y3im619mgu9qlsxu7',
    // center: [-98, 39.5], // starting position [lng, lat]
    center: [0, 0],
    zoom: 4 // starting zoom
  })

  map.on('load', function () {

    // for (const pub of publications) {
    //   const { name, SchoolUrl } = pub;
    //   map.loadImage(`https://logo.clearbit.com/${SchoolUrl}`, (err, img) => {
    //     map.addImage(name, img);
    //   })
    // }
    console.log('adding');

    map.addSource('pubData', { type: 'geojson', data: pubGeoJSON });
    console.log('added');
    // // Add a symbol layer
    map.addLayer({
      'id': 'pubDataPoints',
      // 'type': 'image',
      type: 'circle',
      source: 'pubData',
      layout: {
        // 'icon-image': 'school-15',
        // 'icon-image': ['get', 'name'],
        // 'icon-size': 0.2,
        // get the title name from the source's "title" property
        // 'text-field': [
        //   'format',
        //   ['get', 'name'],
        //   { 'font-scale': 0.8 },
        //   '\n',
        //   {},
        //   ['upcase', ['get', 'university']],
        //   { 'font-scale': 0.5 }
        // ],
        // 'text-font': [
        //   'Open Sans Semibold',
        //   'Arial Unicode MS Bold'
        // ],
        // 'text-offset': [0, .3],
        // 'text-anchor': 'top',
        // 'icon-ignore-placement': true,
        // 'text-ignore-placement': true
      },
      paint: {
        'circle-color': '#000000',
        'circle-opacity': 0.5,
        "circle-radius": 3
      }
    });

    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 3
    });

    map.on('mousemove', 'pubDataPoints', function (e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
      var coordinates = e.features[0].geometry.coordinates.slice();
      var { properties } = e.features[0];

      const description = `
      <h3><em>${properties.name}</em></h3>
      <div>${properties.university} ${properties.school ? `(${properties.school})` : ''}</div>
      `

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    map.on('mouseleave', 'pubDataPoints', function () {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });


  });

}

