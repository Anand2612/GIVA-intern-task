import React, { useState, useEffect } from 'react';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle quantity and price validation
    if (name === 'quantity') {
      if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
        setForm({ ...form, quantity: value });
      }
      return;
    }

    if (name === 'price') {
      if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
        setForm({ ...form, price: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const priceValue = parseFloat(form.price);
    const quantityValue = parseInt(form.quantity);

    if (!form.name || !form.description || isNaN(priceValue) || isNaN(quantityValue)) {
      setError('All fields are required and must be valid');
      return false;
    }

    if (priceValue <= 0 || quantityValue <= 0) {
      setError('Price and quantity must be greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : 'http://localhost:5000/api/products';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save product');
      }

      setForm({ name: '', description: '', price: '', quantity: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete product');
      }

      fetchProducts();
    } catch (err) {
      setError(err.message);
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <main className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
            <button className="absolute top-0 right-0 px-4 py-3" onClick={() => setError('')}>
              ×
            </button>
          </div>
        )}
        
        <div className="flex flex-col gap-6">
          {/* Form */}
          <div className="w-full">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <div className="space-y-4">
                <input
                  name="name"
                  placeholder="Product Name"
                  onChange={handleChange}
                  value={form.name}
                  className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="description"
                  placeholder="Product Description"
                  onChange={handleChange}
                  value={form.description}
                  className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="price"
                  placeholder="Price (₹)"
                  onChange={handleChange}
                  value={form.price}
                  className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="quantity"
                  placeholder="Quantity"
                  type="number"
                  onChange={handleChange}
                  value={form.quantity}
                  className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 mt-4 rounded w-full transition-colors"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="w-full">
            {loading ? (
              <div className="text-center py-4 bg-white rounded shadow-md">
                <div className="animate-pulse">Loading products...</div>
              </div>
            ) : (
              <ul className="space-y-4">
                {products.length === 0 ? (
                  <li className="bg-white p-4 rounded shadow-md text-center text-gray-500">
                    {error ? 'Error loading products' : 'No products found'}
                  </li>
                ) : (
                  products.map((product) => (
                    <li key={product.id} className="bg-white p-4 rounded shadow-md flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-lg font-semibold">₹{product.price}</p>
                        <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductManagement;
