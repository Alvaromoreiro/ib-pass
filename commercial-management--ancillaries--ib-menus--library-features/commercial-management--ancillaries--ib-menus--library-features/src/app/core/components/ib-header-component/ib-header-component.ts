angular.module('ib-header-component-module', [
]);
@Component( 'ib-header-component-module', 'ibHeaderComponent',  {
    controllerAs: 'headerComponentCtrl',
    controller: 'ibHeaderController',
    bindings: {},
    templateUrl: ['$rootScope', function ($rootScope: CommonsRootScope) {
        return $rootScope.routes.templates + 'ib-header-component.html';
    }]
}, ['localStorageService', 'ibHeaderComponentServiceModel'], ['ib-user-tooltip-module'])
class ibHeaderController implements ng.IController {
    private model: MenusModel.MenuModel;
    constructor (private localStorageService: angular.local.storage.ILocalStorageService,
        private ibHeaderComponentServiceModel: ibHeaderComponentServiceModel) {}

    $onInit () {
        this.ibHeaderComponentServiceModel.getSubscriptionToHeaderComponentModel( (data: MenusModel.MenuModel) => {
            this.model = data;
        });
    }
}