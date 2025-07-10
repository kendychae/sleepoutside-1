const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';

async function convertToJson(res) {
  try {
    const jsonResponse = await res.json();
    if (res.ok) {
      return jsonResponse;
    } else {
      console.error('API Error:', res.status, res.statusText, jsonResponse);
      throw { name: 'servicesError', message: jsonResponse };
    }
  } catch (error) {
    console.error('JSON conversion error:', error);
    throw error;
  }
}

export default class ExternalServices {
  constructor() {
    // constructor
  }

  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      return data.Result;
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      return [];
    }
  }

  async findProductById(id) {
    try {
      console.log(`Fetching product by ID: ${id} from ${baseURL}product/${id}`);
      const response = await fetch(`${baseURL}product/${id}`);
      console.log('Response status:', response.status, response.statusText);
      
      const data = await convertToJson(response);
      console.log('Product data received:', data);
      return data.Result;
    } catch (err) {
      console.error("Failed to fetch product by ID:", id, err);
      return null;
    }
  }

  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    const response = await fetch(`${baseURL}checkout/`, options);
    return convertToJson(response);
  }
}
