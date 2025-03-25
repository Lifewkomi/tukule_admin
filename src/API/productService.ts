import axios from 'axios';

// Optionally create an Axios instance with default settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000
});

// Define functions that call your backend endpoints
export async function getAllProducts() {
  const response = await api.get('/api/products');
  return response.data;
}

export async function createProduct(productData: any) {
  const response = await api.post('/api/products', productData);
  return response.data;
}

export async function updateProduct(productId: string, productData: any) {
  const response = await api.put(`/api/products/${productId}`, productData);
  return response.data;
}

export async function deleteProduct(productId: string) {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data;
}
