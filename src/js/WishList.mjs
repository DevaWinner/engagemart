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
      console.log('Added to wishlist:', product.title);
    }
    return items.length;
  }

  removeItem(productId) {
    const items = this.getItems();
    const newItems = items.filter(item => item.id !== productId);
    localStorage.setItem(this.key, JSON.stringify(newItems));
    console.log('Removed from wishlist, ID:', productId);
    return newItems.length;
  }

  isInWishlist(productId) {
    const items = this.getItems();
    return items.some(item => item.id === productId);
  }
}

export { WishList as default };
