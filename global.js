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

