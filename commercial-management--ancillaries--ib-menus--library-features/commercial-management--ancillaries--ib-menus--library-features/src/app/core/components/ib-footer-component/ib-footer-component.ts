angular.module('ib-footer-component-module', [
]);
@Component('ib-footer-component-module', 'ibFooterComponent', {
    controllerAs: 'footerComponentCtrl',
    controller: 'ibFooterController',
    bindings: {
        footerModel: '<',
        isFullWidth: '<',
        isFixed: '<'
    },
    templateUrl: ['$rootScope', function ($rootScope: CommonsRootScope) {
        return $rootScope.routes.templates + 'ib-footer-component.html';
    }]
}, ['localStorageService', 'ibFooterComponentServiceModel'], [])
class ibFooterController implements ng.IController {
    private model: MenusModel.FooterModel;
    constructor (private localStorageService: angular.local.storage.ILocalStorageService,
        private ibFooterComponentServiceModel: ibFooterComponentServiceModel) { }

    $onInit () {
        this.ibFooterComponentServiceModel.getSubscriptionToFooterComponentModel((data: MenusModel.FooterModel) => {
            this.model = data;
        });
    }
}