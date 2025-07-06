import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const imageBasePath = "/sleepoutside-1/src/images/";

function fixImagePath(relativePath) {
  if (!relativePath) return "";
  return relativePath.replace(/^(\.\.\/)+images\//, imageBasePath);
}

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || [];
  const existingIndex = cart.findIndex(item => item.Id === product.Id);
  if (existingIndex !== -1) {
    cart[existingIndex].Quantity = (cart[existingIndex].Quantity || 1) + 1;
  } else {
    cart.push({ ...product, Quantity: 1 });
  }
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

async function displayProductDetails() {
  const product = await dataSource.findProductById(productId);
  if (!product) {
    document.querySelector(".product-detail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.querySelector(".product-detail").innerHTML = `
    <h3>${product.Name}</h3>
    <img src="${fixImagePath(product.Image)}" alt="${product.Name}">
    <p class="price">$${product.FinalPrice}</p>
    <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
  `;

  qs("#addToCart").addEventListener("click", addToCartHandler);
}

function updateCartBadge() {
  const cart = getLocalStorage("so-cart") || [];
  const totalCount = cart.reduce((sum, item) => sum + (item.Quantity || 1), 0);
  const badge = document.querySelector("#cart-count");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "inline" : "none";
  }
}

displayProductDetails();
updateCartBadge();
