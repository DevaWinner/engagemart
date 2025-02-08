import { renderWithTemplate, setLocalStorage, getLocalStorage } from './utils.mjs';
import ShoppingCart from './ShoppingCart.mjs';
import { CommentsLikes } from './CommentsLikes.mjs';

export default class ProductDetails {
  constructor(product, dataSource) {
    this.product = product;
    this.dataSource = dataSource;
    // Generate a random session ID for the current browser session
    this.sessionId = sessionStorage.getItem('visitorId') || 
                    'visitor_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('visitorId', this.sessionId);
    this.commentsLikes = new CommentsLikes();
  }

  async init() {
    this.renderProductDetails();
    this.setupEventListeners();
    // Load current likes and comments from Supabase
    await this.commentsLikes.updateLikeUI(this.product.id, '#likeBtn', '#likesCount', this.sessionId);
    await this.commentsLikes.loadComments(this.product.id, '#commentsContainer');
  }

  renderProductDetails() {
    const container = document.getElementById('main-content');
    if (!container) return;
    container.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${this.product.image}" alt="${this.product.title}" class="img-fluid" />
        </div>
        <div class="col-md-6">
          <h2>${this.product.title}</h2>
          <h4 class="text-muted">$${this.product.price}</h4>
          <p>${this.product.description}</p>
          <div class="mb-3">
            <button id="likeBtn" class="btn btn-outline-primary">Like</button>
            <span id="likesCount" class="ms-2">Likes: 0</span>
          </div>
          <div class="mb-3">
            <button id="addToCartBtn" class="btn btn-success">Add to Cart</button>
          </div>
        </div>
      </div>
      <hr/>
      <div>
        <h4>Comments</h4>
        <div id="commentsContainer"></div>
        <form id="commentForm" class="mt-3">
          <div class="mb-3">
            <label for="commentName" class="form-label">Your Name</label>
            <input type="text" 
                   id="commentName" 
                   class="form-control" 
                   placeholder="Enter your name or leave blank for Anonymous"
                   value="${sessionStorage.getItem('visitorName') || ''}"
            />
          </div>
          <div class="mb-3">
            <label for="commentText" class="form-label">Your Comment</label>
            <textarea id="commentText" class="form-control" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Post Comment</button>
        </form>
      </div>
    `;
  }

  setupEventListeners() {
    // Like button
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
      likeBtn.addEventListener('click', async () => {
        await this.commentsLikes.handleLikeToggle(this.product.id, '#likeBtn', '#likesCount', this.sessionId);
      });
    }
    // Add to Cart button
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const cart = new ShoppingCart('em-cart', '.cart-list');
        const count = cart.addItem(this.product);
        alert(`Product added to cart. You now have ${count} item(s) in your cart.`);
      });
    }
    // Comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      // Save name as user types
      const nameInput = document.getElementById('commentName');
      nameInput?.addEventListener('change', (e) => {
        sessionStorage.setItem('visitorName', e.target.value);
      });

      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentText = document.getElementById('commentText').value.trim();
        const userName = document.getElementById('commentName').value.trim() || 'Anonymous';
        if (commentText) {
          await this.commentsLikes.postComment(
            this.product.id,
            userName,
            commentText,
            '#commentsContainer'
          );
          document.getElementById('commentText').value = '';
          // Don't clear the name field - keep it for next comment
        }
      });
    }
  }
}
