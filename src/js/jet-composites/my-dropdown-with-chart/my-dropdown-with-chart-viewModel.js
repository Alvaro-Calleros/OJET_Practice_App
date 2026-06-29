/**
  Copyright (c) 2015, 2026, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
    [
        'knockout',
        'ojL10n!./resources/nls/my-dropdown-with-chart-strings',
        'ojs/ojcontext',
        'ojs/ojarraydataprovider',
        'ojs/ojknockout',
        'ojs/ojchart'
    ],
    function (ko, componentStrings, Context, ArrayDataProvider) {

    function normalizeBoolean(value) {
        return value === true || value === 'true';
    }

    function DropdownWithChartModel(context) {
        var self = this;
        var busyContext = Context.getContext(context.element).getBusyContext();
        var options = {"description": "my-dropdown-with-chart startup"};
        self.busyResolve = busyContext.addBusyState(options);

        self.res = componentStrings['my-dropdown-with-chart'];
        self.mobileLock = ko.observable(normalizeBoolean(context.properties.mobileLock));
        self.orientationValue = ko.observable('vertical');
        self.chartType = ko.observable('bar');

        self.unitsByCategoryDataProvider = ko.pureComputed(function () {
            return new ArrayDataProvider([], {
                keyAttributes: 'id'
            });
        });

        self.rootClass = ko.pureComputed(function () {
            return self.mobileLock() ?
                'my-dropdown-with-chart my-dropdown-with-chart-mobile-lock' :
                'my-dropdown-with-chart';
        });

        self.busyResolve();
    }

    DropdownWithChartModel.prototype.propertyChanged = function (context) {
        if (context.property === 'mobileLock') {
            this.mobileLock(normalizeBoolean(context.value));
        }
    };

    return DropdownWithChartModel;
});
