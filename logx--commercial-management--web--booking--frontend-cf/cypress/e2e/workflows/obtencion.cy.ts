import { requiredCypressEnv } from '../../support/requiredCypressEnv';
describe('Test - obtencion', () => {
    let getTimeDifference = ():string =>{
        const buyingDate = '2024-12-22T00:07:00.000Z';
        return Math.round((new Date(buyingDate).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)).toString();
    };
    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/cities/destination', { fixture: 'cities_destination.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/market/commercialsellingdata', { fixture: 'commercialsellingdata.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/areas/destination', { fixture: 'areas_destination.json' });

        cy.intercept('GET', '**/iberia-web-content/literales/booking/es.json', { fixture: 'literals/booking-es.json' });
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'literals/general-es.json' });
        cy.intercept('GET', '**/iberia-web-content/links/booking/es.json', { fixture: 'links/booking-es.json' });
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'links/general-es.json' });

        cy.intercept('GET', '**/cs/Satellite?pagename=IB_SE_Services&service=getContact&code=RESERVAS&market=ES&locale=es', { fixture: 'satellite.json' });
        cy.intercept('POST', '**/api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
        cy.intercept('POST', '**token/salesforce**', { statusCode: 200 });
        cy.intercept('POST', '**c.riskified.com/v2/client_infos', { statusCode: 201 });
        cy.intercept('PUT', '**/api/v1/management/**', { statusCode: 200 });

        cy.intercept('GET', '**/iberia-web-content/imagenes/background/backgrounds.json', { fixture: 'images/backgrounds.json' });
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'icons/aerolineas.json' });

        cy.intercept('POST', '**/sse-avm/rs/v2/fare', { fixture: 'fare-four-passengers.json' });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/flight-calculation', { fixture: 'flight-calculation.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'phone-codes.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'country.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: 'companies.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVACIBP/gdpr', { fixture: 'gdpr.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVAC/gdpr', { fixture: 'gdpr.json' });
        cy.intercept('POST', '**/sse-orm/rs/v5/abandoned-shoppingCart/verifyMail', { fixture: 'verify-mail.json' });

        cy.intercept('GET', '**/prlm-mbm/rs/v2/members/contact_details', {fixture: 'contact_details.json'});
        cy.intercept('GET', '**/cust-cust/rs/v1/travel_preferences', {fixture: 'travel_preferences.json'});
        cy.intercept('GET', '**/prlm-asm/rs/v1/members/**/associates', {fixture: 'associates.json'});
        cy.intercept('GET', '**/pzmm-mbm/rs/v1/members/personal_data', { statusCode: 200 });
        cy.intercept('GET', '**/cust-cust/rs/v1/avatar', { statusCode: 200 });

        cy.intercept('GET', '**/v1/bundles/availability/**', { statusCode: 200 });
        cy.intercept('GET', '**/v1/ibv/availability/**', { statusCode: 200 });
        cy.intercept('POST', '**/rb_bf68025iux**', { statusCode: 200 });

        cy.intercept('POST', '**/sse-orm/rs/v2/order', { fixture: 'order.json' });
        cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries(\/?\?.*)?/, { fixture: 'ancillaries.json' });
        cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries-summary(\/?\?.*)?/, { fixture: 'ancillaries-summary.json' });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', { fixture: 'summary-calculation.json' });
        cy.intercept('GET', '**/api/sea-cism/rs/cism/v4/**/seatmapLayout', { fixture: 'seat-map-layout.json' });

        cy.intercept('GET', '**/iberia-web-content/iconos/payment/creditcardlogo.json', { fixture: 'icons/creditcardlogo.json' });
        cy.intercept('GET', '**/cdn.nemuru.com/pricings/**', { fixture: 'pricing.json' });
        cy.intercept('GET', '**/cust-cust/rs/v3/customer/credit_card**', {fixture: 'credit-card-redemption.json'});
        cy.intercept('POST', '**/pmt-ppm/rs/ppm/v7/creditcards/fee', {fixture: 'fee-redemption.json'});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'states.json' });
        cy.intercept('GET', '**/payment-methods', { fixture: 'payment-methods.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FPIBTASA/gcwcs/?retrieveHTML=yes', { fixture: 'gcwcs.json' });
        cy.intercept('GET', '**/available-donations/**', { fixture: 'available-donations.json' });

        cy.intercept('PUT', '**/credit-card', { fixture: 'credit-card.json' });
        cy.intercept('GET', '**/iberia-web-content/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });

        cy.intercept('POST', '**/sse-orm/rs/v3/issue', { fixture: 'issue.json' });
        cy.intercept('PUT', '**/cust-cust/rs/v2/newsletter', { fixture: 'newsletter.json' });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', { fixture: 'summary-calculation.json' });

        cy.intercept('POST', '**/creditCardFee', { fixture: 'creditcardfee.json' });
        cy.intercept('POST', '**/creditCardBin', { fixture: 'creditcardbin.json' });

        cy.intercept('GET', '**/build-recoglobick-activities/**', { statusCode: 200 });
        cy.intercept('GET', '**/build-recoglobick-transfers/**', { statusCode: 200 });
        cy.intercept('POST', '**/identity-digitalboarding.cs81.force.com/**', { statusCode: 200 });
        cy.intercept('GET', '**/load_times**', { statusCode: 200 });
        cy.intercept('POST', '**/payment-methods-info', { fixture: 'payment-methods-info.json'});

        sessionStorage.setItem('ib-booking-app.sendDatalayerEcommerce', 'true');

        // COOKIES
        // cy.get('#onetrust-accept-btn-handler').contains('Aceptar todas las cookies').click()

        // BUY WITH FLEXIBILITY
        // cy.get('.lc-a21-details-btn-shr').contains('Ocultar').wait(1000).click()
    });

    it('return and two adults, one child and one infant', () => {
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01&passengerId=ADULT_02&passengerId=CHILD_01&passengerId=INFANT_01', { fixture: 'security-four-passengers.json' });
        let datalayerGeneralExpected;
        let digitalDataExpected;
        cy.intercept('POST', '**/sse-avm/rs/v2/calendar/ribbon', { fixture: 'ribbon-return.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/availability', { fixture: 'availability-return.json' });

        cy.visit(`${Cypress.env('url')}?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BCN&nombreOrigen=Madrid&nombreDestino=Barcelona&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR_01=2024&END_DAY_01=29&END_MONTH_01=202412&END_YEAR_01=2024&FARE_TYPE=R&quadrigam=IBHMPA&ADT=2&CHD=1&INF=1&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Search&bookingMarket=ES#!/availability`);
        cy.scrollTo(0, 0);
        cy.validateDataLayerInformation({quadrigam:'IBOWFS', proceso: 'booking', paso: 'disponibilidad'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBOWFS', Process: 'booking', Step: 'disponibilidad'});
        cy.get('#bbki-ib-box-mini-fare-0-0-B').first().click();
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click().wait(500);
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.checkDataLayerEvent({event:'add_to_cart'});

        cy.scrollTo(0, 0);
        cy.get('#bbki-passenger-info-passenger-form-0');
        cy.get('#name_0').click('top').type('test');
        cy.get('#first_surname_0').click('top').type('test');
        cy.get('#name_1').click('top').type('test');
        cy.get('#first_surname_1').click('top').type('testuno');
        cy.get('#name_2').click('top').type('test');
        cy.get('#first_surname_2').click('top').type('testdos');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-3-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(2).click();
        cy.get('#ui-select-choices-row-4-9').click();
        cy.get('#name_3').click('top').type('test');
        cy.get('#first_surname_3').click('top').type('testtres');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(3).click();
        cy.get('#ui-select-choices-row-5-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(4).click();
        cy.get('#ui-select-choices-row-6-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(5).click();
        cy.get('#ui-select-choices-row-7-1').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(6).click();
        cy.get('#ui-select-choices-row-1-0').click();
        cy.get('#bbki-passenger-info-passengers-contact-form');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.validateDataLayerInformation({quadrigam:'IBAIRP', proceso: 'booking', paso: 'pasajeros'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBAIRP', Process: 'booking', Step: 'pasajeros'});
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0).wait(1000);
        cy.validateDataLayerInformation({quadrigam:'IBCMTV', codigoSeguimiento:'es/ES/IBCMTV', proceso: 'booking', paso: 'ancillaries'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBCMTV', TrackingCode: 'es/ES/IBCMTV', Process: 'booking', Step: 'ancillaries'});
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0).wait(1000);
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateDataLayerInformation({quadrigam:'IBPURC', proceso: 'booking', paso: 'pago'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBPURC', Process: 'booking', Step: 'pago'});
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4012999999999999');
        cy.get('#name').click('top').type('test');
        cy.get('#surnames').click('top').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-8-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-9-1').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click();

        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});
        cy.fixture('datalayer-objects/obtencion/datalayer-confirmation').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            datalayerGeneralExpected.antelacionCompra = getTimeDifference();
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/obtencion/digital-data-confirmation').then(digital_data => {
            digitalDataExpected = digital_data;
            digitalDataExpected.AdvancePurchase = getTimeDifference();
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
    });
    it('return and two adults and one infant, add ancillaries', () => {
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01&passengerId=ADULT_02&passengerId=CHILD_01&passengerId=INFANT_01', { fixture: 'security-four-passengers.json' });
        let datalayerGeneralExpected;
        let digitalDataExpected;
        cy.window().then( () => {
            sessionStorage.setItem('ib-booking-app.seatsAvailableSegments', JSON.stringify(['IB300620240714']));
            sessionStorage.setItem('ib-booking-app.seatMapSegment', JSON.stringify({segmentId: 'IB300620240714', pasId: 'ADULT_01'}));
            sessionStorage.setItem('ib-booking-app.passengersSelected', JSON.stringify(['ADULT_01']));
        });
        cy.intercept('POST', '**/sse-avm/rs/v2/calendar/ribbon', { fixture: 'ribbon-return.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/availability', { fixture: 'availability-return.json' });

        cy.visit(`${Cypress.env('url')}?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BCN&nombreOrigen=Madrid&nombreDestino=Barcelona&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR_01=2024&END_DAY_01=29&END_MONTH_01=202412&END_YEAR_01=2024&FARE_TYPE=R&quadrigam=IBHMPA&ADT=2&CHD=1&INF=1&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Search&bookingMarket=ES#!/availability`);
        cy.scrollTo(0, 0);
        cy.validateDataLayerInformation({quadrigam:'IBOWFS', proceso: 'booking', paso: 'disponibilidad'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBOWFS', Process: 'booking', Step: 'disponibilidad'});
        cy.get('#bbki-ib-box-mini-fare-0-0-B').first().click();
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click().wait(200);
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.checkDataLayerEvent({event:'add_to_cart'});

        cy.scrollTo(0, 0);
        cy.get('#bbki-passenger-info-passenger-form-0');
        cy.get('#name_0').click('top').type('test');
        cy.get('#first_surname_0').click('top').type('test');
        cy.get('#name_1').click('top').type('test');
        cy.get('#first_surname_1').click('top').type('testuno');
        cy.get('#name_2').click('top').type('test');
        cy.get('#first_surname_2').click('top').type('testdos');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-3-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(2).click();
        cy.get('#ui-select-choices-row-4-9').click();
        cy.get('#name_3').click('top').type('test');
        cy.get('#first_surname_3').click('top').type('testtres');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(3).click();
        cy.get('#ui-select-choices-row-5-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(4).click();
        cy.get('#ui-select-choices-row-6-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(5).click();
        cy.get('#ui-select-choices-row-7-1').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(6).click();
        cy.get('#ui-select-choices-row-1-0').click();
        cy.get('#bbki-passenger-info-passengers-contact-form');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.validateDataLayerInformation({quadrigam:'IBAIRP', proceso: 'booking', paso: 'pasajeros'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBAIRP', Process: 'booking', Step: 'pasajeros'});
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0).wait(1000);
        cy.validateDataLayerInformation({quadrigam:'IBCMTV', proceso: 'booking', paso: 'ancillaries'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBCMTV', TrackingCode: 'es/ES/IBCMTV', Process: 'booking', Step: 'ancillaries'});
        cy.get('#OPEN_BAGGAGES').click();
        cy.validateDataLayerInformation({quadrigam:'MOBAGG', proceso: 'booking', paso: 'equipaje'});
        cy.validateDigitalDataInformation({Quadrigam: 'MOBAGG', Process: 'booking', Step: 'equipaje'});
        cy.get('.ib-add-bags__button.ib-add-bags__button--add').eq(0).click();
        cy.get('.ib-button.ib-button--large.u-mr-xsmall.u-float-right').eq(0).click();
        cy.get('.ib-button.ib-button--w-small.ib-button--block-xs.ib-button--default-normal').eq(1).click();
        cy.get('#cabins-1-row-15-seat-7').click({force:true});//get an alternative for "force:true"
        cy.validateDataLayerInformation({quadrigam:'MOSEAT', proceso: 'booking', paso: 'asientos'});
        cy.validateDigitalDataInformation({Quadrigam: 'MOSEAT', Process: 'booking', Step: 'asientos'});
        cy.get('.ib-button.ib-button--w-medium.u-float-right').eq(0).click();
        cy.get('.ib-button.ib-button--large.u-float-right').eq(0).click();
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateDataLayerInformation({quadrigam:'IBPURC', proceso: 'booking', paso: 'pago'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBPURC', Process: 'booking', Step: 'pago'});
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4012999999999999');
        cy.get('#name').click('top').type('test');
        cy.get('#surnames').click('top').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-8-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-9-1').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click();

        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});
        cy.fixture('datalayer-objects/obtencion/datalayer-confirmation-ancillaries').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            datalayerGeneralExpected.antelacionCompra = getTimeDifference();
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/obtencion/digital-data-confirmation-ancillaries').then(digital_data => {
            digitalDataExpected = digital_data;
            digitalDataExpected.AdvancePurchase = getTimeDifference();
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
    });
    it('return and two adults and one child and user is logged', () => {
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01&passengerId=ADULT_02&passengerId=CHILD_01', { fixture: 'security-three-passengers.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/fare', { fixture: 'fare-three-passengers.json' });

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
        let datalayerGeneralExpected;
        let digitalDataExpected;
        cy.intercept('POST', '**/sse-avm/rs/v2/calendar/ribbon', { fixture: 'ribbon-return.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/availability', { fixture: 'availability-return.json' });

        cy.visit(`${Cypress.env('url')}?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BCN&nombreOrigen=Madrid&nombreDestino=Barcelona&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR_01=2024&END_DAY_01=29&END_MONTH_01=202412&END_YEAR_01=2024&FARE_TYPE=R&quadrigam=IBHMPA&ADT=2&CHD=1&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Search&bookingMarket=ES#!/availability`);
        cy.scrollTo(0, 0);
        cy.validateDataLayerInformation({quadrigam:'IBOWFS', proceso: 'booking', paso: 'disponibilidad'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBOWFS', Process: 'booking', Step: 'disponibilidad'});
        cy.get('#bbki-ib-box-mini-fare-0-0-B').first().click();
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click().wait(200);
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.checkDataLayerEvent({event:'add_to_cart'});

        cy.scrollTo(0, 0);
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-1').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(2).click();
        cy.get('#ui-select-choices-row-3-1').click();
        cy.validateDataLayerInformation({quadrigam:'IBAIRP', proceso: 'booking', paso: 'pasajeros'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBAIRP', Process: 'booking', Step: 'pasajeros'});
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0).wait(1000);
        cy.validateDataLayerInformation({quadrigam:'IBCMTV', proceso: 'booking', paso: 'ancillaries'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBCMTV', TrackingCode: 'es/ES/IBCMTV', Process: 'booking', Step: 'ancillaries'});
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0).wait(1000);
        cy.get('.ib-radio__text.ib-radio__text--payment-form.ng-binding').eq(1).click('center');
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateDataLayerInformation({quadrigam:'IBPURC', proceso: 'booking', paso: 'pago'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBPURC', Process: 'booking', Step: 'pago'});
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4012999999999999');
        cy.get('#name').click('top').type('test');
        cy.get('#surnames').click('top').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-7-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-8-1').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click();

        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});
        cy.fixture('datalayer-objects/obtencion/datalayer-confirmation-logged').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            datalayerGeneralExpected.antelacionCompra = getTimeDifference();
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/obtencion/digital-data-confirmation-logged').then(digital_data => {
            digitalDataExpected = digital_data;
            digitalDataExpected.AdvancePurchase = getTimeDifference();
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
    });
    it('return and one passenger', () => {

        cy.intercept('POST', '**/sse-avm/rs/v2/calendar/ribbon', { fixture: 'ribbon-return.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/availability', { fixture: 'availability-return.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/fare', { fixture: 'fare.json' });
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', { fixture: 'security.json' });

        cy.visit(`${Cypress.env('url')}?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BCN&nombreOrigen=Madrid&nombreDestino=Barcelona&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR_01=2024&END_DAY_01=23&END_MONTH_01=202412&END_YEAR_01=2024&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES#!/availability`);

        cy.scrollTo(0, 0);
        cy.get('#bbki-ib-box-mini-fare-0-0-B').first().click();
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click().wait(200);
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.checkDataLayerEvent({event:'add_to_cart'});

        cy.scrollTo(0, 0);
        cy.get('#name_0').click('top').type('test');
        cy.get('#first_surname_0').click('top').type('test');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();

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

    it('one way, one passenger and one layover', () => {

        cy.intercept('POST', '**/sse-avm/rs/v2/calendar/ribbon', { fixture: 'ribbon-layover.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/availability', { fixture: 'availability-layover.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/fare', { fixture: 'fare.json' });
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', { fixture: 'security.json' });

        cy.visit(`${Cypress.env('url')}?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=1&BEGIN_CITY_01=AGP&END_CITY_01=BIO&nombreOrigen=Málaga&nombreDestino=Bilbao&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR_01=2024&END_DAY_01=&END_MONTH_01=&END_YEAR_01=&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES#!/availability`);

        cy.scrollTo(0, 0);
        cy.get('#bbki-ib-box-mini-fare-0-0-B').first().click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click().wait(200);
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.checkDataLayerEvent({event:'add_to_cart'});

        cy.scrollTo(0, 0);
        cy.get('#name_0').click('top').type('test');
        cy.get('#first_surname_0').click('top').type('test');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
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
    });

    it('return, one passenger and one layover', () => {

        cy.intercept('POST', '**/sse-avm/rs/v2/calendar/ribbon', { fixture: 'ribbon-layover-return.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/availability', { fixture: 'availability-layover-return.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/fare', { fixture: 'fare.json' });
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', { fixture: 'security.json' });

        cy.visit(`${Cypress.env('url')}?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=AGP&END_CITY_01=BIO&nombreOrigen=Málaga&nombreDestino=Bilbao&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR_01=2024&END_DAY_01=23&END_MONTH_01=202412&END_YEAR_01=2024&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES#!/availability`);

        cy.scrollTo(0, 0);
        cy.get('#bbki-ib-box-mini-fare-0-0-B').first().click();
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click().wait(200);
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.checkDataLayerEvent({event:'add_to_cart'});

        cy.scrollTo(0, 0);
        cy.get('#name_0').click('top').type('test');
        cy.get('#first_surname_0').click('top').type('test');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('top').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
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
    });
});
