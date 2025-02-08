import WishList from './WishList.mjs';

export default class WishListUI {
  constructor(containerSelector) {
    this.containerSelector = containerSelector;
    this.wishlist = new WishList();
  }

  init() {
    this.renderWishlist();
    this.updateWishlistCount();
  }

  renderWishlist() {
    const container = document.querySelector(this.containerSelector);
    const items = this.wishlist.getItems();

    if (!items.length) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-heart fs-1 text-muted"></i>
          <p class="mt-3">Your wishlist is empty</p>
          <a href="/index.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="row">
        ${items.map((item) => this.wishlistItemTemplate(item)).join('')}
      </div>
    `;

    // Add event listeners for remove buttons
    container.querySelectorAll('.remove-from-wishlist').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.dataset.productId);
        this.wishlist.removeItem(productId);
        this.renderWishlist();
        this.updateWishlistCount();
      });
    });
  }

  wishlistItemTemplate(product) {
    return `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100 shadow-sm border border-light">
          <div class="position-relative p-4">
            <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: contain;">
            <button class="btn position-absolute top-0 end-0 m-2 remove-from-wishlist"
                    data-product-id="${product.id}">
              <i class="bi bi-x-circle fs-4 text-danger"></i>
            </button>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">$${product.price}</p>
            <a href="/productDetails/?id=${product.id}" class="btn btn-primary mt-auto">View Details</a>
          </div>
        </div>
      </div>
    `;
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
