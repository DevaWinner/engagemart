export default class ProductData {
  constructor() {
    this.apiURL = 'https://fakestoreapi.com/products';
  }

  async getData() {
    const response = await fetch(this.apiURL);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  }

  async findProductById(id) {
    const response = await fetch(`${this.apiURL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  }
}
