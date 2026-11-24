import * as angular from 'angular';
import { ensure_ib_pmt_styles_host } from './ib-pmt-design-system.inject';

export const IB_PMT_STYLES_HOST_CLASS = 'ib-pmt-styles-host';
export const IB_PMT_STYLES_HOST_MODULE = 'ib-pmt-styles-host-module';

const STYLE_ID = 'ib-pmt-styles-host';

function stylesAlreadyDeclared(): boolean {
  return typeof document !== 'undefined' && !!document.getElementById(STYLE_ID);
}

export function injectIbPmtStylesHost(): void {
  if (typeof document === 'undefined' || stylesAlreadyDeclared()) {
    return;
  }
  ensure_ib_pmt_styles_host();
}

type HostEl =
  | { addClass: (cls: string) => void }
  | Element
  | null
  | undefined;

export function mountIbPmtStylesHost(host?: HostEl): void {
  injectIbPmtStylesHost();
  if (!host) {
    return;
  }
  if (typeof (host as { addClass?: unknown }).addClass === 'function') {
    (host as { addClass: (cls: string) => void }).addClass(IB_PMT_STYLES_HOST_CLASS);
    return;
  }
  if ((host as Element).classList) {
    (host as Element).classList.add(IB_PMT_STYLES_HOST_CLASS);
  }
}

export function withIbPmtStylesHostClass(windowClass?: string): string {
  injectIbPmtStylesHost();
  const classes = (windowClass || 'ib-modals').split(/\s+/).filter(Boolean);
  if (classes.indexOf(IB_PMT_STYLES_HOST_CLASS) === -1) {
    classes.push(IB_PMT_STYLES_HOST_CLASS);
  }
  return classes.join(' ');
}

export function ibPmtWithStylesHost(
  controllerName: string
): angular.Injectable<angular.IControllerConstructor> {
  return [
    '$controller',
    '$element',
    '$scope',
    'IbPmtStylesHostMount',
    function (
      $controller: ng.IControllerService,
      $element: ng.IAugmentedJQuery,
      $scope: ng.IScope,
      IbPmtStylesHostMount: typeof mountIbPmtStylesHost
    ) {
      const ctrl = $controller(controllerName, {
        $scope,
        $element
      }) as ng.IController & { $onInit?: () => void };
      IbPmtStylesHostMount($element);
      const prev = ctrl.$onInit;
      ctrl.$onInit = function () {
        IbPmtStylesHostMount($element);
        if (angular.isFunction(prev)) {
          return prev.apply(this, arguments as unknown as []);
        }
      };
      return ctrl;
    }
  ] as angular.Injectable<angular.IControllerConstructor>;
}

try {
  angular.module(IB_PMT_STYLES_HOST_MODULE);
} catch {
  angular.module(IB_PMT_STYLES_HOST_MODULE, []);
}
angular.module(IB_PMT_STYLES_HOST_MODULE).value('IbPmtStylesHostMount', mountIbPmtStylesHost);
