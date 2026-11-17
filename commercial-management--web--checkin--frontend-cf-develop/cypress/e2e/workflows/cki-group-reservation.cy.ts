describe('Test - CKI GroupReservations ', () => {
    const nameFlow: string = 'cki-group-reservation';
    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/iberia-web-content/literales/checkin/es.json', { fixture: 'statics/literals-checkin.json' });
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'statics/literals-general.json' });
        cy.intercept('GET', '**/iberia-web-content/links/checkin/es.json', { fixture: 'statics/links-checkin.json' });
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'statics/links-general.json' });
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'statics/aerolineas.json' });
        cy.intercept('GET', '**/endpoints/**', { fixture: nameFlow + '/endpoint.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: nameFlow + '/companies.json' });

        //cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: nameFlow + '/booking.json', statusCode: 409 });
        cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: nameFlow + '/booking.json' }).as('srvBooking');
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'statics/phone-codes.json' });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/additional-info**', { fixture: nameFlow + '/additional-info.json' });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/emergency**', { fixture: nameFlow + '/emergency.json' });
        cy.intercept('POST', '**/pac-pacc/rs/pacc/v2/**/accept', { fixture: nameFlow + '/accept.json' });
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', { fixture: nameFlow + '/ancillaries.json' });
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', { fixture: `${nameFlow}/ancillaries-summary.json` });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { fixture: nameFlow + '/ancillaries-calculation.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: nameFlow + '/country.json' });
        //cy.intercept('GET', '**payment-methods', { fixture: nameFlow + '/payment-methods.json' });
        cy.intercept('GET', '**payment-methods', { statusCode: 412, fixture: 'statics/payment-methods-412.json' });

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('PUT', '**/iberiapay/api/v2/public/vault/**/credit-card', '{}');
        cy.intercept('GET', '**/pac-bpm/rs/bpm/v3/**/boarding-document', { fixture: nameFlow + '/boarding-document.json' });
        cy.intercept('POST', '**/pac-bpm/rs/bpm/v3/**/boarding-document/print', { fixture: nameFlow + '/print.json' });
        cy.intercept('POST', '**api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
        cy.intercept('POST', '**ibisauth.iberia.com/**', { statusCode: 200 });
        cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
        cy.intercept('POST', '**ibisauth.iberia.com/api/**', { statusCode: 200 });
        cy.intercept('PUT', '**/cust-cust/rs/v2/newsletter**', { statusCode: 204 });
        cy.intercept('PUT', '**/pac-pacc/rs/pacc/v2/info/**/additional-info', { statusCode: 200 });
        cy.intercept('PUT', '**api/v1/management/**', { statusCode: 204 });
        cy.intercept('POST', '**/trm-apim/rs/v3/digital-boarding', { statusCode: 204 });
        cy.intercept('POST', '**/iberiapay/rb_bf68025iux**', { statusCode: 200 });
        cy.intercept('GET', '**/ass-fass/rs/fass/v4/**/ancillaries?ancillaryType=**', { statusCode: 200 });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { statusCode: 200 });
        cy.intercept('DELETE', '**/pac-prm/rs/checkin/v2/**', { statusCode: 204 });
        cy.intercept('POST', '**recoglobick**', { statusCode: 200 });
        cy.intercept('GET', '**load_times**', { statusCode: 200 });
        cy.intercept('GET', '**iberia-web-content/iconos/payment/creditcardlogo.json', { statusCode: 200 });
        cy.intercept('GET', '**fp/clear.png', { statusCode: 200 });
        cy.intercept('GET', '**iberia-web-content/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });

        // Init flow CKI
        cy.visitQuadrigam();
    });

    it('group reservation', () => {
        // Landing ibcose/uncose
        cy.checkInSearchController('JWQYEU', 'BLANCO');

        // Landing ibcoac
        cy.flightsPassengersController();

        // Landing ckianc
        cy.ancillariesPageController();

        // Landing ibcobp
        cy.boardingCardsController();

        // Landing ibcocf-and-ibeccf
        cy.checkInConfirmationController(nameFlow, false);
    });

    it('Group reservation for passengers with repeated last name', () => {
        const isReserverGroup = true;

        if (isReserverGroup) {
            // interception only if isReserverGroup is true
            cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', {
                fixture: nameFlow + '/booking.json',
                statusCode: 409
            });
        }

        //  intercept to follow the flow of CKI
        cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/checkinId/**', {
            fixture: nameFlow + '/booking.json'
        }).as('srvBooking');

        // Landing ibcose/uncose
        cy.checkInSearchController('JWQYEU', 'LOPEZ', isReserverGroup);

        // Landing ibcoac
        cy.flightsPassengersController();

        // Landing ckianc
        cy.ancillariesPageController();

        // Landing ibcobp
        cy.boardingCardsController();

        // Landing ibcocf-and-ibeccf
        cy.checkInConfirmationController(nameFlow, false);
    });
});
