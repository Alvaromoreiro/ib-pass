import { requiredCypressEnv } from '../../support/requiredCypressEnv';
describe('Test - PA', () => {

    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/cs/Satellite**', {statusCode: 200});
        cy.intercept('POST', '**/rb_bf68025iux**', { statusCode: 200 });
        cy.intercept('POST', '**/api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/market/commercialsellingdata', {fixture: 'commercialsellingdata.json'});
        cy.intercept('POST', '**/sse-avm/rs/v2/fare/shuttle', {fixture: 'shuttle-two-passengers.json'});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/flight-calculation', {fixture: 'flight-calculation.json'});
        cy.intercept('POST', '**/framework-services/rs/commons/v1/co2/getFootPrint', { statusCode: 200 });

        cy.intercept('GET', '**/iberia-web-content/literales/booking/es.json', {fixture: 'literals/booking-es.json'});
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', {fixture: 'literals/general-es.json'});
        cy.intercept('GET', '**/iberia-web-content/links/booking/es.json', {fixture: 'links/booking-es.json'});
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', {fixture: 'links/general-es.json'});

        cy.intercept('POST', '**/IbIdentity/IDY_LoginInit', { statusCode: 200 });
        cy.intercept('POST', '**/NetworkTrackingServlet', { statusCode: 204 });

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', {fixture: 'phone-codes.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', {fixture: 'country.json'});
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', {fixture: 'companies.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVACIBP/gdpr', {fixture: 'gdpr.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVAC/gdpr', {fixture: 'gdpr.json'});
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', {fixture: 'security.json'});
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01&passengerId=ADULT_02', {fixture: 'security-two-passengers.json'});
        cy.intercept('POST', '**/sse-orm/rs/v5/abandoned-shoppingCart/verifyMail', {fixture: 'verify-mail.json'});

        cy.intercept('POST', '**/sse-orm/rs/v2/order', {fixture: 'order.json'});
        cy.intercept('GET', '**/prlm-mbm/rs/v2/members/contact_details', {fixture: 'contact_details.json'});
        cy.intercept('GET', '**/cust-cust/rs/v1/travel_preferences', {fixture: 'travel_preferences.json'});
        cy.intercept('GET', '**/prlm-asm/rs/v1/members/**/associates', {fixture: 'associates.json'});
        cy.intercept('GET', '**/pzmm-mbm/rs/v1/members/personal_data', { statusCode: 200 });
        cy.intercept('GET', '**/cust-cust/rs/v1/avatar', { statusCode: 200 });

        cy.intercept('GET', '**/iberia-web-content/iconos/payment/creditcardlogo.json', {fixture: 'icons/creditcardlogo.json'});
        cy.intercept('GET', '**/cdn.nemuru.com/pricings/**', {fixture: 'pricing.json'});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', {fixture: 'states.json'});
        cy.intercept('GET', '**/payment-methods', {fixture: 'payment-methods.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FPIBTASA/gcwcs/?retrieveHTML=yes', {fixture: 'gcwcs.json'});
        cy.intercept('GET', '**/available-donations/**', {fixture: 'available-donations.json'});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/areas/destination', {fixture: 'areas_destination.json'});

        cy.intercept('PUT', '**/credit-card', {fixture: 'credit-card.json'});
        cy.intercept('GET', '**/iberia-web-content/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });

        cy.intercept('POST', '**/sse-orm/rs/v3/issue', {fixture: 'issue.json'});
        cy.intercept('PUT', '**/cust-cust/rs/v2/newsletter', {fixture: 'newsletter.json'});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', {fixture: 'summary-calculation.json'});

        cy.intercept('POST', '**/creditCardFee', {fixture: 'creditcardfee.json'});
        cy.intercept('POST', '**/creditCardBin', {fixture: 'creditcardbin.json'});
        cy.intercept('GET', '**/cust-cust/rs/v3/customer/credit_card**', {fixture: 'credit-card-redemption.json'});
        cy.intercept('POST', '**/pmt-ppm/rs/ppm/v7/creditcards/fee', {fixture: 'fee-redemption.json'});

        cy.intercept('GET', '**/build-recoglobick-activities/**', { statusCode: 200 });
        cy.intercept('GET', '**/build-recoglobick-transfers/**', { statusCode: 200 });
        cy.intercept('POST', '**/payment-methods-info', { fixture: 'payment-methods-info.json'});

        sessionStorage.setItem('ib-booking-app.sendDatalayerEcommerce', 'true');
    });

    it('return and two adults', () => {

        let datalayerGeneralExpected;
        let digitalDataExpected;

        cy.visit(`${Cypress.env('url')}?quadrigam=PAHMPA&market=ES&language=es&BEGIN_CITY_01=MAD&TRIP_TYPE=2&FARE_TYPE=E&FARE_TYPE_END=E&BEGIN_DAY_01=&BEGIN_MONTH_01=&BEGIN_YEAR_01=&END_DAY_01=&END_MONTH_01=&END_YEAR_01=&ADT=2&boton=Ver+Tarifa#!/ibshuttle`);

        cy.scrollTo(0, 0);
        cy.validateDataLayerInformation({quadrigam:'PAFARE', proceso: 'puente aereo', paso: 'disponibilidad'});
        cy.validateDigitalDataInformation({Quadrigam: 'PAFARE', Process: 'puente aereo', Step: 'disponibilidad'});
        cy.get('#SHUTTLE_TOTAL_PRICE_DETAIL_BTN').click();

        cy.scrollTo(0, 0);
        cy.get('#bbki-passenger-info-passenger-form-0');
        cy.get('#name_0').click('top').type('test');
        cy.get('#first_surname_0').click('top').type('test');
        cy.get('#name_1').click('top').type('test');
        cy.get('#first_surname_1').click('top').type('testuno');
        cy.get('#bbki-passenger-info-passengers-contact-form');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.validateDataLayerInformation({quadrigam:'PAAIRP', proceso: 'puente aereo', paso: 'pasajeros'});
        cy.validateDigitalDataInformation({Quadrigam: 'PAAIRP', Process: 'puente aereo', Step: 'pasajeros'});
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4012999999999999');
        cy.get('#name').click('top').type('test');
        cy.get('#surnames').click('top').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-0').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-1').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.validateDataLayerInformation({quadrigam:'PAPURC', proceso: 'puente aereo', paso: 'pago'});
        cy.validateDigitalDataInformation({Quadrigam: 'PAPURC', Process: 'puente aereo', Step: 'pago'});
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0);
        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});

        cy.fixture('datalayer-objects/pa/datalayer-confirmation').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/pa/digital-data-confirmation').then(digital_data => {
            digitalDataExpected = digital_data;
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
        cy.validateDataLayerInformation({quadrigam:'PABKCF', proceso: 'puente aereo', paso: 'confirmacion'});
        cy.validateDigitalDataInformation({Quadrigam: 'PABKCF', Process: 'puente aereo', Step: 'confirmacion'});
    });
    it('return, two adults and user is logged', () => {

        let datalayerGeneralExpected;
        let digitalDataExpected;

        cy.setCookie('IBERIACOM_SSO_TYPE', 'IBPLUS');
        cy.setCookie('IBERIACOM_SSO_REFRESH', requiredCypressEnv('IBERIACOM_SSO_REFRESH'));
        cy.setCookie('IBERIACOM_SSO_ACCESS_TO', '13/12/2116 19:26');
        cy.setCookie('IBERIACOM_SSO_REFRESH_TO', '13/12/2116 19:26');
        cy.setCookie('IBERIACOM_SSO_ACCESS', requiredCypressEnv('IBERIACOM_SSO_ACCESS'));
        cy.setCookie('IBERIACOM_SSO_ACCESS_SALESFORCE', requiredCypressEnv('IBERIACOM_SSO_ACCESS_SALESFORCE'));
        cy.setCookie('IBERIACOM_SSO_REFRESH_SALESFORCE', requiredCypressEnv('IBERIACOM_SSO_REFRESH_SALESFORCE'));
        cy.setCookie('IBERIACOM_SSO_ACCESS_TO_SALESFORCE', '13/12/2116 19:26');
        cy.setCookie('IBERIACOM_SSO_REFRESH_TO_SALESFORCE', '13/12/2116 19:26');
        cy.window().then( win => {
            sessionStorage.setItem('retrieveMemberDetailV2', JSON.stringify(require('cypress/fixtures/retrieve-member-detail-v2.json')));
            sessionStorage.setItem('accessTokenSalesforce', JSON.stringify(requiredCypressEnv('SALESFORCE_ACCESS_TOKEN')));
            sessionStorage.setItem('APP_USER_INFO', '{"appUserInfo":{"logged":true,"userType":"IB_PLUS","permanentUser":false,"avios":8471258,"tierLevel":"PLATINO","frequentFlyer":"TEST-USER-001"},"personalInfo":{"name":"Test","surname":"User","gender":"Male","email":"test@example.com"}}');
            sessionStorage.setItem('ib-booking-app.loginSF', requiredCypressEnv('SALESFORCE_LOGIN_TOKEN'));
            sessionStorage.setItem('ib-booking-app.FFUser', '00000007600919');
            sessionStorage.setItem('ib-booking-app.loggedToken', JSON.stringify(requiredCypressEnv('SALESFORCE_LOGGED_TOKEN')));
            sessionStorage.setItem('ib-booking-app.userLogged', 'true');
            sessionStorage.setItem('ib-booking-app.IberiaUserType', '"ROLE_IBERIA_PLUS"');
            sessionStorage.setItem('ib-booking-app.customerData', '{"generalInfo":{"category":"PLATINO","avios":8471258,"aviosTransformed":"8.471.258","hashEID":"test-hash"},"personalInfo":{"ibPlusNumber":"TEST-USER-001","name":"Test","surname1":"User","gender":"Male","contactEmail":"test@example.com","telecomAddresses":{},"alarms":[{"number":1,"params":["25"]},{"number":5,"params":["DEVOLUCIONES DE CORREO","20/02/2020"]},{"number":7,"params":[]}],"applyPartersDiscounts":true,"partnersInfoBKI":[]},"beneficiaries":{"ibPlusNumber":"TEST-USER-001"},"largeFamilyInfo":{"category":null,"docNumber":null,"zipCode":"00000"},"residentInfo":{"area":-1},"acceptedTermsAndConditions":false,"otherStatuses":{"isRedemptionEnabled":true},"partners":[]}');
            sessionStorage.setItem('ib-booking-app.contactData', '{"contactEmail":"test@example.com","contactPhone":"0000000000","contactPrefix":"44"}');
            sessionStorage.setItem('ib-booking-app.contactDetails', '{"email":"test@example.com","phone":{"prefix":"44","number":"0000000000"},"countryCode":"GB","address":{"street":"1 Test Street","streetNumber":"11","apartment":"21"},"city":"Test City","postalCode":"00000","province":"Aragón","additionalInfo":""}');
        });
        cy.visit(`${Cypress.env('url')}?quadrigam=PAHMPA&market=ES&language=es&BEGIN_CITY_01=MAD&TRIP_TYPE=2&FARE_TYPE=E&FARE_TYPE_END=E&BEGIN_DAY_01=&BEGIN_MONTH_01=&BEGIN_YEAR_01=&END_DAY_01=&END_MONTH_01=&END_YEAR_01=&ADT=2  &boton=Ver+Tarifa#!/ibshuttle`);

        cy.scrollTo(0, 0);
        cy.get('#SHUTTLE_TOTAL_PRICE_DETAIL_BTN').click();

        cy.scrollTo(0, 0);
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-1').click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-radio__text.ib-radio__text--payment-form.ng-binding').eq(1).click('center');
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4012999999999999');
        cy.get('#name').click('top').type('test');
        cy.get('#surnames').click('top').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-2-0').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-3-1').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0);
        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});

        cy.fixture('datalayer-objects/pa/datalayer-confirmation-logged').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/pa/digital-data-confirmation-logged').then(digital_data => {
            digitalDataExpected = digital_data;
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
    });
    it('one way and one passenger', () => {
        cy.intercept('POST', '**/sse-avm/rs/v2/fare/shuttle', {fixture: 'shuttle.json'});
        cy.visit(`${Cypress.env('url')}?quadrigam=PAHMPA&market=ES&language=es&BEGIN_CITY_01=MAD&TRIP_TYPE=2&FARE_TYPE=E&FARE_TYPE_END=E&BEGIN_DAY_01=&BEGIN_MONTH_01=&BEGIN_YEAR_01=&END_DAY_01=&END_MONTH_01=&END_YEAR_01=&ADT=1&boton=Ver+Tarifa#!/ibshuttle`);

        cy.scrollTo(0, 0);
        cy.get('#SHUTTLE_TOTAL_PRICE_DETAIL_BTN').click();

        cy.scrollTo(0, 0);
        cy.get('#name_0').click('top').type('test');
        cy.get('#first_surname_0').click('top').type('test');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4012999999999999');
        cy.get('#name').click('top').type('test');
        cy.get('#surnames').click('top').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-0').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-1').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0);
        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});
    });
});
