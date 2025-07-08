import { getLocalStorage, setLocalStorage, qs, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const productId = getParam("id");
const dataSource = new ProductData();

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || [];
  const existingIndex = cart.findIndex((item) => item.Id === product.Id);
  if (existingIndex !== -1) {
    cart[existingIndex].Quantity = (cart[existingIndex].Quantity || 1) + 1;
  } else {
    cart.push({ ...product, Quantity: 1 });
  }
  setLocalStorage("so-cart", cart);
  updateCartBadge();
}

async function addToCartHandler(e) {
  const id = e.target.dataset.id;
  const product = await dataSource.findProductById(id);
  if (product) {
    addProductToCart(product);
  } else {
    alert("Product not found.");
    console.error("Product not found for ID:", id);
  }
}

async function displayProductDetails() {
  if (!productId) return;

  const product = await dataSource.findProductById(productId);
  const detailContainer = document.querySelector(".product-detail");
  if (!detailContainer) return;

  if (!product) {
    detailContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  // Use the API's image structure
  const imageUrl =
    product.Images?.PrimaryLarge || product.Images?.PrimaryMedium || "";

  detailContainer.innerHTML = `
    <h3>${product.Brand?.Name || ""}</h3>
    <h2>${product.Name}</h2>
    <img src="${imageUrl}" alt="${product.Name}">
    <p class="price">$${product.FinalPrice}</p>
    <p class="description">${product.DescriptionHtmlSimple || ""}</p>
    <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
  `;

  const addToCartBtn = qs("#addToCart");
  if (addToCartBtn) {
    addToCartBtn.removeEventListener("click", addToCartHandler);
    addToCartBtn.addEventListener("click", addToCartHandler);
  }
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

// Initialize
displayProductDetails();
updateCartBadge();
