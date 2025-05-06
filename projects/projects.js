// import { fetchJSON, renderProjects } from '../global.js';
// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const allProjects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1;
let filteredBySearch = allProjects;
let pieChartData = [];

// ✅ Define fixed color scale for consistent year colors
const yearColorScale = d3.scaleOrdinal()
  .domain(['2023', '2024', '2025']) // Update with all years used in your data
  .range(d3.schemeTableau10);

function getSelectedYearLabel() {
  return pieChartData[selectedIndex]?.label ?? null;
}

function getFilteredProjects(projects) {
  const selectedLabel = getSelectedYearLabel();
  return projects.filter(project => {
    const matchesQuery = Object.values(project)
      .join('\n')
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesYear = selectedLabel ? project.year == selectedLabel : true;
    return matchesQuery && matchesYear;
  });
}

function update(filteredProjects) {
  renderProjects(filteredProjects, projectsContainer, 'h2');
  if (titleElement) {
    titleElement.textContent = `Projects (${filteredProjects.length})`;
  }

  // ✅ Always show full pie chart (not filtered)
  renderPieChart(allProjects);
}

function renderPieChart(projectsGiven) {
  const svg = d3.select('#projects-pie-plot');
  const legend = d3.select('.legend');

  svg.selectAll('*').remove();  // Clear all previous SVG content
  legend.selectAll('*').remove();

  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  pieChartData = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const pieGenerator = d3.pie().value(d => d.value);
  const arcData = pieGenerator(pieChartData);

  const selectedYear = getSelectedYearLabel();
  const hasSelection = selectedYear !== null;
  svg.attr('data-selected', hasSelection ? 'true' : null);

  // Draw pie wedges
  svg.selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', d => yearColorScale(d.data.label)) // ✅ persistent color
    .attr('class', d => selectedYear === d.data.label ? 'selected' : '')
    .on('click', (event, d) => {
      const clickedYear = d.data.label;
      selectedIndex = selectedYear === clickedYear ? -1 : pieChartData.findIndex(p => p.label === clickedYear);
      const filtered = getFilteredProjects(filteredBySearch);
      update(filtered);
    });

  // Draw legend
  legend.selectAll('li')
    .data(pieChartData)
    .enter()
    .append('li')
    .attr('class', d => `legend-item ${selectedYear === d.label ? 'selected' : ''}`)
    .attr('style', d => `--color: ${yearColorScale(d.label)}`)
    .html(d => `<span class="swatch" style="background:${yearColorScale(d.label)}"></span> ${d.label} <em>(${d.value})</em>`)
    .on('click', (_, i) => {
      const clickedYear = pieChartData[i].label;
      selectedIndex = selectedYear === clickedYear ? -1 : i;
      const filtered = getFilteredProjects(filteredBySearch);
      update(filtered);
    });
}

// SEARCH BAR
searchInput.addEventListener('input', event => {
  query = event.target.value;
  selectedIndex = -1;
  filteredBySearch = allProjects.filter(project => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  const filtered = getFilteredProjects(filteredBySearch);
  update(filtered);
});

// Initial render
filteredBySearch = allProjects;
update(allProjects);
