(function () {

    angular.module('ib-MmB-booking-dashboard-module').constant('BookingDashboardConstants', {
        TABS: {
            summary: { name: 'summary', isSubtab: false },
            management: { name: 'management', isSubtab: false },
            flights: { name: 'flights', isSubtab: true },
            experience: { name: 'experience', isSubtab: true },
            transfer: { name: 'transfer', isSubtab: true },
            hotel: { name: 'hotel', isSubtab: true },
            cancel: { name: 'cancel', isSubtab: true },
            vehicle: { name: 'vehicle', isSubtab: true },
            changeFlights: { name: 'changeFlights', isSubtab: true },
            simulatorChangeFlights: { name: 'simulatorChangeFlights', isSubtab: true },
            passengers: { name: 'passengers', isSubtab: true },
            refunds: { name: 'refunds', isSubtab: true },
            voluntary_refunds: { name: 'voluntary_refunds', isSubtab: true },
            invoices: { name: 'invoices', isSubtab: true },
            customize: { name: 'customize', isSubtab: false },
            complete: { name: 'complete', isSubtab: false },
            stopOver: { name: 'stopOver', isSubtab: false},
            documents: { name: 'documents', isSubtab: true },
            exclusiveBenefits: { name: 'exclusiveBenefits', isSubtab: false }
        },
        STEPS_STATUS: {
            ACTIVE: 'ACTIVE',
            PAST: 'PAST',
            FUTURE: 'FUTURE'
        },

        ANCILLARIES_STATUS: {
            AVAILABLE: 'AVAILABLE'
        },
        BOX_LINKS_TYPES: {
            CHECK_IN: 'checkIn',
            EMERGENCY_CONTACT: 'emergencyContact',
            SEATS_AUCTION: 'seatsAuction',
            FLIGHT_REMINDER: 'flightReminder',
            BIDABLE: 'BIDABLE'
        },
        BOX_COL_SIZES: {
            LARGE: 'ib-flex--basis-100',
            // 'LARGE: 'col-md-6 col-lg-6 col-xl-6 col-xs-12',
            MEDIUM: 'ib-mmb-dashboard__column'
            // 'MEDIUM: 'col-md-6 col-xs-12'
        },
        BOX_LINK_SIZES: {
            FULL: 'ib-box-menu__section--full',
            LEFT: 'ib-box-menu__section--left',
            RIGHT: 'ib-box-menu__section--right'
        },
        BOX_LINK_ICONS: {
            CHECK_IN: 'icon-checking_online',
            MESSAGES: 'icon-mensajes',
            AUCTION: 'icon-subasta',
            DOWNLOAD: 'icon-descargar',
            UPLOAD_FILE: 'icon-subir_archivos',
            UPGRADE: 'icon-upgrade'
        },
        APIS_FORM: {
            DOCUMENT_TYPES: {
                DNI: 'DNI',
                GREENCARD: 'GREENCARD',
                REDRESSNUMBER: 'REDRESSNUMBER',
                KNOWNTRAVELERNUMBER: 'KNOWNTRAVELERNUMBER',
                OTHERS: 'OTHERS',
                PSPT: 'PSPT',
                TITLE: 'TITLE',
                VISA: 'VISA',
                CREWCERT: 'CREWCERT',
                RESCARD: 'RESCARD',
                MILITARYCARD: 'MILITARYCARD'
            },
            TYPE_DATA_FORM: {
                ADDITIONAL_INFO: 'additionalData',
                EMERGENCY_INFO: 'emergencyData',
                UPDATE_SHOW_FOR_ALL: 'showForAll',
                UPDATE_SHOW_DATA: 'showData'
            },
            DOCUMENT_FIELDS: {
                NUM_DOC: 'NUM_DOC',
                EXPIRY_DOC: 'EXPIRY_DOC',
                ISSUE_DOC: 'ISSUE_DOC',
                CNTRY_DOC: 'CNTRY_DOC',
                CITY_DOC: 'CITY_DOC'
            },
            FIELDS: {
                TITLE: 'TITLE',
                NAME: 'NAME',
                SURNAME: 'SURNAME',
                GENDER: 'GENDER',
                BIRTH_DATE: 'BIRTH_DATE',
                DESTINATION_ADDRESS: 'DESTINATION_ADDRESS',
                DESTINATION_CITY: 'DESTINATION_CITY',
                DESTINATION_STATE: 'DESTINATION_STATE',
                DESTINATION_ZIP: 'DESTINATION_ZIP',
                DESTINATION_COUNTRY: 'DESTINATION_COUNTRY',
                HOME_ADDRESS: 'HOME_ADDRESS',
                HOME_CITY: 'HOME_CITY',
                HOME_STATE: 'HOME_STATE',
                HOME_ZIP: 'HOME_ZIP',
                HOME_COUNTRY: 'HOME_COUNTRY',
                EMERGENCY_CONTACT_NAME: 'EMERGENCY_CONTACT_NAME',
                EMERGENCY_CONTACT_PHONE: 'EMERGENCY_CONTACT_PHONE',
                NATIONALITY: 'NATIONALITY',
                CITY_OF_BIRTH: 'CITY_OF_BIRTH'
            },
            GENDERS: {
                MALE: 'MALE',
                FEMALE: 'FEMALE',
                DEFAULT_GENDER: 'MALE'
            },
            TITLES: {
                MR: 'MR',
                MRS: 'MRS',
                MSS: 'MSS'
            },
            SPANISH_NATIONALITY: 'ES',
            USA_NATIONALITY: 'US',
            TAB_STATES: {
                NOT_TOUCHED: 'NOT_TOUCHED',
                COMPLETED: 'COMPLETED',
                WARNING: 'WARNING'
            },
            TAB_SCROLL_ID: '#APIS_TAB_',
            ADDTIONAL_ERROR_SERVICE: {
                PASSENGER_IS_UNCHECKABLE: 'PASSENGER_IS_UNCHECKABLE'
            },
            PASSENGER_STATUS: {
                ALLOWED: 'ALLOWED',
                NOT_ALLOWED: 'NOT_ALLOWED'
            }
        },
        QUALIFIERS: {
            HOLA_MADRID: 'HOLAMADRID',
            IBERIA_HOLIDAYS: 'IBDPHOLIDAYS',
            GROUP_PNR: 'GROUP_PNR'
        },
        IAG_MARKETING_CODE_CARRIER: ['IB', 'YW', 'I2', 'I0', '0I', 'LL'],
        ANCILLARIES_TYPE: {
            THIRD_PARTY_COMPANIES: 'THIRD_PARTY_COMPANIES'
        },
        ANCILLARIES_BAGGAGES_TYPES: {
            BAGGAGE_15: 'BAGGAGE_15',
            BAGGAGE_23: 'BAGGAGE_23',
            BAGGAGE_32: 'BAGGAGE_32'
        },
        ANCILLARIES_BAGGAGES_TYPES_DESCRIPTION: {
            BAGGAGE_15: '15Kg',
            BAGGAGE_23: '23Kg',
            BAGGAGE_32: '32Kg'
        },
        APIS_STATUS_COMPLETE: [
            'Completar',
            'Vervollständigen',
            'Complete',
            'Compléter',
            'Completa',
            '完了する',
            'vervolledigen',
            'Concluir',
            'завершить',
            '去完成'
        ],
        SAVE_MODAL_LITERALS: {
            title: 'SAVE_CHANGES',
            body: 'SURE_CHANGES',
            extraBody:'SURE_CHANGES_EXTRA_2',
            accept: 'SAVE_CHANGE',
            cancel: 'DONT_SAVE'
        },
        SAVE_ACCEPT_LITERALS: {
            showCloseButton: 'true',
            title: 'SAVE_CHANGES',
            body: 'SAVED_CORRECTLY'
        },
        SAVE_ERROR_LITERALS: {
            showCloseButton: 'true',
            title: 'SAVE_CHANGES',
            body: 'CANT_SAVE_CHANGES_IBZERO'
        },
        EXTERNAL_OPERATOR_MUSTSHOW_LOCATOR: ['VUELING', 'LA'],
        DEFAULT_FLEXIBILIZATION_TITLE: 'MMB_REFUND_ADVISORY_1',
        CUSTOM_FLEXIBILIZATION_TITLE: {
            53: 'MMB_FLEX_CAPABILITIES_INFO_MODULE_TITLE'
        } as Record<number, string>,
    });
})();
