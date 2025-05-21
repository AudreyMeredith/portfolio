console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );

// currentLink?.classList.add('current');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'meta/', title: 'Meta' }, // 
  { url: 'resume.html', title: 'Resume' },
  { url: 'https://github.com/AudreyMeredith', title: 'GitHub' }
];


let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "/"                  // Local server
: "/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    

    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
      }

    //   a.classList.toggle(
    //     'current',
    //     a.host === location.host && a.pathname === location.pathname,
    //   );

    const absoluteURL = new URL(url, location.href);
    let a = document.createElement('a');
    // a.href = url;
    // a.textContent = title;
    a.href = absoluteURL.href;
    a.textContent = title;

    if (absoluteURL.host === location.host && absoluteURL.pathname === location.pathname) {
        a.classList.add('current');
      }
    if (absoluteURL.host !== location.host) {
        a.target = "_blank";
      }

    nav.append(a);
  }
  document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select id="theme-select">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

const select = document.getElementById('theme-select');
const root = document.documentElement;

// Load saved preference from localStorage
let savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  select.value = savedTheme;
  root.style.colorScheme = savedTheme;
} else {
  // If nothing saved, use automatic
  root.style.colorScheme = 'light dark';
}


// Apply selected theme on change
select.addEventListener('change', (event) => {
  const value = select.value;
  localStorage.setItem('theme', value);
  root.style.colorScheme = value;
  localStorage.colorScheme = event.target.value
});


// url = !url.startsWith('http') ? BASE_PATH + url : url;

const form = document.querySelector('form');

form?.addEventListener('submit', (event) => {
  event.preventDefault(); // Stop the default form submission

  const data = new FormData(form);
  let params = [];

  for (let [name, value] of data) {
    console.log(name, value); // Show in console
    // Encode each name and value, then add to the array as name=value
    params.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
  }

  // Join all parameters with & and build the full URL
  const url = `${form.action}?${params.join('&')}`;

  // Open the email client with the prefilled values
  location.href = url;
});

export async function fetchJSON(url) {
    try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
        const data = await response.json();
        return data;
    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    }
  }

  export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    // Step 1: Validate input
    if (!Array.isArray(projects)) {
      console.error('renderProjects: projects must be an array');
      return;
    }
  
    if (!(containerElement instanceof HTMLElement)) {
      console.error('renderProjects: containerElement must be a valid DOM element');
      return;
    }
  
    // Optional: Validate headingLevel is a proper h1–h6 tag
    const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadings.includes(headingLevel)) {
      console.warn(`Invalid heading level "${headingLevel}". Defaulting to h2.`);
      headingLevel = 'h2';
    }
  
    // Step 2: Clear container to avoid duplicates
    containerElement.innerHTML = '';
  
    // Step 3–5: Loop and create each article
    projects.forEach(project => {
      const article = document.createElement('article');
  
      // Fallbacks for missing data
      const title = project.title || 'Untitled Project';
      const image = project.image || 'https://via.placeholder.com/300x200?text=No+Image';
      const description = project.description || 'No description available.';
  
      // Step 4: Use dynamic heading + insert content
      article.innerHTML = `
      <${headingLevel}>${title}</${headingLevel}>
      <img src="${image}" alt="${title}" loading="lazy">
      <div class="project-text">
        <p>${description}</p>
        <p class="project-year">${project.year || ''}</p>
      </div>
    `;
    
  
      // Step 5: Append to container
      containerElement.appendChild(article);
    });
  
    // Step 6: Handle empty array
    if (projects.length === 0) {
      const placeholder = document.createElement('p');
      placeholder.textContent = 'No projects to display.';
      placeholder.style.fontStyle = 'italic';
      containerElement.appendChild(placeholder);
    }
  }
  
  export async function fetchGitHubData(username) {
    // return statement here
    return fetchJSON(`https://api.github.com/users/${username}`);
  }
