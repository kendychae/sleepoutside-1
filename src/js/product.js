import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const imageBasePath = "../images/";

function fixImagePath(relativePath) {
  if (!relativePath) return "";
  return imageBasePath + relativePath.replace(/^(\.\.\/)+images\//, "");
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
  // Try to get productId from URL, fallback to button's data-id
  let id = productId;
  if (!id) {
    const addToCartBtn = document.querySelector("#addToCart");
    if (addToCartBtn) {
      id = addToCartBtn.dataset.id;
    }
  }
  if (!id) return;

  const product = await dataSource.findProductById(id);
  const detailContainer = document.querySelector(".product-detail");
  if (!detailContainer) return;

  if (!product) {
    detailContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  // Only render if the container is empty (so you can use static HTML or JS)
  if (!detailContainer.innerHTML.trim()) {
    detailContainer.innerHTML = `
      <h3>${product.Name}</h3>
      <img src="${fixImagePath(product.Image)}" alt="${product.Name}">
      <p class="price">$${product.FinalPrice}</p>
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    `;
  }

  // Always attach the event handler
  const addToCartBtn = qs("#addToCart");
  if (addToCartBtn) {
    addToCartBtn.removeEventListener("click", addToCartHandler); // Prevent double
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