define([], function () {
  'use strict';

  const stockItems = [
    { id: 'ITM-001', name: 'Laptop', category: 'Computer', quantity: 12, minimumStock: 3, location: 'IT Storage' },
    { id: 'ITM-002', name: 'Monitor', category: 'Display', quantity: 8, minimumStock: 2, location: 'IT Storage' },
    { id: 'ITM-003', name: 'Keyboard', category: 'Peripheral', quantity: 15, minimumStock: 5, location: 'Supply Closet' },
    { id: 'ITM-004', name: 'Mouse', category: 'Peripheral', quantity: 18, minimumStock: 5, location: 'Supply Closet' },
    { id: 'ITM-005', name: 'USB-C Dock', category: 'Docking', quantity: 4, minimumStock: 3, location: 'IT Storage' },
    { id: 'ITM-006', name: 'Headset', category: 'Audio', quantity: 2, minimumStock: 3, location: 'Supply Closet' },
    { id: 'ITM-007', name: 'Phone', category: 'Mobile', quantity: 3, minimumStock: 2, location: 'IT Storage' }
  ];

  function nextId() {
    const max = stockItems.reduce((currentMax, item) => {
      const value = parseInt(String(item.id).replace('ITM-', ''), 10);
      return Number.isNaN(value) ? currentMax : Math.max(currentMax, value);
    }, 0);
    return 'ITM-' + String(max + 1).padStart(3, '0');
  }

  function normalizeNumber(value) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0;
  }

  function normalizeItem(data) {
    return {
      name: String(data.name || '').trim(),
      category: String(data.category || '').trim(),
      quantity: normalizeNumber(data.quantity),
      minimumStock: normalizeNumber(data.minimumStock),
      location: String(data.location || '').trim()
    };
  }

  function getItems() {
    return stockItems;
  }

  function getItemById(id) {
    return stockItems.find((item) => item.id === id) || null;
  }

  function addItem(data) {
    const item = Object.assign({ id: nextId() }, normalizeItem(data));
    stockItems.push(item);
    return item;
  }

  function updateItem(id, data) {
    const item = getItemById(id);
    if (!item) {
      return null;
    }
    Object.assign(item, normalizeItem(data));
    return item;
  }

  function deleteItem(id) {
    const index = stockItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    return stockItems.splice(index, 1)[0];
  }

  function getLowStockItems() {
    return stockItems.filter((item) => item.quantity <= item.minimumStock);
  }

  function getSummary() {
    return {
      totalItemTypes: stockItems.length,
      totalUnits: stockItems.reduce((total, item) => total + item.quantity, 0),
      lowStockCount: getLowStockItems().length,
      outOfStockCount: stockItems.filter((item) => item.quantity === 0).length
    };
  }

  function getUnitsByCategory() {
    const counts = stockItems.reduce((totals, item) => {
      totals[item.category] = (totals[item.category] || 0) + item.quantity;
      return totals;
    }, {});

    return Object.keys(counts).map((category) => {
      return {
        id: category,
        series: category,
        group: 'Units',
        value: counts[category]
      };
    });
  }

  return {
    getItems: getItems,
    getItemById: getItemById,
    addItem: addItem,
    updateItem: updateItem,
    deleteItem: deleteItem,
    getLowStockItems: getLowStockItems,
    getSummary: getSummary,
    getUnitsByCategory: getUnitsByCategory
  };
});
