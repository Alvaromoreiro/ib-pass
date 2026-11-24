import * as angular from 'angular';
export class PmtPaymentScriptsService {
    constructor (
        private PmtConstants: PmtConstants,
        private $rootScope: CommonsRootScope,
        private $window: ng.IWindowService,
        private PmtUtilsService,
        private localStorageService
    ) { }
    /**
     * Gets the available Pmt donations for a booking purchase. If there was and error in the http call,
     * this method treats these http error code and returns the object to show an error in the view.
     * @param {String} orderId - the bookig order id to make the donation
     * @param {String} paymentId - the payment id to make the donation
     * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
     *  When the promise rejects, it returns an object with the error data to show in the view
     */
    getAll = (paymentData) => {
        const getAllSuccess = (script) => {
            return script;
        };
        const scriptGet = this.findScripts(paymentData);

        return Promise.all(scriptGet).then(getAllSuccess, getAllSuccess);
    };

    private findScripts (paymentData: { paymentMethods: any[], currency?: {code?: string}, price: { totalPrice: number} }) {
        const scriptGet: Promise<unknown>[] = [];
        let isNewPaypal: boolean;

        paymentData.paymentMethods.forEach(paymentMethods => {
            if (paymentMethods === this.PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY_AFOP || paymentMethods === this.PmtConstants.PAYMENT_TYPES.IBERIA_PAY_AFOP) {
                isNewPaypal = true;
            }
        });
        for (let i = 0; i < paymentData.paymentMethods.length; i++) {
            switch (paymentData.paymentMethods[i].type) {
                    case this.PmtConstants.PAYMENT_TYPES.PAYPAL:
                        if (!isNewPaypal) {
                            scriptGet.push(this.getPaypalScript(this.PmtConstants.PAYMENT_TYPES.PAYPAL));
                        }
                        break;
                    case this.PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY_AFOP:
                    case this.PmtConstants.PAYMENT_TYPES.IBERIA_PAY_AFOP:
                        switch(paymentData.paymentMethods[i].provider){
                                case  this.PmtConstants.PAYMENT_TYPES.PAYPAL:
                                    scriptGet.push(this.getAfopPaypalScript(paymentData.paymentMethods[i].type, paymentData.currency.code, paymentData.paymentMethods[i].provider));
                                    break;
                                case  this.PmtConstants.PAYMENT_TYPES.NEMURU:
                                    const totalPriceNemuru = paymentData.price ? paymentData.price.totalPrice : paymentData.paymentMethods[i].total;
                                    scriptGet.push(this.getAfopNemuruScript(
                                        paymentData.paymentMethods[i].type,
                                        paymentData.paymentMethods[i].provider,
                                        paymentData.currency,
                                        totalPriceNemuru,
                                        paymentData.paymentMethods[i]?.product,
                                        paymentData.paymentMethods[i].clientId));
                                    break;
                                case this.PmtConstants.PAYMENT_TYPES.MERCADO_PAGO:
                                    scriptGet.push(
                                        this.getAfopMercadoPagoScript(
                                            paymentData.paymentMethods[i].type,
                                            paymentData.paymentMethods[i].provider
                                        )
                                    );
                                    break;
                        }
                        break;
                    default:
                        break;
            }
        }

        return scriptGet;
    }

    private getPaypalScript (type: string) {
        return new Promise((resolve) => {
            const paypalScript = document.createElement('script');
            const getPaypalScriptResponse = (data: { [x: string]: string }) => {
                return () => {
                    resolve(data);
                };
            };
            paypalScript.setAttribute('src', 'https://www.paypalobjects.com/api/checkout.js');
            paypalScript.onload = getPaypalScriptResponse({ [type]: 'success' });
            paypalScript.onerror = getPaypalScriptResponse({ [type]: 'error' });
            document.head.appendChild(paypalScript);
        });
    }

    private getAfopPaypalScript (type: string, currency: string, provider: string) {
        return new Promise((resolve) => {
            if (!this.$window.paypal) {
                const paypalScript = document.createElement('script');
                const paypalUrl = 'https://www.paypal.com/sdk/js?client-id=' +
                    (this.$rootScope.production ? this.PmtConstants.AFOP_PAYPAL_CLIENT_ID.production : this.PmtConstants.AFOP_PAYPAL_CLIENT_ID.test) +
                    '&locale=' + this.PmtUtilsService.getLanguagePaypal() +
                    '&currency=' + currency + '&components=messages,buttons,funding-eligibility&disable-funding=card';
                const getAfopPaypalScriptResponse = (data: { [x: string]: string }) => {
                    return () => {
                        resolve(data);
                    };
                };
                paypalScript.setAttribute('src', paypalUrl);
                paypalScript.onload = getAfopPaypalScriptResponse({ [type + provider]: 'success' });
                paypalScript.onerror = getAfopPaypalScriptResponse({ [type + provider]: 'error' });
                document.head.appendChild(paypalScript);
            } else {
                resolve({ [type + provider]: 'success' });
            }
        });
    }

    private getAfopNemuruScript (
        type:string,
        provider:string,
        currency,
        totalPrice:number,
        product: string,
        clientId: string ){
        return new Promise((resolve) => {
            if(!this.$window.Nemuru){
                const nemuruScript = document.createElement('script');
                const nemuruUrl = this.$rootScope.production ? this.PmtConstants.SCRIPTS_URL.PRO:this.PmtConstants.SCRIPTS_URL.DEV;

                const getAfopNemuruScriptResponse =(data: { [x: string]: string })=>{

                    return () => {
                        this.$window.Nemuru?.init({
                            clientId,
                            configuration: {
                                currency: currency.code,
                                decimalSeparator: currency.decimalSeparator,
                                thousandSeparator: currency.groupingSeparator,
                                locale: this.PmtUtilsService.getNemuruLanguage()
                            },
                            onError: (error) => {}
                        }).then(()=>{
                            resolve(this.resolveNemuru(totalPrice, product, type, provider, data));
                        }, ()=>{
                            resolve( { [type + provider]: 'error' });
                        });

                    };
                };

                nemuruScript.setAttribute('src', nemuruUrl);
                nemuruScript.onload = getAfopNemuruScriptResponse({ [type + provider]: 'success' });
                nemuruScript.onerror = getAfopNemuruScriptResponse({ [type + provider]: 'error' });
                document.head.appendChild(nemuruScript);
            }else {
                resolve(this.resolveNemuru(totalPrice, product, type, provider));
            }
        });
    }

    private resolveNemuru (amount, product, type, provider, data?){
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const fareData = this.localStorageService.get('fareData');
        const flowApp = this.localStorageService.get('flowApp');
        const flows = [
            this.PmtConstants.APP_TYPES.BOOKING,
            this.PmtConstants.APP_TYPES.ONHOLD,
            this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD
        ];
        const EUROPE_COUNTRIES = ['AT', 'BE', 'BG', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
        const shouldShowTab = (slices) => {
            const departureDateTime = new Date(slices[0].departureDateTime).getTime();
            const now = new Date().getTime();
            const diffInHours = Math.abs(departureDateTime - now) / 36e5;
            const isOneWay = slices.length === 1;
            const hasSafePurchaseTime = diffInHours >= 72;
            const lengthSegments = slices[0]?.segments?.length ?? 1;
            const destinationCountry = slices[0]?.segments?.[lengthSegments - 1]?.arrival?.city?.country?.code;
            const isDestinationInEurope = EUROPE_COUNTRIES.includes(destinationCountry);

            if (hasSafePurchaseTime === false) {
                return false;
            }

            if (isOneWay && isDestinationInEurope === false) {
                return false;
            }

            return true;
        };
        const availableConditions=this.$window.Nemuru ? this.$window.Nemuru.availableConditions({'amount':amount }) : [];
        const calculateConditions=this.$window.Nemuru ? this.$window.Nemuru.calculateConditions(
            {
                conditions: {
                    amount: amount,
                    product: product
                }
            }
        ) : [];

        if (
            flowApp === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE
            && fareData?.offers[0]?.slices
            && shouldShowTab(fareData?.offers[0]?.slices) === false) {
            return { [type + provider]: 'error' };
        }

        if (flows.includes(flowApp)
            && bookingInfo?.order?.slices
            && shouldShowTab(bookingInfo?.order?.slices) === false) {
            return { [type + provider]: 'error' };
        }

        if (data){
            return availableConditions?.length>0 ?{...data, calculateConditions: calculateConditions, availableConditions: availableConditions} : { [type + provider]: 'error' };
        } else {
            return availableConditions?.length > 0 ? { ...{ [type + provider]: 'success' }, calculateConditions: calculateConditions, availableConditions: availableConditions} : { [type + provider]: 'error' };
        }
    }

    private getAfopMercadoPagoScript (type: string, provider: string) {
        return new Promise((resolve) => {
            if (this.$window && this.$window.Mercado_Pago) {
                return resolve({ [type + provider]: 'success' });
            }
            const mercadoPagoScript = document.createElement('script');
            const MercadoPagoUrl = this.$rootScope.production ? this.PmtConstants.MERCADO_PAGO_SCRIPTS_URL.PRO:this.PmtConstants.MERCADO_PAGO_SCRIPTS_URL.DEV;
            const getAfopMercadoPagoScriptResponse = (data: { [x: string]: string }) => {
                return () => {
                    resolve(data);
                };
            };
            mercadoPagoScript.setAttribute('src', MercadoPagoUrl);
            mercadoPagoScript.onload = getAfopMercadoPagoScriptResponse({ [type + provider]: 'success' });
            mercadoPagoScript.onerror = getAfopMercadoPagoScriptResponse({ [type + provider]: 'error' });
            document.head.appendChild(mercadoPagoScript);
        });
    }
}
PmtPaymentScriptsService.$inject = ['PmtConstants', '$rootScope', '$window', 'PmtUtilsService', 'localStorageService'];
try {
    const mod = angular.module('pmt-payment-scripts-service');
    mod.service(
        'PmtPaymentScriptsService',
        PmtPaymentScriptsService
    );
} catch (error) {
    const mod = angular.module('pmt-payment-scripts-service', []);
    mod.service(
        'PmtPaymentScriptsService',
        PmtPaymentScriptsService
    );
}
