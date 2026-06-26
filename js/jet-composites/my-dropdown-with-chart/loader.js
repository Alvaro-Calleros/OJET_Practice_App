/**
  Copyright (c) 2015, 2026, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
define(['ojs/ojcomposite', 'text!./my-dropdown-with-chart-view.html', './my-dropdown-with-chart-viewModel', 'text!./component.json', 'css!./my-dropdown-with-chart-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('my-dropdown-with-chart', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);