import { loadHeaderFooter, showSpinner, showError, setupSearch, getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import WishList from './WishList.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  // Load header and footer partials
  await loadHeaderFooter(); // This now handles wishlist count update

  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Show a loading spinner while fetching data
  showSpinner('#main-content');

  const dataSource = new ProductData();
  try {
    const products = await dataSource.getData();
    if (!products || products.length === 0) {
      showError('#main-content', 'No products available at the moment.');
      return;
    }

    // Check for search parameters
    const searchTerm = getParam('search');
    const category = getParam('category');
    
    let displayProducts = products;
    if (searchTerm || category) {
      displayProducts = products.filter(product => {
        const matchesSearch = !searchTerm || 
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !category || 
          product.category.toLowerCase() === category.toLowerCase();
        return matchesSearch && matchesCategory;
      });

      // Update form inputs to match URL parameters
      document.querySelectorAll('#searchInput').forEach(input => {
        input.value = searchTerm || '';
      });
      document.querySelectorAll('#filterSelect').forEach(select => {
        select.value = category || '';
      });
    }

    // Render the full product grid
    const productList = new ProductList(displayProducts, '#main-content');
    productList.init();

    // Setup search with a callback to re-render products
    setupSearch(products, (filteredProducts) => {
      const filteredList = new ProductList(filteredProducts, '#main-content');
      filteredList.init();
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    showError(
      '#main-content',
      'Failed to load products. Please try again later.'
    );
  }
});
