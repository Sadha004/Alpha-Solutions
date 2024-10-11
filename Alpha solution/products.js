// pages/products.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/module.css'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', quantity: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editProduct) {
      await updateProduct();
    } else {
      await createProduct();
    }
  };

  const createProduct = async () => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        fetchProducts();
        setFormData({ name: '', price: '', quantity: '' });
      } else {
        console.error('Failed to create product:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateProduct = async () => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editProduct }),
      });
      const result = await res.json();
      if (res.ok) {
        fetchProducts();
        setEditProduct(null);
        setFormData({ name: '', price: '', quantity: '' });
      } else {
        console.error('Failed to update product:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product._id);
    setFormData({ name: product.name, price: product.price, quantity: product.quantity });
  };

  const handleDelete = async (id) => {
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (!products.length) return <div className="text-center">No products available</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Product Management</h1>
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-600">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
            className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Product Price"
            required
            className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Product Quantity"
            required
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {editProduct ? 'Update Product' : 'Create Product'}
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 border-gray-300">Name</th>
                <th className="px-4 py-2 border-b-2 border-gray-300">Price</th>
                <th className="px-4 py-2 border-b-2 border-gray-300">Quantity</th>
                <th className="px-4 py-2 border-b-2 border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b border-gray-300">{product.name}</td>
                  <td className="px-4 py-2 border-b border-gray-300">{product.price}</td>
                  <td className="px-4 py-2 border-b border-gray-300">{product.quantity}</td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
