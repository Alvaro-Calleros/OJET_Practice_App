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
    'ojs/ojchart'
  ],
  function (ko, accUtils, mockData, ArrayDataProvider) {
    function DashboardViewModel() {
      this.summary = ko.observable(mockData.getSummary());
      this.categoryBreakdownItems = ko.observableArray([]);
      this.locationItems = ko.observableArray([]);
      this.categoryBreakdownDataProvider = new ArrayDataProvider(this.categoryBreakdownItems, {
        keyAttributes: 'id'
      });
      this.locationDataProvider = new ArrayDataProvider(this.locationItems, {
        keyAttributes: 'id'
      });

      this.chartValueStyle = {
        fontSize: '12px',
        fontWeight: '600'
      };

      this.stackLabelStyle = {
        fontSize: '12px',
        fontWeight: '700'
      };

      this.categoryDataLabel = (context) => {
        return context.value == null ? '' : String(context.value);
      };

      this.locationDataLabel = (context) => {
        return context.value == null ? '' : String(context.value);
      };

      this.categoryStackLabel = (context) => {
        return 'Total: ' + context.value;
      };

      this.refreshDashboard = () => {
        this.summary(mockData.getSummary());
        this.categoryBreakdownItems(mockData.getItemUnitsByCategory());
        this.locationItems(mockData.getUnitsByLocation());
      };

      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = 'Dashboard';
        this.refreshDashboard();
      };

      this.disconnected = () => {
        // Implement if needed
      };

      this.transitionCompleted = () => {
        // Implement if needed
      };

      this.refreshDashboard();
    }

    return DashboardViewModel;
  }
);
