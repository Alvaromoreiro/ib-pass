import * as angular from 'angular';
const componentOptions = {
    bindings: {

    },
    controllerAs: 'paypalAfopBtnCtrl',
    templateUrl: ['$rootScope', ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-pmt-paypal-afop-button.html`;
    }]
};
const componentInfo = {
    module: 'ib-pmt-paypal-afop-button-module',
    selector: 'pmtPaypalAfopButton',
    inject: ['PmtConstants', '$window', '$scope', '$rootScope'],
    required: []
};
export class PmtPaypalAfopButton implements ng.IController {
    constructor (
        private PmtConstants: PmtConstants,
        private $window: ng.IWindowService,
        private $scope: angular.IScope,
        private $rootScope: CommonsRootScope
    ) { }
    $onInit (): void {
        (this.$window.paypal as any).Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'horizontal',
                label: 'paypal',
                tagline: true
            },
            // onInit is called when the button first renders
            onInit: (data: any, actions: { disable: () => void; enable: () => void; }) => {
                this.toggleButton(actions);
                this.onChangeCheckbox(() => {
                    this.toggleButton(actions);
                });
            },

            // onClick is called when the button is clicked
            onClick: () => {
                this.submitForm();
            },
            // Call your server to set up the transaction
            createOrder: (data, actions) => {
                let generateAfopPaypal, rejectAfopPaypal;
                this.$scope.$emit('submitedPaymentEvent', false, false);
                return new Promise((resolve, reject) => {
                    const returnToPaypal = (event, formData: httpErrorManagment.formData) => {
                        return resolve(formData.component.token);
                    };
                    const rejectPaypalCall = (event, error) => {
                        return reject(error);
                    };
                    generateAfopPaypal = this.$rootScope.$on('generateAfopPaypal', returnToPaypal);
                    rejectAfopPaypal = this.$rootScope.$on('rejectAfopPaypal', rejectPaypalCall);
                    this.$scope.$on('$destroy', generateAfopPaypal);
                    this.$scope.$on('$destroy', rejectAfopPaypal);
                }).then((data)=> { return data;});
            },

            // Call your server to finalize the transaction
            onApprove: (data, actions) => {
                this.$scope.$emit('submitedPaymentEvent', 'iberiaPayAfop');
            },
            // Call when close paypal window
            onCancel: (data) => {
                this.$scope.$emit('submitedPaymentEvent', 'iberiaPayAfop');
            },

            onError: (err) => {
                if (!(err && err.errorCode && err.errorCode !== 451)) {
                    this.$scope.$emit('submitedPaymentEvent', 'iberiaPayAfop');
                }
            }

        }).render('#paypal-afop-button');
    }
    isValid = () => {
        const checks = angular.element('#check_terms_conditions')[0] as HTMLInputElement;
        return checks.checked;
    };
    onChangeCheckbox = (handler: () => void) => {
        angular.element('#check_terms_conditions').on('click', handler);
    };
    submitForm = () => {
        this.$scope.$emit('submitFormEvent');
    };
    toggleButton = (actions: { enable: () => any; disable: () => any; }) => {
        if (angular.element('#paypal-afop-button')[0])
            return this.isValid() ? actions.enable() : actions.disable();
    };
}
try {
    const mod = angular.module(componentInfo.module);
    PmtPaypalAfopButton.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: PmtPaypalAfopButton })

    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    PmtPaypalAfopButton.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: PmtPaypalAfopButton })
    );
}