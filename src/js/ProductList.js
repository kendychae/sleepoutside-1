export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    // Update the page title
    this.updateTitle();
  }

  updateTitle() {
    const titleElement = document.querySelector("h2");
    if (titleElement && this.category) {
      const categoryName =
        this.category.charAt(0).toUpperCase() + this.category.slice(1);
      titleElement.textContent = `Top Products: ${categoryName}`;
    }
  }

  renderList(list) {
    this.listElement.innerHTML = "";
    list.forEach((product) => {
      this.listElement.appendChild(this.renderListItem(product));
    });
  }

  renderListItem(product) {
    const li = document.createElement("li");
    li.className = "product-card";

    // Choose appropriate image size based on screen width
    const useHighRes = window.innerWidth > 768;
    const imageUrl = useHighRes && product.Images?.PrimaryLarge 
      ? product.Images.PrimaryLarge 
      : product.Images?.PrimaryMedium || product.Image || "";

    li.innerHTML = `
      <a href="../product_pages/index.html?id=${product.Id}">
        <picture>
          <source media="(min-width: 769px)" srcset="${product.Images?.PrimaryLarge || imageUrl}">
          <img src="${product.Images?.PrimaryMedium || imageUrl}" alt="${product.Name}" class="responsive-image" />
        </picture>
        <h3 class="card__brand">${product.Brand?.Name || ""}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    `;

    return li;
  }
}
