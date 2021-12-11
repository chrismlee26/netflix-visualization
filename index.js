// import * as d3 from 'https://unpkg.com/d3?module'
// import * as selection from 'https://unpkg.com/d3-selection?module'
// import {
//   select,
//   json,
//   tsv,
//   geoPath,
//   geoNaturalEarth1,
//   event,
// } from 'd3';
// import { feature } from 'topojson';

const svg = select('svg');

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);

const g = svg.append('g');

g.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({ type: 'Sphere' }));

Promise.all([
  d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
  d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
]).then(([tsvData, topoJSONdata]) => {

  const countryName = tsvData.reduce((accumulator, d) => {
    accumulator[d.iso_n3] = d.name;
    return accumulator;
  }, {});

  const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
  g.selectAll('path').data(countries.features)
    .enter().append('path')
    .attr('class', 'country')
    .attr('d', pathGenerator)
    .append('title')
    .text(d => countryName[d.id]);
});