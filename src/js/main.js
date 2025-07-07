import ProductData from "./ProductData.mjs";
import { qs } from "./utils.mjs";

const dataSource = new ProductData("tents");

// Utility to fix image paths if needed
function fixImagePath(path) {
  if (!path) return "";
  // Remove any leading ../ from the path and prepend images/
  return path.replace(/^(\.\.\/)+images\//, "../images/");
}

function renderProductList(products) {
  const container = qs("#product-list");
  if (!container) return;
  container.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Build product page link relative to src/
    const productLink = `../product_pages/index.html?id=${encodeURIComponent(product.Id)}`;

    productCard.innerHTML = `
      <h3>${product.Name}</h3>
      <img src="${fixImagePath(product.Image)}" alt="${product.Name}">
      <p class="price">$${product.FinalPrice}</p>
      <a href="${productLink}">View Details</a>
    `;

    container.appendChild(productCard);
  });
}

async function loadProducts() {
  const products = await dataSource.getData();
  renderProductList(products);
}

loadProducts();