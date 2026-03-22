import { useState, useEffect } from 'react';
import { inventoryApi } from '../../api/inventoryApi';
import { productsApi } from '../../api/productApi';
import { warehouseApi } from '../../api/warehouseApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { extractErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function InventoryForm({ item, onSaved, onCancel }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    productId: item?.productId ?? '',
    productName: item?.productName ?? '',
    quantity: item?.quantity ?? '',
    lowStockThreshold: item?.lowStockThreshold ?? 10,
    reorderPoint: item?.reorderPoint ?? 20,
    warehouse_id: item?.warehouse_id ?? '',
    shelf: item?.location?.shelf ?? 'A1',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  // Fetch products and inventory on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingProducts(true);
      setLoadingWarehouses(true);
      try {
        // Fetch all products
        const productsRes = await productsApi.getAll({ limit: 1000 });
        const productsList = productsRes.data?.data || [];

        // Fetch all inventory items with pagination fallback
        let allInventory = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const inventoryRes = await inventoryApi.getAll({ page, limit: 100 });
          const inventoryData = inventoryRes.data?.data || [];
          allInventory = [...allInventory, ...inventoryData];
          
          // Check if there are more pages
          const totalPages = inventoryRes.data?.totalPages || 1;
          hasMore = page < totalPages;
          page++;
        }

        // Fetch warehouses
        const warehousesRes = await warehouseApi.getAll();
        const warehousesList = warehousesRes.data?.data || [];

        setProducts(productsList);
        setInventoryItems(allInventory);
        setWarehouses(warehousesList);

        // Filter products that don't have inventory yet
        const inventoryProductIds = new Set(allInventory.map(inv => inv.productId));
        const available = productsList.filter(p => !inventoryProductIds.has(p._id));
        
        console.log('Products:', productsList.length);
        console.log('Inventory:', allInventory.length);
        console.log('Available Products:', available.length);
        console.log('Inventory Product IDs:', inventoryProductIds);
        
        setAvailableProducts(available);
      } catch (err) {
        console.error('Error fetching products/inventory/warehouses:', err);
      } finally {
        setLoadingProducts(false);
        setLoadingWarehouses(false);
      }
    };

    if (!isEdit) {
      fetchData();
    }
  }, [isEdit]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const selectedProduct = availableProducts.find(p => p._id === productId);
    
    if (selectedProduct) {
      setForm((f) => ({
        ...f,
        productId: selectedProduct._id,
        productName: selectedProduct.name,
      }));
      setErrors((er) => ({ ...er, productId: '', productName: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!isEdit && !form.productId.trim()) errs.productId = 'Product ID is required';
    if (!isEdit && !form.productName.trim()) errs.productName = 'Product Name is required';
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0)
      errs.quantity = 'Valid quantity required';
    if (!form.warehouse_id.trim()) errs.warehouse_id = 'Warehouse is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // Look up warehouse name from warehouse_id
      const selectedWarehouse = warehouses.find(w => w.warehouse_id === form.warehouse_id);
      const warehouseName = selectedWarehouse?.warehouseName || form.warehouse_id;
      
      const payload = {
        quantity: Number(form.quantity),
        lowStockThreshold: Number(form.lowStockThreshold),
        reorderPoint: Number(form.reorderPoint),
        warehouse_id: form.warehouse_id,
        location: { warehouse: warehouseName, shelf: form.shelf },
      };
      if (!isEdit) {
        payload.productId = form.productId;
        payload.productName = form.productName;
        await inventoryApi.create(payload);
        toast.success('Inventory item created');
      } else {
        await inventoryApi.update(item.productId, payload);
        toast.success('Inventory updated successfully');
      }
      onSaved();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEdit && (
        <>
          <Select
            label="Select Product"
            value={form.productId}
            onChange={handleProductSelect}
            error={errors.productId}
            placeholder={loadingProducts ? 'Loading products...' : 'Choose a product without inventory'}
            options={availableProducts.map(p => ({
              value: p._id,
              label: `${p.name} (ID: ${p._id})`
            }))}
            disabled={loadingProducts || availableProducts.length === 0}
            required
          />
          {availableProducts.length === 0 && !loadingProducts && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">All products already have inventory. Create a new product first.</p>
            </div>
          )}
          {form.productId && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-600 font-medium">Product Selected</p>
              <p className="text-sm font-semibold text-green-900">{form.productName}</p>
              <p className="text-xs text-green-700 font-mono">{form.productId}</p>
            </div>
          )}
        </>
      )}
      {isEdit && (
        <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Product</p>
          <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
          <p className="text-xs text-gray-400 font-mono">{item.productId}</p>
        </div>
      )}

      <Input
        label="Quantity"
        type="number"
        min="0"
        value={form.quantity}
        onChange={set('quantity')}
        error={errors.quantity}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Low Stock Threshold"
          type="number"
          min="0"
          value={form.lowStockThreshold}
          onChange={set('lowStockThreshold')}
          helperText="Alert when qty falls below this"
        />
        <Input
          label="Reorder Point"
          type="number"
          min="0"
          value={form.reorderPoint}
          onChange={set('reorderPoint')}
          helperText="Suggested reorder trigger"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Warehouse"
          value={form.warehouse_id}
          onChange={set('warehouse_id')}
          error={errors.warehouse_id}
          placeholder={loadingWarehouses ? 'Loading warehouses...' : 'Select a warehouse'}
          options={warehouses.map(w => ({
            value: w.warehouse_id,
            label: w.warehouseName
          }))}
          disabled={loadingWarehouses || warehouses.length === 0}
          required
        />
        <Input label="Shelf" value={form.shelf} onChange={set('shelf')} />
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update Inventory' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
}
