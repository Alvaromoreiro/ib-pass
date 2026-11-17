export const fakeCachedData = {
    flowId: 'TWFuYWdlTXlCb29raW5nQElCZjIzN2ZlMGEwZjIzNDFlODk5NzhlMmQyZjhhYWYxZTI%3D',
    order: {
        orderId: 'Qm9va2luZ0BJQmFmMDcxYzk4OTkzNTRiMmY5OGRkYjJiZGZmOTEzOTk3T1A%3D',
        status: 'ISSUED',
        clientLocator: 'LWFJ9',
        bookingReferences: [
            {
                provider: 'IB',
                reference: 'LWFJ9',
            },
        ],
        orderItems: [
            {
                type: 'flight',
                orderItemId: 'IBaf071c9899354b2f98ddb2bdff913997OP_01',
                bookingReferences: [
                    {
                        provider: 'IB',
                        reference: 'LWFJ9',
                    },
                ],
                price: {
                    fare: 1017,
                    tax: 561.26,
                    total: 1578.26,
                    currency: 'EUR',
                    ticketingFee: 0,
                },
                sliceIds: ['MADEZE20221217122500', 'EZEMAD20221224135000'],
                passengerPrices: [
                    {
                        fareCalculation: 'MAD IB BUE586.16IB MAD424.58NUC1010.74END ROE1.005682',
                        passengerId: 'ADULT_01',
                        price: {
                            fare: 1017,
                            tax: 561.26,
                            total: 1578.26,
                            currency: 'EUR',
                            ticketingFee: 0,
                        },
                        segmentPrices: [
                            {
                                price: null,
                                fareCode: 'SVH0NQB6',
                                segmentsIds: ['IB684520221217'],
                                ticketDesignator: '',
                                penalties: [],
                                penaltyFlags: null,
                            },
                            {
                                price: null,
                                fareCode: 'VVL0NQB6',
                                segmentsIds: ['IB685620221224'],
                                ticketDesignator: '',
                                penalties: [],
                                penaltyFlags: null,
                            },
                        ],
                        taxes: [
                            {
                                code: 'QV',
                                amount: 3.27,
                                currency: 'EUR',
                                description: 'Security',
                                subcode: null,
                                country: null,
                                carrier: null,
                            },
                            {
                                code: 'OG',
                                amount: 0.63,
                                currency: 'EUR',
                                description: 'Security Tax',
                                subcode: null,
                                country: null,
                                carrier: null,
                            },
                            {
                                code: 'JD',
                                amount: 20.2,
                                currency: 'EUR',
                                description: 'Departure Charge',
                                subcode: null,
                                country: null,
                                carrier: null,
                            },
                            {
                                code: 'XR',
                                amount: 58.64,
                                currency: 'EUR',
                                description: 'Airport Tax',
                                subcode: null,
                                country: null,
                                carrier: null,
                            },
                            {
                                code: 'TQ',
                                amount: 8.23,
                                currency: 'EUR',
                                description: 'Security Tax',
                                subcode: null,
                                country: null,
                                carrier: null,
                            },
                            {
                                code: 'QO',
                                amount: 10.29,
                                currency: 'EUR',
                                description: 'Custom and Immigration Services Tax (International)',
                                subcode: null,
                                country: null,
                                carrier: null,
                            },
                            {
                                code: 'YQ',
                                amount: 460,
                                currency: 'EUR',
                                description: 'Cargos del operador',
                                subcode: null,
                                country: null,
                                carrier: null,
                            },
                        ],
                        orderItemPaymentInfos: [],
                    },
                ],
            },
        ],
        slices: [
            {
                sliceId: 'MADEZE20221217122500',
                type: 'REGULAR',
                departureDateTime: '2022-12-17 12:25',
                arrivalDateTime: '2022-12-17 21:00',
                duration: 755,
                stopsNumber: 0,
                detailedPrices: [
                    {
                        fare: 0,
                        currency: null,
                        passengerIds: ['ADULT_01'],
                        segmentPrices: [],
                    },
                ],
                segments: [
                    {
                        type: 'CONFIRMED',
                        mmbAllowed: true,
                        ckiStatus: {
                            code: 'CHECKABLE',
                            message: null,
                        },
                        noShow: false,
                        flyNow: false,
                        flown: false,
                        departure: {
                            code: 'MAD',
                            name: 'BARAJAS',
                            terminal: '4S',
                            city: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                country: {
                                    code: 'ES',
                                    description: 'Spain',
                                },
                            },
                        },
                        arrival: {
                            code: 'EZE',
                            name: 'MINISTRO PISTARINI',
                            terminal: 'A',
                            city: {
                                code: 'BUE',
                                description: 'Buenos Aires',
                                countryCode: 'AR',
                                country: {
                                    code: 'AR',
                                    description: 'Argentina',
                                },
                            },
                        },
                        departureCity: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            timeZone: 'Europe/Madrid',
                        },
                        arrivalCity: {
                            code: 'BUE',
                            description: 'Buenos Aires',
                            countryCode: 'AR',
                            timeZone: 'America/Buenos_Aires',
                        },
                        flight: {
                            marketingCarrier: {
                                code: 'IB',
                                name: 'Iberia',
                            },
                            operationalCarrier: {
                                code: 'IB',
                                name: 'Iberia',
                            },
                            marketingFlightNumber: '6845',
                            operationalFlightNumber: '6845',
                            operationalDisclosure: 'IB',
                            aircraft: {
                                code: '359',
                                description: 'Airbus A350-900',
                            },
                        },
                        cabin: {
                            rbd: 'S',
                            description: '',
                            remainingSeats: 0,
                            fareFamily: 'BASLH',
                            code: 'R',
                            type: 'ECONOMY',
                            bookingClass: 'ECONOMY',
                        },
                        overnight: false,
                        id: 'IB684520221217',
                        duration: 0,
                        waitingTime: 0,
                        operatorLocator: null,
                        stop: null,
                        departureDateTime: '2022-12-17 12:25',
                        departureUtcDateTime: '2022-12-17T11:25:00.000',
                        arrivalDateTime: '2022-12-17 21:00',
                        arrivalUtcDateTime: '2022-12-18T00:00:00.000',
                        status: {
                            code: 'HK',
                            description: 'Holding confirmed',
                        },
                    },
                ],
                overnight: false,
                passengerFlags: [
                    {
                        passengerId: 'ADULT_01',
                        flags: [
                            {
                                type: 'FLIGHT_REFUND',
                                enabled: true,
                            },
                            {
                                type: 'FREQUENT_FLYER_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'SPECIAL_NEEDS_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'CONTACT_DATA_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'EMERGENCY_CONTACT_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'PASSENGER_NAME_CORRECTION',
                                enabled: true,
                            },
                            {
                                type: 'ANCILLARIES',
                                enabled: true,
                            },
                            {
                                type: 'FLIGHT_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                enabled: false,
                            },
                            {
                                type: 'FLIGHT_MODIFICATION_FLEXIBLE',
                                enabled: false,
                            },
                            {
                                type: 'FLIGHT_DISRUPTION_SEARCH',
                                enabled: false,
                            },
                            {
                                type: 'FLIGHT_MODIFICATION_ON_DEMAND',
                                enabled: false,
                            },
                        ],
                    },
                ],
            },
            {
                sliceId: 'EZEMAD20221224135000',
                type: 'REGULAR',
                departureDateTime: '2022-12-24 13:50',
                arrivalDateTime: '2022-12-25 06:05',
                duration: 735,
                stopsNumber: 0,
                detailedPrices: [
                    {
                        fare: 0,
                        currency: null,
                        passengerIds: ['ADULT_01'],
                        segmentPrices: [],
                    },
                ],
                segments: [
                    {
                        type: 'CONFIRMED',
                        mmbAllowed: true,
                        ckiStatus: {
                            code: 'CHECKABLE',
                            message: null,
                        },
                        noShow: false,
                        flyNow: false,
                        flown: false,
                        departure: {
                            code: 'EZE',
                            name: 'MINISTRO PISTARINI',
                            terminal: 'A',
                            city: {
                                code: 'BUE',
                                description: 'Buenos Aires',
                                countryCode: 'AR',
                                country: {
                                    code: 'AR',
                                    description: 'Argentina',
                                },
                            },
                        },
                        arrival: {
                            code: 'MAD',
                            name: 'BARAJAS',
                            terminal: '4S',
                            city: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                country: {
                                    code: 'ES',
                                    description: 'Spain',
                                },
                            },
                        },
                        departureCity: {
                            code: 'BUE',
                            description: 'Buenos Aires',
                            countryCode: 'AR',
                            timeZone: 'America/Buenos_Aires',
                        },
                        arrivalCity: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            timeZone: 'Europe/Madrid',
                        },
                        flight: {
                            marketingCarrier: {
                                code: 'IB',
                                name: 'Iberia',
                            },
                            operationalCarrier: {
                                code: 'IB',
                                name: 'Iberia',
                            },
                            marketingFlightNumber: '6856',
                            operationalFlightNumber: '6856',
                            operationalDisclosure: 'IB',
                            aircraft: {
                                code: '332',
                                description: 'Airbus A330-200',
                            },
                        },
                        cabin: {
                            rbd: 'V',
                            description: '',
                            remainingSeats: 0,
                            fareFamily: 'BASLH',
                            code: 'R',
                            type: 'ECONOMY',
                            bookingClass: 'ECONOMY',
                        },
                        overnight: true,
                        id: 'IB685620221224',
                        duration: 0,
                        waitingTime: 0,
                        warnings: [
                            {
                                code: 'SSE_ORM_20003',
                                description: 'Night flight',
                            },
                        ],
                        operatorLocator: null,
                        stop: null,
                        departureDateTime: '2022-12-24 13:50',
                        departureUtcDateTime: '2022-12-24T16:50:00.000',
                        arrivalDateTime: '2022-12-25 06:05',
                        arrivalUtcDateTime: '2022-12-25T05:05:00.000',
                        status: {
                            code: 'HK',
                            description: 'Holding confirmed',
                        },
                    },
                ],
                overnight: true,
                passengerFlags: [
                    {
                        passengerId: 'ADULT_01',
                        flags: [
                            {
                                type: 'FLIGHT_REFUND',
                                enabled: true,
                            },
                            {
                                type: 'FREQUENT_FLYER_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'SPECIAL_NEEDS_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'CONTACT_DATA_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'EMERGENCY_CONTACT_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'PASSENGER_NAME_CORRECTION',
                                enabled: true,
                            },
                            {
                                type: 'ANCILLARIES',
                                enabled: true,
                            },
                            {
                                type: 'FLIGHT_MODIFICATION',
                                enabled: true,
                            },
                            {
                                type: 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                enabled: false,
                            },
                            {
                                type: 'FLIGHT_MODIFICATION_FLEXIBLE',
                                enabled: false,
                            },
                            {
                                type: 'FLIGHT_DISRUPTION_SEARCH',
                                enabled: false,
                            },
                            {
                                type: 'FLIGHT_MODIFICATION_ON_DEMAND',
                                enabled: false,
                            },
                        ],
                    },
                ],
            },
        ],
        price: {
            fare: 1017,
            tax: 561.26,
            total: 1578.26,
            currency: 'EUR',
            ticketingFee: 0,
        },
        primaryContactInfo: {
            phone: '34664366060',
            email: 'PANEL.FMORALES@PANEL.ES',
            phoneType: 'MOBILE',
            confirmationMailOption: null,
            refundEmail: 'PANEL.FMORALES@PANEL.ES',
        },
        optionalInformation: [],
        cashAviosPossibilities: [],
        specialDiscounts: [],
        checkedBagAllowances: [
            {
                type: 'PIECE',
                segmentIds: ['IB684520221217', 'IB685620221224'],
                totalQuantity: 0,
            },
        ],
        accrualQuote: null,
        bookingCreationDates: [
            {
                creationDate: '2022-10-18',
                provider: 'IB',
            },
        ],
        sender: null,
        officeIata: '7849644',
        availableForCheckin: false,
        earlyCheckinDone: false,
        aviosRedeemed: null,
        pointsRedeemed: null,
    },
    passengers: [
        {
            passengerType: 'ADULT',
            personalInfo: {
                name: 'ATUL',
                surname: 'SINGHP',
                birthDate: null,
            },
            passengerId: 'ADULT_01',
            contactInfo: {
                phone: '34664366060',
                email: 'panel.fmorales@panel.es',
                phoneType: 'MOBILE',
                confirmationMailOption: null,
                refundEmail: null,
            },
            relatedPassengerId: '',
            ckiStatus: null,
            optionalInformation: [],
            residenceAccreditationStatus: null,
            resiberPassengerId: '1',
            securityInformation: {
                relatedContent: [
                    {
                        key: 'APIS_DOCUMENT_INFO',
                        value: 'You have already provided the passenger information required. You can now modify it online if you wish.',
                    },
                    {
                        key: 'APIS_STATUS_INFO',
                        value: 'Complete',
                    },
                ],
            },
            externalPersonalInfo: {
                name: 'Atul',
                firstSurname: 'Singh P',
                lastSurname: '',
            },
            frequentFlyerInfo: {
                company: 'IB',
                number: '00000008438798',
            },
        },
    ],
    tickets: [
        {
            ticketNumbers: ['0751404039325'],
            type: 'ET',
            orderItemId: 'IBaf071c9899354b2f98ddb2bdff913997OP_01',
            passengerId: 'ADULT_01',
            issueDateTime: '2022-10-18 16:18',
            fareCalculation: 'MAD IB BUE586.16IB MAD424.58NUC1010.74END ROE1.005682',
            taxes: [
                {
                    code: 'QV',
                    amount: 3.27,
                    currency: 'EUR',
                    description: '',
                    subcode: null,
                    country: null,
                    carrier: null,
                },
                {
                    code: 'OG',
                    amount: 0.63,
                    currency: 'EUR',
                    description: '',
                    subcode: null,
                    country: null,
                    carrier: null,
                },
                {
                    code: 'JD',
                    amount: 20.2,
                    currency: 'EUR',
                    description: '',
                    subcode: null,
                    country: null,
                    carrier: null,
                },
                {
                    code: 'XR',
                    amount: 58.64,
                    currency: 'EUR',
                    description: '',
                    subcode: null,
                    country: null,
                    carrier: null,
                },
                {
                    code: 'TQ',
                    amount: 8.23,
                    currency: 'EUR',
                    description: '',
                    subcode: null,
                    country: null,
                    carrier: null,
                },
                {
                    code: 'QO',
                    amount: 10.29,
                    currency: 'EUR',
                    description: '',
                    subcode: null,
                    country: null,
                    carrier: null,
                },
                {
                    code: 'YQ',
                    amount: 460,
                    currency: 'EUR',
                    description: '',
                    subcode: null,
                    country: null,
                    carrier: null,
                },
            ],
            coupons: [
                {
                    arrival: 'EZE',
                    departure: 'MAD',
                    departureDate: '2022-12-17T12:25:00.000',
                    status: 'OPEN FOR USE',
                    fareBasis: 'SVH0NQB6',
                    carrier: 'IB',
                    flightNumber: '6845',
                    flightStatus: 'OK',
                    operatingCarrier: null,
                    bookingCode: 'S',
                    designator: '',
                    couponNumber: '1',
                    remark: null,
                    baggageDetail: {
                        freeAllowance: 0,
                        quantityCode: 'PC',
                        unitQualifier: 'PC',
                    },
                    disruptedRefundable: false,
                },
                {
                    arrival: 'MAD',
                    departure: 'EZE',
                    departureDate: '2022-12-24T13:50:00.000',
                    status: 'OPEN FOR USE',
                    fareBasis: 'VVL0NQB6',
                    carrier: 'IB',
                    flightNumber: '6856',
                    flightStatus: 'OK',
                    operatingCarrier: null,
                    bookingCode: 'V',
                    designator: '',
                    couponNumber: '2',
                    remark: null,
                    baggageDetail: {
                        freeAllowance: 0,
                        quantityCode: 'PC',
                        unitQualifier: 'PC',
                    },
                    disruptedRefundable: false,
                },
            ],
            iataCode: '78496445',
            issueCity: 'MAD',
            passengerType: 'ADULT',
            paymentInfo: {
                type: 'CREDIT_CARD',
                amount: 1578.26,
            },
            emdsList: [],
            creditCardFeePrice: null,
            conjunctionTickets: null,
            reissueHistory: [],
            taxedPrice: {
                fare: 1017,
                tax: 561.26,
                total: 1578.26,
                currency: 'EUR',
                ticketingFee: 0,
            },
        },
    ],
    paymentItems: [
        {
            type: 'IBERIA_PAY',
            tokenizedCardNumber: null,
            maskedCardNumber: null,
            authorization: 'J291A5',
            subtotal: 1578.26,
            totalFee: 0,
            total: 1578.26,
            unityFee: 0,
            currency: 'EUR',
            cofInclusion: false,
        },
    ],
    contextMetadata: {
        language: 'en',
        country: 'ES',
        currencies: [
            {
                code: 'EUR',
                description: 'Euro',
                symbol: '€',
                alignment: 'R',
                groupingSeparator: ',',
                decimalSeparator: '.',
                decimals: 2,
                recommendedDisplay: 'symbol',
            },
        ],
    },
    fareFamilyConditions: [
        {
            cabinType: 'E',
            cabinDescription: 'Economy',
            commercialCode: 'BASLH',
            commercialName: 'Basic',
            commercialNameES: 'Básica',
            priority: 0,
            conditions: [
                {
                    code: 'EQMANO',
                    name: 'Hand baggage',
                    text: '1 piece (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 piece in the cabin  (56x40x25cm)',
                        message: ' 1 piece (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                    },
                },
                {
                    code: 'EQBODEGA',
                    name: 'Baggage in hold',
                    text: '0 Pieces',
                    units: 0,
                    extendedInfo: {
                        title: 'No baggage in the hold',
                        message: '0 Pieces',
                        code: 'CA_0_PIEZAS',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'COMIDA',
                    name: 'Meal',
                    text: 'Included',
                    units: null,
                    extendedInfo: {
                        title: 'Meal included',
                        message: 'Included',
                        code: 'Comida_incluida',
                        conditionStatus: true,
                    },
                },
                {
                    code: 'ASIENTO',
                    name: 'Seat  selection',
                    text: 'For a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Can be selected for a fee       ',
                        message: 'For a fee',
                        code: 'CA_Asiento_Pago',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'CAMBIO',
                    name: 'Change',
                    text: 'Allowed with a fee; not allowed for no-shows.',
                    units: null,
                    extendedInfo: {
                        title: 'Flight change with a fee, with some exceptions',
                        message: 'Allowed at any time with a fee of EUR 150/USD 190. Not allowed for no-shows.',
                        code: 'CA_CAMBIO CON PENALTY_150€/190USD_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'REEMBOLSO',
                    name: 'refund (in each direction)',
                    text: 'Not allowed.',
                    units: null,
                    extendedInfo: {
                        title: 'Not allowed',
                        message: 'Not allowed.',
                        code: 'CA_REEMBOLSO NO PERMITIDO',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Early check-in',
                    text: 'Not included',
                    units: null,
                    extendedInfo: {
                        title: 'Not included',
                        message: 'Not included',
                        code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'EMBARQUE',
                    name: 'Priority Boarding ',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'CA_Embarque_NO_Prioritario',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'AVIO',
                    name: 'STANDARD',
                    text: 'Yes',
                    units: null,
                    extendedInfo: {
                        title: 'AVIOS included',
                        message: 'Yes',
                        code: 'AVIOS incluido',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'SALAVIP',
                    name: 'Access to VIP lounges',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Acceso a salas VIP No permitido',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'CABINA',
                    name: ' Cabin',
                    text: 'Economy',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Economy',
                        code: 'CA_Cabina_Turista',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'ASIENTODELANTERO',
                    name: 'Front seat',
                    text: 'Payable',
                    units: null,
                    extendedInfo: {
                        title: 'Can be selected at a cost         ',
                        message: 'Payable',
                        code: 'CA_Asiento_Delantero_pago',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Exclusive check-in counter',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Chek-in_desk_ NO',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selection of an XL seat',
                    text: 'Payable',
                    units: null,
                    extendedInfo: {
                        title: 'Can be selected at a cost         ',
                        message: 'Payable',
                        code: 'CA_Asiento_XL_Pago',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'WIFI',
                    name: 'WiFi',
                    text: '',
                    units: null,
                    extendedInfo: {
                        title: null,
                        message: null,
                        code: null,
                        conditionStatus: true,
                    },
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Fast Track NO',
                        conditionStatus: false,
                    },
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Priority baggage delivery',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false,
                    },
                },
            ],
            conditionsPriority: ['EQMANO', 'EQBODEGA', 'COMIDA', 'ASIENTO', 'CAMBIO', 'REEMBOLSO'],
        },
    ],
    channel: 'IBCOM',
    onHoldInformation: null,
    relatedContent: [
        {
            key: 'APIS_DOCUMENT_INFO',
            value: 'You have already provided the passenger information required. You can now modify it online if you wish.',
        },
    ],
    qualifiers: [],
    reportingWeb: {
        device: 'DMRC',
        idColective: '',
        officeIata: 'MADIB08AB',
        iata: 'I',
        product: '1',
    },
    flexibilizationCapabilitiesInformation: null,
    genericDisruptionCapabilitiesInformation: null,
    upgInformation: {
        url: null,
        flightsInformation: null,
        bidable: false,
    },
    orderFlags: [
        {
            type: 'PRINT_ITINERARY',
            enabled: true,
        },
        {
            type: 'ON_BUSINESS_MODIFICATION',
            enabled: true,
        },
        {
            type: 'VOUCHER_REFUND',
            enabled: false,
        },
        {
            type: 'CASH_REFUND',
            enabled: false,
        },
        {
            type: 'ALLOWED_REFUND_CASH',
            enabled: false,
        },
        {
            type: 'ALLOWED_REFUND_VOUCHER',
            enabled: false,
        },
        {
            type: 'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE',
            enabled: false,
        },
        {
            type: 'ALLOWED_ACCEPT_CHANGES',
            enabled: false,
        },
        {
            type: 'VOUCHER_REFUND_ON_DEMAND',
            enabled: false,
        },
        {
            type: 'VOUCHER_REFUND_RESTRICTION',
            enabled: false,
        },
        {
            type: 'ALLOWED_VOUCHER_COMPENSATION',
            enabled: true,
        },
    ],
    isAirShuttle: false,
    isOnHold: false,
};

export const fakeAncillariesInfo = {
    currencies: [
        {
            code: 'EUR',
            description: 'Euro',
            symbol: '€',
            alignment: 'R',
            groupingSeparator: ',',
            decimalSeparator: '.',
            decimals: 2,
            recommendedDisplay: 'symbol',
        },
    ],
    slices: [
        {
            id: 'MADEZE20221217122500',
            segmentIds: ['IB684520221217'],
        },
        {
            id: 'EZEMAD20221224135000',
            segmentIds: ['IB685620221224'],
        },
    ],
    ancillaries: [
        {
            status: {
                code: 'AVAILABLE',
                reason: null,
            },
            slices: [
                {
                    sliceId: 'MADEZE20221217122500',
                    products: [
                        {
                            price: 20,
                            freeBagsIncluded: 1,
                            additionalBagsPrice: 10,
                            tax: 21,
                            currency: {
                                code: 'EUR',
                                description: 'Euro',
                                symbol: '€',
                                alignment: 'L',
                                groupingSeparator: ',',
                                decimalSeparator: '.',
                                decimals: 2,
                                recommendedDisplay: 'symbol',
                            },
                        },
                    ],
                },
            ],
            type: 'INTEGRATED_BOB',
        },
        {
            status: {
                code: 'AVAILABLE',
                reason: null,
            },
            currency: 'EUR',
            provider: 'ALLIANZ',
            issueCountry: 'ES',
            offers: [
                {
                    code: 'IBAESONA05MMBWWT',
                    name: 'Travel Assistance and Medical Teleconsultation',
                    premium: 30.04,
                    termsAndConditionsDocumentURI: 'http://partner.magroup-webservice.com/IBA/ES/EN/IBA_ES_en_ONA05CT.pdf',
                    coverages: [
                        {
                            title: '¡New!',
                            description: 'Up to 60.000 € (Excess: 50 €)',
                        },
                        {
                            title: 'Medical expenses',
                            description: '300 €',
                        },
                        {
                            title: 'Missed connections',
                            description: 'At cost',
                        },
                        {
                            title: 'Medical repatriation',
                            description: 'At cost',
                        },
                        {
                            title: 'Early return for covered reasons.',
                            description: '200 €',
                        },
                        {
                            title: 'Delayed personnal possessions',
                            description: '1.200€ (max 100€xitem)',
                        },
                        {
                            title: 'Theft, loss or destruction of luggage',
                            description: '100€ x max 10 days',
                        },
                        {
                            title: 'Supplementary hotel expenses',
                            description:
                                'By selecting this insurance product:\n- I confirm that I have read and I accept the Insurance Product Information Document, the Terms & Conditions and the Privacy Statement, provided in a digital format\n- I confirm I have verified that product chosen corresponds to my needs\n- I confirm having my residence in Spain',
                        },
                    ],
                    addOns: [],
                    consent: 'Medical teleconsultation services included during your trip.',
                    compliance: null,
                },
            ],
            countriesAllowed: [
                {
                    country: {
                        code: 'CZ',
                        description: 'Czech Republic',
                    },
                    passengerRequiredFields: [],
                },
                {
                    country: {
                        code: 'MX',
                        description: 'Mexico',
                    },
                    passengerRequiredFields: [],
                },
                {
                    country: {
                        code: 'IT',
                        description: 'Italy',
                    },
                    passengerRequiredFields: [
                        {
                            passengerType: 'ADULT',
                            requiredFieldsGroups: [
                                {
                                    requiredFields: [
                                        {
                                            requiredField: 'DOCUMENT_ID',
                                            pattern: '[a-zA-Z]{6}\\d{2}[a-zA-Z]\\d{2}[a-zA-Z]\\d{3}[a-zA-Z]',
                                        },
                                        {
                                            requiredField: 'BIRTH_DATE',
                                            pattern: null,
                                        },
                                        {
                                            requiredField: 'POLICY_HOLDER',
                                            pattern: null,
                                        },
                                    ],
                                },
                            ],
                            requiredForAll: false,
                        },
                    ],
                },
                {
                    country: {
                        code: 'ES',
                        description: 'Spain',
                    },
                    passengerRequiredFields: [],
                },
            ],
            type: 'INSURANCE',
        },
        {
            status: {
                code: 'NOT_AVAILABLE',
                reason: 'TPC_AVAIL_ERR_0001',
            },
            thirdPartyCompanies: [],
            type: 'THIRD_PARTY_COMPANIES',
        },
        {
            status: {
                code: 'NOT_AVAILABLE',
                reason: 'NOT_AVAILABLE_BY_FF',
            },
            currency: null,
            segments: [
                {
                    id: 'IB684520221217',
                    passengers: [
                        {
                            id: 'ADULT_01',
                            amount: null,
                            status: {
                                code: 'NOT_AVAILABLE',
                                reason: null,
                            },
                        },
                    ],
                    status: {
                        code: 'NOT_AVAILABLE',
                        reason: 'NOT_AVAILABLE_BY_FF',
                    },
                },
                {
                    id: 'IB685620221224',
                    passengers: [
                        {
                            id: 'ADULT_01',
                            amount: null,
                            status: {
                                code: 'NOT_AVAILABLE',
                                reason: null,
                            },
                        },
                    ],
                    status: {
                        code: 'NOT_AVAILABLE',
                        reason: 'NOT_AVAILABLE_BY_FF',
                    },
                },
            ],
            priceFrom: null,
            type: 'PRIORITY_BOARDING',
        },
        {
            status: {
                code: 'AVAILABLE',
                reason: null,
            },
            currency: 'EUR',
            segments: [
                {
                    status: {
                        code: 'AVAILABLE',
                        reason: null,
                    },
                    id: 'IB684520221217',
                    passengers: ['ADULT_01'],
                    segmentPassengers: [
                        {
                            passengerId: 'ADULT_01',
                            priceFrom: 0,
                        },
                    ],
                },
                {
                    status: {
                        code: 'AVAILABLE',
                        reason: null,
                    },
                    id: 'IB685620221224',
                    passengers: ['ADULT_01'],
                    segmentPassengers: [
                        {
                            passengerId: 'ADULT_01',
                            priceFrom: 0,
                        },
                    ],
                },
            ],
            specialMeals: [
                {
                    code: 'BBML',
                    name: 'Baby Meal',
                    description: 'Baby Meal',
                },
                {
                    code: 'CHML',
                    name: 'Child Meal',
                    description: 'Child Meal',
                },
                {
                    code: 'HNML',
                    name: 'Hindu (non vegetarian) Meal specific',
                    description: 'Hindu (non vegetarian) Meal specific',
                },
                {
                    code: 'KSML',
                    name: 'Kosher Meal',
                    description: 'Kosher Meal',
                },
                {
                    code: 'MOML',
                    name: 'Moslem Meal',
                    description: 'Moslem Meal',
                },
                {
                    code: 'AVML',
                    name: 'Asiatic Vegetarian Meal',
                    description: 'Asiatic Vegetarian Meal',
                },
                {
                    code: 'VGML',
                    name: 'Vegetarian vegan Meal',
                    description: 'Vegetarian vegan Meal',
                },
                {
                    code: 'DBML',
                    name: 'Diabetic Meal',
                    description: 'Diabetic Meal',
                },
                {
                    code: 'GFML',
                    name: 'Gluten intolerant Meal',
                    description: 'Gluten intolerant Meal',
                },
                {
                    code: 'LFML',
                    name: 'Low fat Meal',
                    description: 'Low fat Meal',
                },
                {
                    code: 'LCML',
                    name: 'Low calorie Meal',
                    description: 'Low calorie Meal',
                },
                {
                    code: 'NLML',
                    name: 'Low lactose Meal',
                    description: 'Low lactose Meal',
                },
                {
                    code: 'LSML',
                    name: 'Low salt Meal',
                    description: 'Low salt Meal',
                },
                {
                    code: 'VLML',
                    name: 'Vegetarian lacto-ovo Meal',
                    description: 'Vegetarian lacto-ovo Meal',
                },
            ],
            type: 'SPECIAL_MEALS',
        },
        {
            status: {
                code: 'NOT_AVAILABLE',
                reason: null,
            },
            externalUrl: null,
            segments: [],
            type: 'PREORDER',
        },
        {
            status: {
                code: 'AVAILABLE',
                reason: null,
            },
            currency: 'EUR',
            priceFrom: 136,
            segments: [
                {
                    id: 'IB684520221217',
                    availableCabins: [
                        {
                            cabinType: 'BUSINESS',
                            minimumAllowedBid: 332,
                            maximumExpectedBid: 765,
                        },
                        {
                            cabinType: 'PREMIUMTOURIST',
                            minimumAllowedBid: 136,
                            maximumExpectedBid: 340,
                        },
                    ],
                },
                {
                    id: 'IB685620221224',
                    availableCabins: [
                        {
                            cabinType: 'BUSINESS',
                            minimumAllowedBid: 340,
                            maximumExpectedBid: 765,
                        },
                        {
                            cabinType: 'PREMIUMTOURIST',
                            minimumAllowedBid: 162,
                            maximumExpectedBid: 340,
                        },
                    ],
                },
            ],
            type: 'UPGRADING_BID',
        },
        {
            status: {
                code: 'NOT_AVAILABLE',
                reason: 'UPA_20001',
            },
            currency: 'STANDARD',
            aviosOffers: [],
            type: 'UPGRADING_AVIOS',
        },
        {
            status: {
                code: 'AVAILABLE',
                reason: null,
            },
            externalUrl:
                'https://www.iberia.com/es/en/bagonboard/?field1=LWFJ9&field2=SINGHP&utm_source=iberia&utm_medium=referral&utm_content=standard_all-languages_all-routes_semistatic-landing_ad1&utm_campaign=airline_homebagdrop_na_iberia-pilot-3_mar19',
            type: 'BOB',
        },
        {
            status: {
                code: 'AVAILABLE',
                reason: null,
            },
            currency: 'EUR',
            segments: [
                {
                    id: 'IB684520221217',
                    passengers: [
                        {
                            id: 'ADULT_01',
                            priceFrom: 0,
                        },
                    ],
                    pricesProvider: 'IBDP',
                    status: {
                        code: 'AVAILABLE',
                        reason: null,
                    },
                },
                {
                    id: 'IB685620221224',
                    passengers: [
                        {
                            id: 'ADULT_01',
                            priceFrom: 0,
                        },
                    ],
                    pricesProvider: 'IBDP',
                    status: {
                        code: 'AVAILABLE',
                        reason: null,
                    },
                },
            ],
            reasonForIssuance: {
                code: 'A',
                subcode: '0B5',
            },
            type: 'SEAT',
        },
        {
            status: {
                code: 'AVAILABLE',
                reason: null,
            },
            currency: 'EUR',
            slices: [
                {
                    id: 'MADEZE20221217122500',
                    passengers: [
                        {
                            id: 'ADULT_01',
                            maxAdditionalPieces: 8,
                            pieces: [
                                {
                                    subtype: 'BAGGAGE_23',
                                    description: '23kg',
                                    extraPieces: {
                                        units: 1,
                                        reason: ['Other'],
                                    },
                                    reasonForIssuance: {
                                        code: 'C',
                                        subcode: '0GO',
                                    },
                                    franchisePieces: 0,
                                    purchasedPieces: 0,
                                    maxAdditionalSubtypePieces: 8,
                                    availablePriceRanges: [
                                        {
                                            amount: 115,
                                            airportAmount: 115,
                                            from: 1,
                                            to: 1,
                                        },
                                        {
                                            amount: 120,
                                            airportAmount: 120,
                                            from: 2,
                                            to: 8,
                                        },
                                    ],
                                    status: {
                                        code: 'AVAILABLE',
                                        reason: null,
                                    },
                                },
                            ],
                        },
                    ],
                    pricesProvider: 'IBDP',
                    status: {
                        code: 'AVAILABLE',
                        reason: null,
                    },
                },
                {
                    id: 'EZEMAD20221224135000',
                    passengers: [
                        {
                            id: 'ADULT_01',
                            maxAdditionalPieces: 8,
                            pieces: [
                                {
                                    subtype: 'BAGGAGE_23',
                                    description: '23kg',
                                    extraPieces: {
                                        units: 1,
                                        reason: ['Other'],
                                    },
                                    reasonForIssuance: {
                                        code: 'C',
                                        subcode: '0GO',
                                    },
                                    franchisePieces: 0,
                                    purchasedPieces: 0,
                                    maxAdditionalSubtypePieces: 8,
                                    availablePriceRanges: [
                                        {
                                            amount: 115,
                                            airportAmount: 115,
                                            from: 1,
                                            to: 1,
                                        },
                                        {
                                            amount: 120,
                                            airportAmount: 120,
                                            from: 2,
                                            to: 8,
                                        },
                                    ],
                                    status: {
                                        code: 'AVAILABLE',
                                        reason: null,
                                    },
                                },
                            ],
                        },
                    ],
                    pricesProvider: 'IBDP',
                    status: {
                        code: 'AVAILABLE',
                        reason: null,
                    },
                },
            ],
            priceFrom: 115,
            type: 'BAGGAGE',
        },
        {
            status: {
                code: 'NOT_AVAILABLE',
                reason: 'ASS_FASS_9016.2',
            },
            currency: 'EUR',
            slices: [],
            priceFrom: 0,
            type: 'SPECIAL_EQUIPMENT',
        },
    ],
};

export const mockDataAviosAvailable = {
    bidsOpen: false,
    bidsClosed: false,
    totalAmountBidsFormated: '0€',
    bidsAvailable: true,
    freePosibility: false,
    aviosBidAvailable: true,
    freeUpgradesAvailable: 0,
    priceFrom: 18750,
    bidsSegments: [
        {
            id: 'IB640320221219',
            availableCabins: [
                {
                    cabinType: 'BUSINESS',
                    minimumAllowedBid: 340,
                    maximumExpectedBid: 765,
                    avios: 37500,
                },
                {
                    cabinType: 'PREMIUMTOURIST',
                    minimumAllowedBid: 145,
                    maximumExpectedBid: 255,
                    avios: 18750,
                },
            ],
        },
    ],
    currency: '',
    ancillariesTrips: [
        {
            id: 'IB640320221219',
            departure: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'Spain',
                },
            },
            arrival: {
                code: 'MEX',
                description: 'Mexico City',
                countryCode: 'MX',
                country: {
                    code: 'MX',
                    description: 'Mexico',
                },
            },
            dateToOrder: '2022-12-19T12:05:00.000',
            departureDateParsed: '19 Dec 2022',
            arrivalDateParsed: '20 Dec 2022',
            cabinType: '',
            currentCabin: 'Economy',
            passengers: 1,
            cabins: [
                {
                    cabinType: 'BUSINESS',
                    cabinTypeDescription: 'Business',
                    maximumExpectedBid: 765,
                    minimumAllowedBid: 340,
                    avios: 37500,
                    formatAvios: '37.500',
                    images: [
                        '/iberia-web-content/imagenes/upgrade/info_business-class/Carrusel_01.png',
                        '/iberia-web-content/imagenes/upgrade/info_business-class/Carrusel_02.png',
                    ],
                    conditions: {
                        onLand: ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_3'],
                        onBoard: ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2'],
                    },
                    currencySimbol: '€',
                    currentCabin: 'Economy',
                    id: 'IB640320221219',
                },
                {
                    cabinType: 'PREMIUMTOURIST',
                    cabinTypeDescription: 'Premium Economy',
                    maximumExpectedBid: 255,
                    minimumAllowedBid: 145,
                    avios: 18750,
                    formatAvios: '18.750',
                    images: [
                        '/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_01.png',
                        '/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_02.png',
                        '/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_03.png',
                    ],
                    conditions: {
                        onLand: ['UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_1', 'UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_2'],
                        onBoard: ['UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_1', 'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_2', 'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_3'],
                    },
                    currencySimbol: '€',
                    currentCabin: 'Economy',
                    id: 'IB640320221219',
                    selectedOffers: 'STANDARD',
                },
            ],
            $$hashKey: 'object:433',
        },
    ],
    subtype: 'STANDARD',
};

export const mockDeleteCabinAvios = [
    {
        type: 'UPGRADING_AVIOS',
        aviosOffers: [
            {
                subType: 'STANDARD',
                slices: [
                    {
                        id: 'MADMEX20221219130500',
                        segments: [
                            {
                                id: 'IB640320221219',
                                cabinType: 'PREMIUMTOURIST',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export const mockDeleteCabinBids = [
    {
        type: 'UPGRADING_BID',
        segments: [
            {
                id: 'IB625120221201',
                cabins: [
                    {
                        type: 'BUSINESS',
                        bid: 661,
                    },
                ],
            },
        ],
    },
];
export const ancillariesTrips = [
    {
        id: 'IB391820221201',
        departure: {
            code: 'MAD',
            description: 'Madrid',
            countryCode: 'ES',
            country: {
                code: 'ES',
                description: 'Spain',
            },
        },
        arrival: {
            code: 'PMI',
            description: 'Palma de Mallorca',
            countryCode: 'ES',
            country: {
                code: 'ES',
                description: 'Spain',
            },
        },
        dateToOrder: '2022-12-01T06:10:00.000',
        departureDateParsed: '01 Dec 2022',
        arrivalDateParsed: '01 Dec 2022',
        cabinType: '',
        currentCabin: 'Economy',
        passengers: 1,
        cabins: [
            {
                cabinType: 'BUSINESS',
                cabinTypeDescription: 'Business',
                maximumExpectedBid: 94,
                minimumAllowedBid: 43,
                avios: 0,
                formatAvios: '0',
                images: ['/iberia-web-content/imagenes/upgrade/info_business-class/Carrusel_01.png', '/iberia-web-content/imagenes/upgrade/info_business-class/Carrusel_02.png'],
                conditions: {
                    onLand: ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_3'],
                    onBoard: ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2'],
                },
                currencySimbol: '€',
                currentCabin: 'Economy',
                id: 'IB391820221201',
            },
        ],
    },
];

export const mockDataBidAvailable = {
    bidsOpen: false,
    bidsClosed: false,
    totalAmountBidsFormated: '0€',
    bidsAvailable: true,
    freePosibility: 0,
    aviosBidAvailable: false,
    freeUpgradesAvailable: false,
    priceFrom: 145,
    bidsSegments: [
        {
            id: 'IB625120221201',
            availableCabins: [
                {
                    cabinType: 'BUSINESS',
                    minimumAllowedBid: 340,
                    maximumExpectedBid: 765,
                    avios: 0,
                },
                {
                    cabinType: 'PREMIUMTOURIST',
                    minimumAllowedBid: 145,
                    maximumExpectedBid: 255,
                    avios: 0,
                },
            ],
        },
    ],
    currency: '',
    ancillariesTrips: [
        {
            id: 'IB625120221201',
            departure: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'Spain',
                },
            },
            arrival: {
                code: 'NYC',
                description: 'New York',
                countryCode: 'US',
                country: {
                    code: 'US',
                    description: 'USA',
                },
            },
            dateToOrder: '2022-12-01T11:40:00.000',
            departureDateParsed: '01 Dec 2022',
            arrivalDateParsed: '01 Dec 2022',
            cabinType: 'Economy',
            currentCabin: 'Economy',
            passengers: 1,
            cabins: [
                {
                    cabinType: 'BUSINESS',
                    cabinTypeDescription: 'Business',
                    maximumExpectedBid: 765,
                    minimumAllowedBid: 340,
                    avios: 0,
                    formatAvios: '0',
                    images: [
                        '/iberia-web-content/imagenes/upgrade/info_business-class/Carrusel_01.png',
                        '/iberia-web-content/imagenes/upgrade/info_business-class/Carrusel_02.png',
                    ],
                    conditions: {
                        onLand: ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_3'],
                        onBoard: ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2'],
                    },
                    currencySimbol: '€',
                    currentCabin: 'Economy',
                    id: 'IB625120221201',
                    AmountBid: 661,
                    bidOffer: '661.00€',
                    AmountPassengersBid: '661.00€',
                },
                {
                    cabinType: 'PREMIUMTOURIST',
                    cabinTypeDescription: 'Premium Economy',
                    maximumExpectedBid: 255,
                    minimumAllowedBid: 145,
                    avios: 0,
                    formatAvios: '0',
                    images: [
                        '/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_01.png',
                        '/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_02.png',
                        '/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_03.png',
                    ],
                    conditions: {
                        onLand: ['UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_1', 'UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_2'],
                        onBoard: ['UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_1', 'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_2', 'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_3'],
                    },
                    currencySimbol: '€',
                    currentCabin: 'Economy',
                    id: 'IB625120221201',
                    AmountBid: 0,
                },
            ],
            hasBid: true,
        },
    ],
};
