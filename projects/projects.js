// import { fetchJSON, renderProjects } from '../global.js';
// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');

import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title'); // selects the <h1>

renderProjects(projects, projectsContainer, 'h2');

// Step 1.6: Update project count in <h1>
if (titleElement) {
  titleElement.textContent = `Projects (${projects.length})`;
}


