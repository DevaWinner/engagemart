import { renderWithTemplate } from './utils.mjs';
import WishList from './WishList.mjs';

export default class ProductList {
  constructor(products, containerSelector) {
    this.products = products;
    this.containerSelector = containerSelector;
    this.wishlist = new WishList();
  }

  productCardTemplate(product) {
    const isInWishlist = this.wishlist.isInWishlist(product.id);
    return `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100">
          <div class="position-relative">
            <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height:200px; object-fit:contain;">
            <button class="btn position-absolute top-0 end-0 m-2 wishlist-btn" 
                    data-product-id="${product.id}"
                    title="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
              <i class="bi bi-heart${isInWishlist ? '-fill text-danger' : ''} fs-5"></i>
            </button>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">$${product.price}</p>
            <a href="productDetails/index.html?id=${product.id}" class="btn btn-primary mt-auto">View Details</a>
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
    
    // Add event listeners for wishlist buttons
    row.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        const product = this.products.find(p => p.id === productId);
        const icon = btn.querySelector('i');
        
        if (this.wishlist.isInWishlist(productId)) {
          this.wishlist.removeItem(productId);
          icon.classList.remove('bi-heart-fill', 'text-danger');
          icon.classList.add('bi-heart');
          btn.title = 'Add to Wishlist';
        } else {
          this.wishlist.addItem(product);
          icon.classList.remove('bi-heart');
          icon.classList.add('bi-heart-fill', 'text-danger');
          btn.title = 'Remove from Wishlist';
        }
        this.updateWishlistCount();
      });
    });

    // Update wishlist count on initial load
    this.updateWishlistCount();
  }

  updateWishlistCount() {
    const count = this.wishlist.getItems().length;
    const countElement = document.querySelector('#wishlist-count');
    if (countElement) {
      countElement.textContent = count;
      countElement.style.display = count > 0 ? 'inline' : 'none';
    }
  }
}
