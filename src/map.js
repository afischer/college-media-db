import pubGeoJSON from '../data/pubDB.json';
import us from '../data/states-albers-10m.json'
import * as d3 from 'd3';
import * as topojson from 'topojson-client';


export default () => {
  // create SVG
  var svg = d3.select("#map")
    .append("svg")
    .attr('viewBox', '0 0 975 619');;

  // add tooltip and handlers
  const tooltip = d3.select("#map")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

  const handleMouseOver = (d) => {
    const data = JSON.parse(d.target.dataset.info);
    tooltip
      .style("opacity", 1)
      .html(getTooltipHtml(data))

  }

  const handleMouseMove = d => {
    const { clientX, clientY } = d;
    tooltip
      .style("left", clientX + 10 + "px")
      .style("top", clientY + 10 + "px")
  }

  const handleMouseOut = d => {
    tooltip
      .style("opacity", 0)
  }

  const getTooltipHtml = data => {
    const { name, university, school, SchoolUrl } = data;
    return `
      <div class="pub-title">
        <img src="https://logo.clearbit.com/${SchoolUrl}" width="32px" height="32px" />
        <div>
          <h3><em>${name}</em></h3>
          ${university} ${school ? `(${school})` : ''}
        </div>
      </div>
      <p> Other info will go here! </p>
      `
  }

  // top level group for zooming
  const items = svg.append("g");

  // add state paths
  const stateData = topojson.feature(us, us.objects.states).features;
  const path = d3.geoPath();

  items
    .append('g')
    .selectAll('path')
    .data(stateData)
    .enter()
    .append('path')
    .attr('fill', '#d4d4d4')
    .attr('stroke', '#fff')
    .attr('d', path)


  // reproject points onto the map
  const pointRadius = 4;
  const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])

  items.selectAll("circle")
    .data(pubGeoJSON.features)
    .enter()
    .append("circle")
    .attr("cx", d => projection(d.geometry.coordinates)[0])
    .attr("cy", d => projection(d.geometry.coordinates)[1])
    .attr("r", pointRadius)
    .attr("fill", "#888")
    .attr("opacity", ".75")
    .attr("stroke", "#eee")
    .attr("data-info", d => JSON.stringify(d.properties))
    .on('mouseover', handleMouseOver)
    .on('mousemove', handleMouseMove)
    .on('mouseout', handleMouseOut);

  // zoom functionality
  function handleZoom(event) {
    const { transform } = event;
    items.attr("transform", transform);
    items.attr("stroke-width", 1 / transform.k);
    items
      .selectAll('circle')
      .attr("r", Math.max(pointRadius / 30, pointRadius / transform.k));
  }

  const zoom = d3.zoom()
    .scaleExtent([1, 50])
    .translateExtent([[0, 0], [975, 619]])
    .on("zoom", handleZoom);

  svg.call(zoom);


}
