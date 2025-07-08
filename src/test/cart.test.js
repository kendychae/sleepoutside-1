// Simple test to verify cart functionality
import { getLocalStorage, setLocalStorage } from '../js/utils.mjs';

// Mock data for testing
const mockProduct = {
  Id: 'test-123',
  Name: 'Test Product',
  FinalPrice: 99.99,
  Image: 'test-image.jpg',
  Colors: [{ ColorName: 'Red' }],
  Quantity: 1
};

// Test functions
function testAddToCart() {
  console.log('Testing add to cart...');
  
  // Clear cart first
  setLocalStorage('so-cart', []);
  
  // Add product to cart
  const cart = [mockProduct];
  setLocalStorage('so-cart', cart);
  
  // Verify product was added
  const storedCart = getLocalStorage('so-cart');
  console.log('Cart after adding:', storedCart);
  
  if (storedCart.length === 1 && storedCart[0].Id === 'test-123') {
    console.log('✅ Add to cart test passed');
  } else {
    console.log('❌ Add to cart test failed');
  }
}

function testRemoveFromCart() {
  console.log('Testing remove from cart...');
  
  // Set up cart with product
  setLocalStorage('so-cart', [mockProduct]);
  
  // Remove product (simulate removal)
  let cart = getLocalStorage('so-cart') || [];
  cart = cart.filter(item => item.Id !== 'test-123');
  setLocalStorage('so-cart', cart);
  
  // Verify product was removed
  const storedCart = getLocalStorage('so-cart');
  console.log('Cart after removing:', storedCart);
  
  if (storedCart.length === 0) {
    console.log('✅ Remove from cart test passed');
  } else {
    console.log('❌ Remove from cart test failed');
  }
}

function testQuantityUpdate() {
  console.log('Testing quantity update...');
  
  // Set up cart with product
  setLocalStorage('so-cart', [mockProduct]);
  
  // Update quantity
  let cart = getLocalStorage('so-cart') || [];
  const itemIndex = cart.findIndex(item => item.Id === 'test-123');
  if (itemIndex !== -1) {
    cart[itemIndex].Quantity = 3;
    setLocalStorage('so-cart', cart);
  }
  
  // Verify quantity was updated
  const storedCart = getLocalStorage('so-cart');
  console.log('Cart after quantity update:', storedCart);
  
  if (storedCart.length === 1 && storedCart[0].Quantity === 3) {
    console.log('✅ Quantity update test passed');
  } else {
    console.log('❌ Quantity update test failed');
  }
}

// Run tests
console.log('=== Cart Functionality Tests ===');
testAddToCart();
testRemoveFromCart();
testQuantityUpdate();
console.log('=== Tests Complete ===');
