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

// === Get selected year from pie chart data ===
function getSelectedYearLabel() {
  return pieChartData[selectedIndex]?.label ?? null;
}

// === Filter projects by search and selected year ===
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

// === Main update function to render projects and chart ===
function update(filteredProjects) {
  renderProjects(filteredProjects, projectsContainer, 'h2');
  if (titleElement) {
    titleElement.textContent = `Projects (${filteredProjects.length})`;
  }
  renderPieChart(filteredProjects);
}

// === Render pie chart and legend ===
function renderPieChart(projectsGiven) {
  const svg = d3.select('#projects-pie-plot');
  const legend = d3.select('.legend');

  svg.selectAll('path').remove(); // optional if using full enter/update/exit
  legend.selectAll('li').remove();

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
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(pieChartData);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  // ✅ ENTER/UPDATE/EXIT pattern for pie slices
  const paths = svg.selectAll('path')
  .data(arcData, d => d.data.label);

paths.exit().remove();

paths.enter()
  .append('path')
  .merge(paths)
  .attr('d', arcGenerator)
  .attr('fill', d => colors(d.index)) // ✅ FIXED LINE HERE
  .attr('class', d => getSelectedYearLabel() === d.data.label ? 'selected' : '')
  .on('click', (event, d) => {
    const clickedYear = d.data.label;
    if (getSelectedYearLabel() === clickedYear) {
      selectedIndex = -1;
    } else {
      selectedIndex = pieChartData.findIndex(p => p.label === clickedYear);
    }
    const filtered = getFilteredProjects(filteredBySearch);
    update(filtered);
  });


  // Legend
  legend.selectAll('li')
    .data(pieChartData)
    .enter()
    .append('li')
    .attr('class', d => `legend-item ${getSelectedYearLabel() === d.label ? 'selected' : ''}`)
    .attr('style', (_, i) => `--color: ${colors(i)}`)
    .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on('click', (_, i) => {
      const clickedYear = pieChartData[i].label;
      if (getSelectedYearLabel() === clickedYear) {
        selectedIndex = -1;
      } else {
        selectedIndex = i;
      }
      const filtered = getFilteredProjects(filteredBySearch);
      update(filtered);
    });
}

// === Search handler ===
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

// === Initial load ===
filteredBySearch = allProjects;
update(allProjects);

