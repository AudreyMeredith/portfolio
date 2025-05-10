import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
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
          // What other options do we need to set?
          // Hint: look up configurable, writable, and enumerable
        });
  
        return ret;
      });
  }

// (async () => {
//   const data = await loadData();
//   // You can now use `data` safely here
// })();

function renderCommitInfo(data, commits) {
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    dl.append('dt').text('Number of files');
    dl.append('dd').text(d3.group(data, d => d.file).size);

    dl.append('dt').text('Max file length');
    dl.append('dd').text(d3.max(d3.rollups(data, v => d3.max(v, d => +d.line), d => d.file), d => d[1]));

    console.log("Example text values:", data.slice(0, 5).map(d => d.text));

    dl.append('dt').text('Average line length');
    dl.append('dd').text(d3.mean(data, d => d.length).toFixed(2));

    dl.append('dt').text('Longest line length');
    dl.append('dd').text(d3.max(data, d => d.length));

  }
  
  (async () => {
    const data = await loadData();
    console.log("Example text field values:", data.slice(0, 5).map(d => d.text));
    const commits = processCommits(data);
    renderCommitInfo(data, commits);
  })();
  

