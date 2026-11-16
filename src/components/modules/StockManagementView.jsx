import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  Boxes,
  PlusCircle,
  PackagePlus,
  PackageMinus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  ThermometerSnowflake,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';

export const StockManagementView = () => {
  const { stockItems, addStockItem, updateStockQuantity } = useProduction();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItemForUpdate, setSelectedItemForUpdate] = useState(null);

  // New Item Form
  const [newItem, setNewItem] = useState({
    code: 'API-CIP-02',
    name: 'Ciprofloxacin Hydrochloride (USP/EP)',
    category: 'Active Pharmaceutical Ingredient',
    lotNumber: 'LOT-CIP-2026-90',
    quantity: 150.0,
    minThreshold: 50.0,
    unit: 'kg',
    storageCondition: '15°C - 25°C (Controlled Room Temp)',
    expiryDate: '2027-10-30',
    supplier: 'MedPure Ingredients Global'
  });

  // Quantity Update Form
  const [updateAction, setUpdateAction] = useState('DISPENSE'); // 'RESTOCK' | 'DISPENSE' | 'QUARANTINE'
  const [updateAmount, setUpdateAmount] = useState(10);
  const [updateReason, setUpdateReason] = useState('Dispensed for Batch BATCH-2026-VAC-098 Formulation');

  // Category list
  const categories = ['ALL', 'Active Pharmaceutical Ingredient', 'Excipient', 'Buffer / Reagent', 'Solvent / Diluent', 'Primary Packaging', 'Quality Control Assay', 'Cleanroom Sanitizer'];

  // Handle Add Item Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    addStockItem(newItem);
    setShowAddModal(false);
    // Reset form
    setNewItem({
      code: '',
      name: '',
      category: 'Active Pharmaceutical Ingredient',
      lotNumber: '',
      quantity: 100,
      minThreshold: 20,
      unit: 'kg',
      storageCondition: '15°C - 25°C (Controlled Room Temp)',
      expiryDate: '2027-06-30',
      supplier: ''
    });
  };

  // Handle Update Quantity Submit
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemForUpdate) return;

    const delta = updateAction === 'RESTOCK' ? parseFloat(updateAmount) : -parseFloat(updateAmount);
    updateStockQuantity(selectedItemForUpdate.id, delta, updateAction, updateReason);
    setShowUpdateModal(false);
    setSelectedItemForUpdate(null);
  };

  // Open Update Modal
  const openUpdateModal = (item, defaultAction = 'DISPENSE') => {
    setSelectedItemForUpdate(item);
    setUpdateAction(defaultAction);
    setUpdateAmount(10);
    setUpdateReason(
      defaultAction === 'RESTOCK'
        ? 'Restocked from approved supplier QA release'
        : 'Dispensed for active cleanroom production run'
    );
    setShowUpdateModal(true);
  };

  // Helper for expiry countdown calculation
  const getExpiryDays = (dateStr) => {
    const exp = new Date(dateStr);
    const today = new Date();
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  };

  // Filtered Items
  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4" />
            <span>Module 6: Material & API Stock Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Pharmaceutical Inventory, Lots & Expiry Tracking
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage raw APIs, sterile excipients, buffer reagents, and monitor real-time shelf life and storage conditions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Material / Stock</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs font-semibold uppercase">Total Tracked Lots</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stockItems.length}</div>
          <span className="text-[11px] text-teal-400 font-mono">100% GMP Reconciled</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs font-semibold uppercase">Low Stock Alerts</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {stockItems.filter((s) => s.status === 'Low Stock').length}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Below min threshold</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs font-semibold uppercase">Expiring in ≤ 30 Days</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {stockItems.filter((s) => s.status === 'Expiring Soon').length}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Expedited usage needed</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs font-semibold uppercase">Expired (Quarantine)</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {stockItems.filter((s) => s.status === 'Expired').length}
          </div>
          <span className="text-[11px] text-rose-400 font-mono">Immediate disposal flag</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search material name, code, lot number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="Adequate">Adequate Only</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Expiring Soon">Expiring Soon (≤ 30d)</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Item Code</th>
                <th className="py-3 px-3">Material Name & Category</th>
                <th className="py-3 px-3">Lot Number</th>
                <th className="py-3 px-3">Current Qty</th>
                <th className="py-3 px-3">Storage Condition</th>
                <th className="py-3 px-3">Expiry Date & Countdown</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map((item) => {
                const daysLeft = getExpiryDays(item.expiryDate);
                const isColdChain = item.storageCondition.includes('2°C - 8°C') || item.storageCondition.includes('-20°C');

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3 font-mono font-semibold text-teal-400">
                      {item.code}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-100 text-xs">{item.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.category}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.supplier}</div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {item.lotNumber}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-mono font-bold text-white text-sm">
                        {item.quantity} <span className="text-xs text-slate-400 font-sans">{item.unit}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Min: {item.minThreshold} {item.unit}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        {isColdChain && <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        <span>{item.storageCondition}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-slate-200">{item.expiryDate}</div>
                      <div className="mt-0.5">
                        {daysLeft <= 0 ? (
                          <span className="text-[10px] text-rose-400 font-bold">Expired {Math.abs(daysLeft)}d ago</span>
                        ) : daysLeft <= 30 ? (
                          <span className="text-[10px] text-amber-400 font-bold">Expires in {daysLeft} days</span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium">Valid {daysLeft} days</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.status === 'Adequate'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                            : item.status === 'Expiring Soon'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openUpdateModal(item, 'DISPENSE')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition"
                          title="Dispense for active batch"
                        >
                          Dispense
                        </button>
                        <button
                          onClick={() => openUpdateModal(item, 'RESTOCK')}
                          className="px-2 py-1 rounded bg-teal-950 hover:bg-teal-900 text-teal-300 text-[11px] font-medium border border-teal-500/30 transition"
                          title="Restock new quantity"
                        >
                          + Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add New Pharmaceutical Material</h3>
            <p className="text-xs text-slate-400 mb-5">
              Register a new incoming lot into the active cleanroom inventory.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Item Code</label>
                  <input
                    type="text"
                    required
                    value={newItem.code}
                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lot / Batch No.</label>
                  <input
                    type="text"
                    required
                    value={newItem.lotNumber}
                    onChange={(e) => setNewItem({ ...newItem, lotNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Material Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  >
                    {categories.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supplier</label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Qty</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Threshold</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newItem.minThreshold}
                    onChange={(e) => setNewItem({ ...newItem, minThreshold: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Storage Condition</label>
                  <select
                    value={newItem.storageCondition}
                    onChange={(e) => setNewItem({ ...newItem, storageCondition: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  >
                    <option value="15°C - 25°C (Controlled Room Temp)">15°C - 25°C (CRT)</option>
                    <option value="2°C - 8°C (Cold Chain Required)">2°C - 8°C (Cold Chain)</option>
                    <option value="-20°C (Ultra-Cold Storage)">-20°C (Ultra-Cold)</option>
                    <option value="Continuous Recirculation 80°C loop">80°C WFI Loop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Quantity Modal */}
      {showUpdateModal && selectedItemForUpdate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Update Stock Quantity</h3>
            <p className="text-xs text-slate-400 mb-4">
              Material: <strong className="text-teal-300">{selectedItemForUpdate.name}</strong> ({selectedItemForUpdate.lotNumber})
            </p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUpdateAction('DISPENSE')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                      updateAction === 'DISPENSE'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-700 text-slate-400'
                    }`}
                  >
                    - Dispense / Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateAction('RESTOCK')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                      updateAction === 'RESTOCK'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-700 text-slate-400'
                    }`}
                  >
                    + Restock
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Quantity ({selectedItemForUpdate.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={updateAmount}
                  onChange={(e) => setUpdateAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono text-base"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Current: {selectedItemForUpdate.quantity} {selectedItemForUpdate.unit} → Result: {
                    updateAction === 'RESTOCK'
                      ? (selectedItemForUpdate.quantity + (parseFloat(updateAmount) || 0)).toFixed(2)
                      : Math.max(0, selectedItemForUpdate.quantity - (parseFloat(updateAmount) || 0)).toFixed(2)
                  } {selectedItemForUpdate.unit}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Reason / Production Batch Justification
                </label>
                <input
                  type="text"
                  required
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
