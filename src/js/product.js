import { loadHeaderFooter, getParam, showSpinner, showError } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();

  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  showSpinner('#main-content');

  // Get the product ID from the URL (e.g., ?id=1)
  const productId = getParam('id');
  if (!productId) {
    showError('#main-content', 'No product ID provided.');
    return;
  }

  const dataSource = new ProductData();
  try {
    const product = await dataSource.findProductById(productId);
    if (!product) {
      showError('#main-content', 'Product not found.');
      return;
    }
    // Initialize the detailed view
    const details = new ProductDetails(product, dataSource);
    details.init();
  } catch (error) {
    console.error('Error loading product details:', error);
    showError('#main-content', 'Failed to load product details.');
  }
});
