import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

// Detect which product category to load based on query string
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Default to "tents" category (you can make this dynamic later)
const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
  updateCartBadge();
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  if (product) {
    addProductToCart(product);
  } else {
    console.error("Product not found for ID:", e.target.dataset.id);
  }
}

// Display product details
async function displayProductDetails() {
  const product = await dataSource.findProductById(productId);
  if (!product) {
    document.querySelector(".product-detail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.querySelector(".product-detail").innerHTML = `
    <h3>${product.Name}</h3>
    <img src="${product.Image}" alt="${product.Name}">
    <p class="price">$${product.FinalPrice}</p>
    <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
  `;

  qs("#addToCart").addEventListener("click", addToCartHandler);
}

// Update cart badge count
function updateCartBadge() {
  const cart = getLocalStorage("so-cart") || [];
  const badge = document.querySelector("#cart-count");
  if (badge) {
    badge.textContent = cart.length;
    badge.style.display = cart.length > 0 ? "inline" : "none";
  }
}

// Init
displayProductDetails();
updateCartBadge();
