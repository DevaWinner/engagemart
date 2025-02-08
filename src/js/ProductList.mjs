import { renderWithTemplate } from './utils.mjs';

export default class ProductList {
  constructor(products, containerSelector) {
    this.products = products;
    this.containerSelector = containerSelector;
  }

  productCardTemplate(product) {
    return `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height:200px; object-fit:contain;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">$${product.price}</p>
            <a href="/productDetails/index.html?id=${product.id}" class="btn btn-primary mt-auto">View Details</a>
          </div>
        </div>
      </div>
    `;
  }

  init() {
    const container = document.querySelector(this.containerSelector);
    if (!container) return;
    container.innerHTML = '<div class="row" id="productsRow"></div>';
    const row = container.querySelector('#productsRow');
    row.innerHTML = this.products.map(prod => this.productCardTemplate(prod)).join('');
  }
}
