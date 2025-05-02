// import { fetchJSON, renderProjects } from '../global.js';
// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');

import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
renderProjects(projects, projectsContainer, 'h2');
if (titleElement) {
  titleElement.textContent = `Projects (${projects.length})`;
}

// === PIE CHART + LEGEND ===

const data = [
  { value: 1, label: 'Apples' },
  { value: 2, label: 'Oranges' },
  { value: 3, label: 'Mangos' },
  { value: 4, label: 'Pears' },
  { value: 5, label: 'Limes' },
  { value: 5, label: 'Cherries' },
];

const svg = d3.select('#projects-pie-plot');
const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
const sliceGenerator = d3.pie().value(d => d.value);
const arcData = sliceGenerator(data);
const colors = d3.scaleOrdinal(d3.schemeTableau10);

// Draw pie chart
svg.selectAll('path')
  .data(arcData)
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .attr('fill', (d, i) => colors(i));

// Create legend
const legend = d3.select('.legend');

data.forEach((d, idx) => {
  legend.append('li')
    .attr('class', 'legend-item')
    .attr('style', `--color: ${colors(idx)}`)
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});

