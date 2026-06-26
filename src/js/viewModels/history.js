/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['../accUtils'],
 function(accUtils) {
    function HistoryViewModel() {
      this.connected = () => {
        accUtils.announce('About page loaded.', 'assertive');
        document.title = 'About';
      };

      this.disconnected = () => {
        // Implement if needed
      };

      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    return HistoryViewModel;
  }
);
