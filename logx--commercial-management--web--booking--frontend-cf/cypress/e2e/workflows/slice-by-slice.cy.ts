describe('Test - obtencion', () => {
    let getTimeDifference = ():string =>{
        const buyingDate = '2024-12-22T00:07:00.000Z';
        return Math.round((new Date(buyingDate).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)).toString();
    };
    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/cities/destination', { fixture: 'cities_destination.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/market/commercialsellingdata', { fixture: 'flows/slice-by-slice/commercialsellingdata-slice-by-slice.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/areas/destination', { fixture: 'areas_destination.json' });

        cy.intercept('GET', '**/iberia-web-content/literales/booking/es.json', { fixture: 'literals/booking-es.json' });
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'literals/general-es.json' });
        cy.intercept('GET', '**/iberia-web-content/links/booking/es.json', { fixture: 'links/booking-es.json' });
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'links/general-es.json' });

        cy.intercept('GET', '**/cs/Satellite?pagename=IB_SE_Services&service=getContact&code=RESERVAS&market=ES&locale=es', { fixture: 'satellite.json' });
        cy.intercept('POST', '**/api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
        cy.intercept('PUT', '**/api/v1/management/**', { statusCode: 200 });

        cy.intercept('GET', '**/iberia-web-content/imagenes/background/backgrounds.json', { fixture: 'images/backgrounds.json' });
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'icons/aerolineas.json' });

        cy.intercept('POST', '**/sse-avm/rs/v2/fare', { fixture: 'flows/slice-by-slice/fare-sliced-response-four-pass.json' });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/flight-calculation', { fixture: 'flows/slice-by-slice/flight-calculation-sliced-four-pass.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'phone-codes.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'flows/slice-by-slice/country-sliced.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: 'companies.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVACIBP/gdpr', { fixture: 'gdpr.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVAC/gdpr', { fixture: 'gdpr.json' });
        cy.intercept('POST', '**/sse-orm/rs/v5/abandoned-shoppingCart/verifyMail', { fixture: 'verify-mail.json' });

        cy.intercept('GET', '**/prlm-mbm/rs/v2/members/contact_details', {fixture: 'contact_details.json'});
        cy.intercept('GET', '**/cust-cust/rs/v1/travel_preferences', {fixture: 'travel_preferences.json'});
        cy.intercept('GET', '**/prlm-asm/rs/v1/members/**/associates', {fixture: 'associates.json'});
        cy.intercept('GET', '**/pzmm-mbm/rs/v1/members/personal_data', { statusCode: 200 });
        cy.intercept('GET', '**/cust-cust/rs/v1/avatar', { statusCode: 200 });

        cy.intercept('GET', '**/v2/availability/itinerary/**', { statusCode: 200 });
        cy.intercept('POST', '**/rb_bf68025iux**', { statusCode: 200 });

        cy.intercept('POST', '**/sse-orm/rs/v2/order', { fixture: 'flows/slice-by-slice/order-sliced-four-pass.json' });
        cy.intercept('GET', '**api/v1/ibv/availability/**/offerId/**', { statusCode: 200 });
        cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries(\/?\?.*)?/, { fixture: 'flows/slice-by-slice/ancillaries-sliced.json' });
        cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries-summary(\/?\?.*)?/, { fixture: 'flows/slice-by-slice/ancillaries-summary-sliced.json' });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', { fixture: 'flows/slice-by-slice/summary-calculation-sliced.json' });
        cy.intercept('GET', '**/api/sea-cism/rs/cism/v4/**/seatmapLayout', { fixture: 'seat-map-layout.json' });

        cy.intercept('GET', '**/iberia-web-content/iconos/payment/creditcardlogo.json', { fixture: 'icons/creditcardlogo.json' });
        cy.intercept('GET', '**/cdn.nemuru.com/pricings/**', { fixture: 'pricing.json' });
        cy.intercept('GET', '**/cust-cust/rs/v3/customer/credit_card**', {fixture: 'credit-card-redemption.json'});
        cy.intercept('POST', '**/pmt-ppm/rs/ppm/v7/creditcards/fee', {fixture: 'fee-redemption.json'});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/**/states', { fixture: 'states.json' });
        cy.intercept('GET', '**/payment-methods', { fixture: 'flows/slice-by-slice/payment-methods-sliced.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/**/gcwcs/?retrieveHTML=yes', { fixture: 'flows/slice-by-slice/gcwcs-sliced.json' });
        cy.intercept('GET', '**/available-donations/**', { fixture: 'flows/slice-by-slice/available-donations-sliced.json' });

        cy.intercept('PUT', '**/credit-card', { fixture: 'credit-card.json' });
        cy.intercept('GET', '**/iberia-web-content/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });

        cy.intercept('POST', '**/sse-orm/rs/v3/issue', { fixture: 'flows/slice-by-slice/issue-sliced.json' });
        cy.intercept('PUT', '**/cust-cust/rs/v2/newsletter', { fixture: 'newsletter.json' });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', { fixture: 'flows/slice-by-slice/summary-calculation-sliced.json' });

        cy.intercept('POST', '**/creditCardFee', { fixture: 'creditcardfee.json' });
        cy.intercept('POST', '**/creditCardBin', { fixture: 'creditcardbin.json' });

        cy.intercept('GET', '**/build-recoglobick-activities/**', { statusCode: 200 });
        cy.intercept('GET', '**/build-recoglobick-transfers/**', { statusCode: 200 });
        cy.intercept('POST', '**/identity-digitalboarding.cs81.force.com/**', { statusCode: 200 });
        cy.intercept('GET', '**/load_times**', { statusCode: 200 });
        cy.intercept('POST', '**/payment-methods-info', { fixture: 'payment-methods-info.json'});
        cy.intercept('GET', '**/v1/bundles/availability/**', { statusCode: 200 });

        sessionStorage.setItem('ib-booking-app.sendDatalayerEcommerce', 'true');

        // COOKIES
        // cy.get('#onetrust-accept-btn-handler').contains('Aceptar todas las cookies').click()

        // BUY WITH FLEXIBILITY
        // cy.get('.lc-a21-details-btn-shr').contains('Ocultar').wait(1000).click()
    });

    it('return and two adults, one child and one infant', () => {
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01&passengerId=ADULT_02&passengerId=CHILD_01&passengerId=INFANT_01', { fixture: 'flows/slice-by-slice/security-four-passengers-sliced.json' });
        let datalayerGeneralExpected;
        let digitalDataExpected;
        cy.intercept('POST', '**/sse-avm/rs/v2/calendar/ribbon', { fixture: 'ribbon-return.json' });
        cy.intercept('POST', '**/sse-avm/rs/v2/availability/itinerary', { fixture: 'flows/slice-by-slice/itinerary-outbound-return.json' });
        cy.intercept('GET', '**/sse-avm/rs/v2/availability/itinerary/**/**/*', { fixture: 'flows/slice-by-slice/itinerary-inbound-return.json' });
        // GO TO SLICE BY SLICE AVAILABILITY
        cy.visit( `${ Cypress.env( 'url' ) }?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BCN&nombreOrigen=Madrid&nombreDestino=Barcelona&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR_01=2024&END_DAY_01=29&END_MONTH_01=202412&END_YEAR_01=2024&FARE_TYPE=R&quadrigam=IBHMPA&ADT=2&CHD=1&INF=1&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Search&bookingMarket=ES#!/availability` );
        // cy.scrollTo(0, 0).wait(1000);
        // SELECT FIRST SLICE
        cy.get('#bbki-ib-box-mini-fare-0-0-E').first().click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click().wait(200);
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.validateDataLayerInformation({quadrigam:'IBOWFS', proceso: 'booking slice by slice', paso: 'disponibilidad'});
        cy.validateDigitalDataInformation( { Quadrigam: 'IBOWFS', Process: 'booking slice by slice', Step: 'disponibilidad' } );
        // SELECT SECOND SLICE
        cy.scrollTo( 0, 0 );
        cy.get( '#bbki-ib-box-mini-fare-1-1-E' ).first().click();
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click().wait(200);
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.checkDataLayerEvent({event:'add_to_cart'});
        // CONTINUE TO PASSENGERS FORM
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
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('5555555555');
        cy.get('#save_passengers_data_span').click('left');
        cy.validateDataLayerInformation({quadrigam:'IBAIRP', proceso: 'booking slice by slice', paso: 'pasajeros'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBAIRP', Process: 'booking slice by slice', Step: 'pasajeros'});
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0).wait(1000);
        cy.validateDataLayerInformation({quadrigam:'IBCMTV', proceso: 'booking slice by slice', paso: 'ancillaries'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBCMTV', TrackingCode: 'es/ES/IBCMTV', Process: 'booking slice by slice', Step: 'ancillaries'});
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0).wait(1000);
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateDataLayerInformation({quadrigam:'IBPURC', proceso: 'booking slice by slice', paso: 'pago'});
        cy.validateDigitalDataInformation({Quadrigam: 'IBPURC', Process: 'booking slice by slice', Step: 'pago'});
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
        cy.fixture('datalayer-objects/slice-by-slice/datalayer-confirmacion').then(datalayer => {
            datalayerGeneralExpected = datalayer;
            datalayerGeneralExpected.antelacionCompra = getTimeDifference();
            cy.validateDataLayerInformation(datalayerGeneralExpected);
        });
        cy.fixture('datalayer-objects/slice-by-slice/digital-data-confirmacion').then(digital_data => {
            digitalDataExpected = digital_data;
            digitalDataExpected.AdvancePurchase = getTimeDifference();
            cy.validateDigitalDataInformation(digitalDataExpected);
        });
        cy.checkDataLayerEvent({event:'purchase'});
    });
});
