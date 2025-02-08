import { loadHeaderFooter } from './utils.mjs';
import WishListUI from './WishListUI.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadHeaderFooter();
    console.log('Initializing wishlist UI...');
    const wishlistUI = new WishListUI('#wishlist-container');
    wishlistUI.init();
  } catch (error) {
    console.error('Error initializing wishlist:', error);
  }
});
