// pages/create-product.js
import React, { useState } from 'react';

const CreateProduct = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState(null); // For success/error messages

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if form fields are not empty
    if (!name || !price || !quantity) {
      setMessage('All fields are required.');
      return;
    }

    const data = {
      name,
      price,
      quantity,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('Product created successfully!');
      } else {
        setMessage(`Failed to create product: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Create a New Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Product</button>
      </form>

      {/* Display success/error message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateProduct;
