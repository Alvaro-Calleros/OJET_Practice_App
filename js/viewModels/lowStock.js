/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define([
    'knockout',
    '../accUtils',
    '../data/mockData',
    'ojs/ojarraydataprovider',
    'ojs/ojknockout',
    'ojs/ojtable'
  ],
  function(ko, accUtils, mockData, ArrayDataProvider) {
    function EmployeesViewModel() {
      this.lowStockItems = ko.observableArray([]);
      this.lowStockDataProvider = new ArrayDataProvider(this.lowStockItems, {
        keyAttributes: 'id'
      });
      this.columns = [
        { headerText: 'ID', field: 'id' },
        { headerText: 'Name', field: 'name' },
        { headerText: 'Category', field: 'category' },
        { headerText: 'Quantity', field: 'quantity' },
        { headerText: 'Minimum', field: 'minimumStock' },
        { headerText: 'Location', field: 'location' }
      ];

      this.refreshLowStock = () => {
        this.lowStockItems(mockData.getLowStockItems());
      };

      this.connected = () => {
        accUtils.announce('Low Stock page loaded.', 'assertive');
        document.title = 'Low Stock';
        this.refreshLowStock();
      };

      this.disconnected = () => {
        // Implement if needed
      };

      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    return EmployeesViewModel;
  }
);
