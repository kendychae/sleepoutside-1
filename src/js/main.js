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

// Welcome Modal Functionality
function initWelcomeModal() {
  const modal = document.getElementById('welcome-modal');
  const closeBtn = document.querySelector('.close');
  const registrationForm = document.getElementById('registration-form');
  
  // Check if user has visited before
  const hasVisited = localStorage.getItem('hasVisited');
  
  if (!hasVisited) {
    // Show modal after a short delay for first-time visitors
    setTimeout(() => {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }, 1500);
  }
  
  // Close modal functionality
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    localStorage.setItem('hasVisited', 'true');
  }
  
  // Close on X button click
  closeBtn.addEventListener('click', closeModal);
  
  // Close on outside click
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
  
  // Handle registration form submission
  registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const newsletter = document.getElementById('reg-newsletter').checked;
    
    // Simulate registration (in real app, would send to server)
    const registrationData = {
      name,
      email,
      newsletter,
      registeredAt: new Date().toISOString(),
      giveawayEntry: true
    };
    
    // Store registration data
    localStorage.setItem('userRegistration', JSON.stringify(registrationData));
    
    // Show success message
    alert(`Thank you ${name}! You've been registered and entered into our giveaway. Good luck! 🍀`);
    
    // Close modal
    closeModal();
  });
}

// Initialize
updateCartBadge();
initWelcomeModal();
