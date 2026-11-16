import * as angular from 'angular';
import {CommonsConstantsType} from '../../constants/ib-commons-constants';

@Component('ib-ui-flight-card-module', 'ibUiFlightCard', {
    bindings: {
	    flightInfo : '<',
	    separator : '<'
    },
    controllerAs: 'ibUiFlightCardCtrl',
    templateUrl: ['$rootScope', ($rootScope:CommonsRootScope) => {
    return `${$rootScope.routes.templates}ib-ui-flight-card-view.html`;
    }]
    }, ['CommonsConstants'], [])
class IbUiFlightCardController implements ng.IController {
    public showDetails: boolean = false;
    public keepCollapseOpen: boolean = false;
    public cssClassMessage: string = '';
    public cssClassDate: string ;
    public flightInfo: UiComponentsModel.FlightCardComponentFlightInfo;
    public separator: boolean;

    constructor (private CommonsConstants: CommonsConstantsType) {
    }

    $onInit ( ) {
        if (angular.isUndefined(this.separator)) {
            this.separator = true;
        }
    }

    $onChanges ( ) {
        if (this.flightInfo && this.flightInfo.flightData  && this.flightInfo.flightData.type === this.CommonsConstants.UICOMPONENT.UI_FLIGHT_CARD.NEW_FLIGHT) {
            this.cssClassMessage = 'ib-ticket-block__flight-info--prev';
            this.cssClassDate = 'ib-ticket-block__date--white';
        }else {
            this.cssClassMessage = 'ib-ticket-block__flight-info--new';
            this.cssClassDate = '';
        }
    }

    getFareIcon = (icon: string): string => {
        const fareIcons = Object.values(this.CommonsConstants.FARE_ICON);
        const found = fareIcons.find((item: any) => item.CASE === icon);
        return found ? found.TYPE : '';
    };
}
