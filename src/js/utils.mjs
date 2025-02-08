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
