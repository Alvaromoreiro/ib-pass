@Component('ib-pmt-external-form-module', 'ibPmtExternalForm', {
    bindings: {
        externalFormInfo: '<',
        containerForm: '=',
        contactData: '=',
        submittedTab: '='
    },
    controllerAs: 'pmtExternalFormCtrl',
    templateUrl: ['$rootScope', ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-pmt-external-form.html`;
    }]
}, ['$translate', '$filter', 'PmtConstants', '$rootScope'], [])

class IbPmtExternalFormController implements ng.IController {
    public externalFormInfo: { type: string; provider: string; description: string; };
    public model: {
        title: string,
        description: Array<string>,
        paymentLogo: string,
        requiredFields?: Record<string, boolean>,
        termsOfUseTitle?: string,
        termsOfUseConditions?: Array<string>
    };
    public containerForm: any;
    public submittedTab: boolean | undefined;
    public contactData: any;
    constructor (
        private $translate: angular.translate.ITranslateService,
        private $filter: ng.FilterFactory,
        private PmtConstants: PmtConstants,
        private $rootScope: CommonsRootScope
    ) { }
    checkNameOrSurname = (value: string) => {
        let nameOrSurname: string, contactData: any;
        if (value === 'name') {
            nameOrSurname = this.contactData.ownerName;
            contactData = this.containerForm.name;
        } else if (value === 'surnames') {
            nameOrSurname = this.contactData.surnames;
            contactData = this.containerForm.surnames;
        }
        const check : boolean = this.PmtConstants.PATTERNS.NAME_SURNAME_PATTERN.test(nameOrSurname ? nameOrSurname.replace(/[\`\´]/g, '\'') : '');
        if (contactData) {
            contactData.$setValidity(value === 'name' ? 'nameInvalid' : 'surnameInvalid', check);
        }
    };
    $onInit = (): void => {
        this.model = {
            title: null,
            description: [],
            paymentLogo : this.externalFormInfo.provider + '.png'
        };
        if(this.$rootScope.patterns && (!this.$rootScope.patterns.PHONE_PATTERN || !this.$rootScope.patterns.PHONE_CLEANER)) {
            angular.extend(this.$rootScope.patterns, {PHONE_PATTERN: /^\d{8,}$/, PHONE_CLEANER: '\\D+'});
        } else {
            this.$rootScope.patterns = {PHONE_PATTERN: /^\d{8,}$/, PHONE_CLEANER: '\\D+'};
        }
        if (this.$rootScope.lengthPatterns && (!this.$rootScope.lengthPatterns.MIN_LENGTH_PHONE || !this.$rootScope.lengthPatterns.MAX_LENGTH_PHONE)) {
            angular.extend(this.$rootScope.lengthPatterns, {MIN_LENGTH_PHONE: 4, MAX_LENGTH_PHONE: 16});
        } else {
            this.$rootScope.lengthPatterns = {MIN_LENGTH_PHONE: 4, MAX_LENGTH_PHONE: 16};
        }
        this.$translate.onReady().then(this.getBannersTexts);
    };
    private getBannersTexts = (): void => {
        const tagsInfo = {
            bold: {
                tag: 'span',
                class: 'ib-text ib-text--inline ib-text--bold'
            }
        };
        switch (this.externalFormInfo.type) {
                case 'BUTTON':
                    if (this.externalFormInfo.provider === 'DOCOMO_SOFORT') {
                        this.model.title = this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_1'));
                        this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_2') + '$$bold$' + this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_3') + 'Sofort' + '$$' + this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_4'), tagsInfo));
                        this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_5')));
                    } else {
                        this.applyIdealTexts();
                    }
                    break;
                case 'ONHOLD_IBERIA_PAY_AFOP':
                case 'IBERIA_PAY_AFOP':
                    switch (this.externalFormInfo.provider) {
                            case 'NEMURU':
                                this.model.title = this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_AFOP_NEMURU_TEXT_1'));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_AFOP_NEMURU_TEXT_2')));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_AFOP_NEMURU_TEXT_3')));
                                this.model.requiredFields ={
                                    name: true,
                                    surname: true,
                                    phone: true,
                                    email:true
                                };
                                this.setPhoneSelected();
                                break;
                            case 'BIZUM':
                                this.model.title = this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_AFOP_BIZUM_TEXT_1'));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_AFOP_BIZUM_TEXT_2')));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_AFOP_BIZUM_TEXT_3')));
                                this.model.requiredFields = {
                                    name: true,
                                    surname: true,
                                    phone: true
                                };
                                this.setPhoneSelected();
                                break;
                            case 'IDEAL':
                                this.applyIdealTexts();
                                this.model.paymentLogo = this.externalFormInfo.provider + '.svg';
                                break;
                            case 'SOFORT':
                                this.model.title = this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_1'));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_2') + '$$bold$' + this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_3') +  this.$filter('CapitalLetterFilter')(this.externalFormInfo.provider) + '$$' + this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_4'), tagsInfo));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_ONLINE_BANKING_TEXT_5')));
                                this.model.paymentLogo = this.externalFormInfo.provider + '.svg';
                                break;
                            case 'MERCADO_PAGO':
                                this.model.paymentLogo = this.externalFormInfo.provider + '.svg';
                                this.model.title = this.$filter('literalFormatter')(this.$filter('translate')('MERCADO_PAGO_HEADER'));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('MERCADO_PAGO_BODY_1')));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('MERCADO_PAGO_BODY_2')));
                                break;
                            case 'PAYPAL':
                            default:
                                this.model.title = this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_1') + this.externalFormInfo.description + this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_2'));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_3') + '$$bold$' + this.externalFormInfo.description + '$$' + this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_4'), tagsInfo));
                                this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_5')));
                                break;
                    }
                    break;
                default:
                    this.model.title = this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_1') + this.externalFormInfo.description + this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_2'));
                    this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_3') + '$$bold$' + this.externalFormInfo.description + '$$' + this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_4'), tagsInfo));
                    this.model.description.push(this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_EXTERNAL_PAYMENT_TEXT_5')));
                    break;
        }
    };
    private setPhoneSelected () {
        if (!this.contactData.composePhoneNumber){
            this.contactData.composePhoneNumber = { prefix: { id: '' } };
        }
    }

    private applyIdealTexts = (): void => {
        this.model.title = this.$filter('literalFormatter')(this.$filter('translate')('IBPURC_PAYMENTS_AFOP_IDEAL_TEXT_1'));
        this.model.description = [];
        ['IBPURC_PAYMENTS_AFOP_IDEAL_TEXT_2', 'IBPURC_PAYMENTS_AFOP_IDEAL_TEXT_3', 'IBPURC_PAYMENTS_AFOP_IDEAL_TEXT_4']
            .map((key) => this.$filter('translate')(key))
            .filter((text) => Boolean(text))
            .forEach((text) => {
                this.model.description.push(this.$filter('literalFormatter')(text));
            });

        const termsTitle = this.$filter('translate')('IBPURC_PAYMENTS_AFOP_IDEAL_TERMS_TITLE');
        if (Boolean(termsTitle)) {
            this.model.termsOfUseTitle = this.$filter('literalFormatter')(termsTitle);
            this.model.termsOfUseConditions = ['IBPURC_PAYMENTS_AFOP_IDEAL_TERMS_1', 'IBPURC_PAYMENTS_AFOP_IDEAL_TERMS_2']
                .map((key) => this.$filter('translate')(key))
                .filter((text) => Boolean(text))
                .map((text) => this.$filter('literalFormatter')(text));
        }
    };
}