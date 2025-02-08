import { renderWithTemplate, setupSearch } from './utils.mjs';
import { CommentsLikes } from './CommentsLikes.mjs';
import WishList from './WishList.mjs';

export default class ProductDetails {
  constructor(product, dataSource) {
    this.product = product;
    this.dataSource = dataSource;
    // Generate a random session ID for the current browser session
    this.sessionId =
      sessionStorage.getItem('visitorId') ||
      'visitor_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('visitorId', this.sessionId);
    this.commentsLikes = new CommentsLikes();
    this.wishlist = new WishList();
  }

  async init() {
    this.renderProductDetails();
    this.setupEventListeners();
    // Initialize search functionality without products array
    setupSearch(null, null);
    // Load current likes and comments from Supabase
    await this.commentsLikes.updateLikeUI(
      this.product.id,
      '#likeBtn',
      '#likesCount',
      this.sessionId
    );
    await this.commentsLikes.loadComments(
      this.product.id,
      '#commentsContainer'
    );
  }

  renderProductDetails() {
    const container = document.getElementById('main-content');
    if (!container) return;
    const isInWishlist = this.wishlist.isInWishlist(this.product.id);
    container.innerHTML = `
      <div class="row p-3">
        <div class="col-md-6">
          <img src="${this.product.image}" alt="${this.product.title}" class="img-fluid" />
        </div>
        <div class="col-md-6">
          <h2>${this.product.title}</h2>
          <h4 class="text-muted">$${this.product.price}</h4>
          <p>${this.product.description}</p>
          <div class="mb-3 d-flex gap-2">
            <button id="likeBtn" class="btn btn-outline-primary">
              <i class="bi bi-hand-thumbs-up"></i> Like
            </button>
            <span id="likesCount" class="btn btn-light disabled">0 likes</span>
          </div>
          <button id="wishlistBtn" class="btn ${isInWishlist ? 'btn-danger' : 'btn-outline-danger'}">
              <i class="bi bi-heart${isInWishlist ? '-fill' : ''}"></i>
              ${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
        </div>
      </div>
      <hr/>
      <div class="p-3">
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
        await this.commentsLikes.handleLikeToggle(
          this.product.id,
          '#likeBtn',
          '#likesCount',
          this.sessionId
        );
      });
    }

    // Wishlist button
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        if (this.wishlist.isInWishlist(this.product.id)) {
          this.wishlist.removeItem(this.product.id);
          wishlistBtn.classList.remove('btn-danger');
          wishlistBtn.classList.add('btn-outline-danger');
          wishlistBtn.innerHTML = '<i class="bi bi-heart"></i> Add to Wishlist';
        } else {
          this.wishlist.addItem(this.product);
          wishlistBtn.classList.remove('btn-outline-danger');
          wishlistBtn.classList.add('btn-danger');
          wishlistBtn.innerHTML =
            '<i class="bi bi-heart-fill"></i> Remove from Wishlist';
        }
        this.updateWishlistCount();
      });
    }

    // Comment form handling
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
        const userName =
          document.getElementById('commentName').value.trim() || 'Anonymous';
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

  updateWishlistCount() {
    const count = this.wishlist.getItems().length;
    const countElement = document.querySelector('#wishlist-count');
    if (countElement) {
      countElement.textContent = count;
      countElement.style.display = count > 0 ? 'inline' : 'none';
    }
  }
}
