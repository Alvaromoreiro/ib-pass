describe('Payment-Methods Transformer Test', () => {

    let returnedValue, PmtMethodsTransformer, rootScope, localStorageService;

    const fakeCurrencyService = {
        formatAvios: jasmine.createSpy(),
        formatPrice: jasmine.createSpy(),
        getCurrencyObject: jasmine.createSpy()
    };

    const fakePmtUtilsService = {
        getPaymentRelatedContent: jasmine.createSpy(),
        getCreditCardIcon: jasmine.createSpy(),
        addKeyToPaymentMethods: jasmine.createSpy(),
        checkCreditCardExpiryDate: jasmine.createSpy()
    };

    const fakecashAviosPossibilities = [
        {
            totalDiscount: 10,
            currency: 'EUR',
            aviosRequired: 1850,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 10,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ]
        },
        {
            totalDiscount: 26.62,
            currency: 'EUR',
            aviosRequired: 4930,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 26.62,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ]
        },
        {
            totalDiscount: 44.37,
            currency: 'EUR',
            aviosRequired: 8215,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 44.37,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ]
        },
        {
            totalDiscount: 70.99,
            currency: 'EUR',
            aviosRequired: 13145,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 70.99,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ]
        },
        {
            totalDiscount: 84.3,
            currency: 'EUR',
            aviosRequired: 15610,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 84.3,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ]
        }
    ];

    const fakepaymentsInfo = {
        creditCardsInfo: {
            creditCardsList: [
                {
                    description: 'American Express',
                    cardTypeId: '16',
                    name: 'ico-americanexpress.png'
                },
                {
                    description: 'American Express Banco Popular particular',
                    cardTypeId: '124',
                    name: 'ico-americanexpress.png'
                },
                {
                    description: 'American Express empresa',
                    cardTypeId: '103',
                    name: 'ico-americanexpress.png'
                },
                {
                    description: 'American Express Iberia Cards particular',
                    cardTypeId: '113',
                    name: 'ico-americanexpress.png'
                },
                {
                    description: 'American Express mercado Italia',
                    cardTypeId: '2',
                    name: 'ico-americanexpress.png'
                },
                {
                    description: 'Carte Blanche',
                    cardTypeId: '6',
                    name: 'ico-carteblanche.png'
                },
                {
                    description: 'Diners Club',
                    cardTypeId: '4',
                    name: 'ico-dinersclub.png'
                },
                {
                    description: 'MasterCard empresa',
                    cardTypeId: '105',
                    name: 'ico-mastercard.png'
                },
                {
                    description: 'MasterCard particular',
                    cardTypeId: '112',
                    name: 'ico-mastercard.png'
                },
                {
                    description: 'MasterCard mercado Italia',
                    cardTypeId: '5',
                    name: 'ico-mastercard.png'
                },
                {
                    description: 'Resto de American Express',
                    cardTypeId: '123',
                    name: 'ico-americanexpress.png'
                },
                {
                    description: 'UATP/Airplus',
                    cardTypeId: '3',
                    name: 'ico-uatp.png'
                },
                {
                    description: 'Visa empresa',
                    cardTypeId: '101',
                    name: 'visa-ico.png'
                },
                {
                    description: 'Visa mercado Italia',
                    cardTypeId: '1',
                    name: 'visa-ico.png'
                },
                {
                    description: 'Visa particular',
                    cardTypeId: '111',
                    name: 'visa-ico.png'
                },
                {
                    description: 'Master Card Débito',
                    cardTypeId: '12',
                    name: 'ico-mastercard.png'
                }
            ]
        },
        sessionId: 'IBERIA8201d060-04ca-40b3-8087-e09ebfb93180',
        currency: {
            suffixSymbol: true,
            decimalSeparator: ',',
            numberDecimals: 2,
            groupingSeparator: '.',
            currencySymbol: '€',
            description: 'Euro',
            code: 'EUR'
        },
        relatedContent: {
            original: {
                termsAndConditions: 'He leído y acepto los <a target=\'_blank\' href=\'http://prea.iberia.es/web/program.do?quadrigam=CONDIC&quickaccess=true&market=ES&language=es\'>términos y condiciones</a> generales de compra  y las <a target=\'_blank\' href=\'http://prea.iberia.es/web/program.do?quadrigam=CONBIL&quickaccess=true&market=ES&language=es\'>condiciones de contrato</a>',
                totalPriceText: 'Precio total, incluye tarifa aérea, <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tasas_gubernamentales&market=ES&language=es\'>tasas</a> (salvo las que se cobren en determinados aeropuertos en el momento de facturar), gastos de gestión, cargos del operador, y las opciones seleccionadas. Si eliges abonar el viaje con una de estas <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tarjetas_empresa&market=ES&language=es\'>tarjetas</a>, se aplicará un cargo adicional por reserva de un 1% del importe final en vuelos de largo radio y 2% en el resto de vuelos.'
            },
            transformed: {
                CONDITIONS: {

                },
                TOTAL_PRICE: {

                }
            }
        },
        originalPaymentMethods: [
            {
                total: 137.73,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                vault: {
                    id: '000023RQ',
                    urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pree.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                    urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pree.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                },
                type: 'IBERIA_PAY'
            },
            {
                total: 137.73,
                appliedDiscounts: [

                ],
                description: 'Transferencia',
                provider: 'DOCOMO_SOFORT',
                unityFee: 0,
                totalFee: 0,
                totalToPay: 137.73,
                fee: null,
                requiredAdditionalFields: false,
                type: 'BUTTON'
            },
            {
                total: 137.73,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                type: 'CREDITCARD'
            },
            {
                total: 137.73,
                totalToPay: 137.73,
                unityFee: 0,
                totalFee: 0,
                fee: null,
                description: 'PayPal',
                appliedDiscounts: [

                ],
                type: 'PAYPAL'
            }
        ],
        paymentMethods: [
            {
                total: 137.73,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-carteblanche.png'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-mastercard.png'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-dinersclub.png'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-uatp.png'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-americanexpress.png'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/visa-ico.png'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                type: 'CREDITCARD',
                somethingToPay: true,
                totalPriceInfo: '137,73€',
                key: 5
            },
            {
                total: 137.73,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-carteblanche.png'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-mastercard.png'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-dinersclub.png'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-uatp.png'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-americanexpress.png'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 137.73,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/visa-ico.png'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                vault: {
                    id: '000023RQ',
                    urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pree.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                    urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pree.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                },
                type: 'IBERIA_PAY',
                somethingToPay: true,
                totalPriceInfo: '137,73€',
                key: 4
            },
            {
                total: 137.73,
                totalToPay: 137.73,
                unityFee: 0,
                totalFee: 0,
                fee: null,
                description: 'PayPal',
                appliedDiscounts: [

                ],
                type: 'PAYPAL',
                key: 3,
                totalPriceInfo: '137,73€',
                provider: 'PAYPAL'
            },
            {
                total: 137.73,
                appliedDiscounts: [

                ],
                description: 'Transferencia',
                provider: 'DOCOMO_SOFORT',
                unityFee: 0,
                totalFee: 0,
                totalToPay: 137.73,
                fee: null,
                requiredAdditionalFields: false,
                type: 'BUTTON',
                key: 2,
                totalPriceInfo: '137,73€'
            }
        ],
        requiredAdditionalFields: {
            paymentMethods: [

            ],
            info: {

            }
        },
        availableDiscounts: {
            VOUCHER: {
                available: true
            },
            AVIOS: {
                available: false,
                disscounts: [
                    {
                        totalDiscount: 10,
                        currency: 'EUR',
                        aviosRequired: 1850,
                        offerAvailable: false,
                        perPassengerDiscounts: [
                            {
                                discount: 10,
                                passengerType: 'ADT',
                                numberOfPassengers: 1
                            }
                        ],
                        formatedAvios: '111',
                        formatedTotalDiscount: '10,00€'
                    },
                    {
                        totalDiscount: 26.62,
                        currency: 'EUR',
                        aviosRequired: 4930,
                        offerAvailable: false,
                        perPassengerDiscounts: [
                            {
                                discount: 26.62,
                                passengerType: 'ADT',
                                numberOfPassengers: 1
                            }
                        ],
                        formatedAvios: '111',
                        formatedTotalDiscount: '26,62€'
                    },
                    {
                        totalDiscount: 44.37,
                        currency: 'EUR',
                        aviosRequired: 8215,
                        offerAvailable: false,
                        perPassengerDiscounts: [
                            {
                                discount: 44.37,
                                passengerType: 'ADT',
                                numberOfPassengers: 1
                            }
                        ],
                        formatedAvios: '111',
                        formatedTotalDiscount: '44,37€'
                    },
                    {
                        totalDiscount: 70.99,
                        currency: 'EUR',
                        aviosRequired: 13145,
                        offerAvailable: false,
                        perPassengerDiscounts: [
                            {
                                discount: 70.99,
                                passengerType: 'ADT',
                                numberOfPassengers: 1
                            }
                        ],
                        formatedAvios: '111',
                        formatedTotalDiscount: '70,99€'
                    },
                    {
                        totalDiscount: 84.3,
                        currency: 'EUR',
                        aviosRequired: 15610,
                        offerAvailable: false,
                        perPassengerDiscounts: [
                            {
                                discount: 84.3,
                                passengerType: 'ADT',
                                numberOfPassengers: 1
                            }
                        ],
                        formatedAvios: '111',
                        formatedTotalDiscount: '84,30€'
                    }
                ]
            }
        },
        appliedDiscounts: {
            status: false,
            types: {

            }
        },
        somethingToPay: true,
        isOnHoldOrder: null,
        paymentId: '8201d060-04ca-40b3-8087-e09ebfb93180',
        price: {
            totalPrice: 137.73,
            formattedTotalPrice: '137,73€',
            formattedOldPriceInfo: null
        },
        selectedPaymentInfo: {

        },
        iberiaPayLoadingIframe: true,
        customerCreditCards: {
            CREDITCARD: [
                {
                    description: 'CREDIT_CARD_FORM_SELECT_NEW_LOGGED_OPTION',
                    cardTypeId: 'newCard',
                    profileCardId: 'newCard',
                    active: true,
                    provider: {
                        CREDITCARD: true,
                        ONHOLD_CREDITCARD: true,
                        IBERIA_PAY: true,
                        ONHOLD_IBERIA_PAY: true
                    }
                }
            ],
            IBERIA_PAY: [
                {
                    description: 'CREDIT_CARD_FORM_SELECT_NEW_LOGGED_OPTION',
                    cardTypeId: 'newCard',
                    profileCardId: 'newCard',
                    active: true,
                    provider: {
                        CREDITCARD: true,
                        ONHOLD_CREDITCARD: true,
                        IBERIA_PAY: true,
                        ONHOLD_IBERIA_PAY: true
                    }
                }
            ]
        }
    };

    const fakePaymentMethods = {
        currency: {
            code: 'EUR',
            description: 'Euro',
            symbol: '€',
            alignment: 'R',
            groupingSeparator: '.',
            decimalSeparator: ',',
            decimals: 2,
            recommendedDisplay: 'symbol'
        },
        paymentMethods: [
            {
                total: 128.79,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                vault: {
                    id: '000023XQ',
                    urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                    urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                },
                type: 'IBERIA_PAY'
            },
            {
                total: 128.79,
                appliedDiscounts: [

                ],
                description: 'Transferencia',
                provider: 'DOCOMO_SOFORT',
                unityFee: 0,
                totalFee: 0,
                totalToPay: 128.79,
                fee: null,
                requiredAdditionalFields: false,
                type: 'BUTTON'
            },
            {
                total: 128.79,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                type: 'CREDITCARD'
            },
            {
                total: 128.79,
                totalToPay: 128.79,
                unityFee: 0,
                totalFee: 0,
                fee: null,
                description: 'PayPal',
                appliedDiscounts: [

                ],
                type: 'PAYPAL'
            }
        ],
        availableDiscounts: [
            {
                possibilities: [{
                    totalDiscount: {
                        fare: 10.00,
                        currency: 'EUR'
                    },
                    aviosRequired: 1850,
                    paymentMethodsWithDiscount: [
                        {
                            total: 118.79,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 118.79,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 118.79,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 118.79,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            tycreditCardTypespes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 118.79,
                            totalToPay: 118.79,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                },
                {
                    totalDiscount: {
                        fare: 38.64,
                        currency: 'EUR'
                    },
                    aviosRequired: 7155,
                    paymentMethodsWithDiscount: [
                        {
                            total: 90.15,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 90.15,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 90.15,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 90.15,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 90.15,
                            totalToPay: 90.15,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                },
                {
                    totalDiscount: {
                        fare: 64.40,
                        currency: 'EUR'
                    },
                    aviosRequired: 11925,
                    paymentMethodsWithDiscount: [
                        {
                            total: 64.39,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 64.39,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 64.39,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 64.39,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 64.39,
                            totalToPay: 64.39,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                },
                {
                    totalDiscount: {
                        fare: 103.04,
                        currency: 'EUR'
                    },
                    aviosRequired: 19080,
                    paymentMethodsWithDiscount: [
                        {
                            total: 25.75,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 25.75,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 25.75,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 25.75,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 25.75,
                            totalToPay: 25.75,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                },
                {
                    totalDiscount: {
                        fare: 122.36,
                        currency: 'EUR'
                    },
                    aviosRequired: 22660,
                    paymentMethodsWithDiscount: [
                        {
                            total: 6.43,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 6.43,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 6.43,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 6.43,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 6.43,
                            totalToPay: 6.43,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                }
                ],
                type: 'AVIOS'
            },
            {
                type: 'VOUCHER'
            }
        ],
        paymentId: '4db2ec09-f499-4481-ba86-fe990b075162',
        termsAndConditions: 'He leído y acepto los <a target=\'_blank\' href=\'http://prea.iberia.es/web/program.do?quadrigam=CONDIC&quickaccess=true&market=IT&language=es\'>términos y condiciones</a> generales de compra  y las <a target=\'_blank\' href=\'http://prea.iberia.es/web/program.do?quadrigam=CONBIL&quickaccess=true&market=IT&language=es\'>condiciones de contrato</a>',
        totalPriceText: 'Precio Final, incluye tarifa aérea, tasas, gastos de gestión y cargos del operador.'
    };

    const fakePaymentMethods2 = {
        currency: {
            code: 'EUR',
            description: 'Euro',
            symbol: '€',
            alignment: 'R',
            groupingSeparator: '.',
            decimalSeparator: ',',
            decimals: 2,
            recommendedDisplay: 'symbol'
        },
        paymentMethods: [
            {
                total: 128.79,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                vault: {
                    id: '000023XQ',
                    urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                    urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                },
                type: 'IBERIA_PAY'
            },
            {
                total: 128.79,
                appliedDiscounts: [

                ],
                description: 'Transferencia',
                provider: 'DOCOMO_SOFORT',
                unityFee: 0,
                totalFee: 0,
                totalToPay: 128.79,
                fee: null,
                requiredAdditionalFields: false,
                type: 'BUTTON'
            },
            {
                total: 128.79,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0.00,
                        fee: null,
                        totalFee: 0.00,
                        totalToPay: 128.79,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                type: 'CREDITCARD'
            },
            {
                total: 128.79,
                totalToPay: 128.79,
                unityFee: 0,
                totalFee: 0,
                fee: null,
                description: 'PayPal',
                appliedDiscounts: [

                ],
                type: 'PAYPAL'
            }
        ],
        availableDiscounts: [
            {
                possibilities: [{
                    totalDiscount: {
                        fare: 10.00,
                        currency: 'EUR'
                    },
                    aviosRequired: 1850,
                    paymentMethodsWithDiscount: [
                        {
                            total: 118.79,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 118.79,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 118.79,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 118.79,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 118.79,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 118.79,
                            totalToPay: 118.79,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                },
                {
                    totalDiscount: {
                        fare: 38.64,
                        currency: 'EUR'
                    },
                    aviosRequired: 7155,
                    paymentMethodsWithDiscount: [
                        {
                            total: 90.15,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 90.15,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 90.15,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 90.15,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 90.15,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 90.15,
                            totalToPay: 90.15,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                },
                {
                    totalDiscount: {
                        fare: 64.40,
                        currency: 'EUR'
                    },
                    aviosRequired: 11925,
                    paymentMethodsWithDiscount: [
                        {
                            total: 64.39,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 64.39,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 64.39,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 64.39,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 64.39,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 64.39,
                            totalToPay: 64.39,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                },
                {
                    totalDiscount: {
                        fare: 103.04,
                        currency: 'EUR'
                    },
                    aviosRequired: 19080,
                    paymentMethodsWithDiscount: [
                        {
                            total: 25.75,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 25.75,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 25.75,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 25.75,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 25.75,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 25.75,
                            totalToPay: 25.75,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                },
                {
                    totalDiscount: {
                        fare: 122.36,
                        currency: 'EUR'
                    },
                    aviosRequired: 22660,
                    paymentMethodsWithDiscount: [
                        {
                            total: 6.43,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            vault: {
                                id: '000023XQ',
                                urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                                urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                            },
                            type: 'IBERIA_PAY'
                        },
                        {
                            total: 6.43,
                            appliedDiscounts: [

                            ],
                            description: 'Transferencia',
                            provider: 'DOCOMO_SOFORT',
                            unityFee: 0,
                            totalFee: 0,
                            totalToPay: 6.43,
                            fee: null,
                            requiredAdditionalFields: false,
                            type: 'BUTTON'
                        },
                        {
                            total: 6.43,
                            appliedDiscounts: [

                            ],
                            description: 'Tarjeta de crédito',
                            creditCardTypes: [
                                {
                                    cardTypeCode: 'CB',
                                    description: 'Carte Blanche',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: null,
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '6'
                                },
                                {
                                    cardTypeCode: 'CA',
                                    description: 'Master Card',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '5'
                                },
                                {
                                    cardTypeCode: 'DC',
                                    description: 'Diners Club',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '4'
                                },
                                {
                                    cardTypeCode: 'TP',
                                    description: 'UATP/Airplus',
                                    cvv: {
                                        length: 0,
                                        mandatory: false
                                    },
                                    pattern: '1[0-9]{12,15}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '3'
                                },
                                {
                                    cardTypeCode: 'AX',
                                    description: 'American Express',
                                    cvv: {
                                        length: 4,
                                        mandatory: true
                                    },
                                    pattern: '(34|37)[0-9]{13}',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '2'
                                },
                                {
                                    cardTypeCode: 'VI',
                                    description: 'Visa',
                                    cvv: {
                                        length: 3,
                                        mandatory: true
                                    },
                                    pattern: '4([0-9]{15}|[0-9]{12})',
                                    unityFee: 0.00,
                                    fee: null,
                                    totalFee: 0.00,
                                    totalToPay: 6.43,
                                    extendedDescription: '(Sin cargo)',
                                    cardTypeId: '1'
                                }
                            ],
                            requiredFields: [
                                'billTo_country',
                                'billTo_postalCode',
                                'issueCountry'
                            ],
                            requiredAdditionalFields: false,
                            type: 'CREDITCARD'
                        },
                        {
                            total: 6.43,
                            totalToPay: 6.43,
                            unityFee: 0,
                            totalFee: 0,
                            fee: null,
                            description: 'PayPal',
                            appliedDiscounts: [

                            ],
                            type: 'PAYPAL'
                        }
                    ]
                }
                ],
                type: 'AVIOS'
            },
            {
                type: 'VOUCHER'
            }
        ],
        paymentId: '4db2ec09-f499-4481-ba86-fe990b075162',
        termsAndConditions: 'He leído y acepto los <a target=\'_blank\' href=\'http://prea.iberia.es/web/program.do?quadrigam=CONDIC&quickaccess=true&market=IT&language=es\'>términos y condiciones</a> generales de compra  y las <a target=\'_blank\' href=\'http://prea.iberia.es/web/program.do?quadrigam=CONBIL&quickaccess=true&market=IT&language=es\'>condiciones de contrato</a>',
        totalPriceText: 'Precio Final, incluye tarifa aérea, tasas, gastos de gestión y cargos del operador.'
    };

    const fakeAppConstants = {
        MERCHANT_ID: 'IBERIA',
        PAYMENT_TYPES: {
            CREDIT_CARD: 'CREDITCARD',
            EXTERNAL_CREDITCARD: 'EXTERNAL_CREDITCARD',
            AVIOS: 'AVIOS',
            VOUCHER: 'VOUCHER',
            ONHOLD: 'ONHOLD',
            ONHOLD_CREDITCARD: 'ONHOLD_CREDITCARD',
            ONHOLD_IBERIA_PAY: 'ONHOLD_IBERIA_PAY',
            BUTTON: 'BUTTON',
            PAYPAL: 'PAYPAL',
            NEW_CARD: 'newCard',
            IBERIA_PAY: 'IBERIA_PAY'
        },
        PAYMENT_METHODS_KEYS: {
            DEFAULT: { CREDITCARD: 5, IBERIA_PAY: 4, PAYPAL: 3, DOCOMO_SOFORT: 2, DOCOMO_IDEAL: 1 },
            JP: { JC: 4, CREDITCARD: 3, IBERIA_PAY: 2, PAYPAL: 1 },
            CN: { UP: 5, DOCOMO_ALIPAY: 4, DOCOMO_WECHAT: 3, CREDITCARD: 2, IBERIA_PAY: 1 }
        },
        DISCOUNT_TYPES: {
            AVIOS: 'AVIOS',
            VOUCHER: 'VOUCHER',
            PARTNER: 'PARTNER',
            AVIOS_REDEMPTION: 'AVIOS_REDEMPTION'
        },
        APP_TYPES: {
            BOOKING: 'BBKI',
            MANAGEMYBOOKING: 'MMB',
            MANAGEMYBOOKING_ONHOLD: 'MMBOH',
            MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
            ONHOLD: 'BBKIOH',
            CHECKIN: 'CKI'
        }
    };

    const fakeSelectedPayment = {
        selectedTab: 0,
        selectedDisscountTab: 0,
        selectedAviosIndex: 1,
        selectedOnHoldIndex: 0
    };
    const fakeCustomerCreditCards = [
        {
            cardTypeId: '112',
            description: 'Tata',
            expiryDate: '1021',
            nameOnCard: 'Tata',
            surnameOnCard: 'Tata',
            companyName: null,
            defaultCard: false,
            creditCardInfo: [
                {
                    cardNumber: '************0015',
                    type: 'RESIBER'
                },
                {
                    token: '8100000000060015',
                    mask: '549983******0015',
                    type: 'IBERIAPAY'
                }
            ],
            profileCardId: '2',
            profileAddressInfo: {
                street: 'Tata',
                streetNumber: '1',
                block: null,
                zipCode: '32263',
                city: 'Tata',
                region: null,
                additionalInfo: null,
                state: {
                    code: '23',
                    description: 'Jaén'
                },
                country: {
                    code: 'ES',
                    description: 'España'
                }
            },
            cardType: {
                code: 'CA',
                description: 'MasterCard particular'
            },
            provider: {
                CREDITCARD: true,
                IBERIA_PAY: true
            },
            cardNumber: '************0015'
        },
        {
            cardTypeId: '111',
            description: 'Tarjeton',
            expiryDate: '0620',
            nameOnCard: 'Test',
            surnameOnCard: 'Prueba',
            companyName: null,
            defaultCard: true,
            creditCardInfo: [
                {
                    cardNumber: '************9999',
                    type: 'RESIBER'
                },
                {
                    token: '8100000000079999',
                    mask: '401299******9999',
                    type: 'IBERIAPAY'
                }
            ],
            profileCardId: '1',
            profileAddressInfo: {
                street: 'Nueva',
                streetNumber: '1',
                block: '2',
                zipCode: '28760',
                city: 'Tres piedras',
                region: null,
                additionalInfo: null,
                state: {
                    code: '28',
                    description: 'Madrid'
                },
                country: {
                    code: 'ES',
                    description: 'España'
                }
            },
            cardType: {
                code: 'VI',
                description: 'Visa particular'
            },
            provider: {
                CREDITCARD: true,
                IBERIA_PAY: true
            },
            cardNumber: '************9999'
        },
        {
            cardTypeId: '111',
            description: 'Tata11',
            expiryDate: '1019',
            nameOnCard: 'Tata',
            surnameOnCard: 'Tata',
            companyName: null,
            defaultCard: false,
            creditCardInfo: [
                {
                    cardNumber: '************1111',
                    type: 'RESIBER'
                },
                {
                    token: '8100000000081111',
                    mask: '411111******1111',
                    type: 'IBERIAPAY'
                }
            ],
            profileCardId: '3',
            profileAddressInfo: {
                street: 'Fwuais',
                streetNumber: '1',
                block: null,
                zipCode: '26626',
                city: 'Tata',
                region: 'Tata',
                additionalInfo: null,
                state: null,
                country: {
                    code: 'GB',
                    description: 'Reino Unido'
                }
            },
            cardType: null,
            provider: {
                CREDITCARD: true,
                IBERIA_PAY: true
            },
            cardNumber: '************1111'
        }
    ];
    const fakeselectedAviosDisccount = {
        totalDiscount: {
            fare: 38.64,
            currency: 'EUR'
        },
        aviosRequired: 7155,
        paymentMethodsWithDiscount: [
            {
                total: 90.15,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-carteblanche.png'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-mastercard.png'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-dinersclub.png'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-uatp.png'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-americanexpress.png'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/visa-ico.png'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                type: 'CREDITCARD',
                key: 5,
                somethingToPay: true,
                totalPriceInfo: '90,15€'
            },
            {
                total: 90.15,
                appliedDiscounts: [

                ],
                description: 'Tarjeta de crédito',
                creditCardTypes: [
                    {
                        cardTypeCode: 'CB',
                        description: 'Carte Blanche',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: null,
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '6',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-carteblanche.png'
                    },
                    {
                        cardTypeCode: 'CA',
                        description: 'Master Card',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '5(1|2|3|4|5|8)[0-9]{14}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '5',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-mastercard.png'
                    },
                    {
                        cardTypeCode: 'DC',
                        description: 'Diners Club',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '3((00|01|02|03|04|05)[0-9]{11}|(6|8)[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '4',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-dinersclub.png'
                    },
                    {
                        cardTypeCode: 'TP',
                        description: 'UATP/Airplus',
                        cvv: {
                            length: 0,
                            mandatory: false
                        },
                        pattern: '1[0-9]{12,15}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '3',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-uatp.png'
                    },
                    {
                        cardTypeCode: 'AX',
                        description: 'American Express',
                        cvv: {
                            length: 4,
                            mandatory: true
                        },
                        pattern: '(34|37)[0-9]{13}',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '2',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/ico-americanexpress.png'
                    },
                    {
                        cardTypeCode: 'VI',
                        description: 'Visa',
                        cvv: {
                            length: 3,
                            mandatory: true
                        },
                        pattern: '4([0-9]{15}|[0-9]{12})',
                        unityFee: 0,
                        fee: null,
                        totalFee: 0,
                        totalToPay: 90.15,
                        extendedDescription: '(Sin cargo)',
                        cardTypeId: '1',
                        parsedFee: '0€',
                        iconUrl: '/iberia-web-content/iconos/payment/visa-ico.png'
                    }
                ],
                requiredFields: [
                    'billTo_country',
                    'billTo_postalCode',
                    'issueCountry'
                ],
                requiredAdditionalFields: false,
                vault: {
                    id: '000023XQ',
                    urlIframeNumber: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeNumber.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                    urlIframeCvv: 'https://www.test.indra-netplus.com/iberiapay/iframes/iframeCvv.html?urlsCss=https://pred.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
                },
                type: 'IBERIA_PAY',
                key: 4,
                somethingToPay: true,
                totalPriceInfo: '90,15€'
            },
            {
                total: 90.15,
                totalToPay: 90.15,
                unityFee: 0,
                totalFee: 0,
                fee: null,
                description: 'PayPal',
                appliedDiscounts: [

                ],
                type: 'PAYPAL',
                key: 3,
                somethingToPay: true,
                totalPriceInfo: '90,15€'
            },
            {
                total: 90.15,
                appliedDiscounts: [

                ],
                description: 'Transferencia',
                provider: 'DOCOMO_SOFORT',
                unityFee: 0,
                totalFee: 0,
                totalToPay: 90.15,
                fee: null,
                requiredAdditionalFields: false,
                type: 'BUTTON',
                key: 2,
                somethingToPay: true,
                totalPriceInfo: '90,15€'
            }
        ],
        formatedAvios: '111',
        formatedTotalDiscount: '38,64€',
        active: true
    };

    const fakePmtModelInfo = {
        ident: 'IDENT'
    };

    const $fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        function filterFunc () {
            return [];
        }
        switch (filter) {
                case 'translate':
                    filterFunc = function (label) {
                        return label;
                    };
                    break;
                default:
                    break;
        }

        return filterFunc;
    });

    beforeEach(() => {
        angular.mock.module('ib-pmt-services-http-module', 'LocalStorageModule', ($provide) => {
            $provide.value('PmtConstants', fakeAppConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('PmtUtilsService', fakePmtUtilsService);
            $provide.value('PmtUtilsService', fakePmtUtilsService);
            $provide.value('$filter', $fakeFilter);
        });

        inject((_PmtMethodsTransformer_, $rootScope, _localStorageService_) => {
            PmtMethodsTransformer = _PmtMethodsTransformer_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            localStorageService.set('selectedPaymentData', fakeSelectedPayment);
            localStorageService.set('pmtModelInfo', fakePmtModelInfo);
            localStorageService.set('paymentsInfo', fakepaymentsInfo);
            localStorageService.set('selectedAviosDisccount', fakeselectedAviosDisccount);
        });
        fakeCurrencyService.getCurrencyObject = jasmine.createSpy('getCurrencyObject').and.callFake((serviceCurrency) => {
            const currency = {
                suffixSymbol: true,
                decimalSeparator: ',',
                numberDecimals: 2,
                groupingSeparator: '.',
                currencySymbol: '',
                description: '',
                code:''
            };
            if (serviceCurrency) {
                currency.suffixSymbol = serviceCurrency.alignment === 'R';
                currency.decimalSeparator = serviceCurrency.decimalSeparator ? serviceCurrency.decimalSeparator : ',';
                currency.numberDecimals = serviceCurrency.decimals ? serviceCurrency.decimals : 2;
                currency.groupingSeparator = serviceCurrency.groupingSeparator ? serviceCurrency.groupingSeparator : '.';
                currency.currencySymbol = serviceCurrency.symbol ?? serviceCurrency.code ? serviceCurrency.code : '';
                currency.description = serviceCurrency.description ? serviceCurrency.description : '';
                currency.code = serviceCurrency.code ? serviceCurrency.code : '';
            }
            return currency;
        });

        fakeCurrencyService.formatPrice = jasmine.createSpy('formatPrice').and.callFake(() => {
            return '118.79€';
        });

        fakeCurrencyService.formatAvios = jasmine.createSpy('formatAvios').and.callFake(() => {
            return '111';
        });

        fakePmtUtilsService.addKeyToPaymentMethods = jasmine.createSpy('addKeyToPaymentMethods').and.callFake((paymentMethods, paymentMethodsAddKey) => {
            let i;
            if (paymentMethods.length === paymentMethodsAddKey.length) {
                for (i = 0; i < paymentMethods.length; i++) {
                    if (paymentMethods[i].type === paymentMethodsAddKey[i].type) {
                        paymentMethodsAddKey[i].key = paymentMethods[i].key;
                    }
                }
            }
            return paymentMethodsAddKey;
        }
        );
    });

    describe('When generateModelPayMethods is called and market is ES', () => {
        it('and have all the data', (done) => {
            returnedValue = PmtMethodsTransformer.generateModelPayMethods(fakePaymentMethods2, 'ES');

            expect(returnedValue.sessionId).toEqual('IBERIAIDENT');
            expect(returnedValue.price).toEqual({ totalPrice: 118.79, formattedTotalPrice: '118.79€', formattedOldPriceInfo: '118.79€', textTotalPrice: 'SUMMARY_TOTAL', showTotalPrice: true });
            expect(returnedValue.currency).toEqual({ suffixSymbol: true, decimalSeparator: ',', numberDecimals: 2, groupingSeparator: '.', currencySymbol: 'EUR', description: 'Euro', code: 'EUR' });
            expect(returnedValue.availableDiscounts.AVIOS.available).toBe(true);
            expect(returnedValue.availableDiscounts.VOUCHER.available).toBe(true);

            done();
        });

        it('and have all the data and dont have avios discount selected', (done) => {
            localStorageService.remove('selectedPaymentData');
            localStorageService.remove('selectedAviosDisccount');

            returnedValue = PmtMethodsTransformer.generateModelPayMethods(fakePaymentMethods, 'ES');
            expect(returnedValue.sessionId).toEqual('IBERIAIDENT');
            expect(returnedValue.price).toEqual({ totalPrice: 128.79, formattedTotalPrice: '118.79€', formattedOldPriceInfo: null, textTotalPrice: 'SUMMARY_TOTAL', showTotalPrice: true });
            expect(returnedValue.currency).toEqual({ suffixSymbol: true, decimalSeparator: ',', numberDecimals: 2, groupingSeparator: '.', currencySymbol: 'EUR', description: 'Euro', code: 'EUR' });
            expect(returnedValue.availableDiscounts.AVIOS.available).toBe(true);
            expect(returnedValue.availableDiscounts.VOUCHER.available).toBe(true);
            done();
        });

        it('and have all the data and have avios discount selected and active is false', (done) => {
            localStorageService.remove('selectedPaymentData');
            fakeselectedAviosDisccount.active = false;
            localStorageService.set('selectedAviosDisccount', fakeselectedAviosDisccount);
            returnedValue = PmtMethodsTransformer.generateModelPayMethods(fakePaymentMethods, 'ES');

            expect(returnedValue.sessionId).toEqual('IBERIAIDENT');
            expect(returnedValue.price).toEqual({ totalPrice: 128.79, formattedTotalPrice: '118.79€', formattedOldPriceInfo: null, textTotalPrice: 'SUMMARY_TOTAL', showTotalPrice: true });
            expect(returnedValue.currency).toEqual({ suffixSymbol: true, decimalSeparator: ',', numberDecimals: 2, groupingSeparator: '.', currencySymbol: 'EUR', description: 'Euro', code: 'EUR' });
            expect(returnedValue.availableDiscounts.AVIOS.available).toBe(true);
            expect(returnedValue.availableDiscounts.VOUCHER.available).toBe(true);
            done();
        });
    });
});