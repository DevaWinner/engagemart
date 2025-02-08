import { updateWishlistCount } from './utils.mjs';

class WishList {
  constructor(key = 'em-wishlist') {
    this.key = key;
  }

  getItems() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  }

  addItem(product) {
    const items = this.getItems();
    if (!items.find(item => item.id === product.id)) {
      items.push(product);
      localStorage.setItem(this.key, JSON.stringify(items));
      updateWishlistCount();
    }
    return items.length;
  }

  removeItem(productId) {
    const items = this.getItems();
    const newItems = items.filter(item => item.id !== productId);
    localStorage.setItem(this.key, JSON.stringify(newItems));
    updateWishlistCount();
    return newItems.length;
  }

  isInWishlist(productId) {
    const items = this.getItems();
    return items.some(item => item.id === productId);
  }
}

export { WishList as default };
