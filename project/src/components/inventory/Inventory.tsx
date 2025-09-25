import React, { useState } from 'react';
import { Package, Plus, Search, Filter, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import InventoryCard from './InventoryCard';
import AddItemModal from './AddItemModal';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddItem, setShowAddItem] = useState(false);

  const inventoryItems = [
    {
      id: 1,
      name: 'Sesame Oil',
      category: 'Oils',
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      unit: 'bottles',
      price: 450,
      supplier: 'Ayur Supplies Ltd',
      lastRestocked: '2024-01-10',
      expiryDate: '2024-12-31',
      status: 'low'
    },
    {
      id: 2,
      name: 'Coconut Oil',
      category: 'Oils',
      currentStock: 35,
      minStock: 15,
      maxStock: 60,
      unit: 'bottles',
      price: 380,
      supplier: 'Natural Products Co',
      lastRestocked: '2024-01-12',
      expiryDate: '2025-06-30',
      status: 'good'
    },
    {
      id: 3,
      name: 'Ashwagandha Powder',
      category: 'Herbs',
      currentStock: 8,
      minStock: 12,
      maxStock: 40,
      unit: 'kg',
      price: 1200,
      supplier: 'Himalayan Herbs',
      lastRestocked: '2024-01-05',
      expiryDate: '2024-08-15',
      status: 'critical'
    },
    {
      id: 4,
      name: 'Triphala Churna',
      category: 'Herbs',
      currentStock: 25,
      minStock: 10,
      maxStock: 30,
      unit: 'kg',
      price: 800,
      supplier: 'Ayur Supplies Ltd',
      lastRestocked: '2024-01-08',
      expiryDate: '2024-10-20',
      status: 'good'
    },
    {
      id: 5,
      name: 'Massage Table Sheets',
      category: 'Equipment',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'pieces',
      price: 150,
      supplier: 'Medical Supplies Inc',
      lastRestocked: '2024-01-14',
      expiryDate: null,
      status: 'good'
    }
  ];

  const categories = ['all', 'Oils', 'Herbs', 'Equipment', 'Medicines'];
  const statuses = ['all', 'good', 'low', 'critical'];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockStats = () => {
    const total = inventoryItems.length;
    const critical = inventoryItems.filter(item => item.status === 'critical').length;
    const low = inventoryItems.filter(item => item.status === 'low').length;
    const good = inventoryItems.filter(item => item.status === 'good').length;
    
    return { total, critical, low, good };
  };

  const stats = getStockStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-600">Track medicines, oils, herbs and equipment</p>
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Items</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Good Stock</p>
                <p className="text-2xl font-bold text-green-700">{stats.good}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.low}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Critical</p>
                <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600 mb-2">No items found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <AddItemModal onClose={() => setShowAddItem(false)} />
      )}
    </div>
  );
};

export default Inventory;