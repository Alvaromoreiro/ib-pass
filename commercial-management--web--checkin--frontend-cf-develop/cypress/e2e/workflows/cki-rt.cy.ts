import { SeatParams } from 'cypress/support/command-models';

describe('Test - CKI RT', () => {
    const nameFlow: string = 'rt';
    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/iberia-web-content/literales/checkin/es.json', { fixture: 'statics/literals-checkin.json' }).as('literals-checkin');
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'statics/literals-general.json' }).as('literals-general');
        cy.intercept('GET', '**/iberia-web-content/links/checkin/es.json', { fixture: 'statics/links-checkin.json' }).as('links-checkin');
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'statics/links-general.json' }).as('links-general');
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'statics/aerolineas.json' }).as('aerolineas');
        cy.intercept('GET', '**/endpoints/**', { fixture: nameFlow + '/endpoint.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: nameFlow + '/companies.json' }).as('companies');
        cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: nameFlow + '/booking.json' }).as('srvBooking'); // flightsPassengersController, wait end to get data result
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: nameFlow + '/phone-codes.json' }).as('phone-codes');
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVAC/gdpr', { fixture: nameFlow + '/gdpr-ibprivac.json' }).as('gdpr');
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/additional-info**', { fixture: nameFlow + '/additional-info.json' }).as('additional-info');
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/emergency**', { fixture: nameFlow + '/emergency.json' }).as('emergency');
        cy.intercept('POST', '**/pac-pacc/rs/pacc/v2/**/accept', { fixture: nameFlow + '/accept.json' }).as('accept');
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', { fixture: nameFlow + '/ancillaries.json' }).as('ancillaries');
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { fixture: nameFlow + '/ancillaries-calculation.json' }).as('ancillaries-calculation');
        cy.intercept('GET', '**/sea-cism/rs/cism/v4/**/flight/3/seatmap', { fixture: nameFlow + '/seatmap.json' }).as('seatmap');
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: nameFlow + '/country.json' }).as('country');
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: nameFlow + '/states.json' }).as('states');
        cy.intercept('GET', '**payment-methods', { fixture: nameFlow + '/payment-methods.json' }).as('payment-methods');
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/**/gcwcs/**', { fixture: nameFlow + '/gcwcs.json' }).as('gcwcs');
        cy.intercept('PUT', '**/iberiapay/api/v2/public/vault/**/credit-card', '{}');
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardFee', { fixture: nameFlow + '/credit-card-fee.json' }).as('credit-card-fee');
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardBin', { fixture: nameFlow + '/credit-card-bin.json' }).as('credit-card-bin');
        cy.intercept('POST', '**/ass-fass/rs/fass/v6/**/ancillaries/pay-and-issue', { fixture: nameFlow + '/pay-and-issue.json' }).as('pay-and-issue');
        cy.intercept('GET', '**/pac-bpm/rs/bpm/v3/**/boarding-document', { fixture: nameFlow + '/boarding-document.json' }).as('boarding-document');
        cy.intercept('POST', '**/pac-bpm/rs/bpm/v3/**/boarding-document/print', { fixture: nameFlow + '/print.json' }).as('print');
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', { fixture: nameFlow + '/ancillaries-summary.json' }).as('ancillaries-summary');
        cy.intercept('POST', '**api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 }).as('token');
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/DIGTRABOB/gdpr', { statusCode: 200 }).as('DIGTRABOB-gdpr');
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/BOWINEPRIVAC/gdpr', { statusCode: 200 }).as('BOWINEPRIVAC-gdpr');
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
        cy.intercept('POST', '**recoglobick**', { statusCode: 200 });
        cy.intercept('POST', '**pmt-ppm/rs/ppm/v7**', { statusCode: 401 });
        cy.intercept('GET', '**load_times**', { statusCode: 200 });
        cy.intercept('GET', '**iberia-web-content/iconos/payment/creditcardlogo.json', { statusCode: 200 }).as('creditcardlogo');
        cy.intercept('GET', '**fp/clear.png', { statusCode: 200 });
        cy.intercept('GET', '**iberia-web-content/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });
        cy.intercept('GET', '**api/v1/bundles/availability/**', { statusCode: 200 });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });

        // Init flow CKI
        cy.visitQuadrigam();
    });

    it('1ADL, 1INF, 1CHILD for RT with select seat ancillaries', () => {
        // Landing ibcose/uncose
        cy.checkInSearchController('VLQO5D', 'smith');

        // Landing ibcoac
        cy.flightsPassengersController();

        // Landing ckianc
        const ancSeat: SeatParams = { idsSeatSelected: ['cabins-1-row-9-seat-7', 'cabins-1-row-12-seat-6']};
        cy.ancillariesPageController({addSeat: ancSeat});

        // Landing ibpurc
        cy.pmtPageController();

        // Landing ibcobp
        cy.boardingCardsController();

        // Landing ibcocf-and-ibeccf
        cy.checkInConfirmationController(nameFlow, true);
    });
});
