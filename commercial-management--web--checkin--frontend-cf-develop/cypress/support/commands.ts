/// <reference types="cypress" />

import 'cypress-iframe';
import {
    ContactData,
    RegressionDataLayerInformation,
    RegressionDigitalDataInformation,
    VisitQuadrigamParams,
    CkiancLandingParams,
    FillApisDetailsParams,
    IbcoacLandingParams,
    SeatParams,
    InterceptServicesParams,
    Service,
    IbcobpLanding,
    FillContactDetails,
    MockContactData,
    IbCheckinApisParams
} from 'cypress/support/command-models';
import { CommandsConstants, ProcessAndStep } from 'cypress/support/commands-constants';
import {
    setBookingInfo,
    mockContactData,
    isEnableGA4,
    disabledGA4,
    mockPassengerApisInfo,
    getInhibitBC,
    resetInhibitBC,
    checkInhibitBoardingCard,
    setIsDeinvoice,
    getIsDeinvoice,
    getCarrierConnectEnabled
} from 'cypress/support/commands-utils';

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Validate the datalayer_general object stored information for GA4 analytics.
             * @param datalayerObject
             */
            validateDataLayerInformation(datalayerObject: RegressionDataLayerInformation): Chainable<any>;
            /**
             * Validate the digital_data object stored information for GA4 analytics.
             * @param digital_data
             */
            validateDigitalDataInformation(digital_data: RegressionDigitalDataInformation): Chainable<any>;
            /**
             * Search by locator and surname
             * @param pnr
             * @param surname
             * @param isReserverGroup
             */
            checkInSearchController(pnr: string, surname: string, isReserverGroup?: boolean): Chainable<any>;
            /**
             * Fill in contact details
             * @param contactData data fill contact details
             */
            fillContactDetails(contactData: ContactData[], logged?: boolean): Chainable<any>;
            /**
             * Fill ibcoac landing
             * @param IbcoacLandingParams
             * @argument requiredContactData boolean (optional) indicate is required contactData
             * @argument isLogged boolean (optional) indicates user logged or not
             * @argument isApis boolean (optional) indicates if is requires apis
             * @argument isApisUSA boolean (optional) indicates if is requires apis destination USA
             * @argument isAirShuttleOpen boolean (optional) indicates if includes air shuttle segments
             */
            flightsPassengersController(params?: IbcoacLandingParams): Chainable<any>;
            /**
             * Fill in apis details
             * @param FillApisDetailsParams
             * @argument emergencyRequired boolean for indicate if fills emergency contact
             * @argument isApisUSA boolean (optional) indicates is requires apis destination USA
             */
            fillApisDetails(params?: FillApisDetailsParams): Chainable<any>;
            /**
             * Fill payment data to credit card
             * @param numberIdMonth number end id to input month (ej: #ui-select-choices-2 -> 2)
             * @param numberIdYear number end id to input year (ej: #ui-select-choices-3 -> 3)
             */
            pmtPageController(numberIdMonth?: string, numberIdYear?: string): Chainable<any>;
            /**
             * Refactor validate process and step GA4
             * @param quadrigam validate quadrigam visit
             */
            validateProcessAndStepGA4(quadrigam: string): Chainable<any>;
            /**
             * Validate confirmation data GA4
             * @param flow string name folder file mock test
             */
            validateConfirmationGA4(flow: string): Chainable<any>;
            /**
             * Redirects to a Iberia page given the quadrigam
             * @param VisitQuadrigamParams
             * @argument quadrigam string (optional) visit quadrigam url entri
             * @argument urlParams boolean (optional) additional params to url
             * @argument logged boolean (optional) insert intercept flow login
             * @argument disabledGA4 boolean (optional) validate or not ga4 (only dev)
             */
            visitQuadrigam(params?: VisitQuadrigamParams): Chainable<any>;
            /**
             * Boarding cards landing
             * @param IbcobpLanding
             */
            boardingCardsController(params?: IbcobpLanding): Chainable<any>;
            /**
             * Boarding cards landing
             * @param flow test to validate GA4
             * @param isEarly indicates if is early flow
             */
            checkInConfirmationController(flow: string, isEarly?: boolean): Chainable<any>;
            /**
             * PA flight selection landing
             */
            flightNowController(): Chainable<any>;
            /**
             * PA flight selected landing
             */
            flyNowConfirmationPAController(): Chainable<any>;
            /**
             * Login IBPlus
             */
            login(): Chainable<any>;
            /**
             * Ancillaries landing
             * @param CkiancLandingParams
             * @argument addSeat SeatParams (optional)
             * @argument addBaggages boolean (optional)
             */
            ancillariesPageController(params?: CkiancLandingParams): Chainable<any>;
            /**
             * Intercept services and mocks responses
             * @param interceptServicesParams
             * @argument flowName string
             * @argument logged boolean (optional)
             * @argument payment SeatParams (optional)
             */
            interceptServices(params: InterceptServicesParams): Chainable<any>;
            /**
             * Upgrade Landing
             */
            upgradeController(): Chainable<any>;
            /**
             * Beautiful log
             * @param message string
             */
            logBeautiful(message: string): Chainable<any>;
            /**
             * Uncoac landing
             * @param isAllPassengers boolean
             */
            flightsPassengerDesController(isAllPassengers?: boolean): Chainable<any>;
            /**
             * group reservation
             * @param {string} name - The name to be entered in the reservation form.
             * @example
             *   cy.reserveGroups('Alberto');
             */
            reserveGroups(name: string);
            /**
             * Check until loading gone
             */
            checkUntilLoadingGone(callback: () => void);
            /**
             * Apis / Timatic landing
             */
            ibCheckinApisComponent(params?: IbCheckinApisParams): Chainable<any>;
        }
    }
}

Cypress.Commands.add('validateDataLayerInformation', (datalayerObject: RegressionDataLayerInformation) => {
    cy.logBeautiful('[GA4] Datalayer validating');
    return cy.window().then((window: any) => {
        Object.entries(datalayerObject).forEach(([key, value]) => {
            if (window.datalayer_general[key] && typeof value !== 'object') expect(window.datalayer_general[key], key).to.be.equal(value);
        });
    });
});

Cypress.Commands.add('validateDigitalDataInformation', (digitalData: RegressionDigitalDataInformation) => {
    cy.logBeautiful('[GA4] DigitalData validating');
    return cy.window().then((window: any) => {
        Object.entries(digitalData).forEach(([key, value]) => {
            if (window.digital_data[key] && typeof value !== 'object') expect(window.digital_data[key], key).to.be.equal(value);
        });
    });
});

Cypress.Commands.add('reserveGroups', (name: string) => {
    cy.logBeautiful('Initiating group reservation');
    cy.get('.ib-modals__header > .ib-heading').contains('Nombre del pasajero');
    cy.get('label[for="name"]').click().type(name);
    cy.get('#cki-modal-name-accept-btn').click();
});

Cypress.Commands.add('checkInSearchController', (pnr: string, surname: string, isReserverGroup?: boolean) => {
    let quadrigam: string = 'IBCOSE';
    cy.logBeautiful('form search by locator and surname');
    cy.scrollTo(0, 0);
    cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type(surname);
    cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type(pnr);
    cy.get('#ANONYMOUS_LOGIN_BOTON').click();

    if (isReserverGroup) {
        cy.reserveGroups('alberto');
    }

    if (sessionStorage.getItem('ib-check-in-app.userLogged') === 'true') {
        quadrigam = 'IBCOSEII';
    } else if (getIsDeinvoice()) {
        quadrigam = 'UNCOSE';
        cy.wait('@srvBooking').then((intercept) => {
            setBookingInfo(intercept.response.body);
        });
    }

    cy.validateProcessAndStepGA4(quadrigam);
});

Cypress.Commands.add('flightsPassengersController', (params: IbcoacLandingParams) => {
    const modalDangerousObject = () => {
        cy.logBeautiful('modal info dangerous object');
        cy.scrollTo(0, 0);
        //cy.get('.ib-modals__header > .ib-heading').click();
        cy.get('#danger-objs-conditions-objects_span').click('topLeft');
        cy.validateProcessAndStepGA4('CKDANG');
        cy.get('#cki-modal-dangerous-objects-continue-flow-btn').click();
    };
    const fillContactDetails = (params: FillContactDetails) => {
        cy.logBeautiful('fillContactDetails');
        const mock: MockContactData = mockContactData();
        if (mock.isRequired) {
            mock.contactData.forEach((passenger, i) => {
                if (params.isLogged) {
                    cy.get(`#IBCOAC_CONTACT_FORM_PHONE_${i}`)
                        .click('top')
                        .type('{selectAll}{backSpace}' + passenger.phone);
                    cy.get(`#IBAIRP_CONTACT_FORM_EMAIL_${i}`)
                        .click('top')
                        .type('{selectAll}{backSpace}' + passenger.email);
                } else {
                    cy.get(`#IBCOAC_CONTACT_FORM_PHONE_${i}`).click('top').type(passenger.phone);
                    cy.get(`#IBAIRP_CONTACT_FORM_EMAIL_${i}`).click('top').type(passenger.email);
                }
                //cy.get('[data-ng-if="passenger.fieldStatus.contactData.show"] > .ib-layout__line-spacing--large > .ib-check > .ib-check__label').click();
            });
        }
    };

    cy.logBeautiful('flightsPassengersController');
    // waiting service booking intercept response
    const quadrigam = params && params.isAirShuttleOpen ? 'IBCOACPA' : 'IBCOAC';
    const isLogged = params && params.isLogged;
    const closeModalInfo = params && params.modalInfo;

    cy.wait('@srvBooking').then((intercept) => {
        setBookingInfo(intercept.response.body);
    });

    cy.scrollTo(0, 0);

    cy.get('@bookingInfo').then(() => {
        //cy.get('.ib-layout__section-title > .ib-heading').as('title_FlightsPassengersController').click();
        checkInhibitBoardingCard();
        if (getInhibitBC()) cy.get('[id^=cki-flights-passengers-passenger-info-] > .ib-box-selects > .ib-box-selects__container > .ib-msg-alert').should('be.visible'); // show alert inhibit per passengers

        fillContactDetails({ isLogged: isLogged });

        if (getCarrierConnectEnabled()) cy.get('input[name="check_carrier_connect"]').click({ force: true });
        cy.get('#IBCOAC_CHECKIN_BUTTON').click(() => {
            cy.validateProcessAndStepGA4(quadrigam);
        });
        if (closeModalInfo) cy.get('#MODAL_INFO_ACCEPT_BUTTON').click();
        if (!getCarrierConnectEnabled()) modalDangerousObject();
    });
});

Cypress.Commands.add('fillApisDetails', (params?: FillApisDetailsParams) => {
    cy.logBeautiful('fillApisDetails');
    cy.scrollTo(0, 0).wait(500);
    const isApisUSA: boolean = params && params.isApisUSA;
    const emergencyRequired: boolean = params && params.emergencyRequired;
    const passengerApisInfo = mockPassengerApisInfo(isApisUSA);

    cy.get('#MODAL_TRAVEL_REQUIREMENTS').click({ force: true });

    passengerApisInfo.forEach((passenger, index) => {
        cy.get(`#\:r9\:-input`).click().type(passenger.name, { force: true });
        fillBasicInfo(passenger, index);
        fillDocumentation(passenger, index);
        if (isApisUSA) {
            fillDestinationUSA(passenger, index);
            cy.get('#CHECK_PRIVACY_EMERGENCY').click({ force: true });
            cy.get('#CHECK_CONFIRM_EMERGENCY_DATA').click({ force: true });
        } else {
            cy.get('#APIS_TRUTHFUL_INFO_CHECK_' + index).click({ force: true });
        }

        cy.get('#APIS_NEXT_BUTTON, #APIS_NEXT_BUTTON_2').then(($buttons) => {
            if ($buttons.length > 0) {
                cy.wrap($buttons).first().click();
            } else {
                cy.logBeautiful('Ninguno de los botones existe.');
            }
        });
    });
    //apis last screen
    passengerApisInfo.forEach((passenger, index) => {
        fillApisContactAndEmergency(passenger, index, emergencyRequired);
    });

    if (isApisUSA) {
        cy.get('#CHECK_PRIVACY_EMERGENCY').click({ force: true });
        cy.get('#CHECK_CONFIRM_EMERGENCY_DATA').click({ force: true });
    } else {
        cy.get('#APIS_TRUTHFUL_INFO_CHECK_' + passengerApisInfo.length).click({ force: true });
    }

    cy.validateProcessAndStepGA4('IBCOACII');
    cy.get('#APIS_SAVE_CONTINUE_BUTTON_CONTACT').click();

    function fillBasicInfo (passenger, index) {
        cy.logBeautiful('fillBasicInfo');
        cy.get(`#APIS_NAME_${index}`).type(passenger.name, { force: true });
        cy.get(`#APIS_SURNAME_${index}`).type(passenger.surname, { force: true });
        cy.get('#PASSENGER_BIRTH_DATE > .ib-select-date__action--day').click().contains(passenger.birthday.day).click();
        cy.get('#PASSENGER_BIRTH_DATE > .ib-select-date__action--month').click().contains(passenger.birthday.month).click();
        cy.get('#PASSENGER_BIRTH_DATE > .ib-select-date__action--year').click().contains(passenger.birthday.year).click();
        cy.get(`#APIS_GENDER_${passenger.gender.toUpperCase()}_${index}`).click({ force: true });
        cy.get(`#APIS_HOME_COUNTRY_${index}`).click();
        cy.get(`#APIS_HOME_COUNTRY_${index} > .ib-select__list`).contains(passenger.country).click();
        cy.get(`#APIS_NATIONALITY_${index}`).click();
        cy.get(`#APIS_NATIONALITY_${index} > .ib-select__list`).contains(passenger.nationality).click();
    }

    function fillDestinationUSA (passenger, index) {
        cy.logBeautiful('fillDestinationUSA');
        cy.get(`#APIS_DESTINATION_ADDRESS_${index}`).type(passenger.destinationUSA.address, { force: true });
        cy.get(`#APIS_ZIP_CODE_${index}`).type(passenger.destinationUSA.zipCode, { force: true });
        cy.get(`#APIS_DESTINATION_CITY_${index}`).type(passenger.destinationUSA.city, { force: true });
        cy.get(`#APIS_DESTINATION_STATE_${index}`).click();
        cy.get(`#APIS_DESTINATION_STATE_${index} > .ib-select__list`).contains(passenger.destinationUSA.state).click();
    }

    function fillDocumentation (passenger, index) {
        cy.logBeautiful('fillDocumentation');
        cy.get(`#APIS_DOCUMENT_TYPE_${index}_REQ`).click();
        cy.get(`#APIS_DOCUMENT_TYPE_${index}_REQ > .ib-select__list`).contains('Pas').click();
        cy.get(`#APIS_DOC_NUMBER_${index}_REQ`).type(passenger.document.number, { force: true });
        cy.get(`#cki-apis-passenger-docs-expiry-date-${index}_REQ > #EXPIRY_DATE > .ib-select-date__action--day`).click().contains(passenger.document.expirationDate.day).click();
        cy.get(`#cki-apis-passenger-docs-expiry-date-${index}_REQ > #EXPIRY_DATE > .ib-select-date__action--month`)
            .click()
            .contains(passenger.document.expirationDate.month)
            .click();
        cy.get(`#cki-apis-passenger-docs-expiry-date-${index}_REQ > #EXPIRY_DATE > .ib-select-date__action--year`).click().contains(passenger.document.expirationDate.year).click();
        cy.get(`#APIS_DOC_COUNTRY_${index}_REQ`).click();
        cy.get(`#APIS_DOC_COUNTRY_${index}_REQ > .ib-select__list`).contains(passenger.document.emissionCountry).click();
    }

    function fillApisContactAndEmergency (passenger, index, emergencyRequired) {
        cy.logBeautiful('fillApisContactAndEmergency');
        cy.get(`#APIS_PHONE_ADDITIONAL_${index}`).type(passenger.phone, { force: true });
        cy.get(`#APIS_EMAIL_${index}`).type(passenger.email, { force: true });
        if (emergencyRequired) {
            cy.get(`#APIS_NAME_EMERGENCY_${index}`).type(passenger.emergencyContact.name, { force: true });
            cy.get(`#APIS_PHONE_EMERGENCY_${index}`).type(passenger.emergencyContact.phone, { force: true });
        }
    }
});

Cypress.Commands.add('pmtPageController', (numberIdMonth?: string, numberIdYear?: string) => {
    const date = new Date();
    const mockCreditCard = {
        number: '4012999999999999',
        name: 'test',
        surname: 'tester',
        cvv: '555',
        expiration: {
            month: '01',
            year: (date.getFullYear() + 1).toString()
        }
    };
    const cardExpirationDate = {
        monthId: `#ui-select-choices-${numberIdMonth ? numberIdMonth : '3'}`,
        yearId: `#ui-select-choices-${numberIdYear ? numberIdYear : '4'}`
    };
    const title = '#pmt-breakdwon';
    const iframeNumberCard = '#ibdc-number-frame';
    const inputName = '#name';
    const inputsurname = '#surnames';
    const iframeCCV = '#ibdc-cvv-frame';
    const check = '#check_terms_conditions_span';
    const btn = '#pmt-total-price-pay-btn';

    cy.logBeautiful('pmtPageController');
    cy.scrollTo(0, 0);
    cy.get(title).as('title_PmtPageController').click();
    cy.iframe(iframeNumberCard).find('#number').click('top').type(mockCreditCard.number, { force: true });
    cy.get(inputName).click('top').type(mockCreditCard.name);
    cy.get(inputsurname).click('top').type(mockCreditCard.surname);
    cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
    cy.get(cardExpirationDate.monthId).contains(mockCreditCard.expiration.month).click();
    cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
    cy.get(cardExpirationDate.yearId).contains(mockCreditCard.expiration.year).click();
    cy.iframe(iframeCCV).find('#cvv').click('top').type(mockCreditCard.cvv, { force: true });
    cy.get(check).click('topLeft');
    cy.validateProcessAndStepGA4('IBCKIPURC');
    cy.get(btn).click();
});

Cypress.Commands.add('validateProcessAndStepGA4', (quadrigam: string) => {
    const processAndStep = ProcessAndStep;

    if (isEnableGA4()) {
        cy.logBeautiful(`Validating Process and step (GA4)(${quadrigam})`);

        quadrigam = quadrigam.toLocaleLowerCase();
        if (processAndStep[quadrigam]) {
            cy.validateDataLayerInformation(processAndStep[quadrigam].datalayer);
            cy.validateDigitalDataInformation(processAndStep[quadrigam].digitaldata);
        } else {
            cy.logBeautiful('ERROR validate process and step: ' + quadrigam);
        }
    }
});

Cypress.Commands.add('validateConfirmationGA4', (flow: string) => {
    if (isEnableGA4()) {
        cy.logBeautiful(`(GA4) Check confirmation`);

        cy.fixture(`${flow}/datalayer/datalayer-confirmation`).then((datalayer) => {
            const datalayerGeneralExpected = datalayer;
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture(`${flow}/datalayer/digital-data-confirmation`).then((digital_data) => {
            const digitalDataExpected = digital_data;
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
    }
});

Cypress.Commands.add('visitQuadrigam', (params: VisitQuadrigamParams = {}) => {
    const urlParams = params && params.urlParams ? params.urlParams : {};
    const paramsBefore = new URLSearchParams(Object.entries(urlParams));
    const isDeinvoice = params && params.isDeinvoice;
    let quadrigam = params && params.quadrigam ? params.quadrigam : 'ibcose';

    if (!paramsBefore.get('language')) paramsBefore.set('language', 'es');
    if (!paramsBefore.get('market')) paramsBefore.set('market', 'es');
    if (isDeinvoice && !paramsBefore.get('ckiParaAAVV') && !paramsBefore.get('undoCKI') && !paramsBefore.get('travelAgent')) {
        paramsBefore.set('ckiParaAAVV', 'true');
        paramsBefore.set('undoCKI', 'true');
        paramsBefore.set('travelAgent', '54840');
        quadrigam = 'uncose';
        setIsDeinvoice(true);
    }
    const search = paramsBefore ? `?${paramsBefore.toString()}` : '';
    //if (params && params.logged) cy.login().wait(500);
    if (params && params.disabledGA4) disabledGA4();
    resetInhibitBC();
    cy.visit(`${Cypress.env('url')}${search}#!/${quadrigam}`);
});

Cypress.Commands.add('boardingCardsController', (params: IbcobpLanding) => {
    const { inhibitBC } = params || {};
    const { status = false, isHomogeneous = false, type } = inhibitBC || {};

    const isAircheckOrInhibit = status && ['AIRCHECK', 'INHIBIT'].includes(type);
    const isCaseInhibitionHomogeneousNextFlow = status && isHomogeneous && !isAircheckOrInhibit;
    const isCaseInhibitionHomogeneousEndFlow = status && isHomogeneous && isAircheckOrInhibit;
    const btn = '#cki-boarding-cards-get-cards-button2';
    const btnWallet = '#IB_BOARDING_CARDS_WALLET_BUTTON';
    const input = '#email_one';
    const downloadBC = () => {
        cy.get(input).then(($input) => {
            const text = $input.val();
            if (text === '') {
                cy.get(input).type('test@test.test', { force: true });
            }
        });
        cy.get(btnWallet).click();
        cy.validateProcessAndStepGA4('IBCOBP');
        cy.get(btn).click();
    };

    cy.logBeautiful('boardingCardsController');
    cy.scrollTo(0, 0);
    if (isCaseInhibitionHomogeneousNextFlow) {
        cy.get(btn).should('be.visible');
        cy.validateProcessAndStepGA4('IBCOBP');
        cy.get(btn).click();
    } else if (isCaseInhibitionHomogeneousEndFlow) cy.validateProcessAndStepGA4('IBCOBP');
    else downloadBC();
});

Cypress.Commands.add('checkInConfirmationController', (flow: string) => {
    const title = '.title__h2';
    const titleAlertInhibit = '.ib-msg-alert__text--bold';
    let isEarly = sessionStorage.getItem('ib-check-in-app.isEarly') || false;
    if (typeof isEarly === 'string') isEarly = isEarly === 'true';

    cy.logBeautiful('checkInConfirmationController');
    cy.scrollTo(0, 0);
    cy.get(title).as('title_CheckInConfirmationController').click();
    if (getInhibitBC()) cy.get(titleAlertInhibit).as('title_AlertInhibitBC').click(); //Title alert inhibit
    if (isEarly) cy.validateProcessAndStepGA4('IBECCF');
    else cy.validateProcessAndStepGA4('IBCKICF');
    cy.validateConfirmationGA4(flow);
});

Cypress.Commands.add('flightNowController', () => {
    const title = '.ibe-info__box';
    const btn = '#cki-flight-now-tab-slices-select-segment-btn';

    cy.logBeautiful('flightNowController');
    cy.get(title).as('title_FlightNowController').click();
    cy.validateProcessAndStepGA4('IBFNPA');
    cy.get(btn).click();
});

Cypress.Commands.add('flyNowConfirmationPAController', () => {
    const btn = '#button_next';

    cy.logBeautiful('flyNowConfirmationPAController');
    cy.validateProcessAndStepGA4('IBFCONPA');
    cy.get(btn).click();
});

Cypress.Commands.add('login', () => {
    cy.setCookie('IBERIACOM_SSO_TYPE', 'IBPLUS');
    cy.setCookie(
        'IBERIACOM_SSO_REFRESH',
        'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI5ZTA3ZmEzMC0wZDBmLTQ5ODAtODliOS1kNjcxMWMyY2M2ZGMiLCJleHAiOjE2NzI3NjAwMTEsIm5iZiI6MCwiaWF0IjoxNjcyNzU4MjExLCJpc3MiOiJodHRwOi8vYXV0aC1pYmlzdWF0Yi5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwiYXVkIjpudWxsLCJzdWIiOiIwMDAwMDAwNzYwMDkxOSIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJpYmVyaWFfd2ViIiwic2Vzc2lvbl9zdGF0ZSI6IjExNjQ5OTgxLTMwODYtNGJlNS04MzA4LTBhMTNlMmVhZjM2ZiIsImNsaWVudF9zZXNzaW9uIjoiMmNmYzU4MzktMWUyYy00NGE5LThjYWMtYWFhZWMzYzcyNDZhIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIlJPTEVfQ01fQ0xBSU1TIiwiUk9MRV9NRU1CRVIiLCJST0xFX09STSIsIlJPTEVfQlBNIiwiUk9MRV9PUlMiLCJST0xFX1BNVCIsIlJPTEVfSUJFUklBX1BMVVMiLCJST0xFX0FWTSIsIlJPTEVfTE9DIiwiUk9MRV9BVkMiLCJST0xFX0FEVk0iLCJST0xFX0hPTUUiLCJST0xFX01FTUJFUl9BU1NPQ0lBVEUiLCJST0xFX0lEQ19HRVRfSURFTlRJRklFUlMiLCJST0xFX0NVU1QiLCJST0xFX0lEQ19TRUFSQ0hfQ1VTVE9NRVJfU0EiLCJST0xFX1BBQ0MiLCJST0xFX01FTUJFUl9BQ0NPVU5UUyIsIlJPTEVfQ1JZUFRPX01BTkFHRVIiLCJST0xFX01FTUJFUl9QRVJNSVNTSU9OUyIsIlJPTEVfU0VBVFMiLCJST0xFX0FQSU0iLCJST0xFX1NGTSIsIlJPTEVfQUdMX0NSRURJVF9DVVJSRU5DWSIsIlJPTEVfT1dDQVJEX0VNRVJBTEQiLCJST0xFX0ZPRkYiLCJST0xFX0JJT01FVFJJQyIsIlJPTEVfVVBHUkFERV9NQU5BR0VSIiwiUk9MRV9MUE0iLCJST0xFX0ZBVkwiLCJST0xFX1NBTCIsIlJPTEVfRk0iLCJST0xFX1VTRVIiLCJST0xFX1BSTSIsIlJPTEVfTUVNQkVSX0lOVklUQVRJT04iLCJST0xFX0ZBU1MiLCJST0xFX0NIQU5ORUxfQURBUFRFUiIsIlJPTEVfSUJDQVJEX1BMQVRJTk8iLCJST0xFX1NSViIsIlJPTEVfQUdMX0NSRURJVF9UUkFOU0FDVElPTiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7fX0.UPR-HtYWifUlevJbKKQo9sTP7AZNAGfCLY4tPeOWpwQhQ6OZBDuKE30Qs412mZR7hAxWVaoyJBCKxtHDs01hrQq3212kBoYKB5n5kznsF4Rhc9eWISflGX5ft-xcEWDf3SFeHmcQNYnKSMZt3dMw6B0WTmTQpI1Do8-JPXTI0kUiiB40b-qVu-8jrJUqBqe_KFydjz6czun22UobrfEoEmSsgmN5g9Bkf_6FAReu0t4rAVlu_Y7oT5wBbzPJSMC1_OkDSRwEBz2T61eGoE5FgYg_wQ1tT6h126ZwGWK1BDfKw8O3AexsbPfR09UmFM7_Eidg_6YE66kgsGBTaCUZJw'
    );
    cy.setCookie('IBERIACOM_SSO_ACCESS_TO', '13/12/2116 19:26');
    cy.setCookie('IBERIACOM_SSO_REFRESH_TO', '13/12/2116 19:26');
    cy.setCookie(
        'IBERIACOM_SSO_ACCESS',
        'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI0YzhkODNmNy01YTFkLTQxNzEtYTVkMy01ZThlMjMwY2QyN2MiLCJleHAiOjE2NzI3NTkxMTEsIm5iZiI6MCwiaWF0IjoxNjcyNzU4MjExLCJpc3MiOiJodHRwOi8vYXV0aC1pYmlzdWF0Yi5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwiYXVkIjoiaWJlcmlhX3dlYiIsInN1YiI6IjAwMDAwMDA3NjAwOTE5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaWJlcmlhX3dlYiIsInNlc3Npb25fc3RhdGUiOiIxMTY0OTk4MS0zMDg2LTRiZTUtODMwOC0wYTEzZTJlYWYzNmYiLCJjbGllbnRfc2Vzc2lvbiI6IjJjZmM1ODM5LTFlMmMtNDRhOS04Y2FjLWFhYWVjM2M3MjQ2YSIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJST0xFX0NNX0NMQUlNUyIsIlJPTEVfTUVNQkVSIiwiUk9MRV9PUk0iLCJST0xFX1BNVCIsIlJPTEVfT1JTIiwiUk9MRV9CUE0iLCJST0xFX0FWTSIsIlJPTEVfSUJFUklBX1BMVVMiLCJST0xFX0xPQyIsIlJPTEVfQVZDIiwiUk9MRV9BRFZNIiwiUk9MRV9IT01FIiwiUk9MRV9NRU1CRVJfQVNTT0NJQVRFIiwiUk9MRV9JRENfR0VUX0lERU5USUZJRVJTIiwiUk9MRV9DVVNUIiwiUk9MRV9JRENfU0VBUkNIX0NVU1RPTUVSX1NBIiwiUk9MRV9QQUNDIiwiUk9MRV9NRU1CRVJfQUNDT1VOVFMiLCJST0xFX0NSWVBUT19NQU5BR0VSIiwiUk9MRV9NRU1CRVJfUEVSTUlTU0lPTlMiLCJST0xFX1NFQVRTIiwiUk9MRV9BUElNIiwiUk9MRV9TRk0iLCJST0xFX0FHTF9DUkVESVRfQ1VSUkVOQ1kiLCJST0xFX0ZPRkYiLCJST0xFX09XQ0FSRF9FTUVSQUxEIiwiUk9MRV9VUEdSQURFX01BTkFHRVIiLCJST0xFX0JJT01FVFJJQyIsIlJPTEVfRkFWTCIsIlJPTEVfTFBNIiwiUk9MRV9TQUwiLCJST0xFX0ZNIiwiUk9MRV9VU0VSIiwiUk9MRV9QUk0iLCJST0xFX01FTUJFUl9JTlZJVEFUSU9OIiwiUk9MRV9DSEFOTkVMX0FEQVBURVIiLCJST0xFX0ZBU1MiLCJST0xFX0lCQ0FSRF9QTEFUSU5PIiwiUk9MRV9BR0xfQ1JFRElUX1RSQU5TQUNUSU9OIiwiUk9MRV9TUlYiXX0sInJlc291cmNlX2FjY2VzcyI6e30sIm5hbWUiOiIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIwMDAwMDAwNzYwMDkxOSJ9.Dl9Pu6PA0ahaY5MB856DiRSE69Wn--9DovPEWszsB2yT-ZRGHv1Gk01IscBDhBz38tz-JwwyN-XmI4yB_M4OSD2vpbKett4pWceYqBekT16G6l3Z9y5r7jwUuNb_UR5QKiiAZrbr-WuY75ru0jq4VuHAUP7AMf9jb7ZCCa_LR8N9nQhehHoCinVa4H0esp56NQ-PasH6EPM0ePOkdrmnkYNE4nY9Ivh9s1rFaTbvmRDLoAKW7hnZ3QBHMF-7j-b0O5un0qQoqv4oRsVlfGK3rIAVQMe3EOP5aWrcPpDB8g_V8djsa_Nc-u2n47zSrpCnyERxz8vTuMsJuEMr2LyxRQ'
    );
    cy.setCookie('IBERIACOM_SSO_ACCESS_SALESFORCE', Cypress.env('salesforceAccessToken'));
    cy.setCookie('IBERIACOM_SSO_REFRESH_SALESFORCE', Cypress.env('salesforceRefreshToken'));
    cy.setCookie('IBERIACOM_SSO_ACCESS_TO_SALESFORCE', '13/12/2116 19:26');
    cy.setCookie('IBERIACOM_SSO_REFRESH_TO_SALESFORCE', '13/12/2116 19:26');

    cy.window().then((win) => {
        sessionStorage.setItem('retrieveMemberDetailV2', JSON.stringify(require('cypress/fixtures/loggin/retrieve-member-detail-v2.json')));
        // sessionStorage.setItem('APP_USER_INFO', '{"appUserInfo":{"logged":true,"userType":"IB_PLUS","permanentUser":false,"avios":8471258,"tierLevel":"PLATINO","frequentFlyer":"00000007600919"},"personalInfo":{"name":"Pankaj","surname":"Tailor","gender":"Male","email":"foo@foo.bar"}}');
        sessionStorage.setItem('ib-check-in-app.loginSF', '00D0C0000000tjg!ARkAQOduI7OcnSvtUOKEj_qlQb.6FcnMTIB4tx.CBS1GvPnlw52TUAw9uDjfbHu7e6_Up6DAPct9GiVzMDnoJGYZ_Tx4Dv4e');
        sessionStorage.setItem('ib-check-in-app.FFUser', '00000008438798');
        sessionStorage.setItem(
            'ib-check-in-app.loggedToken',
            Cypress.env('salesforceLoggedToken')
        );
        sessionStorage.setItem('ib-check-in-app.userLogged', 'true');
        sessionStorage.setItem('ib-check-in-app.IberiaUserType', '"ROLE_IBERIA_PLUS"');
        // sessionStorage.setItem('ib-check-in-app.customerData', '{"generalInfo":{"category":"INFINITA","avios":7690932,"aviosTransformed":"7.690.932","hashEID":"4a882d12aec5bbcdc18dccfe54fcc5b1b8a954f488b9bd4e5cf74f9587a36171"},"personalInfo":{"ibPlusNumber":"00000008438798","name":"Atul","surname1":"Singh P","surname2":"","gender":"Female","contactEmail":"qaloya.l.t.y1@gmail.com","telecomAddresses":{},"alarms":[{"number":1,"params":["25"]},{"number":5,"params":["DEVOLUCIONES DE CORREO","20/02/2020"]},{"number":7,"params":[]}]},"beneficiaries":{"ibPlusNumber":"00000008438798"},"largeFamilyInfo":{"category":null,"docNumber":null,"zipCode":null},"residentInfo":{"area":-1},"acceptedTermsAndConditions":false,"otherStatuses":{"isRedemptionEnabled":true},"partners":[]}');
        // sessionStorage.setItem('ib-check-in-app.contactData', '{"contactEmail":"foo@foo.bar","contactPhone":"625166563","contactPrefix":"44"}');
        // sessionStorage.setItem('ib-check-in-app.contactDetails', '{"email":"foo@foo.bar","phone":{"prefix":"44","number":"625166563"},"countryCode":"GB","address":{"street":"14 WHEATLEY DRIVE","streetNumber":"11","apartment":"21"},"city":"","postalCode":"WF148NW","province":"Aragón","additionalInfo":""}');
    });
});

Cypress.Commands.add('ancillariesPageController', (params: CkiancLandingParams) => {
    const ancSeat = (params: SeatParams) => {
        cy.logBeautiful('Ancillaries Seat');
        cy.scrollTo(0, 0);

        if (params && params.clickOpenSeatMap) cy.get('ib-seat-map-box .ib-button--default-normal').click({ force: true });

        params.idsSeatSelected.forEach((idSeat: string) => {
            cy.get(`#${idSeat}`).click({ force: true });
            cy.get('.ib-button.ib-button--w-medium.u-float-right').eq(0).click();
        });

        cy.validateProcessAndStepGA4('MOSEAT');
        cy.get('.ib-button.ib-button--large.u-float-right').eq(0).click();
    };
    const ancBaggages = () => {
        const btnAdd15kg =
            'div.ib-modal-with-footer__body>div:nth-child(1)>div:nth-child(2)>fieldset>div>div>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>button:nth-child(3)';
        cy.logBeautiful('Ancillaries Baggages');
        cy.scrollTo(0, 0);
        cy.get('#OPEN_BAGGAGES').click();
        cy.get(btnAdd15kg).click();
        cy.get('button.ib-button--large').click();
        cy.validateProcessAndStepGA4('MOBAGG');
    };

    cy.logBeautiful('ckianc Landing');
    // Ancillaries Seat
    if (params && params.addSeat) ancSeat(params.addSeat);

    // Ancillaries BAGGAGES
    if (params && params.addBaggages) ancBaggages();

    // Exit landing ckianc
    cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();
});

Cypress.Commands.add('interceptServices', (params: InterceptServicesParams) => {
    const interceptServices = (services: Service[]) => {
        services.forEach(({ file, statics, request, endpoint }) => {
            if (statics) {
                cy.intercept(request, `**/${endpoint}`, { fixture: `statics/${file}.json` });
            } else if (file) {
                cy.intercept(request, `**/${endpoint}`, { fixture: `${params.nameFlow}/${file}.json` });
            } else {
                cy.intercept(request, `**/${endpoint}`, { statusCode: 200 });
            }
        });
    };

    if (params.logged) interceptServices(CommandsConstants.logginServices);
    if (params.payment) interceptServices(CommandsConstants.paymentServices);
});

Cypress.Commands.add('upgradeController', () => {
    const title = '.ib-heading--type-2';
    const btn = '#cki-upgrade-upgrading-continue-btn';

    cy.logBeautiful('ckianc Landing');
    cy.get(title).as('title_upgradeController').click();
    cy.get(btn).click();
});

Cypress.Commands.add('logBeautiful', (message: string) => {
    cy.log(`===================================`);
    cy.log(`${message}`);
    cy.log(`===================================`);
});

Cypress.Commands.add('flightsPassengerDesController', (isAllPassengers?: boolean) => {
    cy.logBeautiful('uncoac Landing');
    cy.wait('@srvEmergency').then(() => {
        const title = '.ib-layout__header > .ib-heading';
        const checkSegment = '.ib-ticket__footer-wrapper > .ib-check > .ib-check__label';
        const checkAllPassenger = '.col-md-5 > .ib-check > .ib-check__label';
        const checkFirstPassenger = 'ib-passenger-deinvoicing-info#cki-flights-des-invoice-passenger-deinvoicing-info-0>div>div>div>div>div>div>label';
        const btn = '#cki-flights-des-invoice-manage-deinvoicing-btn';
        const titleModal = '.ib-layout__line-spacing > .ib-heading';
        const btnModal = '#cki-flights-des-invoice-modal-deinvoicing-alert-accept-btn';
        const titleAlertOK = '.ib-box-mini-alert__txt';
        const btnFinish = '#cki-flights-des-invoice-finish-btn';

        cy.scrollTo(0, 0);
        cy.get(title).should('be.visible').as('DE_INVOICING_AVAILABLE_FLIGHTS');
        cy.get(checkSegment).should('be.visible').click().as('select_segment');
        if (isAllPassengers) cy.get(checkAllPassenger).should('be.visible').click().as('select_all_passenger');
        else cy.get(checkFirstPassenger).should('be.visible').click().as('select_first_passenger');
        cy.get(btn).should('be.visible').click();

        // Modal
        cy.get(titleModal).should('be.visible').as('DE_INVOICING_MODAL_ALERT_TITLE');
        cy.get(btnModal).should('be.visible').click();

        // confirmation
        cy.get(titleAlertOK).should('be.visible').as('DE_INVOICING_PROCESS_OK');
        cy.get(btnFinish).should('be.visible').click();
    });
});

Cypress.Commands.add('checkUntilLoadingGone', (callback) => {
    cy.get('body').then(($body) => {
        if ($body.find('figure.ib-img-loading').length > 0) {
            cy.wait(500);
            cy.checkUntilLoadingGone(callback);
        } else {
            callback();
        }
    });
});

Cypress.Commands.add('ibCheckinApisComponent', (params?: IbCheckinApisParams) => {
    const selectDate = (dataTestId: string, value: { day: string; month: string; year: string }) => {
        cy.get(`[data-testid="${dataTestId}-day"]`).click({ force: true }).type(`${value.day}{enter}`);
        cy.get(`[data-testid="${dataTestId}-month"]`).click({ force: true }).type(`${value.month}{enter}`);
        cy.get(`[data-testid="${dataTestId}-year"]`).click({ force: true }).type(`${value.year}{enter}`);
    };
    cy.logBeautiful('ibCheckinApisComponent');

    cy.wait(500);
    const isApisUSA: boolean = params && params.isApisUSA;
    const emergencyRequired: boolean = params && params.emergencyRequired;
    const passengerApisInfo = mockPassengerApisInfo(isApisUSA);
    const isMultiPassengers: boolean = passengerApisInfo.length > 1;

    cy.get('#MODAL_TRAVEL_REQUIREMENTS').should('be.visible');
    cy.get('[data-testid="primary-button"]').click({ force: true });

    /*passengerApisInfo.forEach((passenger) => {
        // Personal Data
        cy.get('input[name="personalData.name"]').type(passenger.name, { force: true });
        cy.get('input[name="personalData.surname"]').type(passenger.surname, { force: true });

        // BirthDate
        selectDate('personalData.birthDate', passenger.birthday);

        cy.get('[data-testid="personalData.nationality"]').click({ force: true }).type(`${passenger.nationality}{enter}`);
        cy.get('[data-testid="personalData.country"]').click({ force: true }).type(`${passenger.country}{enter}`);
        cy.get(`[data-testid="personalData.gender-${passenger.gender.toUpperCase()}"]`).click({ force: true });

        // Document Required
        cy.get('[data-testid="documentationRequired.mandatory.issuerCountry"]').click({ force: true }).type(`${passenger.document.emissionCountry}{enter}`);
        cy.get('[data-testid="documentationRequired.mandatory.type"]').click({ force: true }).type(`${passenger.document.type}{enter}`);
        cy.get('input[name="documentationRequired.mandatory.number"]').type(passenger.document.number, { force: true });
        selectDate('documentationRequired.mandatory.expiryDate', passenger.document.expirationDate);

        // Addres destinations
        if (isApisUSA) {
            cy.get('input[name="passengerAddress.address"]').type(passenger.destinationUSA.address, { force: true });
            cy.get('input[name="passengerAddress.zipCode"]').type(passenger.destinationUSA.zipCode, { force: true });
            cy.get('input[name="passengerAddress.city"]').type(passenger.destinationUSA.city, { force: true });
            cy.get('[data-testid="passengerAddress.state"]').click({ force: true }).type(`${passenger.destinationUSA.state}{enter}`);
        }

        // Contact Data
        cy.get('[data-testid="contactData.additionalInfo.phone"]').click({ force: true }).type(`${passenger.prefixLabel}{enter}`);
        cy.get('input[name="contactData.additionalInfo.number"]').type(passenger.phone, { force: true });
        cy.get('input[name="contactData.additionalInfo.email"]').type(passenger.email, { force: true });

        // Emergency data
        if (emergencyRequired) {
            cy.get('[data-testid="contactData.emergencyInfo.phone"]').click({ force: true }).type(`${passenger.prefixLabel}{enter}`);
            cy.get('input[name="contactData.emergencyInfo.number"]').type(passenger.phone, { force: true });
            cy.get('input[name="contactData.emergencyInfo.name"]').type(passenger.name, { force: true });
        }

        //CheckBoxs
        if (isApisUSA) cy.get('input[name="checkbox.usPrivacyEmergencyData"]').click({ force: true });
        cy.get('input[name="checkbox.confirmEmergencyData"]').click({ force: true });

        // Button Submit form
        cy.get('[data-testid="apis-form-submit"]').then(($btn) => {
            if (!$btn.is(':disabled')) {
                cy.wrap($btn).click();
            }
        });
    });


    // Button next flow
    if (isMultiPassengers) {
        cy.wait('@putAdditionalInfo').then(() => {
            cy.get('[data-testid="button-continue-flow"]').then(($btn) => {
                if (!$btn.is(':disabled')) {
                    cy.wait(1000);
                    cy.wrap($btn).click();
                }
            });
        });
    }*/
});
