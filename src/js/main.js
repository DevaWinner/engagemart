import { loadHeaderFooter, showSpinner, showError } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  // Load header and footer partials
  await loadHeaderFooter();

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

    // Render the full product grid
    const productList = new ProductList(products, '#main-content');
    productList.init();

    // Set up search & filter functionality (if form exists)
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      const searchInput = document.getElementById('searchInput');
      const filterSelect = document.getElementById('filterSelect');

      const filterAndRender = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value.toLowerCase();
        const filteredProducts = products.filter((product) => {
          const matchesSearch =
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
          const matchesCategory = selectedCategory
            ? product.category.toLowerCase() === selectedCategory
            : true;
          return matchesSearch && matchesCategory;
        });
        const filteredList = new ProductList(filteredProducts, '#main-content');
        filteredList.init();
      };

      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterAndRender();
      });
      searchInput.addEventListener('input', filterAndRender);
      filterSelect.addEventListener('change', filterAndRender);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    showError(
      '#main-content',
      'Failed to load products. Please try again later.'
    );
  }
});
