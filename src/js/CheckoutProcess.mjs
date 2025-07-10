import { getLocalStorage, setLocalStorage, alertMessage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // Calculate the total of all items in the cart
    this.itemTotal = this.list.reduce((total, item) => {
      return total + (item.FinalPrice * (item.Quantity || 1));
    }, 0);

    // Calculate shipping (assuming $10 shipping for the first item, $2 for each additional)
    if (this.list.length > 0) {
      const totalItems = this.list.reduce((total, item) => total + (item.Quantity || 1), 0);
      this.shipping = 10 + ((totalItems - 1) * 2);
    }

    // Calculate tax (6% of subtotal)
    this.tax = this.itemTotal * 0.06;

    // Calculate order total
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summaryElement = document.querySelector(this.outputSelector);
    if (summaryElement) {
      summaryElement.innerHTML = `
        <p>Subtotal (${this.list.length} items): $${this.itemTotal.toFixed(2)}</p>
        <p>Shipping Estimate: $${this.shipping.toFixed(2)}</p>
        <p>Tax: $${this.tax.toFixed(2)}</p>
        <p><strong>Order Total: $${this.orderTotal.toFixed(2)}</strong></p>
      `;
    }
  }

  async checkout() {
    // Get form data
    const form = document.forms['checkout'];
    if (!form) {
      alertMessage('Checkout form not found');
      return;
    }

    // Check form validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Prepare order data
    const formData = new FormData(form);
    const json = {};
    
    // Convert FormData to JSON
    for (let [key, value] of formData.entries()) {
      json[key] = value;
    }

    // Add order summary
    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = this.list.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.Quantity || 1
    }));

    try {
      // Attempt to submit the order
      const result = await this.services.checkout(json);
      
      // If successful, clear cart and redirect
      setLocalStorage(this.key, []);
      window.location.href = 'success.html';
      
    } catch (err) {
      // Handle checkout errors
      let errorMessage = 'An error occurred during checkout.';
      
      if (err.name === 'servicesError' && err.message) {
        // Extract meaningful error messages from server response
        if (typeof err.message === 'object') {
          errorMessage = Object.values(err.message).flat().join(', ');
        } else {
          errorMessage = err.message;
        }
      }
      
      alertMessage(errorMessage);
    }
  }
}
