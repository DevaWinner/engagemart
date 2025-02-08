import { getLocalStorage, setLocalStorage, renderWithTemplate } from './utils.mjs';

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
    this.total = 0;
  }

  init() {
    let cartItems = getLocalStorage(this.key) || [];
    // Consolidate duplicate items
    const consolidated = cartItems.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, quantity: 0 };
      }
      acc[item.id].quantity += item.quantity || 1;
      return acc;
    }, {});
    cartItems = Object.values(consolidated);
    setLocalStorage(this.key, cartItems);
    this.calculateTotal(cartItems);
    this.renderCart(cartItems);
  }

  calculateTotal(cartItems) {
    this.total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  }

  renderCart(cartItems) {
    const container = document.querySelector(this.parentSelector);
    if (!container) return;
    if (cartItems.length === 0) {
      container.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }
    const template = (item) => `
      <div class="cart-item border p-2 mb-2">
        <div>${item.title}</div>
        <div>Quantity: ${item.quantity}</div>
        <div>Price: $${(item.price * item.quantity).toFixed(2)}</div>
        <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Remove</button>
      </div>
    `;
    renderWithTemplate(template, container, cartItems, 'beforeend', true);
    container.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => this.removeItem(e));
    });
  }

  removeItem(e) {
    const id = e.target.getAttribute('data-id');
    let cartItems = getLocalStorage(this.key) || [];
    cartItems = cartItems.filter(item => item.id != id);
    setLocalStorage(this.key, cartItems);
    this.init();
  }

  addItem(product) {
    let cartItems = getLocalStorage(this.key) || [];
    const existing = cartItems.find(item => item.id == product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      cartItems.push(product);
    }
    setLocalStorage(this.key, cartItems);
    return cartItems.length;
  }
}
