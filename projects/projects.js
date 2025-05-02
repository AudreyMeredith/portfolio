// import { fetchJSON, renderProjects } from '../global.js';
// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');

import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

document.addEventListener('DOMContentLoaded', async () => {
  // Load and render projects
  const projects = await fetchJSON('../lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  const titleElement = document.querySelector('.projects-title');

  renderProjects(projects, projectsContainer, 'h2');

  if (titleElement) {
    titleElement.textContent = `Projects (${projects.length})`;
  }

  // === PIE CHART ===
  const svg = d3.select('#projects-pie-plot');
  if (!svg.node()) {
    console.error('SVG element with id "projects-pie-plot" not found.');
    return;
  }

  const data = [1, 2, 3, 4, 5, 5];

  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  const sliceGenerator = d3.pie();
  const arcData = sliceGenerator(data);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  svg.selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', (d, i) => colors(i));
});
