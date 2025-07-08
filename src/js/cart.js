import { getLocalStorage } from "./utils.mjs";

// Adjust this if your images folder moves
const imageBasePath = "../images/";

// Fixes image paths to be relative to the cart page
function fixImagePath(relativePath) {
  if (!relativePath) return "";
  // Remove any leading ../ from the path and prepend imageBasePath
  return imageBasePath + relativePath.replace(/^(\.\.\/)+images\//, "");
}

// Renders the cart contents to the page
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (!productList) return;

  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty.</p>";
    updateCartBadge(0);
    return;
  }

  const htmlItems = cartItems.map(cartItemTemplate).join("");
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice) * (item.Quantity || 1),
    0,
  );

  productList.innerHTML = `
    ${htmlItems}
    <li class="cart-total">Total: $${total.toFixed(2)}</li>
  `;

  updateCartBadge(cartItems);
}

// Template for each cart item
function cartItemTemplate(item) {
  // Build product page link relative to cart page
  const productLink = `../product_pages/index.html?id=${encodeURIComponent(item.Id)}`;
  return `
    <li class="cart-card divider">
      <a href="${productLink}" class="cart-card__image">
        <img src="${fixImagePath(item.Image)}" alt="${item.Name}" />
      </a>
      <a href="${productLink}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
      <p class="cart-card__price">$${(item.FinalPrice * (item.Quantity || 1)).toFixed(2)}</p>
    </li>
  `;
}

// Updates the cart badge in the header
function updateCartBadge(cartItems) {
  const count = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0)
    : 0;
  const badge = document.querySelector("#cart-count");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline" : "none";
  }
}

// Initialize cart rendering
renderCartContents();
