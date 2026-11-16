import * as angular from 'angular';
import ng from 'angular';

class ApisOriginInfo implements ng.IController {

    constructor (
        
    ) {}

    activate = (): any => {
       
         
    };

   

    
    $onInit = this.activate();

}

const selector = 'ibApisOriginInfo';
const options = {
    bindings: {
        homeAddress: '=',
        inTransit: '=',
        countries: '<',
        requiredFields: '<',
        containerForm: '=',
        passengerData: '=',
        isInfant: '<',
        relatedAdultData: '<'
    },
    controller: ApisOriginInfo,
    controllerAs: 'apisOriginInfoCtrl',
    templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
        return MmBAppConstants.templatesRoute + 'ib-apis-origin-info-view.html';
    }]
};

const inject = [
    
];
try {
    const mod = angular.module('ib-apis-origin-info-module');
    options.controller.$inject = inject;
    mod.component(selector, options);
} catch (error) {
    const mod = angular.module('ib-apis-origin-info-module', []);
    options.controller.$inject = inject;
    mod.component(selector, options);
}
