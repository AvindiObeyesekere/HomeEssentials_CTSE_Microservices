import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../config/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = ['rice', 'soap', 'detergent', 'cooking-oil', 'spices', 'cleaning', 'personal-care', 'other'];
const EMOJI = { rice: '🌾', soap: '🧼', detergent: '🧴', 'cooking-oil': '🫙', spices: '🌶️', cleaning: '🧹', 'personal-care': '💊', other: '📦' };
const canManage = role => ['Admin', 'StoreManager'].includes(role);

export default function ProductsPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [products,   setProducts]   = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('');
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (category) params.category = category;
      if (search)   params.search   = search;
      const res = await productApi.get('/api/products', { params });
      setProducts(res.data.data    || []);
      setTotal(res.data.total      || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setError('Failed to load products. Make sure the Product Service is running on port 3002.');
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = e => { e.preventDefault(); setPage(1); fetchProducts(); };
  const clearFilters = () => { setSearch(''); setCategory(''); setPage(1); };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await productApi.delete(`/api/products/${deleteId}`);
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  const inputCls = 'px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Product Catalog</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} product{total !== 1 ? 's' : ''} available</p>
        </div>
        {canManage(user?.role) && (
          <Link
            to="/products/new"
            className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add Product
          </Link>
        )}
      </div>

      {/* Filter bar */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center">
        <input
          className={`${inputCls} flex-1 min-w-[180px] max-w-xs`}
          placeholder="🔍  Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={inputCls}
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">Search</button>
        {(search || category) && (
          <button type="button" onClick={clearFilters} className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition-colors">✕ Clear</button>
        )}
      </form>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          Loading products…
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-3">📦</span>
          <p className="text-sm font-medium mb-1">No products found</p>
          {canManage(user?.role) && (
            <Link to="/products/new" className="mt-3 text-sm text-green-700 font-semibold hover:underline">
              + Add your first product
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => (
              <div
                key={p._id}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${
                  p.isActive === false ? 'opacity-60' : ''
                }`}
              >
                <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center text-5xl">
                  {p.imageUrl && !p.imageUrl.includes('placeholder.com') ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    EMOJI[p.category] || '📦'
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-gray-800 text-sm leading-tight">{p.name}</p>
                    {p.isActive === false && (
                      <span className="text-[9px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 font-semibold flex-shrink-0">Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-green-50 text-green-700 rounded-full px-2 py-0.5 font-semibold">{p.category}</span>
                    {p.brand && <span className="text-[10px] text-gray-400">{p.brand}</span>}
                  </div>
                  <p className="text-base font-bold text-green-700 mt-2">
                    LKR {Number(p.price).toFixed(2)}
                    <span className="text-xs text-gray-400 font-normal"> / {p.unit}</span>
                  </p>
                  {canManage(user?.role) && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/products/${p._id}/edit`)}
                        className="flex-1 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg py-1.5 font-medium transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p._id)}
                        className="flex-1 text-xs border border-red-100 text-red-500 hover:bg-red-50 rounded-lg py-1.5 font-medium transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-2">
              <button
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
              <h3 className="text-lg font-bold text-gray-800 text-center">Delete Product?</h3>
              <p className="text-sm text-gray-500 text-center mt-2">This action cannot be undone. The product will be permanently removed.</p>
            </div>
            <div className="flex gap-2 px-6 pb-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function ProductsPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [products,   setProducts]   = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('');
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (category) params.category = category;
      if (search)   params.search   = search;
      const res = await productApi.get('/api/products', { params });
      setProducts(res.data.data    || []);
      setTotal(res.data.total      || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setError('Failed to load products. Make sure the Product Service is running on port 3002.');
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = e => { e.preventDefault(); setPage(1); fetchProducts(); };

  const clearFilters = () => { setSearch(''); setCategory(''); setPage(1); };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await productApi.delete(`/api/products/${deleteId}`);
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Product Catalog</div>
          <div className="page-subtitle">{total} product{total !== 1 ? 's' : ''} available</div>
        </div>
        {canManage(user?.role) && (
          <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
        )}
      </div>

      {/* Filter Bar */}
      <form className="filter-bar" onSubmit={handleSearch}>
        <input
          className="form-control"
          placeholder="🔍  Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-control"
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-secondary">Search</button>
        {(search || category) && (
          <button type="button" className="btn btn-secondary" onClick={clearFilters}>✕ Clear</button>
        )}
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>No products found.</p>
          {canManage(user?.role) && (
            <Link to="/products/new" className="btn btn-primary" style={{ marginTop: 14 }}>
              + Add your first product
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map(p => (
              <div className={`product-card${p.isActive === false ? ' inactive-overlay' : ''}`} key={p._id}>
                <div className="product-img">
                  {p.imageUrl && !p.imageUrl.includes('placeholder.com') ? (
                    <img src={p.imageUrl} alt={p.name} />
                  ) : (
                    <span style={{ fontSize: '3rem' }}>{EMOJI[p.category] || '📦'}</span>
                  )}
                </div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.description}</div>
                  <div className="product-meta">
                    <span className="product-category">{p.category}</span>
                    {p.brand && <span className="product-brand">• {p.brand}</span>}
                    {p.isActive === false && (
                      <span className="badge badge-secondary" style={{ marginLeft: 'auto' }}>Inactive</span>
                    )}
                  </div>
                  <div className="product-price">
                    LKR {Number(p.price).toFixed(2)}
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                      {' '}/ {p.unit}
                    </span>
                  </div>
                  {canManage(user?.role) && (
                    <div className="product-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/products/${p._id}/edit`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteId(p._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                ← Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Confirm Delete</div>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
