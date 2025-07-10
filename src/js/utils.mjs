// Wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage, returns null if not found
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error parsing localStorage data for key:", key, e);
    return null;
  }
}

// Save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Set a listener for both touchend and click, avoiding duplicate calls
export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element) return;

  let called = false;
  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    if (!called) {
      called = true;
      callback(event);
      setTimeout(() => { called = false; }, 300);
    }
  });
  element.addEventListener("click", (event) => {
    if (!called) {
      called = true;
      callback(event);
      setTimeout(() => { called = false; }, 300);
    }
  });
}

// Get parameter from URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Load header and footer functionality
export function loadHeaderFooter() {
  // Update cart badge on all pages
  updateCartBadge();
  
  // Add event listeners for navigation if needed
  // This is a placeholder for more complex header/footer functionality
}

// Animate cart icon when item is added
export function animateCartIcon() {
  const cartIcon = document.querySelector('.cart-icon');
  const cartCount = document.querySelector('#cart-count');
  
  if (cartIcon) {
    // Add bounce animation to cart icon
    cartIcon.classList.add('bounce');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      cartIcon.classList.remove('bounce');
    }, 600);
  }
  
  if (cartCount && cartCount.style.display !== 'none') {
    // Add pulse animation to cart count
    cartCount.classList.add('cart-count-pulse');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      cartCount.classList.remove('cart-count-pulse');
    }, 400);
  }
}

// Update cart badge function
function updateCartBadge() {
  const cart = getLocalStorage('so-cart') || [];
  const totalCount = cart.reduce((sum, item) => sum + (item.Quantity || 1), 0);
  const badge = document.querySelector('#cart-count');
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline' : 'none';
  }
}

// Alert message function for displaying errors and success messages
export function alertMessage(message, scroll = true, type = 'error') {
  // create element to hold the alert
  const alert = document.createElement('div');
  // add a class to style the alert
  alert.classList.add('alert');
  if (type === 'success') {
    alert.classList.add('success');
  } else if (type === 'info') {
    alert.classList.add('info');
  }
  // set the contents. You should have a message and an X or something the user can click on to remove
  alert.innerHTML = `<p>${message}</p><span class="alert-close">&times;</span>`;

  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child
  alert.addEventListener('click', function(e) {
    if (e.target.classList.contains('alert-close')) {
      const main = document.querySelector('main');
      if (main && main.contains(this)) {
        main.removeChild(this);
      }
    }
  });

  // add the alert to the top of main
  const main = document.querySelector('main');
  if (main) {
    main.prepend(alert);
  }

  // make sure they see the alert by scrolling to the top of the window
  // you may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) {
    window.scrollTo(0, 0);
  }

  // Auto-remove success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 3000);
  }
}