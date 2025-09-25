import React from 'react';
import { Package, AlertTriangle, Calendar, DollarSign, Edit, Plus } from 'lucide-react';

interface InventoryCardProps {
  item: any;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'critical':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: AlertTriangle,
          iconColor: 'text-red-500'
        };
      case 'low':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500'
        };
      default:
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: Package,
          iconColor: 'text-green-500'
        };
    }
  };

  const config = getStatusConfig(item.status);
  const StatusIcon = config.icon;
  const stockPercentage = (item.currentStock / item.maxStock) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <Package className="h-6 w-6 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
          <StatusIcon className={`inline h-3 w-3 mr-1 ${config.iconColor}`} />
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        {/* Stock Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Stock Level</span>
            <span className="text-sm text-gray-600">
              {item.currentStock} / {item.maxStock} {item.unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                item.status === 'critical' ? 'bg-red-500' :
                item.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.max(stockPercentage, 5)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
            <span>Min: {item.minStock}</span>
            <span>Max: {item.maxStock}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Price per {item.unit}:</span>
            <span className="font-medium text-gray-800">₹{item.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Supplier:</span>
            <span className="font-medium text-gray-800">{item.supplier}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Restocked:</span>
            <span className="font-medium text-gray-800">{item.lastRestocked}</span>
          </div>
          {item.expiryDate && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expires:</span>
              <span className="font-medium text-gray-800">{item.expiryDate}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors text-sm">
            <Plus className="h-4 w-4" />
            <span>Restock</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
            <Edit className="h-4 w-4" />
          </button>
        </div>

        {/* Low Stock Warning */}
        {(item.status === 'critical' || item.status === 'low') && (
          <div className={`p-3 rounded-lg border ${
            item.status === 'critical' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`h-4 w-4 ${
                item.status === 'critical' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <span className={`text-sm font-medium ${
                item.status === 'critical' ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {item.status === 'critical' ? 'Critical Stock Level!' : 'Low Stock Warning'}
              </span>
            </div>
            <p className={`text-xs mt-1 ${
              item.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {item.status === 'critical' 
                ? 'Immediate restocking required'
                : 'Consider restocking soon'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryCard;