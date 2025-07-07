function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // Use relative path so it works locally and on GitHub Pages
    this.path = `../json/${this.category}.json`;
  }

  async getData() {
    try {
      const res = await fetch(this.path);
      return await convertToJson(res);
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      return [];
    }
  }

  async findProductById(id) {
    const productsData = await this.getData();
    const products = Array.isArray(productsData) ? productsData : productsData.Result || [];
    return products.find((item) => item.Id === id);
  }
}