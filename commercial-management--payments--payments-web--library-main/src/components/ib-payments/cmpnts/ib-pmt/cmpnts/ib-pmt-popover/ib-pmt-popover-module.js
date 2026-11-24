(function () {
  'use strict';

  let popoverModule;
  try {
    popoverModule = angular.module('ib-pmt-popover-module');
  } catch (err) {
    popoverModule = angular.module('ib-pmt-popover-module', []);
  }

  popoverModule.run(['$templateCache', function ($templateCache) {
    $templateCache.put('ib-generic-popover.html', `
      <p class="ib-text ib-text--color-light">{{popoverCtrl.text|translate}}</p>
      <button id="bbki-generic-popover-close-btn" class="popover-close icon-cerrar" type="button"
          data-ng-click="popoverCtrl.close()">
          <span class="u-hide-accessible">{{'POP_OVER_ACCESSIBILITY_CLOSE'|translate}}</span>
      </button>
    `);
  }]);
})();
