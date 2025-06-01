// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// import scrollama from 'https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm';

// async function loadData() {
//   const data = await d3.csv('loc.csv', row => ({
//     ...row,
//     line: +row.line,
//     depth: +row.depth,
//     length: +row.length,
//     date: new Date(row.date + 'T00:00' + row.timezone),
//     datetime: new Date(row.datetime),
//   }));
//   return data;
// }

// function processCommits(data) {
//   return d3.groups(data, d => d.commit)
//     .map(([id, lines]) => {
//       const meta = lines[0];
//       const datetime = new Date(meta.datetime);
//       const commit = {
//         id,
//         url: `https://github.com/lindbergryan04/portfolio/commit/${id}`,
//         author: meta.author,
//         date: meta.date,
//         time: meta.time,
//         timezone: meta.timezone,
//         datetime,
//         hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//         totalLines: lines.length
//       };
//       Object.defineProperty(commit, 'lines', {
//         value: lines,
//         enumerable: false,
//       });
//       return commit;
//     }).sort((a, b) => a.datetime - b.datetime);
// }

// function updateTooltipVisibility(visible) {
//   document.getElementById('commit-tooltip').hidden = !visible;
// }

// function updateTooltipPosition(event) {
//   const tooltip = document.getElementById('commit-tooltip');
//   tooltip.style.left = `${event.clientX}px`;
//   tooltip.style.top = `${event.clientY}px`;
// }

// function renderTooltipContent(commit) {
//   document.getElementById('commit-link').textContent = commit.id;
//   document.getElementById('commit-link').href = commit.url;
//   document.getElementById('commit-date').textContent = commit.datetime.toLocaleDateString('en');
//   document.getElementById('commit-time').textContent = commit.time;
//   document.getElementById('commit-author').textContent = commit.author;
//   document.getElementById('commit-lines').textContent = commit.totalLines;
// }

// let xScale, yScale;
// const width = 1000, height = 600;
// const margin = { top: 10, right: 10, bottom: 30, left: 40 };
// const usableArea = {
//   top: margin.top,
//   left: margin.left,
//   right: width - margin.right,
//   bottom: height - margin.bottom,
//   width: width - margin.left - margin.right,
//   height: height - margin.top - margin.bottom
// };

// function updateScatterPlot(data, commits) {
//   let svg = d3.select('#chart').select('svg');
//   if (svg.empty()) {
//     svg = d3.select('#chart')
//       .append('svg')
//       .attr('viewBox', [0, 0, width, height])
//       .style('overflow', 'visible');

//     svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${usableArea.bottom})`);
//     svg.append('g').attr('class', 'y-axis').attr('transform', `translate(${usableArea.left}, 0)`);
//     svg.append('g').attr('class', 'dots');
//   }

//   xScale = d3.scaleTime()
//     .domain(d3.extent(commits, d => d.datetime))
//     .range([usableArea.left, usableArea.right]);

//   yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.bottom, usableArea.top]);
//   const rScale = d3.scaleSqrt()
//     .domain(d3.extent(commits, d => d.totalLines))
//     .range([4, 20]);

//   const dots = svg.select('g.dots');
//   const sortedCommits = d3.sort(commits, d => -d.totalLines);

//   dots.selectAll('circle')
//     .data(sortedCommits, d => d.id)
//     .join('circle')
//     .attr('class', 'commit-dot')
//     .attr('cx', d => xScale(d.datetime))
//     .attr('cy', d => yScale(d.hourFrac))
//     .attr('r', d => rScale(d.totalLines))
//     .style('--r', d => rScale(d.totalLines))
//     .on('mouseenter', (e, d) => {
//       renderTooltipContent(d);
//       updateTooltipVisibility(true);
//       updateTooltipPosition(e);
//     })
//     .on('mouseleave', () => updateTooltipVisibility(false));

//   svg.select('g.x-axis').call(d3.axisBottom(xScale));
//   svg.select('g.y-axis').call(d3.axisLeft(yScale).tickFormat(d => `${d}:00`));
// }

// function updateFileDisplay(commits) {
//   const lines = commits.flatMap(d => d.lines);
//   const files = d3.groups(lines, d => d.file)
//     .map(([name, lines]) => ({ name, lines, type: lines[0].type }))
//     .sort((a, b) => b.lines.length - a.lines.length);

//   const colors = d3.scaleOrdinal(["#51127c", "#b73779", "#fc8961", "#fcfdbf"]);

//   const container = d3.select('#files')
//     .selectAll('div')
//     .data(files, d => d.name)
//     .join(
//       enter => enter.append('div')
//         .call(div => {
//           div.append('dt').append('code');
//           div.append('dd');
//         })
//     )
//     .attr('style', d => `--color: ${colors(d.type)}`);

//   container.select('dt > code').text(d => `${d.name} (${d.lines.length} lines)`);
//   container.select('dd')
//     .selectAll('div')
//     .data(d => d.lines)
//     .join('div')
//     .attr('class', 'line');
// }

// function updateStats(data, commits) {
//   const stat = d3.select('#stats').html('').append('dl').attr('class', 'stats');

//   stat.append('dt').text('Commits');
//   stat.append('dd').text(commits.length);

//   stat.append('dt').text('Files');
//   stat.append('dd').text(new Set(data.map(d => d.file)).size);

//   stat.append('dt').text('Total LOC');
//   stat.append('dd').text(data.length);

//   const fileLengths = d3.rollups(data, v => d3.max(v, d => d.line), d => d.file);
//   stat.append('dt').text('Max Depth');
//   stat.append('dd').text(d3.max(fileLengths, d => d[1]));

//   stat.append('dt').text('Longest Line');
//   stat.append('dd').text(d3.max(data, d => d.length));

//   stat.append('dt').text('Max Lines');
//   stat.append('dd').text(d3.max(commits, d => d.totalLines));
// }

// const data = await loadData();
// const commits = processCommits(data);

// let commitProgress = 100;
// const timeScale = d3.scaleTime()
//   .domain(d3.extent(commits, d => d.datetime))
//   .range([0, 100]);

// let commitMaxTime = timeScale.invert(commitProgress);
// let filteredCommits = commits;

// function filterCommits() {
//   commitMaxTime = timeScale.invert(commitProgress);
//   filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);
// }

// const slider = document.getElementById('commit-slider');
// const selectedTime = d3.select('#selectedTime');

// slider.addEventListener('input', e => {
//   commitProgress = +e.target.value;
//   filterCommits();

//   selectedTime.text(timeScale.invert(commitProgress).toLocaleString('en-US', {
//     dateStyle: 'long',
//     timeStyle: 'short'
//   }));

//   updateScatterPlot(data, filteredCommits);
//   updateFileDisplay(filteredCommits);
//   updateStats(data, filteredCommits);
// });

// filterCommits();
// updateScatterPlot(data, filteredCommits);
// updateFileDisplay(filteredCommits);
// updateStats(data, filteredCommits);

// d3.select('#scatter-story')
//   .selectAll('.step')
//   .data(commits)
//   .join('div')
//   .attr('class', 'step')
//   .html((d, i) => `
//     <p>On ${d.datetime.toLocaleString('en', { dateStyle: 'full', timeStyle: 'short' })},
//     I made <a href="${d.url}" target="_blank">${i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}</a>.
//     I edited ${d.totalLines} lines across ${d3.rollups(d.lines, D => D.length, d => d.file).length} files.
//     Then I looked over all I had made, and I saw that it was very good.</p>
//   `);

// function onStepEnter(response) {
//   const commit = response.element.__data__;
//   commitProgress = timeScale(commit.datetime);
//   slider.value = commitProgress;
//   selectedTime.text(commit.datetime.toLocaleString('en-US', {
//     dateStyle: 'long',
//     timeStyle: 'short'
//   }));
//   filterCommits();
//   updateScatterPlot(data, filteredCommits);
//   updateFileDisplay(filteredCommits);
//   updateStats(data, filteredCommits);
// }

// scrollama()
//   .setup({
//     container: '#scrolly-1',
//     step: '#scrolly-1 .step'
//   })
//   .onStepEnter(onStepEnter);

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import scrollama from 'https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm';

async function loadData() {
  const data = await d3.csv('loc.csv', row => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));
  return data;
}

function processCommits(data) {
  return d3.groups(data, d => d.commit)
    .map(([id, lines]) => {
      const meta = lines[0];
      const datetime = new Date(meta.datetime);
      const commit = {
        id,
        url: `https://github.com/lindbergryan04/portfolio/commit/${id}`,
        author: meta.author,
        date: meta.date,
        time: meta.time,
        timezone: meta.timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length
      };
      Object.defineProperty(commit, 'lines', {
        value: lines,
        enumerable: false,
      });
      return commit;
    }).sort((a, b) => a.datetime - b.datetime);
}

function updateTooltipVisibility(visible) {
  document.getElementById('commit-tooltip').hidden = !visible;
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;
}

function renderTooltipContent(commit) {
  document.getElementById('commit-link').textContent = commit.id;
  document.getElementById('commit-link').href = commit.url;
  document.getElementById('commit-date').textContent = commit.datetime.toLocaleDateString('en');
  document.getElementById('commit-time').textContent = commit.time;
  document.getElementById('commit-author').textContent = commit.author;
  document.getElementById('commit-lines').textContent = commit.totalLines;
}

let xScale, yScale;
const width = 1000, height = 600;
const margin = { top: 10, right: 10, bottom: 30, left: 40 };
const usableArea = {
  top: margin.top,
  left: margin.left,
  right: width - margin.right,
  bottom: height - margin.bottom,
  width: width - margin.left - margin.right,
  height: height - margin.top - margin.bottom
};

function updateScatterPlot(data, commits) {
  let svg = d3.select('#chart').select('svg');
  if (svg.empty()) {
    svg = d3.select('#chart')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .style('overflow', 'visible');

    svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${usableArea.bottom})`);
    svg.append('g').attr('class', 'y-axis').attr('transform', `translate(${usableArea.left}, 0)`);
    svg.append('g').attr('class', 'dots');
  }

  xScale = d3.scaleTime()
    .domain(d3.extent(commits, d => d.datetime))
    .range([usableArea.left, usableArea.right]);

  yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.bottom, usableArea.top]);
  const rScale = d3.scaleSqrt()
    .domain(d3.extent(commits, d => d.totalLines))
    .range([4, 20]);

  const dots = svg.select('g.dots');
  const sortedCommits = d3.sort(commits, d => -d.totalLines);

  dots.selectAll('circle')
    .data(sortedCommits, d => d.id)
    .join('circle')
    .attr('class', 'commit-dot')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines))
    .style('--r', d => rScale(d.totalLines))
    .on('mouseenter', (e, d) => {
      renderTooltipContent(d);
      updateTooltipVisibility(true);
      updateTooltipPosition(e);
    })
    .on('mouseleave', () => updateTooltipVisibility(false));

  svg.select('g.x-axis').call(d3.axisBottom(xScale));
  svg.select('g.y-axis').call(d3.axisLeft(yScale).tickFormat(d => `${d}:00`));
}

function updateFileDisplay(commits) {
  const lines = commits.flatMap(d => d.lines);
  const files = d3.groups(lines, d => d.file)
    .map(([name, lines]) => ({ name, lines, type: lines[0].type }))
    .sort((a, b) => b.lines.length - a.lines.length);

  const colors = d3.scaleOrdinal(["#51127c", "#b73779", "#fc8961", "#fcfdbf"]);

  const container = d3.select('#files')
    .selectAll('div')
    .data(files, d => d.name)
    .join(
      enter => enter.append('div')
        .call(div => {
          div.append('dt').append('code');
          div.append('dd');
        })
    )
    .attr('style', d => `--color: ${colors(d.type)}`);

  container.select('dt > code').text(d => `${d.name} (${d.lines.length} lines)`);
  container.select('dd')
    .selectAll('div')
    .data(d => d.lines)
    .join('div')
    .attr('class', 'line');
}

function updateStats(data, commits) {
  const stat = d3.select('#stats').html('').append('dl').attr('class', 'stats');

  stat.append('dt').text('Commits');
  stat.append('dd').text(commits.length);

  stat.append('dt').text('Files');
  stat.append('dd').text(new Set(data.map(d => d.file)).size);

  stat.append('dt').text('Total LOC');
  stat.append('dd').text(data.length);

  const fileLengths = d3.rollups(data, v => d3.max(v, d => d.line), d => d.file);
  stat.append('dt').text('Max Depth');
  stat.append('dd').text(d3.max(fileLengths, d => d[1]));

  stat.append('dt').text('Longest Line');
  stat.append('dd').text(d3.max(data, d => d.length));

  stat.append('dt').text('Max Lines');
  stat.append('dd').text(d3.max(commits, d => d.totalLines));
}

const data = await loadData();
const commits = processCommits(data);

let commitProgress = 100;
const timeScale = d3.scaleTime()
  .domain(d3.extent(commits, d => d.datetime))
  .range([0, 100]);

let commitMaxTime = timeScale.invert(commitProgress);
let filteredCommits = commits;

function filterCommits() {
  commitMaxTime = timeScale.invert(commitProgress);
  filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);
}

const slider = document.getElementById('commit-slider');
const selectedTime = d3.select('#selectedTime');

slider.addEventListener('input', e => {
  commitProgress = +e.target.value;
  filterCommits();

  selectedTime.text(timeScale.invert(commitProgress).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short'
  }));

  updateScatterPlot(data, filteredCommits);
  updateFileDisplay(filteredCommits);
  updateStats(data, filteredCommits);
});

filterCommits();
updateScatterPlot(data, filteredCommits);
updateFileDisplay(filteredCommits);
updateStats(data, filteredCommits);

d3.select('#scatter-story')
  .selectAll('.step')
  .data(commits)
  .join('div')
  .attr('class', 'step')
  .html((d, i) => `
    <p>On ${d.datetime.toLocaleString('en', { dateStyle: 'full', timeStyle: 'short' })},
    I made <a href="${d.url}" target="_blank">${i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}</a>.
    I edited ${d.totalLines} lines across ${d3.rollups(d.lines, D => D.length, d => d.file).length} files.
    Then I looked over all I had made, and I saw that it was very good.</p>
  `);

function onStepEnter(response) {
  const commit = response.element.__data__;
  commitProgress = timeScale(commit.datetime);
  slider.value = commitProgress;
  selectedTime.text(commit.datetime.toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short'
  }));
  filterCommits();
  updateScatterPlot(data, filteredCommits);
  updateFileDisplay(filteredCommits);
  updateStats(data, filteredCommits);
}

scrollama()
  .setup({
    container: '#scrolly-1',
    step: '#scrolly-1 .step'
  })
  .onStepEnter(onStepEnter);
