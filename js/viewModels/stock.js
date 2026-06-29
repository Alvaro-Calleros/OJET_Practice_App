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
    'ojs/ojknockout',
    'ojs/ojbutton'
  ],
  function (ko, accUtils, mockData) {
    function AssetsViewModel() {
      const sortById = (left, right) => {
        return String(left.id || '').localeCompare(String(right.id || ''), undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      };

      const blankForm = () => ({
        name: '',
        category: '',
        quantity: 0,
        minimumStock: 0,
        location: ''
      });

      const copyItem = (item) => Object.assign({}, item);

      const normalizeId = (id) => String(id || '').trim().toUpperCase();

      const normalizeName = (name) => String(name || '').trim().toLowerCase();

      const getSortedItems = () => {
        return mockData.getItems().slice().sort(sortById);
      };

      const buildPayload = (form) => {
        const quantityValue = String(form.quantity() ?? '').trim();
        const minimumStockValue = String(form.minimumStock() ?? '').trim();
        return {
          name: String(form.name() || '').trim(),
          category: String(form.category() || '').trim(),
          quantity: quantityValue === '' ? NaN : Number(quantityValue),
          minimumStock: minimumStockValue === '' ? NaN : Number(minimumStockValue),
          location: String(form.location() || '').trim()
        };
      };

      const resetForm = (form, values) => {
        const source = Object.assign(blankForm(), values || {});
        form.name(source.name);
        form.category(source.category);
        form.quantity(source.quantity);
        form.minimumStock(source.minimumStock);
        form.location(source.location);
      };

      const validatePayload = (payload) => {
        if (!payload.name) {
          return 'Name is required.';
        }
        if (!payload.category) {
          return 'Category is required.';
        }
        if (!Number.isFinite(payload.quantity) || payload.quantity < 0) {
          return 'Quantity must be a number greater than or equal to 0.';
        }
        if (!Number.isInteger(payload.quantity)) {
          return 'Quantity must be a whole number.';
        }
        if (!Number.isFinite(payload.minimumStock) || payload.minimumStock < 0) {
          return 'Minimum stock must be a number greater than or equal to 0.';
        }
        if (!Number.isInteger(payload.minimumStock)) {
          return 'Minimum stock must be a whole number.';
        }
        if (!payload.location) {
          return 'Location is required.';
        }
        return '';
      };

      this.primaryActionOptions = [
        { value: 'list', label: 'List' },
        { value: 'create', label: 'Create' },
        { value: 'update', label: 'Update' },
        { value: 'delete', label: 'Delete' }
      ];

      this.secondaryActionOptions = [
        { value: '', label: 'Find actions' },
        { value: 'findById', label: 'Find by ID' },
        { value: 'findByName', label: 'Find by Name' }
      ];

      this.selectedAction = ko.observable('list');
      this.secondaryAction = ko.observable('');
      this.items = ko.observableArray([]);
      this.statusMessage = ko.observable('');
      this.errorMessage = ko.observable('');

      this.createForm = {
        name: ko.observable(''),
        category: ko.observable(''),
        quantity: ko.observable(0),
        minimumStock: ko.observable(0),
        location: ko.observable('')
      };

      this.findByIdQuery = ko.observable('');
      this.foundByIdItem = ko.observable(null);

      this.findByNameQuery = ko.observable('');
      this.foundByNameItems = ko.observableArray([]);

      this.updateIdQuery = ko.observable('');
      this.updateLoadedItem = ko.observable(null);
      this.updateForm = {
        name: ko.observable(''),
        category: ko.observable(''),
        quantity: ko.observable(0),
        minimumStock: ko.observable(0),
        location: ko.observable('')
      };

      this.deleteIdQuery = ko.observable('');
      this.deleteCandidate = ko.observable(null);

      this.hasStatus = ko.pureComputed(() => !!this.statusMessage());
      this.hasError = ko.pureComputed(() => !!this.errorMessage());
      this.hasFoundByNameItems = ko.pureComputed(() => this.foundByNameItems().length > 0);

      this.refreshItems = () => {
        this.items(getSortedItems());
      };

      this.clearMessages = () => {
        this.statusMessage('');
        this.errorMessage('');
      };

      this.selectAction = () => {
        this.clearMessages();
        this.foundByIdItem(null);
        this.foundByNameItems([]);
        this.updateLoadedItem(null);
        this.deleteCandidate(null);
        this.refreshItems();
      };

      this.setAction = (action) => {
        this.selectedAction(action);
        if (action !== 'findById' && action !== 'findByName') {
          this.secondaryAction('');
        }
        this.selectAction();
      };

      this.showList = () => {
        this.setAction('list');
      };

      this.showCreate = () => {
        this.setAction('create');
      };

      this.showUpdate = () => {
        this.setAction('update');
      };

      this.showDelete = () => {
        this.setAction('delete');
      };

      this.selectSecondaryAction = () => {
        const action = this.secondaryAction();
        if (action) {
          this.setAction(action);
        }
      };

      this.resetCreateForm = () => {
        resetForm(this.createForm);
      };

      this.createItem = () => {
        this.clearMessages();
        const payload = buildPayload(this.createForm);
        const validationMessage = validatePayload(payload);
        if (validationMessage) {
          this.errorMessage(validationMessage);
          return;
        }

        const createdItem = mockData.addItem(payload);
        this.refreshItems();
        this.resetCreateForm();
        this.statusMessage('Created item ' + createdItem.id + '.');
      };

      this.findById = () => {
        this.clearMessages();
        const id = normalizeId(this.findByIdQuery());
        const item = id ? mockData.getItemById(id) : null;
        this.foundByIdItem(item ? copyItem(item) : null);
        if (!item) {
          this.errorMessage('No item found for ID ' + (id || '(blank)') + '.');
        }
      };

      this.findByName = () => {
        this.clearMessages();
        const name = normalizeName(this.findByNameQuery());
        const matches = name
          ? mockData.getItems().filter((item) => normalizeName(item.name) === name).sort(sortById)
          : [];
        this.foundByNameItems(matches.map(copyItem));
        if (!matches.length) {
          this.errorMessage('No item found for name ' + (this.findByNameQuery().trim() || '(blank)') + '.');
        }
      };

      this.loadUpdateItem = () => {
        this.clearMessages();
        const id = normalizeId(this.updateIdQuery());
        const item = id ? mockData.getItemById(id) : null;
        this.updateLoadedItem(item ? copyItem(item) : null);
        if (!item) {
          resetForm(this.updateForm);
          this.errorMessage('No item found for ID ' + (id || '(blank)') + '.');
          return;
        }

        resetForm(this.updateForm, item);
        this.statusMessage('Loaded item ' + item.id + ' for update.');
      };

      this.updateItem = () => {
        this.clearMessages();
        const loadedItem = this.updateLoadedItem();
        if (!loadedItem) {
          this.errorMessage('Load an item by ID before updating.');
          return;
        }

        const payload = buildPayload(this.updateForm);
        const validationMessage = validatePayload(payload);
        if (validationMessage) {
          this.errorMessage(validationMessage);
          return;
        }

        const updatedItem = mockData.updateItem(loadedItem.id, payload);
        if (!updatedItem) {
          this.errorMessage('Item ' + loadedItem.id + ' was not found.');
          return;
        }

        this.updateLoadedItem(copyItem(updatedItem));
        this.refreshItems();
        this.statusMessage('Updated item ' + updatedItem.id + '.');
      };

      this.loadDeleteItem = () => {
        this.clearMessages();
        const id = normalizeId(this.deleteIdQuery());
        const item = id ? mockData.getItemById(id) : null;
        this.deleteCandidate(item ? copyItem(item) : null);
        if (!item) {
          this.errorMessage('No item found for ID ' + (id || '(blank)') + '.');
          return;
        }
        this.statusMessage('Ready to delete item ' + item.id + '.');
      };

      this.deleteItem = () => {
        this.clearMessages();
        const candidate = this.deleteCandidate();
        if (!candidate) {
          this.errorMessage('Find an item by ID before deleting.');
          return;
        }

        const deletedItem = mockData.deleteItem(candidate.id);
        if (!deletedItem) {
          this.errorMessage('Item ' + candidate.id + ' was not found.');
          return;
        }

        this.deleteCandidate(null);
        this.deleteIdQuery('');
        this.refreshItems();
        this.statusMessage('Deleted item ' + deletedItem.id + '.');
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

      this.refreshItems();
    }

    return AssetsViewModel;
  }
);
