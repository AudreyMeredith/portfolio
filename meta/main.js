// // Updated meta.js with Scrollama-based scrollytelling

// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import scrollama from "https://cdn.jsdelivr.net/npm/scrollama/+esm";

// let commits = [];

// function updateScatterPlot(data) {
//   d3.select("#chart svg").remove();

//   const width = 1000, height = 300;
//   const margin = { top: 10, right: 10, bottom: 30, left: 40 };
//   const usableWidth = width - margin.left - margin.right;
//   const usableHeight = height - margin.top - margin.bottom;

//   const svg = d3.select("#chart")
//     .append("svg")
//     .attr("viewBox", `0 0 ${width} ${height}`);

//   const xScale = d3.scaleTime()
//     .domain(d3.extent(data, d => d.datetime))
//     .range([margin.left, width - margin.right]);

//   const yScale = d3.scaleLinear()
//     .domain([0, 24])
//     .range([height - margin.bottom, margin.top]);

//   const rScale = d3.scaleSqrt()
//     .domain(d3.extent(data, d => d.totalLines))
//     .range([2, 20]);

//   svg.selectAll("circle")
//     .data(data)
//     .join("circle")
//     .attr("class", "commit-dot")
//     .attr("cx", d => xScale(d.datetime))
//     .attr("cy", d => yScale(d.datetime.getHours() + d.datetime.getMinutes() / 60))
//     .attr("r", d => rScale(d.totalLines))
//     .style("--r", d => rScale(d.totalLines));
// }

// (async () => {
//   const rawData = await d3.csv("loc.csv", row => ({
//     ...row,
//     line: +row.line,
//     datetime: new Date(row.datetime),
//     totalLines: +row.length
//   }));

//   commits = d3.groups(rawData, d => d.commit).map(([id, lines]) => {
//     const meta = lines[0];
//     return {
//       id,
//       url: `https://github.com/yourrepo/commit/${id}`,
//       datetime: meta.datetime,
//       author: meta.author,
//       totalLines: lines.length,
//       lines
//     };
//   });

//   commits.sort((a, b) => a.datetime - b.datetime);

//   // Initial scatter plot
//   updateScatterPlot(commits);

//   // Generate narrative text
//   d3.select('#scatter-story')
//     .selectAll('.step')
//     .data(commits)
//     .join('div')
//     .attr('class', 'step')
//     .style('padding-bottom', '4rem')
//     .html((d, i) => {
//       const fileCount = d3.rollups(d.lines, D => D.length, d => d.file).length;
//       const date = d.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" });
//       const commitType = i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious';
//       return `<p>On ${date}, I made <a href="${d.url}" target="_blank">${commitType}</a>. I edited ${d.totalLines} lines across ${fileCount} files. Then I looked over all I had made, and I saw that it was very good.</p>`;
//     });

//   function onStepEnter(response) {
//     const commit = response.element.__data__;
//     updateScatterPlot([commit]);
//   }

//   const scroller = scrollama();
//   scroller
//     .setup({
//       container: '#scrolly-1',
//       step: '#scrolly-1 .step'
//     })
//     .onStepEnter(onStepEnter);
// })();

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import scrollama from "https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm";

let commits = [];

function renderScatterPlot(data) {
  const width = 1000,
    height = 300,
    margin = { top: 10, right: 10, bottom: 30, left: 40 };

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.datetime))
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([height - margin.bottom, margin.top]);

  const rScale = d3.scaleSqrt()
    .domain(d3.extent(data, d => d.totalLines))
    .range([2, 20]);

  const dots = svg.append("g").attr("class", "dots");

  dots.selectAll("circle")
    .data(data, d => d.id)
    .join("circle")
    .attr("class", "commit-dot")
    .attr("cx", d => xScale(d.datetime))
    .attr("cy", d => yScale(d.datetime.getHours() + d.datetime.getMinutes() / 60))
    .attr("r", d => rScale(d.totalLines))
    .style("--r", d => rScale(d.totalLines));
}

function updateScatterPlot(data) {
  const svg = d3.select("#chart svg");
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.datetime))
    .range([40, 1000 - 10]);

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([300 - 30, 10]);

  const rScale = d3.scaleSqrt()
    .domain(d3.extent(data, d => d.totalLines))
    .range([2, 20]);

  svg.select("g.dots")
    .selectAll("circle")
    .data(data, d => d.id)
    .join("circle")
    .attr("class", "commit-dot")
    .attr("cx", d => xScale(d.datetime))
    .attr("cy", d => yScale(d.datetime.getHours() + d.datetime.getMinutes() / 60))
    .attr("r", d => rScale(d.totalLines))
    .style("--r", d => rScale(d.totalLines));
}

function updateFileDisplay(filteredCommits) {
  const lines = filteredCommits.flatMap(d => d.lines);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  const files = d3.groups(lines, d => d.file)
    .map(([name, lines]) => ({ name, lines, type: lines[0].type }))
    .sort((a, b) => b.lines.length - a.lines.length);

  const container = d3.select('#files')
    .selectAll('div')
    .data(files, d => d.name)
    .join(enter => enter.append('div')
      .call(div => {
        div.append('dt').append('code');
        div.append('dd');
      }))
    .attr("style", d => `--color: ${colors(d.type)}`);

  container.select('dt > code')
    .html(d => `${d.name} <small>${d.lines.length} lines</small>`);

  container.select('dd')
    .selectAll('div')
    .data(d => d.lines)
    .join('div')
    .attr('class', 'line');
}

(async () => {
  const rawData = await d3.csv("loc.csv", row => ({
    ...row,
    line: +row.line,
    datetime: new Date(row.datetime),
    totalLines: +row.length
  }));

  commits = d3.groups(rawData, d => d.commit).map(([id, lines]) => {
    const meta = lines[0];
    return {
      id,
      url: `https://github.com/yourrepo/commit/${id}`,
      datetime: meta.datetime,
      author: meta.author,
      totalLines: lines.length,
      lines
    };
  });

  commits.sort((a, b) => a.datetime - b.datetime);

  renderScatterPlot(commits);

  d3.select('#scatter-story')
    .selectAll('.step')
    .data(commits)
    .join('div')
    .attr('class', 'step')
    .html((d, i) => {
      const fileCount = d3.rollups(d.lines, D => D.length, d => d.file).length;
      const date = d.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" });
      const commitType = i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious';
      return `<p>On ${date}, I made <a href="${d.url}" target="_blank">${commitType}</a>. I edited ${d.totalLines} lines across ${fileCount} files. Then I looked over all I had made, and I saw that it was very good.</p>`;
    });

  const scroller = scrollama();
  scroller.setup({
    container: '#scrolly-1',
    step: '#scrolly-1 .step'
  }).onStepEnter(response => {
    const commit = response.element.__data__;
    updateScatterPlot(commits.filter(d => d.datetime <= commit.datetime));
    updateFileDisplay(commits.filter(d => d.datetime <= commit.datetime));
  });
})();