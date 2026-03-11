import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const INIT = {
  firstName: '', lastName: '', email: '', password: '', role: 'Customer',
  address: { line1: '', city: '', postalCode: '', country: 'Sri Lanka' },
};

export default function RegisterPage() {
  const [form,    setForm]    = useState(INIT);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate      = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAddr = e =>
    setForm(f => ({ ...f, address: { ...f.address, [e.target.name]: e.target.value } }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Registration failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50 focus:bg-white';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <span className="text-5xl">ðŸª</span>
          <h1 className="text-white text-2xl font-bold mt-3">HomeEssentials+</h1>
          <p className="text-green-200 text-sm mt-1">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <span className="mt-0.5">âš ï¸</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name *</label>
                <input className={inputCls} name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" />
              </div>
              <div>
                <label className={labelCls}>Last Name *</label>
                <input className={inputCls} name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Email Address *</label>
              <input className={inputCls} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
            </div>

            <div>
              <label className={labelCls}>Password *</label>
              <input className={inputCls} type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className={labelCls}>Role</label>
              <select className={inputCls} name="role" value={form.role} onChange={handleChange}>
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
                <option value="StoreManager">Store Manager</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>City</label>
                <input className={inputCls} name="city" value={form.address.city} onChange={handleAddr} placeholder="Colombo" />
              </div>
              <div>
                <label className={labelCls}>Postal Code</label>
                <input className={inputCls} name="postalCode" value={form.address.postalCode} onChange={handleAddr} placeholder="00100" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Creating Accountâ€¦
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
