import { SeatParams } from 'cypress/support/command-models';

describe('Test - Air Shuttle CLOSED', () => {
    const nameFlow: string = 'air-shuttle-closed';
    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/iberia-web-content/literales/checkin/es.json', { fixture: 'statics/literals-checkin.json' });
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'statics/literals-general.json' });
        cy.intercept('GET', '**/iberia-web-content/links/checkin/es.json', { fixture: 'statics/links-checkin.json' });
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'statics/links-general.json' });
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'statics/aerolineas.json' });
        cy.intercept('GET', '**/iberia-web-content/imagenes/ciudades/cities.json', { fixture: 'statics/cities.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/DIGTRABOB/gdpr', { fixture: nameFlow + '/gdpr-digtrabob.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/BOWINEPRIVAC/gdpr', { fixture: nameFlow + '/gdpr-bowineprivac.json' });
        cy.intercept('GET', '**/endpoints/**', { fixture: nameFlow + '/endpoints.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: nameFlow + '/companies.json' });
        cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: nameFlow + '/booking.json' }).as('srvBooking'); // flightsPassengersController, wait end to get data result
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: nameFlow + '/phone-codes.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVACIBP/gdpr', { fixture: nameFlow + '/gdpr-ibprivacibp.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVAC/gdpr', { fixture: nameFlow + '/gdpr-ibprivac.json' });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/additional-info**', { fixture: nameFlow + '/additional-info.json' });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/emergency**', { fixture: nameFlow + '/emergency.json' });
        cy.intercept('POST', '**/pac-pacc/rs/pacc/v2/**/accept', { fixture: nameFlow + '/accept.json' });
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', { fixture: nameFlow + '/ancillaries.json' });
        cy.intercept('GET', '**/sea-cism/rs/cism/v4/**/flight/**/seatmap', { fixture: nameFlow + '/seatmap.json' });
        cy.intercept('GET', '**/pac-bpm/rs/bpm/v3/**/boarding-document', { fixture: nameFlow + '/boarding-document.json' });
        cy.intercept('POST', '**/pac-bpm/rs/bpm/v3/**/boarding-document/print', { fixture: nameFlow + '/print.json' });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { statusCode: 200, fixture: nameFlow + '/print.json' });
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', { fixture: nameFlow + '/ancillaries-summary.json' });
        cy.intercept('POST', '**lgm-ul/rs/v1/login', { statusCode: 200 });
        cy.intercept('GET', '**ibplus/login/', { statusCode: 200 });
        cy.intercept('POST', '**api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
        cy.intercept('POST', '**ibisauth.iberia.com/**', { statusCode: 200 });
        cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
        cy.intercept('POST', '**ibisauth.iberia.com/api/**', { statusCode: 200 });
        cy.intercept('PUT', '**/cust-cust/rs/v2/newsletter**', { statusCode: 204 });
        cy.intercept('PUT', '**/pac-pacc/rs/pacc/v2/info/**/additional-info', { statusCode: 200 });
        cy.intercept('PUT', '**api/v1/management/**', { statusCode: 204 });
        cy.intercept('POST', '**/trm-apim/rs/v3/digital-boarding', { statusCode: 204 });
        cy.intercept('POST', '**/iberiapay/rb_bf68025iux**', { statusCode: 200 });
        cy.intercept('GET', '**/ancillaries?ancillaryType=**', { statusCode: 200 });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { statusCode: 200 });
        cy.intercept('DELETE', '**/pac-prm/rs/checkin/v2/**', { statusCode: 204 });
        cy.intercept('POST', '**recoglobick**', {statusCode: 200});
        cy.intercept('GET', '**load_times**', {statusCode: 200});
        cy.intercept('GET', '**iberia-web-content/iconos/payment/creditcardlogo.json', {statusCode: 200});
        cy.intercept('GET', '**fp/clear.png', {statusCode: 200});
        cy.intercept('GET', '**iberia-web-content/imagenes/cargando/paymentLoading.svg', {statusCode: 200});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { statusCode: 200 });
        cy.intercept('GET', '**payment-methods', { statusCode: 412, fixture: 'statics/payment-methods-412.json' });
        cy.intercept('GET', '**/avatar', { statusCode: 200 });
        cy.intercept('GET', '**api/v1/bundles/availability/**', {statusCode: 200});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });

        // Init flow CKI
        cy.visitQuadrigam();
    });

    it('1ADL with seat change', () => {
        // Landing ibcose/uncose
        cy.checkInSearchController('NWKKG', 'test');

        // Landing ibcoac
        cy.flightsPassengersController();

        // Landing ckianc
        const ancSeat: SeatParams = { idsSeatSelected: ['cabins-1-row-12-seat-6'], clickOpenSeatMap: true};
        cy.ancillariesPageController({addSeat: ancSeat});

        // Landing ibcobp
        cy.boardingCardsController();

        // Landing ibcocf-and-ibeccf
        cy.checkInConfirmationController(nameFlow + '', true);
    });
});
