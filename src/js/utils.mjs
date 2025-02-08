export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function renderWithTemplate(templateFn, parentElement, data, position = 'beforeend', clear = false, callback) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  if (Array.isArray(data)) {
    const html = data.map(item => templateFn(item)).join('');
    parentElement.insertAdjacentHTML(position, html);
  } else {
    parentElement.insertAdjacentHTML(position, templateFn(data));
  }
  if (callback) callback(data);
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  const templateEl = document.createElement('template');
  templateEl.innerHTML = template;
  return templateEl;
}

export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate('/public/partials/header.html');
    const footerTemplate = await loadTemplate('/public/partials/footer.html');
    const headerEl = qs('#main-header');
    const footerEl = qs('#main-footer');
    if (headerEl) headerEl.innerHTML = headerTemplate.innerHTML;
    if (footerEl) footerEl.innerHTML = footerTemplate.innerHTML;
    updateWishlistCount(); // Add this line
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
}

export function showSpinner(containerSelector) {
  const container = qs(containerSelector);
  if (container) {
    container.innerHTML = `
      <div class="d-flex justify-content-center my-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }
}

export function showError(containerSelector, message) {
  const container = qs(containerSelector);
  if (container) {
    container.innerHTML = `
      <div class="alert alert-danger my-5" role="alert">
        ${message}
      </div>
    `;
  }
}

export function setupSearch(products, renderFn) {
  const forms = document.querySelectorAll('form[id="searchForm"]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = form.querySelector('input[type="search"]');
      const filterSelect = form.querySelector('select');
      const searchTerm = searchInput?.value || '';
      const category = filterSelect?.value || '';

      // Build search URL params
      const searchParams = new URLSearchParams();
      if (searchTerm) searchParams.append('search', searchTerm);
      if (category) searchParams.append('category', category);

      // If not on index page OR there are no products (meaning we're not on main page)
      if (!products || !window.location.pathname.endsWith('/index.html')) {
        // Navigate to home page with search params
        window.location.href = `/index.html${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        return;
      }

      // Only execute search if we're on index page with products
      if (renderFn) {
        const filteredProducts = products.filter(product => {
          const matchesSearch = !searchTerm || 
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = !category || 
            product.category.toLowerCase() === category.toLowerCase();
          return matchesSearch && matchesCategory;
        });
        renderFn(filteredProducts);
      }
    });
  });
}

export function updateWishlistCount() {
  const items = JSON.parse(localStorage.getItem('em-wishlist')) || [];
  const countElement = document.querySelector('#wishlist-count');
  if (countElement) {
    countElement.textContent = items.length;
    countElement.style.display = items.length > 0 ? 'inline' : 'none';
  }
}
