// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// async function loadData() {
//     const data = await d3.csv('loc.csv', (row) => ({
//       ...row,
//       line: Number(row.line), // or just +row.line
//       depth: Number(row.depth),
//       length: Number(row.length),
//       date: new Date(row.date + 'T00:00' + row.timezone),
//       datetime: new Date(row.datetime),
//     }));
  
//     return data;
//   }

//   function processCommits(data) {
//     return d3
//       .groups(data, (d) => d.commit)
//       .map(([commit, lines]) => {
//         let first = lines[0];
//         let { author, date, time, timezone, datetime } = first;
//         let ret = {
//           id: commit,
//           url: 'https://github.com/vis-society/lab-7/commit/' + commit,
//           author,
//           date,
//           time,
//           timezone,
//           datetime,
//           hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//           totalLines: lines.length,
//         };
  
//         Object.defineProperty(ret, 'lines', {
//           value: lines,
//           // What other options do we need to set?
//           // Hint: look up configurable, writable, and enumerable
//         });
  
//         return ret;
//       });
//   }

// // (async () => {
// //   const data = await loadData();
// //   // You can now use `data` safely here
// // })();

// function renderCommitInfo(data, commits) {
//     // Create the dl element
//     const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
//     // Add total LOC
//     dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
//     dl.append('dd').text(data.length);
  
//     // Add total commits
//     dl.append('dt').text('Total commits');
//     dl.append('dd').text(commits.length);
  
//     dl.append('dt').text('Number of files');
//     dl.append('dd').text(d3.group(data, d => d.file).size);

//     dl.append('dt').text('Max file length');
//     dl.append('dd').text(d3.max(d3.rollups(data, v => d3.max(v, d => +d.line), d => d.file), d => d[1]));

//     console.log("Example text values:", data.slice(0, 5).map(d => d.text));

//     dl.append('dt').text('Average line length');
//     dl.append('dd').text(d3.mean(data, d => d.length).toFixed(2));

//     dl.append('dt').text('Longest line length');
//     dl.append('dd').text(d3.max(data, d => d.length));

//   }
  
//   let xScale, yScale; // 👈 promote to global so isCommitSelected can use them

// function isCommitSelected(selection, commit) {
//   if (!selection) return false;

//   const [x0, y0] = selection[0];
//   const [x1, y1] = selection[1];

//   const x = xScale(commit.datetime);
//   const y = yScale(commit.hourFrac);

//   return x0 <= x && x <= x1 && y0 <= y && y <= y1;
// }
// function renderSelectionCount(selection, commits) {
//     const selectedCommits = selection
//       ? commits.filter((d) => isCommitSelected(selection, d))
//       : [];
  
//     const countElement = document.querySelector('#selection-count');
//     countElement.textContent = `${
//       selectedCommits.length || 'No'
//     } commits selected`;
  
//     return selectedCommits;
//   }
  
//   function renderLanguageBreakdown(selection, commits) {
//     const selectedCommits = selection
//       ? commits.filter((d) => isCommitSelected(selection, d))
//       : [];
//     const container = document.getElementById('language-breakdown');
  
//     if (selectedCommits.length === 0) {
//       container.innerHTML = '';
//       return;
//     }
  
//     const lines = selectedCommits.flatMap((d) => d.lines);
  
//     const breakdown = d3.rollup(lines, v => v.length, d => d.type);
  
//     container.innerHTML = '';
//     for (const [language, count] of breakdown) {
//       const proportion = count / lines.length;
//       const formatted = d3.format('.1~%')(proportion);
//       container.innerHTML += `
//         <dt>${language}</dt>
//         <dd>${count} lines (${formatted})</dd>
//       `;
//     }
//   }
  

// function renderScatterPlot(data, commits) {
//     const width = 1000;
//     const height = 600;
//     const margin = { top: 10, right: 10, bottom: 30, left: 40 };
  
//     const usableArea = {
//       top: margin.top,
//       right: width - margin.right,
//       bottom: height - margin.bottom,
//       left: margin.left,
//       width: width - margin.left - margin.right,
//       height: height - margin.top - margin.bottom,
//     };
  
//     // Scales
//     xScale = d3.scaleTime()
//       .domain(d3.extent(commits, d => d.datetime))
//       .range([usableArea.left, usableArea.right])
//       .nice();
  
//     yScale = d3.scaleLinear()
//       .domain([0, 24])
//       .range([usableArea.bottom, usableArea.top]);
    
//     const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);

//     const rScale = d3
//         .scaleSqrt()  // square root scale for accurate area perception
//         .domain([minLines, maxLines])
//         .range([2, 30]);  // adjust if dots are too big/small
      
  
//     // Create SVG
//     const svg = d3.select("#chart")
//       .append("svg")
//       .attr("viewBox", `0 0 ${width} ${height}`)
//       .style("overflow", "visible");
  
//     // Add gridlines before axes
//     const gridlines = svg.append("g")
//       .attr("class", "gridlines")
//       .attr("transform", `translate(${usableArea.left}, 0)`);
//     gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));
  
//     // Axes
//     const xAxis = d3.axisBottom(xScale);
//     const yAxis = d3.axisLeft(yScale)
//       .tickFormat(d => String(d % 24).padStart(2, '0') + ":00");
  
//     svg.append("g")
//       .attr("transform", `translate(0, ${usableArea.bottom})`)
//       .call(xAxis);
  
//     svg.append("g")
//       .attr("transform", `translate(${usableArea.left}, 0)`)
//       .call(yAxis);
  
//     // Plot the dots
//     svg.append("g")
//     .attr("class", "dots")
//     .selectAll("circle")
//     .data(d3.sort(commits, d => -d.totalLines))  // Sort by lines (largest first)
//     .join("circle")
//     .attr("cx", d => xScale(d.datetime))
//     .attr("cy", d => yScale(d.hourFrac))
//     .attr("r", d => rScale(d.totalLines))  // ✅ Use rScale to size by totalLines
//     .attr("fill", "steelblue")
//     .style("fill-opacity", 0.7)
//     .on("mouseenter", (event, commit) => {
//       d3.select(event.currentTarget).style("fill-opacity", 1);
//       renderTooltipContent(commit);
//       updateTooltipVisibility(true);
//       updateTooltipPosition(event);
//     })
//     .on("mousemove", (event) => {
//       updateTooltipPosition(event);
//     })
//     .on("mouseleave", (event) => {
//       d3.select(event.currentTarget).style("fill-opacity", 0.7);
//       updateTooltipVisibility(false);
//     });
  
//     const brush = d3.brush()
//   .on('start brush end', brushed);

// svg.call(brush);

// // Raise dots above brush overlay
// svg.selectAll('.dots, .overlay ~ *').raise();

// function brushed(event) {
//   const selection = event.selection;
//   d3.selectAll('circle').classed('selected', d =>
//     isCommitSelected(selection, d)
//   );
//   renderSelectionCount(selection, commits);
//   renderLanguageBreakdown(selection, commits);
// }

//   }

//   function renderTooltipContent(commit) {
//     if (!commit) return;
  
//     const link = document.getElementById('commit-link');
//     const date = document.getElementById('commit-date');
//     const time = document.getElementById('commit-time');
//     const author = document.getElementById('commit-author');
//     const lines = document.getElementById('commit-lines');
  
//     link.href = commit.url;
//     link.textContent = commit.id;
  
//     date.textContent = commit.datetime?.toLocaleDateString('en', { dateStyle: 'full' });
//     time.textContent = commit.datetime?.toLocaleTimeString('en', { timeStyle: 'short' });
//     author.textContent = commit.author;
//     lines.textContent = commit.totalLines;
//   }
//   function updateTooltipVisibility(isVisible) {
//     const tooltip = document.getElementById('commit-tooltip');
//     tooltip.hidden = !isVisible;
//   }

//   function updateTooltipPosition(event) {
//     const tooltip = document.getElementById('commit-tooltip');
//     tooltip.style.left = `${event.clientX + 12}px`;
//     tooltip.style.top = `${event.clientY + 12}px`;
//   }
  
  
//   (async () => {
//     const data = await loadData();
//     const commits = processCommits(data);
//     renderCommitInfo(data, commits);
//     renderScatterPlot(data, commits); // ✅ Add this
//   })();
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let xScale, yScale;
let commitProgress = 100;
let timeScale, commitMaxTime;
let filteredCommits = [];

async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  return data;
}

function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
      });

      return ret;
    });
}

function renderCommitInfo(data, commits) {
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  dl.append('dt').text('Number of files');
  dl.append('dd').text(d3.group(data, d => d.file).size);

  dl.append('dt').text('Max file length');
  dl.append('dd').text(d3.max(d3.rollups(data, v => d3.max(v, d => +d.line), d => d.file), d => d[1]));

  dl.append('dt').text('Average line length');
  dl.append('dd').text(d3.mean(data, d => d.length).toFixed(2));

  dl.append('dt').text('Longest line length');
  dl.append('dd').text(d3.max(data, d => d.length));
}

function isCommitSelected(selection, commit) {
  if (!selection) return false;
  const [x0, y0] = selection[0];
  const [x1, y1] = selection[1];
  const x = xScale(commit.datetime);
  const y = yScale(commit.hourFrac);
  return x0 <= x && x <= x1 && y0 <= y && y <= y1;
}

function renderSelectionCount(selection, commits) {
  const selectedCommits = selection ? commits.filter(d => isCommitSelected(selection, d)) : [];
  const countElement = document.querySelector('#selection-count');
  countElement.textContent = `${selectedCommits.length || 'No'} commits selected`;
  return selectedCommits;
}

function renderLanguageBreakdown(selection, commits) {
  const selectedCommits = selection ? commits.filter(d => isCommitSelected(selection, d)) : [];
  const container = document.getElementById('language-breakdown');
  if (selectedCommits.length === 0) {
    container.innerHTML = '';
    return;
  }
  const lines = selectedCommits.flatMap(d => d.lines);
  const breakdown = d3.rollup(lines, v => v.length, d => d.type);
  container.innerHTML = '';
  for (const [language, count] of breakdown) {
    const proportion = count / lines.length;
    const formatted = d3.format('.1~%')(proportion);
    container.innerHTML += `<dt>${language}</dt><dd>${count} lines (${formatted})</dd>`;
  }
}

function updateScatterPlot(data, commitsToRender) {
  d3.select("#chart").select("svg").remove();

  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 40 };
  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  xScale = d3.scaleTime()
    .domain(d3.extent(commitsToRender, d => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();

  yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([usableArea.bottom, usableArea.top]);

  const [minLines, maxLines] = d3.extent(commitsToRender, d => d.totalLines);
  const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 30]);

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("overflow", "visible");

  svg.append("g")
    .attr("transform", `translate(${usableArea.left}, 0)`)
    .call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, '0') + ":00"));

  svg.append("g")
    .attr("transform", `translate(0, ${usableArea.bottom})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("class", "dots")
    .selectAll("circle")
    .data(d3.sort(commitsToRender, d => -d.totalLines))
    .join("circle")
    .attr("cx", d => xScale(d.datetime))
    .attr("cy", d => yScale(d.hourFrac))
    .attr("r", d => rScale(d.totalLines))
    .attr("class", "commit-dot")
    .style("--r", d => rScale(d.totalLines))
    .attr("fill", "steelblue")
    .style("fill-opacity", 0.7)
    .on("mouseenter", (event, commit) => {
      d3.select(event.currentTarget).style("fill-opacity", 1);
      renderTooltipContent(commit);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on("mousemove", (event) => updateTooltipPosition(event))
    .on("mouseleave", (event) => {
      d3.select(event.currentTarget).style("fill-opacity", 0.7);
      updateTooltipVisibility(false);
    });

  const brush = d3.brush().on('start brush end', brushed);
  svg.call(brush);

  function brushed(event) {
    const selection = event.selection;
    d3.selectAll('circle').classed('selected', d => isCommitSelected(selection, d));
    renderSelectionCount(selection, commitsToRender);
    renderLanguageBreakdown(selection, commitsToRender);
  }
}

function renderTooltipContent(commit) {
  if (!commit) return;
  document.getElementById('commit-link').href = commit.url;
  document.getElementById('commit-link').textContent = commit.id;
  document.getElementById('commit-date').textContent = commit.datetime?.toLocaleDateString('en', { dateStyle: 'full' });
  document.getElementById('commit-time').textContent = commit.datetime?.toLocaleTimeString('en', { timeStyle: 'short' });
  document.getElementById('commit-author').textContent = commit.author;
  document.getElementById('commit-lines').textContent = commit.totalLines;
}

function updateTooltipVisibility(isVisible) {
  document.getElementById('commit-tooltip').hidden = !isVisible;
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX + 12}px`;
  tooltip.style.top = `${event.clientY + 12}px`;
}

function setupTimeSlider(commits, data) {
  timeScale = d3.scaleTime()
    .domain(d3.extent(commits, d => d.datetime))
    .range([0, 100]);

  const timeSlider = document.getElementById('timeSlider');
  const selectedTime = d3.select('#selectedTime');

  timeSlider.addEventListener('input', () => {
    commitProgress = +timeSlider.value;
    commitMaxTime = timeScale.invert(commitProgress);
    selectedTime.text(commitMaxTime.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" }));
    filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);
    updateScatterPlot(data, filteredCommits);
  });

  // Initial values
  commitMaxTime = timeScale.invert(commitProgress);
  selectedTime.text(commitMaxTime.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" }));
  filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);
}

(async () => {
  const data = await loadData();
  const commits = processCommits(data);
  renderCommitInfo(data, commits);
  setupTimeSlider(commits, data);
  updateScatterPlot(data, filteredCommits);
})();
