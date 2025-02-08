import {
  getComments,
  postComment,
  getLikesCount,
  userHasLiked,
  toggleLike
} from './SupabaseIntegration.mjs';

export class CommentsLikes {
  async loadComments(productId, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    try {
      const comments = await getComments(productId);
      if (comments.length === 0) {
        container.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
      } else {
        container.innerHTML = '';
        comments.forEach(comment => {
          const commentDiv = document.createElement('div');
          commentDiv.className = 'border p-2 mb-2 rounded';
          commentDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
              <strong class="text-primary">${comment.user_id}</strong>
              <small class="text-muted">${new Date(comment.created_at).toLocaleString()}</small>
            </div>
            <p class="mb-0 mt-1">${comment.text}</p>
          `;
          container.appendChild(commentDiv);
        });
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      container.innerHTML = '<p class="text-danger">Error loading comments.</p>';
    }
  }

  async postComment(productId, userId, text, containerSelector) {
    try {
      const result = await postComment(productId, userId, text);
      if (result) {
        await this.loadComments(productId, containerSelector);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment. Please try again.');
    }
  }

  async updateLikeUI(productId, likeBtnSelector, likesCountSelector, userId) {
    const likeBtn = document.querySelector(likeBtnSelector);
    const likesCountElem = document.querySelector(likesCountSelector);
    try {
      const count = await getLikesCount(productId);
      const hasLiked = await userHasLiked(productId, userId);
      likesCountElem.textContent = `Likes: ${count}`;
      if (hasLiked) {
        likeBtn.classList.remove('btn-outline-primary');
        likeBtn.classList.add('btn-primary');
        likeBtn.textContent = 'Unlike';
      } else {
        likeBtn.classList.remove('btn-primary');
        likeBtn.classList.add('btn-outline-primary');
        likeBtn.textContent = 'Like';
      }
    } catch (error) {
      console.error('Error updating like UI:', error);
    }
  }

  async handleLikeToggle(productId, likeBtnSelector, likesCountSelector, userId) {
    try {
      await toggleLike(productId, userId);
      await this.updateLikeUI(productId, likeBtnSelector, likesCountSelector, userId);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Error toggling like. Please try again.');
    }
  }
}
