import { loadHeaderFooter, getLocalStorage } from './utils.mjs';

// Load header and footer
loadHeaderFooter();

// Update cart badge on main page
function updateCartBadge() {
  const cart = getLocalStorage('so-cart') || [];
  const totalCount = cart.reduce((sum, item) => sum + (item.Quantity || 1), 0);
  const badge = document.querySelector('#cart-count');
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline' : 'none';
  }
}

// Initialize
updateCartBadge();
