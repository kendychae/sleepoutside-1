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

    li.innerHTML = `
      <a href="../product_pages/index.html?id=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    `;

    return li;
  }
}
