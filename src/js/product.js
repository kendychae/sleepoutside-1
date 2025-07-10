import { getLocalStorage, setLocalStorage, qs, getParam, alertMessage, updateCartBadgeWithAnimation } from "./utils.mjs";
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
  updateCartBadgeWithAnimation();
}

async function addToCartHandler(e) {
  try {
    const id = e.target.dataset.id;
    console.log("Attempting to add product to cart with ID:", id);
    
    const product = await dataSource.findProductById(id);
    console.log("Product found:", product);
    
    if (product) {
      addProductToCart(product);
      alertMessage(`${product.Name} has been added to your cart!`, false, 'success');
    } else {
      alertMessage("Product not found.", true);
      console.error("Product not found for ID:", id);
    }
  } catch (error) {
    console.error("Error in addToCartHandler:", error);
    alertMessage("An error occurred while adding the product to cart.", true);
  }
}

async function displayProductDetails() {
  if (!productId) {
    console.log("No product ID found in URL");
    return;
  }

  console.log("Loading product details for ID:", productId);
  
  try {
    const product = await dataSource.findProductById(productId);
    const detailContainer = document.querySelector(".product-detail");
    if (!detailContainer) {
      console.error("Product detail container not found");
      return;
    }

    if (!product) {
      detailContainer.innerHTML = "<p>Product not found.</p>";
      console.error("Product not found for ID:", productId);
      return;
    }

    console.log("Product loaded successfully:", product);

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
      console.log("Add to cart button event listener attached");
    } else {
      console.error("Add to cart button not found");
    }
  } catch (error) {
    console.error("Error loading product details:", error);
    const detailContainer = document.querySelector(".product-detail");
    if (detailContainer) {
      detailContainer.innerHTML = "<p>Error loading product details.</p>";
    }
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
