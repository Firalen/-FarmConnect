import React, { useEffect, useState } from 'react';
import { usersAPI, productsAPI, ordersAPI, reviewsAPI } from '../services/api';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', location: '', phoneNumber: '', profileImage: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [editProductForm, setEditProductForm] = useState({ title: '', price: '', category: '', quantity: '', unit: '', location: '', isAvailable: true });
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editOrderStatus, setEditOrderStatus] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchOrders();
    fetchReviews();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getAll();
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductLoading(true);
    setProductError(null);
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data);
    } catch (err) {
      setProductError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setProductLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const res = await ordersAPI.getAll();
      setOrders(res.data);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewLoading(true);
    setReviewError(null);
    try {
      const res = await reviewsAPI.getAll();
      setReviews(res.data.data || []);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      location: user.location || '',
      phoneNumber: user.phoneNumber || '',
      profileImage: user.profileImage || '',
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    setActionLoading(true);
    try {
      await usersAPI.update(id, editForm);
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setActionLoading(true);
    try {
      await usersAPI.delete(id);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProductEdit = (product) => {
    setEditProductId(product._id);
    setEditProductForm({
      title: product.title || '',
      price: product.price || '',
      category: product.category || '',
      quantity: product.quantity || '',
      unit: product.unit || '',
      location: product.location || '',
      isAvailable: product.isAvailable,
    });
  };

  const handleProductEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProductForm({
      ...editProductForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleProductEditSave = async (id) => {
    setActionLoading(true);
    try {
      await productsAPI.update(id, editProductForm);
      setEditProductId(null);
      fetchProducts();
    } catch (err) {
      setProductError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setActionLoading(true);
    try {
      await productsAPI.delete(id);
      fetchProducts();
    } catch (err) {
      setProductError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOrderEdit = (order) => {
    setEditOrderId(order._id);
    setEditOrderStatus(order.status);
  };

  const handleOrderStatusChange = (e) => {
    setEditOrderStatus(e.target.value);
  };

  const handleOrderEditSave = async (id) => {
    setActionLoading(true);
    try {
      await ordersAPI.updateStatus(id, editOrderStatus);
      setEditOrderId(null);
      fetchOrders();
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const orderStatusOptions = [
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  const handleReviewDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setActionLoading(true);
    try {
      await reviewsAPI.delete(id);
      fetchReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <h3 className="text-xl font-semibold mb-4">User Management</h3>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-4 border">
                    {editUserId === user._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editUserId === user._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editUserId === user._id ? (
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="user">User</option>
                        <option value="farmer">Farmer</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editUserId === user._id ? (
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.location
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editUserId === user._id ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.phoneNumber
                    )}
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    {editUserId === user._id ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          onClick={() => handleEditSave(user._id)}
                          disabled={actionLoading}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          onClick={() => setEditUserId(null)}
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          onClick={() => handleEdit(user)}
                          disabled={actionLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDelete(user._id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <hr className="my-8" />
      <h3 className="text-xl font-semibold mb-4">Product Management</h3>
      {productLoading ? (
        <p>Loading products...</p>
      ) : productError ? (
        <p className="text-red-600">{productError}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">Quantity</th>
                <th className="py-2 px-4 border">Unit</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Available</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="py-2 px-4 border">
                    {editProductId === product._id ? (
                      <input
                        type="text"
                        name="title"
                        value={editProductForm.title}
                        onChange={handleProductEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      product.title
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editProductId === product._id ? (
                      <input
                        type="number"
                        name="price"
                        value={editProductForm.price}
                        onChange={handleProductEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      product.price
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editProductId === product._id ? (
                      <input
                        type="text"
                        name="category"
                        value={editProductForm.category}
                        onChange={handleProductEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editProductId === product._id ? (
                      <input
                        type="number"
                        name="quantity"
                        value={editProductForm.quantity}
                        onChange={handleProductEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      product.quantity
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editProductId === product._id ? (
                      <input
                        type="text"
                        name="unit"
                        value={editProductForm.unit}
                        onChange={handleProductEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      product.unit
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {editProductId === product._id ? (
                      <input
                        type="text"
                        name="location"
                        value={editProductForm.location}
                        onChange={handleProductEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      product.location
                    )}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {editProductId === product._id ? (
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={editProductForm.isAvailable}
                        onChange={handleProductEditChange}
                        className="h-4 w-4"
                      />
                    ) : (
                      product.isAvailable ? 'Yes' : 'No'
                    )}
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    {editProductId === product._id ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          onClick={() => handleProductEditSave(product._id)}
                          disabled={actionLoading}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          onClick={() => setEditProductId(null)}
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          onClick={() => handleProductEdit(product)}
                          disabled={actionLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => handleProductDelete(product._id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <hr className="my-8" />
      <h3 className="text-xl font-semibold mb-4">Order Management</h3>
      {orderLoading ? (
        <p>Loading orders...</p>
      ) : orderError ? (
        <p className="text-red-600">{orderError}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">Buyer</th>
                <th className="py-2 px-4 border">Farmer</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 px-4 border">{order._id}</td>
                  <td className="py-2 px-4 border">{order.buyer?.name || '-'}</td>
                  <td className="py-2 px-4 border">{order.farmer?.name || '-'}</td>
                  <td className="py-2 px-4 border">{order.totalAmount}</td>
                  <td className="py-2 px-4 border">
                    {editOrderId === order._id ? (
                      <select
                        value={editOrderStatus}
                        onChange={handleOrderStatusChange}
                        className="border rounded px-2 py-1 w-full"
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                    ) : (
                      order.status
                    )}
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    {editOrderId === order._id ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          onClick={() => handleOrderEditSave(order._id)}
                          disabled={actionLoading}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          onClick={() => setEditOrderId(null)}
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleOrderEdit(order)}
                        disabled={actionLoading}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <hr className="my-8" />
      <h3 className="text-xl font-semibold mb-4">Review Management</h3>
      {reviewLoading ? (
        <p>Loading reviews...</p>
      ) : reviewError ? (
        <p className="text-red-600">{reviewError}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Product</th>
                <th className="py-2 px-4 border">User</th>
                <th className="py-2 px-4 border">Rating</th>
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Comment</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id} className="border-b">
                  <td className="py-2 px-4 border">{review.product?.title || '-'}</td>
                  <td className="py-2 px-4 border">{review.user?.name || '-'}</td>
                  <td className="py-2 px-4 border">{review.rating}</td>
                  <td className="py-2 px-4 border">{review.title}</td>
                  <td className="py-2 px-4 border">{review.comment}</td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleReviewDelete(review._id)}
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin; 