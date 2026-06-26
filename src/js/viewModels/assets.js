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
    'ojs/ojtable',
    'ojs/ojbutton',
    'ojs/ojtoolbar',
    'ojs/ojdialog',
    'ojs/ojformlayout',
    'ojs/ojvalidationgroup',
    'ojs/ojinputtext',
    'ojs/ojinputnumber'
  ],
  function (ko, accUtils, mockData, ArrayDataProvider) {
    function AssetsViewModel() {
      const buildRows = () => {
        const searchValue = this.searchText ? this.searchText().trim().toLowerCase() : '';
        return mockData.getItems().filter((item) => {
          if (!searchValue) {
            return true;
          }
          return [
            item.id,
            item.name,
            item.category,
            item.location
          ].some((value) => String(value || '').toLowerCase().includes(searchValue));
        });
      };

      this.searchInput = ko.observable('');
      this.searchText = ko.observable('');
      this.items = ko.observableArray(buildRows());
      this.itemsDataProvider = new ArrayDataProvider(this.items, {
        keyAttributes: 'id'
      });

      this.columns = [
        { headerText: 'ID', field: 'id' },
        { headerText: 'Name', field: 'name' },
        { headerText: 'Category', field: 'category' },
        { headerText: 'Quantity', field: 'quantity' },
        { headerText: 'Minimum', field: 'minimumStock' },
        { headerText: 'Location', field: 'location' },
        { headerText: 'Actions', template: 'actionsTemplate', sortable: 'disabled' }
      ];

      this.dialogTitle = ko.observable('Add Item');
      this.editingItemId = ko.observable(null);
      this.form = {
        name: ko.observable(''),
        category: ko.observable(''),
        quantity: ko.observable(0),
        minimumStock: ko.observable(0),
        location: ko.observable('')
      };

      this.refreshItems = () => {
        this.items(buildRows());
      };

      this.applySearch = () => {
        this.searchText(this.searchInput());
        this.refreshItems();
      };

      this.clearSearch = () => {
        this.searchInput('');
        this.searchText('');
        this.refreshItems();
      };

      this.handleSearchInputChanged = (event) => {
        this.searchInput(event.detail.value || '');
      };

      this.handleSearchKeydown = (event) => {
        if (event.key === 'Enter') {
          this.applySearch();
        }
        return true;
      };

      this.resetForm = () => {
        this.editingItemId(null);
        this.form.name('');
        this.form.category('');
        this.form.quantity(0);
        this.form.minimumStock(0);
        this.form.location('');
      };

      this.populateForm = (item) => {
        this.editingItemId(item.id);
        this.form.name(item.name || '');
        this.form.category(item.category || '');
        this.form.quantity(item.quantity || 0);
        this.form.minimumStock(item.minimumStock || 0);
        this.form.location(item.location || '');
      };

      this.openItemDialog = () => {
        document.getElementById('stockItemDialog').open();
      };

      this.closeItemDialog = () => {
        document.getElementById('stockItemDialog').close();
      };

      this.buildPayload = () => {
        return {
          name: this.form.name(),
          category: this.form.category(),
          quantity: this.form.quantity(),
          minimumStock: this.form.minimumStock(),
          location: this.form.location()
        };
      };

      this.openAddItemDialog = () => {
        this.dialogTitle('Add Item');
        this.resetForm();
        this.openItemDialog();
      };

      this.editItem = (itemId) => {
        const item = mockData.getItemById(itemId);
        if (item) {
          this.dialogTitle('Edit Item');
          this.populateForm(item);
          this.openItemDialog();
        }
      };

      this.saveItem = () => {
        const validationGroup = document.getElementById('stockItemFormValidation');
        if (validationGroup.valid !== 'valid') {
          validationGroup.showMessages();
          validationGroup.focusOn('@firstInvalidShown');
          return;
        }

        const itemId = this.editingItemId();
        const payload = this.buildPayload();
        if (itemId) {
          mockData.updateItem(itemId, payload);
        } else {
          mockData.addItem(payload);
        }
        this.refreshItems();
        this.closeItemDialog();
      };

      this.deleteItem = (itemId) => {
        mockData.deleteItem(itemId);
        this.refreshItems();
      };

      this.connected = () => {
        accUtils.announce('Stock page loaded.', 'assertive');
        document.title = 'Stock';
        this.refreshItems();
      };

      this.disconnected = () => {
        // Implement if needed
      };

      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    return AssetsViewModel;
  }
);
