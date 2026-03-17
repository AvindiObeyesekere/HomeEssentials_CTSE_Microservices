import React, { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { ordersApi } from "../../api/orderApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const { user } = useAuth();
  const resolvedUserId = user?.id ?? user?._id ?? "";
  const [form, setForm] = useState({
    userId: resolvedUserId,
    productId: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadOrders = async (userId) => {
    if (!userId) return;
    try {
      setOrdersLoading(true);
      const res = await ordersApi.getByUser(userId);
      setOrders(res.data?.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  React.useEffect(() => {
    setForm((prev) => ({ ...prev, userId: resolvedUserId }));
    if (resolvedUserId) loadOrders(resolvedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.productId || !form.quantity) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        userId: form.userId,
        items: [
          {
            productId: form.productId,
            quantity: Number(form.quantity),
          },
        ],
      };

      const { data } = await ordersApi.create(payload);
      setCreatedOrder(data.data);
      await loadOrders(form.userId);
      toast.success("Order created successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create order. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <header className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
          <ShoppingCart size={28} className="text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders Service</h2>
          <p className="text-gray-500 text-sm">
            Create a test order to trigger Product, Inventory and Payment flows
            through the Order Service (port 3004).
          </p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Create Test Order
          </h3>
          <p className="text-xs text-gray-500">
            Use an existing User ID and Product ID from your other services.
          </p>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. USER-123"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
              type="text"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. 65a1b2c3d4e5f6g7h8i9j0k1"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-medium hover:bg-orange-600 disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            <span>{loading ? "Creating..." : "Create Order"}</span>
          </button>
        </form>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Latest Order Result
            </h3>
            {!createdOrder ? (
              <p className="text-sm text-gray-500">
                Submit the form to see the created order details here.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Order ID</span>
                  <span className="font-mono text-gray-900">
                    {createdOrder.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Status</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700">
                    {createdOrder.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Total Amount</span>
                  <span className="font-semibold text-gray-900">
                    Rs. {createdOrder.totalAmount}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Items</span>
                  <ul className="mt-1 space-y-1">
                    {createdOrder.items?.map((it) => (
                      <li
                        key={it.productId}
                        className="flex justify-between text-gray-700"
                      >
                        <span>
                          {it.productName} x {it.quantity}
                        </span>
                        <span>Rs. {it.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Your Orders</h3>
              <button
                type="button"
                onClick={() => loadOrders(form.userId)}
                disabled={ordersLoading || !form.userId}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 disabled:opacity-60"
              >
                {ordersLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {!form.userId ? (
              <p className="text-sm text-gray-500">
                Add a User ID to load orders.
              </p>
            ) : ordersLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <p className="text-sm text-gray-500">No orders found.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.orderId}
                    className="border border-gray-100 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {o.orderId}
                        </div>
                        <div className="text-xs text-gray-500">
                          {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="text-xs font-medium text-gray-800">
                          {o.status}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        Items: <span className="font-medium">{o.items?.length ?? 0}</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        Rs. {o.totalAmount}
                      </div>
                    </div>

                    {Array.isArray(o.items) && o.items.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-gray-700">
                        {o.items.slice(0, 3).map((it) => (
                          <li key={`${o.orderId}-${it.productId}`} className="flex justify-between">
                            <span className="truncate pr-3">
                              {it.productName} x {it.quantity}
                            </span>
                            <span className="shrink-0">Rs. {it.price}</span>
                          </li>
                        ))}
                        {o.items.length > 3 && (
                          <li className="text-xs text-gray-500">
                            + {o.items.length - 3} more item(s)
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

