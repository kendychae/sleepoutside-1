import { getLocalStorage, qs } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty.</p>";
    updateCartBadge(0);
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
  document.querySelector(".product-list").insertAdjacentHTML(
    "beforeend",
    `<li class="cart-total">Total: $${total.toFixed(2)}</li>`
  );

  updateCartBadge(cartItems.length);
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="/sleepoutside-1/product_pages/index.html?id=${item.Id}" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="/sleepoutside-1/product_pages/index.html?id=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

// Update superscript badge on backpack icon
function updateCartBadge(count) {
  const badge = document.querySelector("#cart-count");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline" : "none";
  }
}

renderCartContents();
