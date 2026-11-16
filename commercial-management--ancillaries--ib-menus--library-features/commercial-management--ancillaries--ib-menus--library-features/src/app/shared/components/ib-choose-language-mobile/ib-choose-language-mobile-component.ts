import ng from 'angular';
import { CommonsModalService } from 'ib-web-commons/app/core/ib-modal/services/ib-modal-service';

const componentOptions = {
    bindings: {},
    controller: 'IbChooseLanguageMobileController',
    controllerAs: 'ibChooseLanguageMobileCtrl',
    templateUrl: [
        '$rootScope',
        '$attrs',
        function ($rootScope: CommonsRootScope, $attrs) {
            return (
                $rootScope.routes.templates +
                ($attrs.template || 'ib-choose-language-mobile-view.html')
            );
        }
    ]
};

const componentInfo = {
    module: 'ib-choose-language-mobile-module',
    selector: 'ibChooseLanguageMobile',
    inject: ['CommonsModalService'],
    required: []
};

@Component(componentInfo.module, componentInfo.selector, componentOptions, componentInfo.inject, componentInfo.required)
export class IbChooseLanguageMobileComponent implements ng.IController {
    constructor (
        private CommonsModalService: CommonsModalService
    ) { }

    openModal (e: MouseEvent) {
        e.preventDefault();
        this.CommonsModalService.openBuildGenericModal(null, 'ib-choose-language-mobile-modal-view.html', 'ib-modals--sm ib-modals--mobile-full', 'IbChooseLanguageMobileModalComponent');
    }
}