import CheckoutProcess from './CheckoutProcess.mjs';

// Initialize checkout process
const checkout = new CheckoutProcess('so-cart', '#order-summary');
checkout.init();

// Add event listener for checkout form submission
document.querySelector('#checkoutSubmit')
  .addEventListener('click', (e) => {
    e.preventDefault();
    
    // Get the form
    const form = document.forms['checkout'];
    
    // Check form validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // If valid, proceed with checkout
    checkout.checkout();
  });

// Update cart badge on page load
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  const totalCount = cart.reduce((sum, item) => sum + (item.Quantity || 1), 0);
  const badge = document.querySelector('#cart-count');
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline' : 'none';
  }
}

updateCartBadge();
