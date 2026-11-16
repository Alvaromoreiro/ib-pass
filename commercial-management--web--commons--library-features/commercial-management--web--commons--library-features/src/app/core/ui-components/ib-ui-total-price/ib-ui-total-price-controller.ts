import {CommonsUserUtilsService} from '../../utils/ib-commons-user-utils.service';

@Component(
    'ib-ui-total-price-module',
    'ibUiTotalPrice',
    {
    bindings: {
    label: '=',
    price: '<',
    labelPoints: '<',
    points: '<',
    conditions: '<',
    labelButton: '<',
    onAccept: '&'
    },
    controllerAs: 'ibUiTotalPriceCtrl',
    templateUrl: [
    '$rootScope',
    ($rootScope: CommonsRootScope) => {
    return `${$rootScope.routes.templates}ib-ui-total-price-view.html`;
    }
    ]
    },
    ['localStorageService', '$rootScope', '$scope', 'CommonsUserUtilsService'],
    []
)
class IbUiTotalPriceController implements ng.IController {
    public label: string;
    public price: string;
    public labelPoints: string;
    public points: string;
    public conditions: string;
    public labelButton: string;
    public avios = { avios: 0, elite: 0 };
    public calculatedPoints = this.localStorageService.get('CalculatedPoints');
    public onAccept: (a: Record<string, any>) => void;
    public isIbZero: boolean;
    public isOnb: boolean;
    public isUserLogged: boolean;

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $rootScope: CommonsRootScope,
        private $scope: angular.IScope,
        private commonsUserUtilsService: CommonsUserUtilsService
    ) {
        const getAvios = () => {
            this.avios = this.localStorageService.get('changeFlightAvios');
        };
        const getAviosEvent = this.$rootScope.$on('changeFlight', getAvios);
        $scope.$on('$destroy', getAviosEvent);
        this.isIbZero = this.commonsUserUtilsService.isIbZero();
        this.isOnb = this.commonsUserUtilsService.isUserLoggedONB();
        this.isUserLogged = this.commonsUserUtilsService.isUserLogged();
    }

    accept = () => {
        this.onAccept({
            message: 'Accept'
        });
    };
}