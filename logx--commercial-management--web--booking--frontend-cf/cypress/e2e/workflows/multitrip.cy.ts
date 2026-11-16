import { requiredCypressEnv } from '../../support/requiredCypressEnv';
describe('Test - multitrip', () => {
    let getTimeDifference = (date:string):string =>{
        return Math.round((new Date(date).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)).toString();
    };
    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/cities/destination', { fixture: 'cities_destination.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/market/commercialsellingdata', { fixture: 'commercialsellingdata.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/areas/destination', { fixture: 'areas_destination.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/availability/complex', { fixture: 'complex.json' });
        cy.intercept('GET', '**/sse-avm/rs/v2/availability/complex/Qm9va2luZ0BHVy0xNjcyNjcxOTgyNDU5LVp3R0dm/**', { fixture: 'complex-second.json' });
        cy.intercept('GET', '**/sse-avm/rs/v2/availability/complex/Qm9va2luZ0BHVy0xNjcyNjcxOTg5MzEwLWxReDlp/**', { fixture: 'complex-third.json' });
        cy.intercept('GET', '**/sse-avm/rs/v2/availability/complex/Qm9va2luZ0BHVy0xNjcyNjcyOTQ5MTgwLXNCMXVp/**', { fixture: 'complex-fourth.json' });


        cy.intercept('GET', '**/iberia-web-content/literales/booking/es.json', { fixture: 'literals/booking-es.json' });
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'literals/general-es.json' });
        cy.intercept('GET', '**/iberia-web-content/links/booking/es.json', { fixture: 'links/booking-es.json' });
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'links/general-es.json' });
        cy.intercept('POST', '**/api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });

        cy.intercept('GET', '**/cs/Satellite**', { fixture: 'satellite.json' });
        cy.intercept('POST', '**/api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });

        cy.intercept('GET', '**/iberia-web-content/imagenes/background/backgrounds.json', { fixture: 'images/backgrounds.json' });
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'icons/aerolineas.json' });

        cy.intercept('POST', '**/sse-avm/rs/v2/fare/complex', { fixture: 'fare-complex.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/**/gdpr', {fixture: 'gdpr.json'});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/flight-calculation', { fixture: 'flight-calculation-multitrip.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'phone-codes.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'country.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: 'companies.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVAC/gdpr', { fixture: 'gdpr.json' });
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', { fixture: 'security.json' });
        cy.intercept('POST', '**/sse-orm/rs/v5/abandoned-shoppingCart/verifyMail', { fixture: 'verify-mail.json' });

        cy.intercept('GET', '**/prlm-mbm/rs/v2/members/contact_details', {fixture: 'contact_details.json'});
        cy.intercept('GET', '**/cust-cust/rs/v1/travel_preferences', {fixture: 'travel_preferences.json'});
        cy.intercept('GET', '**/prlm-asm/rs/v1/members/**/associates', {fixture: 'associates.json'});
        cy.intercept('GET', '**/pzmm-mbm/rs/v1/members/personal_data', { statusCode: 200 });
        cy.intercept('GET', '**/cust-cust/rs/v1/avatar', { statusCode: 200 });


        cy.intercept('POST', '**/rb_bf68025iux**', { statusCode: 200 });
        cy.intercept('PUT', '**/api/v1/management/**', { statusCode: 200 });
        cy.intercept('GET', '**/cust-cust/rs/v1/avatar', { statusCode: 200 });

        cy.intercept('POST', '**/sse-orm/rs/v2/order', { fixture: 'order-multitrip.json' });
        cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries(\/?\?.*)?/, { fixture: 'ancillaries-multitrip.json' });
        cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries-summary(\/?\?.*)?/, { fixture: 'ancillaries-summary-multitrip.json' });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', { fixture: 'summary-calculation-multitrip.json' });
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
        cy.intercept('POST', '**/payment-methods-info', { fixture: 'payment-methods-info.json'});
        cy.intercept('POST', '**c.riskified.com/v2/client_infos', { statusCode: 201 });
        cy.intercept('GET', '**/v1/bundles/availability/**', { statusCode: 200 });
        cy.intercept('GET', '**api/cust-cust/rs/v3/customer/marketing-permission', { statusCode: 200 });

        sessionStorage.setItem('ib-booking-app.sendDatalayerEcommerce', 'true');
    });
    it('return and two adults, one child and one infant', () => {
        let datalayerGeneralExpected;
        let digitalDataExpected;
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01&passengerId=ADULT_02&passengerId=CHILD_01&passengerId=INFANT_01', { fixture: 'security-four-passengers.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/fare/complex', { fixture: 'fare-complex-four-passengers.json' });
        cy.visit(`${Cypress.env('url')}?bookingMarket=ES&TRIP_TYPE=3&text-from2-visible=Madrid%20(MAD)&BEGIN_CITY_01=MAD&text-to2-visible=Barcelona%20(BCN)&END_CITY_01=BCN&text-date-from2=22/12/2024&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR2_01=2024&BEGIN_HOUR_01=0000&text-from3-visible=Barcelona%20(BCN)&BEGIN_CITY_02=BCN&text-to3-visible=Bilbao%20(BIO)&END_CITY_02=BIO&text-date-from3=23/12/2024&BEGIN_DAY_02=23&BEGIN_MONTH_02=202412&BEGIN_YEAR3_01=2024&BEGIN_HOUR_02=0000&text-from4-visible=Bilbao%20(BIO)&BEGIN_CITY_03=BIO&text-to4-visible=Palma%20de%20Mallorca%20(PMI)&END_CITY_03=PMI&text-date-from4=24/12/2024&BEGIN_DAY_03=24&BEGIN_MONTH_03=202412&BEGIN_YEAR4_01=2024&BEGIN_HOUR_03=0000&text-from5-visible=Palma%20de%20Mallorca%20(PMI)&BEGIN_CITY_04=PMI&text-to5-visible=Madrid%20(MAD)&END_CITY_04=MAD&text-date-from5=25/12/2024&BEGIN_DAY_04=25&BEGIN_MONTH_04=202412&BEGIN_YEAR5_01=2024&BEGIN_HOUR_04=0000&numTrayectos=4&FARE_TYPE=R&ADT=2&CHD=1&INF=1&YCD=0&YTH=0#!/availability`);

        cy.scrollTo(0, 0);
        cy.validateDataLayerInformation({quadrigam:'MTVAIL', proceso: 'multiples trayectos', paso: 'disponibilidad'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTVAIL', Process: 'multiples trayectos', Step: 'disponibilidad'});
        cy.get('#bbki-ib-box-mini-fare-0-0-E').first().click('bottom').wait(1000);
        cy.get('#radioFare-basica-E-0').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-1').find('#radioFare-basica-E-1').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-2').find('#bbki-ib-box-mini-fare-2-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-2').find('#radioFare-basica-E-2').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-3').find('#bbki-ib-box-mini-fare-3-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-3').find('#radioFare-basica-E-3').eq(0).click({ force: true });
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#name_0').click('bottom').type('test');
        cy.get('#first_surname_0').click('bottom').type('test');
        cy.get('#name_1').click('bottom').type('test');
        cy.get('#first_surname_1').click('bottom').type('testuno');
        cy.get('#name_2').click('bottom').type('test');
        cy.get('#first_surname_2').click('bottom').type('testdos');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click('bottom');
        cy.get('#ui-select-choices-row-2-2').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click('bottom');
        cy.get('#ui-select-choices-row-3-2').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(2).click('bottom');
        cy.get('#ui-select-choices-row-4-9').click('bottom');
        cy.get('#name_3').click('bottom').type('test');
        cy.get('#first_surname_3').click('bottom').type('testtres');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(3).click('bottom');
        cy.get('#ui-select-choices-row-5-2').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(4).click('bottom');
        cy.get('#ui-select-choices-row-6-2').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(5).click('bottom');
        cy.get('#ui-select-choices-row-7-1').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(6).click('bottom');
        cy.get('#ui-select-choices-row-1-0').click('bottom');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('bottom').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('bottom').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('bottom').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.validateDataLayerInformation({quadrigam:'MTAIRP', proceso: 'multiples trayectos', paso: 'pasajeros'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTAIRP', Process: 'multiples trayectos', Step: 'pasajeros'});
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0).wait(1000);
        cy.validateDataLayerInformation({quadrigam:'MTCMTV', proceso: 'multiples trayectos', paso: 'ancillaries'});
        cy.validateDigitalDataInformation({ Quadrigam: 'MTCMTV', Process: 'multiples trayectos', Step: 'ancillaries' });
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0).wait(1000);
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateDataLayerInformation({quadrigam:'MTPURC', proceso: 'multiples trayectos', paso: 'pago'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTPURC', Process: 'multiples trayectos', Step: 'pago'});
        cy.iframe('#ibdc-number-frame').find('#number').click('bottom').type('4012999999999999');
        cy.get('#name').click('bottom').type('test');
        cy.get('#surnames').click('bottom').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click({force: true});
        cy.get('#ui-select-choices-row-8-0').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click({force: true});
        cy.get('#ui-select-choices-row-9-1').click('bottom');
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('bottom').type('555');
        cy.get('#check_terms_conditions_span').click({force: true});
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});
        cy.fixture('datalayer-objects/multitrip/datalayer-confirmation').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            datalayerGeneralExpected.antelacionCompra = getTimeDifference('2024-12-22T00:07:00.000Z') + '-' + getTimeDifference('2024-12-23T00:07:00.000Z') + '-' + getTimeDifference('2024-12-24T00:07:00.000Z') + '-' + getTimeDifference('2024-12-25T00:07:00.000Z');
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/multitrip/digital-data-confirmation').then(digital_data => {
            digitalDataExpected = digital_data;
            digitalDataExpected.AdvancePurchase = getTimeDifference('2024-12-22T00:07:00.000Z') + '-' + getTimeDifference('2024-12-23T00:07:00.000Z') + '-' + getTimeDifference('2024-12-24T00:07:00.000Z') + '-' + getTimeDifference('2024-12-25T00:07:00.000Z');
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
    });
    it('return and two adults, one child and one infant, add ancillaries', () => {
        let datalayerGeneralExpected;
        let digitalDataExpected;
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01&passengerId=ADULT_02&passengerId=CHILD_01&passengerId=INFANT_01', { fixture: 'security-four-passengers.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/fare/complex', { fixture: 'fare-complex-four-passengers.json' });
        cy.visit(`${Cypress.env('url')}?bookingMarket=ES&TRIP_TYPE=3&text-from2-visible=Madrid%20(MAD)&BEGIN_CITY_01=MAD&text-to2-visible=Barcelona%20(BCN)&END_CITY_01=BCN&text-date-from2=22/12/2024&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR2_01=2024&BEGIN_HOUR_01=0000&text-from3-visible=Barcelona%20(BCN)&BEGIN_CITY_02=BCN&text-to3-visible=Bilbao%20(BIO)&END_CITY_02=BIO&text-date-from3=23/12/2024&BEGIN_DAY_02=23&BEGIN_MONTH_02=202412&BEGIN_YEAR3_01=2024&BEGIN_HOUR_02=0000&text-from4-visible=Bilbao%20(BIO)&BEGIN_CITY_03=BIO&text-to4-visible=Palma%20de%20Mallorca%20(PMI)&END_CITY_03=PMI&text-date-from4=24/12/2024&BEGIN_DAY_03=24&BEGIN_MONTH_03=202412&BEGIN_YEAR4_01=2024&BEGIN_HOUR_03=0000&text-from5-visible=Palma%20de%20Mallorca%20(PMI)&BEGIN_CITY_04=PMI&text-to5-visible=Madrid%20(MAD)&END_CITY_04=MAD&text-date-from5=25/12/2024&BEGIN_DAY_04=25&BEGIN_MONTH_04=202412&BEGIN_YEAR5_01=2024&BEGIN_HOUR_04=0000&numTrayectos=4&FARE_TYPE=R&ADT=2&CHD=1&INF=1&YCD=0&YTH=0#!/availability`);

        cy.scrollTo(0, 0);
        cy.validateDataLayerInformation({quadrigam:'MTVAIL', proceso: 'multiples trayectos', paso: 'disponibilidad'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTVAIL', Process: 'multiples trayectos', Step: 'disponibilidad'});
        cy.get('#bbki-ib-box-mini-fare-0-0-E').first().click('bottom').wait(1000);
        cy.get('#radioFare-basica-E-0').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-1').find('#radioFare-basica-E-1').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-2').find('#bbki-ib-box-mini-fare-2-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-2').find('#radioFare-basica-E-2').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-3').find('#bbki-ib-box-mini-fare-3-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-3').find('#radioFare-basica-E-3').eq(0).click({ force: true });
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#name_0').click('bottom').type('test');
        cy.get('#first_surname_0').click('bottom').type('test');
        cy.get('#name_1').click('bottom').type('test');
        cy.get('#first_surname_1').click('bottom').type('testuno');
        cy.get('#name_2').click('bottom').type('test');
        cy.get('#first_surname_2').click('bottom').type('testdos');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click('bottom');
        cy.get('#ui-select-choices-row-2-2').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click('bottom');
        cy.get('#ui-select-choices-row-3-2').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(2).click('bottom');
        cy.get('#ui-select-choices-row-4-9').click('bottom');
        cy.get('#name_3').click('bottom').type('test');
        cy.get('#first_surname_3').click('bottom').type('testtres');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(3).click('bottom');
        cy.get('#ui-select-choices-row-5-2').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(4).click('bottom');
        cy.get('#ui-select-choices-row-6-2').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(5).click('bottom');
        cy.get('#ui-select-choices-row-7-1').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(6).click('bottom');
        cy.get('#ui-select-choices-row-1-0').click('bottom');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('bottom').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('bottom').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('bottom').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.validateDataLayerInformation({quadrigam:'MTAIRP', proceso: 'multiples trayectos', paso: 'pasajeros'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTAIRP', Process: 'multiples trayectos', Step: 'pasajeros'});
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0).wait(1500);
        cy.validateDataLayerInformation({quadrigam:'MTCMTV', proceso: 'multiples trayectos', paso: 'ancillaries'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTCMTV', Process: 'multiples trayectos', Step: 'ancillaries'});
        cy.get('#OPEN_BAGGAGES').click('bottom');
        cy.validateDataLayerInformation({quadrigam:'MOBAGG', proceso: 'multiples trayectos', paso: 'equipaje'});
        cy.validateDigitalDataInformation({Quadrigam: 'MOBAGG', Process: 'multiples trayectos', Step: 'equipaje'});
        cy.get('.ib-add-bags__button.ib-add-bags__button--add').eq(0).click('bottom');
        cy.get('.ib-button.ib-button--large.u-mr-xsmall.u-float-right').eq(0).click('bottom');
        cy.get('.ib-button.ib-button--w-small.ib-button--block-xs.ib-button--default-normal').eq(1).click('bottom');
        cy.get('#cabins-1-row-17-seat-7').click({force:true});//get an alternative for "force:true"
        cy.validateDataLayerInformation({quadrigam:'MOSEAT', proceso: 'multiples trayectos', paso: 'asientos'});
        cy.validateDigitalDataInformation({Quadrigam: 'MOSEAT', Process: 'multiples trayectos', Step: 'asientos'});
        cy.get('.ib-button.ib-button--w-medium.u-float-right').eq(0).click('bottom');
        cy.get('.ib-button.ib-button--large.u-float-right').eq(0).click('bottom');
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateDataLayerInformation({quadrigam:'MTPURC', proceso: 'multiples trayectos', paso: 'pago'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTPURC', Process: 'multiples trayectos', Step: 'pago'});
        cy.iframe('#ibdc-number-frame').find('#number').click('bottom').type('4012999999999999');
        cy.get('#name').click('bottom').type('test');
        cy.get('#surnames').click('bottom').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click({force: true});
        cy.get('#ui-select-choices-row-8-0').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click({force: true});
        cy.get('#ui-select-choices-row-9-1').click('bottom');
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('bottom').type('555');
        cy.get('#check_terms_conditions_span').click({force: true});
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});
        cy.fixture('datalayer-objects/multitrip/datalayer-confirmation-ancillaries').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            datalayerGeneralExpected.antelacionCompra = getTimeDifference('2024-12-22T00:07:00.000Z') + '-' + getTimeDifference('2024-12-23T00:07:00.000Z') + '-' + getTimeDifference('2024-12-24T00:07:00.000Z') + '-' + getTimeDifference('2024-12-25T00:07:00.000Z');
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/multitrip/digital-data-confirmation-ancillaries').then(digital_data => {
            digitalDataExpected = digital_data;
            digitalDataExpected.AdvancePurchase = getTimeDifference('2024-12-22T00:07:00.000Z') + '-' + getTimeDifference('2024-12-23T00:07:00.000Z') + '-' + getTimeDifference('2024-12-24T00:07:00.000Z') + '-' + getTimeDifference('2024-12-25T00:07:00.000Z');
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
    });
    it('return and two adults, one child and user is logged', () => {
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
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01&passengerId=ADULT_02&passengerId=CHILD_01', { fixture: 'security-three-passengers.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/fare/complex', { fixture: 'fare-complex-three-passengers.json' });
        cy.visit(`${Cypress.env('url')}?bookingMarket=ES&TRIP_TYPE=3&text-from2-visible=Madrid%20(MAD)&BEGIN_CITY_01=MAD&text-to2-visible=Barcelona%20(BCN)&END_CITY_01=BCN&text-date-from2=22/12/2024&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR2_01=2024&BEGIN_HOUR_01=0000&text-from3-visible=Barcelona%20(BCN)&BEGIN_CITY_02=BCN&text-to3-visible=Bilbao%20(BIO)&END_CITY_02=BIO&text-date-from3=23/12/2024&BEGIN_DAY_02=23&BEGIN_MONTH_02=202412&BEGIN_YEAR3_01=2024&BEGIN_HOUR_02=0000&text-from4-visible=Bilbao%20(BIO)&BEGIN_CITY_03=BIO&text-to4-visible=Palma%20de%20Mallorca%20(PMI)&END_CITY_03=PMI&text-date-from4=24/12/2024&BEGIN_DAY_03=24&BEGIN_MONTH_03=202412&BEGIN_YEAR4_01=2024&BEGIN_HOUR_03=0000&text-from5-visible=Palma%20de%20Mallorca%20(PMI)&BEGIN_CITY_04=PMI&text-to5-visible=Madrid%20(MAD)&END_CITY_04=MAD&text-date-from5=25/12/2024&BEGIN_DAY_04=25&BEGIN_MONTH_04=202412&BEGIN_YEAR5_01=2024&BEGIN_HOUR_04=0000&numTrayectos=4&FARE_TYPE=R&ADT=2&CHD=1&INF=0&YCD=0&YTH=0#!/availability`);

        cy.scrollTo(0, 0);
        cy.validateDataLayerInformation({quadrigam:'MTVAIL', proceso: 'multiples trayectos', paso: 'disponibilidad'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTVAIL', Process: 'multiples trayectos', Step: 'disponibilidad'});
        cy.get('#bbki-ib-box-mini-fare-0-0-E').first().click('bottom').wait(1000);
        cy.get('#radioFare-basica-E-0').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-1').find('#radioFare-basica-E-1').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-2').find('#bbki-ib-box-mini-fare-2-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-2').find('#radioFare-basica-E-2').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-3').find('#bbki-ib-box-mini-fare-3-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-3').find('#radioFare-basica-E-3').eq(0).click({ force: true });
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click('bottom');
        cy.get('#ui-select-choices-row-2-1').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(2).click('bottom');
        cy.get('#ui-select-choices-row-3-1').click('bottom');
        cy.validateDataLayerInformation({quadrigam:'MTAIRP', proceso: 'multiples trayectos', paso: 'pasajeros'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTAIRP', Process: 'multiples trayectos', Step: 'pasajeros'});
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0).wait(1000);
        cy.validateDataLayerInformation({quadrigam:'MTCMTV', proceso: 'multiples trayectos', paso: 'ancillaries'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTCMTV', Process: 'multiples trayectos', Step: 'ancillaries'});
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0).wait(1000);
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateDataLayerInformation({quadrigam:'MTPURC', proceso: 'multiples trayectos', paso: 'pago'});
        cy.validateDigitalDataInformation({Quadrigam: 'MTPURC', Process: 'multiples trayectos', Step: 'pago'});
        cy.get('.ib-radio__text.ib-radio__text--payment-form.ng-binding').eq(1).click({force: true});
        cy.iframe('#ibdc-number-frame').find('#number').click('bottom').type('4012999999999999');
        cy.get('#name').click('bottom').type('test');
        cy.get('#surnames').click('bottom').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click({force: true});
        cy.get('#ui-select-choices-row-7-0').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click({force: true});
        cy.get('#ui-select-choices-row-8-1').click('bottom');
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('bottom').type('555');
        cy.get('#check_terms_conditions_span').click({force: true});
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});
        cy.fixture('datalayer-objects/multitrip/datalayer-confirmation-logged').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            datalayerGeneralExpected.antelacionCompra = getTimeDifference('2024-12-22T00:07:00.000Z') + '-' + getTimeDifference('2024-12-23T00:07:00.000Z') + '-' + getTimeDifference('2024-12-24T00:07:00.000Z') + '-' + getTimeDifference('2024-12-25T00:07:00.000Z');
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/multitrip/digital-data-confirmation-logged').then(digital_data => {
            digitalDataExpected = digital_data;
            digitalDataExpected.AdvancePurchase = getTimeDifference('2024-12-22T00:07:00.000Z') + '-' + getTimeDifference('2024-12-23T00:07:00.000Z') + '-' + getTimeDifference('2024-12-24T00:07:00.000Z') + '-' + getTimeDifference('2024-12-25T00:07:00.000Z');
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
    });
    it('four trips and one passenger', () => {

        cy.visit(`${Cypress.env('url')}?bookingMarket=ES&TRIP_TYPE=3&text-from2-visible=Madrid%20(MAD)&BEGIN_CITY_01=MAD&text-to2-visible=Barcelona%20(BCN)&END_CITY_01=BCN&text-date-from2=22/12/2024&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR2_01=2024&BEGIN_HOUR_01=0000&text-from3-visible=Barcelona%20(BCN)&BEGIN_CITY_02=BCN&text-to3-visible=Bilbao%20(BIO)&END_CITY_02=BIO&text-date-from3=23/12/2024&BEGIN_DAY_02=23&BEGIN_MONTH_02=202412&BEGIN_YEAR3_01=2024&BEGIN_HOUR_02=0000&text-from4-visible=Bilbao%20(BIO)&BEGIN_CITY_03=BIO&text-to4-visible=Palma%20de%20Mallorca%20(PMI)&END_CITY_03=PMI&text-date-from4=24/12/2024&BEGIN_DAY_03=24&BEGIN_MONTH_03=202412&BEGIN_YEAR4_01=2024&BEGIN_HOUR_03=0000&text-from5-visible=Palma%20de%20Mallorca%20(PMI)&BEGIN_CITY_04=PMI&text-to5-visible=Madrid%20(MAD)&END_CITY_04=MAD&text-date-from5=25/12/2024&BEGIN_DAY_04=25&BEGIN_MONTH_04=202412&BEGIN_YEAR5_01=2024&BEGIN_HOUR_04=0000&numTrayectos=4&FARE_TYPE=R&ADT=1&CHD=0&INF=0&YCD=0&YTH=0#!/availability`);

        cy.scrollTo(0, 0);
        cy.get('#bbki-ib-box-mini-fare-0-0-E').first().click('bottom').wait(1000);
        cy.get('#radioFare-basica-E-0').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-1').find('#bbki-ib-box-mini-fare-1-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-1').find('#radioFare-basica-E-1').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-2').find('#bbki-ib-box-mini-fare-2-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-2').find('#radioFare-basica-E-2').eq(0).click({ force: true });
        cy.get('#bbki-availavility-availability-trip-3').find('#bbki-ib-box-mini-fare-3-0-E').first().click('bottom').wait(1000);
        cy.get('#bbki-availability-slice-info-3').find('#radioFare-basica-E-3').eq(0).click({ force: true });
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#name_0').click('bottom').type('test');
        cy.get('#first_surname_0').click('bottom').type('test');
        cy.get('#IBAIRP_CONTACT_FORM_EMAIL').click('bottom').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_REPEATED_EMAIL').click('bottom').type('test@test.com');
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('bottom').type('612345678');
        cy.get('#save_passengers_data_span').click('left');
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click('bottom');

        cy.scrollTo(0, 0);
        cy.iframe('#ibdc-number-frame').find('#number').click('bottom').type('4012999999999999');
        cy.get('#name').click('bottom').type('test');
        cy.get('#surnames').click('bottom').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click({force: true});
        cy.get('#ui-select-choices-row-1-0').click('bottom');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click({force: true});
        cy.get('#ui-select-choices-row-2-1').click('bottom');
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('bottom').type('555');
        cy.get('#check_terms_conditions_span').click({force: true});
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.get('#pmt-total-price-pay-btn').click('bottom');

        cy.scrollTo(0, 0);
        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
        cy.checkDataLayerEvent({event:'purchase'});
    });
});
