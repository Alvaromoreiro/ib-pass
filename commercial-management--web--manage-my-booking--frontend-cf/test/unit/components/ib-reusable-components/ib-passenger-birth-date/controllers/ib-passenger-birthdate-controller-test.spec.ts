describe('PassengerBirthDateController test', function () {
    var $controller, $rootScope,$scope,controller,date;

    var fakeMmBAppConstants = {
        COOKIES: {
            'PERSONALIZATION': 'IBERIACOM_PERSONALIZATION',
            'LOGGED_TOKEN': 'IBERIACOM_SSO_ACCESS',
            'LOGGED_TOKEN_EXPIRATION': 'IBERIACOM_SSO_ACCESS_TO',
            'LOGGED_REFRESH_TOKEN': 'IBERIACOM_SSO_REFRESH',
            'LOGGED_REFRESH_TOKEN_EXPIRATION': 'IBERIACOM_SSO_REFRESH_TO',
            'CHECKIN_ID': 'IBERIACOM_GDR_PA_INFO',
            'BOOKING_INFO': 'IBERIACOM_GDR_PA_ACCESS',
            'AIR_SHUTTLE_ERROR': 'IBERIACOM_GDR_PA_ERROR',
            'DEFAULT_EXPIRY_TIME': 1000 * 60 * 60 * 24 * 365 * 10, //ten years
            'DEFAULT_PATH': '/'
        },
        nameParameters: {
            lang: 'language',
            market: 'market',
            'CODE_ERROR': 'codeError'
        },
        PHONE_TYPE: 'MOBILE',
        PASSENGER_TYPES: {
            'adult': 'ADULT',
            'child': 'CHILD',
            'infant': 'INFANT'
        },
        SLICE_TYPES: {
            'REGULAR': 'REGULAR',
            'SHUTTLE': 'SHUTTLE'
        },
        SLICE_STATUS: {
            'HOLD': 'ON_HOLD',
            'ON_HOLD_CONFIRMABLE': 'ON_HOLD_CONFIRMABLE',
            'FRAUD_ONHOLD': 'FRAUD_ONHOLD'
        },
        SEGMENT_TYPES: {
            'OPEN': 'OPEN',
            'CONFIRMED': 'CONFIRMED',
        },
        FARE_CODES: {
            'EQMANO': 'EQMANO',
            'EQBODEGA': 'EQBODEGA',
            'REEMBOLSO': 'REEMBOLSO',
        },
        MmBPatterns: {
            'NAME_SURNAME_PATTERN': /^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_+{}\[\]"\^€$£])/,
            'NAME_SURNAME_CLEANER': '[0-9*¡!?¿<>\\\\ºª|/\\·@#$%&,;=?¿())_+{}\\[\\]"\\^€$£]',
            'EMAIL_PATTERN': /^[A-Za-z0-9_\.\+-]+@[A-Za-z0-9-\.]+\.[A-Za-z0-9]+$/,
            'PHONE_PATTERN': /^\d{6,}$/,
            'PHONE_CLEANER': '[^0-9(+)]',
            'CVV_PATTERN': /^\d+$/,
            'CVV_CLEANER': '\\D+',
            'CREDIT_CARD_NUMBER_PATTERN': /^\d+$/,
            'CREDIT_CARD_NUMBER_CLEANER': '\\D+',
            'CARD_NUMBER_PATTERN': /^\d+$/,
            'CARD_NUMBER_CLEANER': '\\D+',
            'DOCS_PATTERN': /^(?!.*[¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_+{}\[\]"\^€$£])/,
            'DOCS_CLEANER': '[¡!?¿<>\\\\ºª|/\\·@#$%&,;=?¿())_+{}\\[\\]"\\^€$£]',
            'PNR_PATTERN': /^[a-zA-Z\s\d\-]+$/,
            'PNR_CLEANER': '[^a-zA-Z\\s\\d\\-]',
            'NUMBER_IB_PLUS_PATTERN': /^\d{8,}$/,
            'NUMBER_IB_PLUS_CLEANER': '\\D+',
            'NUMBER_FF_PATTERN': /^\d+$/,
            'NUMBER_FF_CLEANER': '\\D+',
            'PHONE_MAX_LENGTH': 16,
            'EMAIL_MAX_LENGTH': 60,
            'MAX_LENGTH_NAME': 30,
            'NUMBER_IB_PLUS_MAX_LENGTH': 8,
            'NUMBER_FF_MAX_LENGTH': 20,
            'MAX_LENGTH_IBERIA_CARD': 8,
            'MIN_LENGTH_FF': 8,
            'MAX_LENGTH_PIN': 6,
            'AWS_WARNING_ERRORS': /AWS/,
            'APIS_DOCUMENT_MAX_LENGTH': 20,
            'APIS_DNI_PSTS_MAX_LENGTH': 15,
            'ONLY_LETTERS': /[^a-zA-Z+]/g
        },
        PAGES_URL: {
            'SEARCH': '/chktrp',
            'BOOKING_MANAGE': '/ibmtdt',
            'CHANGE_FLIGHT': '/tcadvs',
            'FLIGHT_CONFIRMATION': '/tcfrev',
            'BOOKINGS_LIST': '/mytrps',
            'PASSENGERS_INFO': '/moinfo',
            'CHANGE_PASSENGERS_SPECIAL_NEEDS': '/mopmr',
            'CONFIRM_ON_HOLD': '/ohmtdt',
            'MMB_DASHBOARD': '/ibdash',
            'MMB_INVOLUNTARY_CHANGE': '/ibinvchange',
            'PAYMENTS': '/ohinfo',
            'ON_HOLD_ANULATION': '/cnclit',
            'MMB_CONFIRMATION_ORDER': '/confirmation',
            'MMB_COMMUNICATION_LOST': '/communicationLost'
        },
        PAGE_TYPE_CHANNEL: {
            'MOBI': 'MOBI'
        },
        STEP_PARAM_VALUES: {
            'CHANGE_FLIGHT': 'changeFlight'
        },
        GDR_PA_ERRORS: {
            'ERR_1': 'GDR_PA_ERROR_1'
        },
        GDR_CODE_ERRORS: {
            'UNEXPECTED_TECHNICAL_EXCEPTION': 'FRAM_B0006'
        },
        CHECKIN_NEXT_STEP: {
            'SEATS_MAP': 'seatsMap',
            'BOARDING_CARDS': 'boardingCards',
            'FLY_NOW': 'flyNow',
            'FLIGHT_PASSENGER': 'flightPas'
        },
        STATUS: {
            'UNCHECKABLE': 'UNCHECKABLE',
            'CHECKABLE': 'CHECKABLE',
            'CHECKED': 'CHECKED',
            'STANDBY': 'STANDBY',
            'REISSUE': 'REISSUE',
            'NOT_SELECTABLE': 'NOT_SELECTABLE'
        },
        QUADRIGAM: {
            'SEARCH': 'CHKTRP',
            'LOGGED_SEARCH': 'MYTRPS',
            'TRIP_DETAILS': 'IBMTDT',
            'CHANGE_FLIGHT': 'TCADVS',
            'CHANGE_FLIGHT_DISPO': 'TCFLPA',
            'FLIGHT_CONFIRMATION': 'TCFREV',
            'ORDER_TICKETS': 'IBENIT',
            'ORDER_TICKETS_CONFIRMATION': 'IBCENIT',
            'CHANGED_HOURS_INV': 'IBICHC',
            'CANCEL_FLIGHT_INV': 'IBICFC',
            'SPECIAL_NEEDS': 'MOPMR',
            'SPECIAL_NEEDS_CONFIRMED': 'MOPMRCF',
            'PASSENGER_INFO': 'MOINFO',
            'ON_HOLD_CONF': 'OHMTDT',
            'ON_HOLD_CONF_ON_BUSINESS': 'CIPOHMTDT',
            'ON_HOLD_CONF_RESIDENTS': 'OHSARA',
            'ON_HOLD_CONF_LOGIN': 'OHLOIN',
            'ON_HOLD_CONF_PAYMENT': 'OHINFO',
            'ON_HOLD_CONF_PAYMENT_ON_BUSINESS': 'CIPOHINFO',
            'ON_HOLD_CONF_PAYMENT_WAIT': 'OHWAIT',
            'ON_HOLD_CONF_PAYMENT_FRAUD': 'OHPCC',
            'ON_HOLD_CONF_CONFIRMATION': 'RTBKCF',
            'ON_HOLD_CONF_CONFIRMATION_ON_BUSINESS': 'CIPRTBKCF',
            'ON_HOLD_CONF_CANCEL_ORDER_MODAL': 'CNCLOH',
            'ON_HOLD_CONF_CANCEL_ORDER_MODAL_ON_BUSINESS': 'CIPCNCLOH',
            'ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION': 'CNCLIT',
            'ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION_ON_BUSINESS': 'CIPCNCLIT',

            'PASSENGER_DATA': 'MODPAX',
            'PASSENGER_FF_ADD': 'MOEMER',
            'CONFIRM_EMERGENCY_CONTACT': 'MOCEME',
            'FRECUENT_F': 'MOFFLY',
            'CONFIRM_FF': 'MOCFFL',
            'CONFIRM_ADD_APIS': 'MOCAPI',
            'SPECIAL_NEEDS_ADD': 'MOPMR',
            'CONFIRM_SPECIAL_NEEDS_ADD': 'MOCPMR',
            'MANAGE_RESERV': 'IBMMBR',
            'ADD_APIS': 'MOAPIS',
            'MODAL_INFO_SEATS': 'MODSEA',
            'MODAL_INFO_BAGGAGE': 'MODBAG',
            'MODAL_INFO_SECUR': 'MODINS',
            'YOUR_FLIGHTS': 'IBMTFL'
        },
        URL_PARAMETERS: {
            'LOCATOR': 'pnr',
            'SURNAME': 'surname',
            'MARKET': 'market',
            'LANGUAGE': 'language',
            'CHANNEL': 'channel',
            'DEVICE': 'device',
            'ERROR_CODE': 'codeError',
            'AIR_SHUTTLE': 'airshuttle',
            'PREORDER': 'preorder'
        },
        GOOGLE_ADS_URIS: {
            'TYPE_0': '/5508/iberia.com/check-in/Check-in-online-728x90',
            'TYPE_1': '/5508/iberia.com/check-in/Check-in-online-300x250',
            'TYPE_2': '/5508/iberia.com/check-in/Check-in-online-300x600',
            'TYPE_3': '/5508/iberia.com/check-in/Check-in-online-160x600'
        },
        BANNER_IDS: {
            'TYPE_0': 'banner_adds_728_90',
            'TYPE_1': 'banner_adds_300_250',
            'TYPE_2': 'banner_adds_300_600',
            'TYPE_3': 'banner_adds_160_600'
        },
        DESTINATION_IMAGE_SIZE: {
            'desktop': '_2000_1200.jpg',
            'tablet': '_768_1024.jpg',
            'mobile': '_320_568_2x.jpg'
        },
        WCS: {
            'PHONE_TYPES': {
                'SALES': 'RESERVAS'
            }
        },
        MODAL_PAYMENT_TAXES: 'ib-modal-payment-taxes.html',
        MODAL_SPECIAL_NEEDS: 'ib-modal-special-needs.html',
        GENERAL_ERRORS_SERVICE: {
            'SERVICE_GENERAL_ERROR': 'REST_SERVICE_ERROR_GENERAL',
            'LOGGED_ERROR_TITLE': 'GENERAL_ADVICE_TITLE',
            'LOGGED_ERROR_BODY': 'GENERAL_LOGGED_ERROR_BODY'
        },
        'PURCHASEKEY': 'PURCHASE_MESSAGE',
        'ON_HOLD_MARKETS': ['IE', 'FI', 'SE', 'DK', 'GR', 'ZA', 'HU', 'CZ', 'PT', 'AT', 'SN', 'CH', 'BE', 'MA', 'NL', 'RU', 'IT', 'DE', 'IL', 'DZ', 'FR', 'ES'],
        'MMB_MARKETS': ['IE', 'GR'],
        DAYS_ARRAY: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18',
            '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
        ],
        MONTH_ARRAY: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        DEFAULT_TO_YEARS: 100,
        DEFAULT_FROM_YEARS: 0,
        FORMAT_DATE: [{
            'code': 'es',
            'dateFormat': {
                'fullDate': 'EEEE, D "de" MMMM "de" Y',
                'longDate': 'D "de" MMMM "de" Y',
                'medium': 'D MMM Y H:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'H:mm:ss',
                'short': 'D/M/YY H:mm',
                'shortDate': 'D/M/YY',
                'shortTime': 'H:mm'
            }
        }, {
            'code': 'en',
            'dateFormat': {
                'fullDate': 'EEEE, MMMM D, Y',
                'longDate': 'MMMM D, Y',
                'medium': 'MMM D, Y h:mm:ss a',
                'mediumDate': 'MMM D, Y',
                'mediumTime': 'h:mm:ss a',
                'short': 'M/D/YY h:mm a',
                'shortDate': 'M/D/YY',
                'shortTime': 'h:mm a'
            }
        }, {
            'code': 'ls',
            'dateFormat': {
                'fullDate': 'EEEE, MMMM D, Y',
                'longDate': 'MMMM D, Y',
                'medium': 'MMM D, Y h:mm:ss a',
                'mediumDate': 'MMM D, Y',
                'mediumTime': 'h:mm:ss a',
                'short': 'M/D/YY h:mm a',
                'shortDate': 'M/D/YY',
                'shortTime': 'h:mm a'
            }
        }, {
            'code': 'zh',
            'dateFormat': {
                'fullDate': 'y\u5e74M\u6708d\u65e5EEEE',
                'longDate': 'y\u5e74M\u6708d\u65e5',
                'medium': 'y\u5e74M\u6708d\u65e5 ah:mm:ss',
                'mediumDate': 'y\u5e74M\u6708d\u65e5',
                'mediumTime': 'ah:mm:ss',
                'short': 'Y/M/D ah:mm',
                'shortDate': 'Y/M/D',
                'shortTime': 'ah:mm'
            }
        }, {
            'code': 'ca',
            'dateFormat': {
                'fullDate': 'EEEE, D MMMM "de" Y',
                'longDate': 'D MMMM "de" Y',
                'medium': 'D MMM Y H:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'H:mm:ss',
                'short': 'D/M/YY H:mm',
                'shortDate': 'D/M/YY',
                'shortTime': 'H:mm'
            }
        }, {
            'code': 'de',
            'dateFormat': {
                'fullDate': 'EEEE, D. MMMM Y',
                'longDate': 'D. MMMM Y',
                'medium': 'DD.MM.Y HH:mm:ss',
                'mediumDate': 'DD.MM.Y',
                'mediumTime': 'HH:mm:ss',
                'short': 'DD.MM.YY HH:mm',
                'shortDate': 'DD.MM.YY',
                'shortTime': 'HH:mm'
            }
        }, {
            'code': 'fr',
            'dateFormat': {
                'fullDate': 'EEEE D MMMM Y',
                'longDate': 'D MMMM Y',
                'medium': 'D MMM Y HH:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'HH:mm:ss',
                'short': 'DD/MM/Y HH:mm',
                'shortDate': 'D/MM/Y',
                'shortTime': 'HH:mm'
            }
        }, {
            'code': 'it',
            'dateFormat': {
                'fullDate': 'EEEE D MMMM Y',
                'longDate': 'D MMMM Y',
                'medium': 'DD MMM Y HH:mm:ss',
                'mediumDate': 'DD MMM Y',
                'mediumTime': 'HH:mm:ss',
                'short': 'DD/MM/YY HH:mm',
                'shortDate': 'DD/MM/YY',
                'shortTime': 'HH:mm'
            }
        }, {
            'code': 'pt',
            'dateFormat': {
                'fullDate': 'EEEE, D "de" MMMM "de" Y',
                'longDate': 'D "de" MMMM "de" Y',
                'medium': 'D "de" MMM "de" Y HH:mm:ss',
                'mediumDate': 'D "de" MMM "de" Y',
                'mediumTime': 'HH:mm:ss',
                'short': 'DD/MM/YY HH:mm',
                'shortDate': 'DD/MM/YY',
                'shortTime': 'HH:mm'
            }
        }, {
            'code': 'ja',
            'dateFormat': {
                'fullDate': 'y\u5e74M\u6708d\u65e5EEEE',
                'longDate': 'y\u5e74M\u6708d\u65e5',
                'medium': 'Y/MM/dd H:mm:ss',
                'mediumDate': 'Y/MM/DD',
                'mediumTime': 'H:mm:ss',
                'short': 'Y/MM/DD H:mm',
                'shortDate': 'Y/MM/DD',
                'shortTime': 'H:mm'
            }
        }, {
            'code': 'nl',
            'dateFormat': {
                'fullDate': 'EEEE D MMMM Y',
                'longDate': 'D MMMM Y',
                'medium': 'D MMM Y HH:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'HH:mm:ss',
                'short': 'DD-MM-YY HH:mm',
                'shortDate': 'DD-MM-YY',
                'shortTime': 'HH:mm'
            }
        }, {
            'code': 'ru',
            'dateFormat': {
                'fullDate': 'EEEE, D MMMM Y "\u0433".',
                'longDate': 'D MMMM Y "\u0433".',
                'medium': 'D MMM Y "\u0433". H:mm:ss',
                'mediumDate': 'D MMM Y "\u0433".',
                'mediumTime': 'H:mm:ss',
                'short': 'DD.MM.YY H:mm',
                'shortDate': 'DD.MM.YY',
                'shortTime': 'H:mm'
            }
        }],
        PURCHASEMESSAGES: ['PURCHASE_WITHOUT_PAYMENT', 'PURCHASEOK_WITHOUT_TICKETS']
    }

    var fakeExpectedDays = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
    ]

    var fakeExpectedDays2 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

    var fakeExpectedMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']


    var expectedYears = [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7];

    var expectedYears2 = [2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987,
        1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970, 1969, 1968, 1967, 1966, 1965, 1964, 1963, 1962, 1961, 1960, 1959, 1958, 1957, 1956, 1955, 1954, 1953, 1952, 1951, 1950, 1949, 1948, 1947, 1946, 1945, 1944, 1943, 1942, 1941, 1940, 1939, 1938, 1937, 1936, 1935, 1934, 1933, 1932, 1931, 1930, 1929, 1928, 1927, 1926, 1925, 1924, 1923, 1922, 1921, 1920, 1919, 1918, 1917];


    beforeEach(function () {
        angular.mock.module('ib-passenger-birth-date-module', function ($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;

        });
    });

    describe('when activate() function is called', function () {

        it('should set correct values to availableYears, availableDays and availableMonths when yearsFrom and yearsTo are avadible.', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.yearsFrom = 2000;
            controller.yearsTo = 2010;
            controller.$onInit();
            expect(controller.availableMonths).toEqual(fakeExpectedMonths);
            expect(controller.availableDays).toEqual(fakeExpectedDays);
        });

        it('should set correct values to availableYears, availableDays and availableMonths when yearsFrom and yearsTo are not avadible.', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });

            controller.$onInit();
            expect(controller.availableMonths).toEqual(fakeExpectedMonths);
            expect(controller.availableDays).toEqual(fakeExpectedDays);


        });

    });

    describe('when monthsSelected() function is called', function () {

        it('should set correct day when month and year are null and day > availableDays', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.day = '32';
            controller.availableMonths = fakeExpectedMonths;
            controller.availableDays = fakeExpectedDays2;
            controller.monthsSelected();
            expect(controller.day).toEqual('31');
        });

        it('should set correct day when month and year are null < availableDays', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.day = '29';
            controller.availableMonths = fakeExpectedMonths;
            controller.availableDays = fakeExpectedDays2;
            controller.monthsSelected();
            expect(controller.day).toEqual('29');
        });

        it('should set correct day when month and year exist', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.month = '12';
            controller.year = 19;
            controller.availableMonths = ['01','02','03','04','05'];
            controller.availableYears = [19];
            date = new Date("December 17, 1995 03:24:00");
            controller.day = (date.getDate() + 1)+'';
            controller.monthsSelected();
            expect(controller.day).toEqual('18');
        });

        it('should set correct day when month and year exist', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.month = '12';
            controller.year = 19;
            controller.availableMonths = ['01','02','03','04','05'];
            controller.availableYears = [19];
            date = new Date("December 17, 1995 03:24:00");
            controller.day = (date.getDate() - 1)+'';
            controller.monthsSelected();
            expect(controller.day).toEqual('16');
        });

        it('should set correct day when month and year exist', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.month = 12;
            controller.year = 19;
            controller.availableMonths = [5,6];
            controller.availableYears = [19];
            date = new Date("December 17, 1995 03:24:00");
            controller.day = (date.getDate() + 1)+'';
            controller.monthsSelected();
            expect(controller.day).toEqual('18');
        });

        it('should set correct day when month and year exist', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.month = 12;
            controller.year = 19;
            controller.availableMonths = [5,6];
            controller.availableYears = [19];
            date = new Date("December 17, 1995 03:24:00");
            controller.day = (date.getDate() - 1)+'';
            controller.monthsSelected();
            expect(controller.day).toEqual('16');
        });

        it('should set correct day when month and year exist', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.month = 12;
            controller.year = 19;
            controller.availableMonths = [5,6];
            controller.availableYears = [19];
            date = new Date("December 17, 1995 03:24:00");
            controller.day = (date.getDate() + 100)+'';
            controller.monthsSelected();
            expect(controller.day).toEqual('31');
        });
    });

    describe('when yearsSelected() function is called', function () {

        it('should set correct month', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.month = 12;
            controller.year = 19;
            controller.availableMonths = [5];
            controller.availableYears = [18, 19];
            date = new Date("December 17, 1995 03:24:00");
            controller.month = (date.getMonth() + 1)+''
            controller.yearsSelected();
            expect(controller.month).toEqual('12');
        });
    });

    describe('when yearsSelected() function is called', function () {

        it('should set correct month', function () {
            $scope = $rootScope.$new();
            controller = $controller('PassengerBirthDateController', {
                $scope: $scope
            });
            controller.year = 19;
            controller.availableMonths = [5];
            controller.availableYears = [18,18];
            date = new Date("December 17, 1995 03:24:00");
            controller.month = (date.getMonth() + -100)+''
            controller.yearsSelected();
            expect(controller.month).toEqual('-89');
        });
    });
});
