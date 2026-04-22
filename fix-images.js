const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Handle meta description
if (!html.includes('<meta name="description"')) {
  html = html.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <meta name="description" content="Discover stunning floral arrangements and beautiful fresh bouquets for every occasion at Flora. We bring joy and elegance to your celebrations.">`
  );
}

// Handle aria labels
html = html.replace(/<a href="\.\/index\.html" class="header-logo-link animate__animated animate__pulse">/g, '<a href="./index.html" class="header-logo-link animate__animated animate__pulse" aria-label="Flora Home">');
html = html.replace(/<a href="\.\/index\.html" class="footer-logo-link">/g, '<a href="./index.html" class="footer-logo-link" aria-label="Flora Home">');
html = html.replace(/<button type="button" class="menu-button" aria-expanded="false" data-menu-button>/g, '<button type="button" class="menu-button" aria-expanded="false" data-menu-button aria-label="Toggle mobile menu">');
html = html.replace(/<button type="button" class="menu-button" aria-expanded="false" data-menu-button aria-label="Toggle mobile menu">[\s\S]*?<svg class="menu-icon menu-icon__burger" width="24" height="24">[\s\S]*?<use href="\.\/images\/icons\.svg#menu"><\/use>[\s\S]*?<\/svg>[\s\S]*?<svg class="menu-icon menu-icon__close" width="24" height="24">[\s\S]*?<use href="\.\/images\/icons\.svg#close_x"><\/use>[\s\S]*?<\/svg>[\s\S]*?<\/button>/g, `<button type="button" class="menu-button" aria-expanded="false" data-menu-button aria-label="Toggle mobile menu">\r\n        <svg class="menu-icon menu-icon__burger" width="24" height="24"><use href="./images/icons.svg#menu"></use></svg>\r\n        <svg class="menu-icon menu-icon__close" width="24" height="24"><use href="./images/icons.svg#close_x"></use></svg>\r\n      </button>`);

// Fix AOS
html = html.replace(/<section class="section-wrapper hero-section" data-aos="zoom-in">/g, '<section class="section-wrapper hero-section">');

// Find all <img> tags in the document and process them manually
const parts = html.split(/(<img[^>]+>)/gi);
let newHtml = "";

for (let part of parts) {
  if (part.toLowerCase().startsWith('<img ')) {
    // Only process images that reference ./images/(something)@X1.jpg
    const match = part.match(/src="\.\/images\/([^@"]+)@X1\.jpg"/);
    if (match) {
      const baseName = match[1];
      let imgStr = part;

      // Add fetchpriority to hero, loading lazy to others
      if (baseName === 'hero') {
        if (!imgStr.includes('fetchpriority')) {
          imgStr = imgStr.replace('<img ', '<img fetchpriority="high" ');
        }
      } else {
        if (!imgStr.includes('loading="lazy"')) {
          imgStr = imgStr.replace('<img ', '<img loading="lazy" ');
        }
      }

      // Construct Picture wrapper
      newHtml += `\n          <picture>\n            <source type="image/webp" srcset="./images/webp/${baseName}@X1.webp 1x, ./images/webp/${baseName}@X2.webp 2x">\n            ${imgStr}\n          </picture>`;
      continue;
    }
  }
  newHtml += part;
}

fs.writeFileSync('index.html', newHtml);
console.log("Replaced perfectly via string split.");
