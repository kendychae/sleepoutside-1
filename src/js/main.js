import ProductData from "./ProductData.mjs";
import { qs } from "./utils.mjs";

const dataSource = new ProductData("tents");

function renderProductList(products) {
  const container = qs("#product-list");
  container.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <h3>${product.Name}</h3>
      <img src="${product.Image}" alt="${product.Name}">
      <p class="price">$${product.FinalPrice}</p>
      <a href="/sleepoutside-1/product_pages/index.html?id=${product.Id}">View Details</a>
    `;

    container.appendChild(productCard);
  });
}

async function loadProducts() {
  const products = await dataSource.getData();
  renderProductList(products);
}

loadProducts();
