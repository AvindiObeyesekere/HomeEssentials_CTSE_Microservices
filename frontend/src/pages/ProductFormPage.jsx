import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productApi } from '../config/api.js';

const CATEGORIES = ['rice', 'soap', 'detergent', 'cooking-oil', 'spices', 'cleaning', 'personal-care', 'other'];
const UNITS      = ['kg', 'g', 'l', 'ml', 'piece', 'pack'];
const INIT       = { name: '', description: '', category: 'rice', price: '', unit: 'kg', imageUrl: '', brand: '', isActive: true };

export default function ProductFormPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const isEdit      = !!id;

  const [form,        setForm]        = useState(INIT);
  const [loading,     setLoading]     = useState(false);
  const [fetchLoad,   setFetchLoad]   = useState(isEdit);
  const [error,       setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!id) return;
    productApi.get(`/api/products/${id}`)
      .then(res => {
        const p = res.data.data;
        setForm({ name: p.name, description: p.description, category: p.category, price: p.price, unit: p.unit, imageUrl: p.imageUrl || '', brand: p.brand || '', isActive: p.isActive });
      })
      .catch(() => setError('Failed to load product details.'))
      .finally(() => setFetchLoad(false));
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      const body = { ...form, price: parseFloat(form.price) };
      if (!body.imageUrl) delete body.imageUrl;
      if (!body.brand)    delete body.brand;
      if (isEdit) await productApi.put(`/api/products/${id}`, body);
      else        await productApi.post('/api/products', body);
      navigate('/products');
    } catch (err) {
      if (err.response?.data?.errors) {
        const errs = {};
        err.response.data.errors.forEach(e => { errs[e.path] = e.msg; });
        setFieldErrors(errs);
      } else {
        setError(err.response?.data?.message || 'Save failed. Please check all fields.');
      }
    } finally { setLoading(false); }
  };

  if (fetchLoad) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        Loading product…
      </div>
    );
  }

  const inputCls = `w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50 focus:bg-white`;
  const errInput = `w-full px-3.5 py-2.5 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50`;
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

  const field = (name) => fieldErrors[name] ? errInput : `${inputCls} border-gray-200`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isEdit ? 'Update product details below' : 'Fill in the form to add a new product'}</p>
        </div>
        <Link to="/products" className="inline-flex items-center gap-1 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-5">
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Product Name *</label>
            <input className={field('name')} name="name" value={form.name} onChange={handleChange} required minLength={3} maxLength={100} placeholder="e.g. Basmati Rice 1kg" />
            {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea className={field('description')} name="description" value={form.description} onChange={handleChange} rows={3} required minLength={10} maxLength={1000} placeholder="Describe the product in detail…" />
            {fieldErrors.description && <p className="text-xs text-red-500 mt-1">{fieldErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category *</label>
              <select className={`${inputCls} border-gray-200`} name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Unit *</label>
              <select className={`${inputCls} border-gray-200`} name="unit" value={form.unit} onChange={handleChange}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price (LKR) *</label>
              <input className={field('price')} type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" required placeholder="0.00" />
              {fieldErrors.price && <p className="text-xs text-red-500 mt-1">{fieldErrors.price}</p>}
            </div>
            <div>
              <label className={labelCls}>Brand <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className={`${inputCls} border-gray-200`} name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Keells" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input className={field('imageUrl')} name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            {fieldErrors.imageUrl && <p className="text-xs text-red-500 mt-1">{fieldErrors.imageUrl}</p>}
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              className={`w-10 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
                form.isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only"
              />
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  form.isActive ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Product is Active
              <span className="text-xs text-gray-400 ml-1 font-normal">(visible to customers)</span>
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Saving…
                </>
              ) : isEdit ? '✅ Update Product' : '✅ Create Product'}
            </button>
            <Link to="/products" className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function ProductFormPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const isEdit      = !!id;

  const [form,        setForm]        = useState(INIT);
  const [loading,     setLoading]     = useState(false);
  const [fetchLoad,   setFetchLoad]   = useState(isEdit);
  const [error,       setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!id) return;
    productApi.get(`/api/products/${id}`)
      .then(res => {
        const p = res.data.data;
        setForm({
          name:        p.name,
          description: p.description,
          category:    p.category,
          price:       p.price,
          unit:        p.unit,
          imageUrl:    p.imageUrl || '',
          brand:       p.brand   || '',
          isActive:    p.isActive,
        });
      })
      .catch(() => setError('Failed to load product details.'))
      .finally(() => setFetchLoad(false));
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      const body = { ...form, price: parseFloat(form.price) };
      if (!body.imageUrl) delete body.imageUrl;
      if (!body.brand)    delete body.brand;

      if (isEdit) {
        await productApi.put(`/api/products/${id}`, body);
      } else {
        await productApi.post('/api/products', body);
      }
      navigate('/products');
    } catch (err) {
      if (err.response?.data?.errors) {
        const errs = {};
        err.response.data.errors.forEach(e => { errs[e.path] = e.msg; });
        setFieldErrors(errs);
      } else {
        setError(err.response?.data?.message || 'Save failed. Please check all fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoad) return <div className="loading">Loading product…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</div>
          <div className="page-subtitle">
            {isEdit ? 'Update the details below' : 'Fill in the form to add a new product'}
          </div>
        </div>
        <Link to="/products" className="btn btn-secondary">← Back to Products</Link>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={100}
              placeholder="e.g. Basmati Rice 1kg"
            />
            {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              minLength={10}
              maxLength={1000}
              placeholder="Describe the product in detail…"
            />
            {fieldErrors.description && <div className="form-error">{fieldErrors.description}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              {fieldErrors.category && <div className="form-error">{fieldErrors.category}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Unit *</label>
              <select className="form-control" name="unit" value={form.unit} onChange={handleChange}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (LKR) *</label>
              <input
                className="form-control"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                placeholder="0.00"
              />
              {fieldErrors.price && <div className="form-error">{fieldErrors.price}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                className="form-control"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              className="form-control"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg  (optional)"
            />
            {fieldErrors.imageUrl && <div className="form-error">{fieldErrors.imageUrl}</div>}
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
            />
            <label htmlFor="isActive" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
              Product is Active (visible to customers)
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : (isEdit ? '✅ Update Product' : '✅ Create Product')}
            </button>
            <Link to="/products" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
