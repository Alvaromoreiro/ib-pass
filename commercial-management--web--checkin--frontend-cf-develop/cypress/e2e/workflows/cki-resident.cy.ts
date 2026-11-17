import { SeatParams } from 'cypress/support/command-models';

describe('Test - CKI resident', () => {
    const nameFlow: string = 'cki-resident';
    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/iberia-web-content/literales/checkin/es.json', { fixture: 'statics/literals-checkin.json' });
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'statics/literals-general.json' });
        cy.intercept('GET', '**/iberia-web-content/links/checkin/es.json', { fixture: 'statics/links-checkin.json' });
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'statics/links-general.json' });
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'statics/aerolineas.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/DIGTRABOB/gdpr', { fixture: 'statics/gdpr-digtrabob.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/BOWINEPRIVAC/gdpr', { fixture: 'statics/gdpr-bowineprivac.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVACIBP/gdpr', { fixture: 'statics/gdpr-ibprivacibp.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVAC/gdpr', { fixture: 'statics/gdpr-ibprivac.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FPIBTASA/gdpr', { fixture: 'statics/gdpr-ibprivac.json' });
        cy.intercept('GET', '**/endpoints/**', { fixture: 'statics/endpoints.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: 'statics/companies.json' });
        cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: `${nameFlow}/booking.json` }).as('srvBooking'); // flightsPassengersController, wait end to get data result
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'statics/phone-codes.json' });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/additional-info**', { fixture: `${nameFlow}/additional-info.json` });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/emergency**', { fixture: `${nameFlow}/emergency.json` });
        cy.intercept('POST', '**/pac-pacc/rs/pacc/v2/**/accept', { fixture: `${nameFlow}/accept.json` });
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', { fixture: `${nameFlow}/ancillaries.json` });
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', { fixture: `${nameFlow}/ancillaries-summary.json` });
        cy.intercept('GET', '**/sea-cism/rs/cism/v4/**/flight/**/seatmap', { fixture: `${nameFlow}/seatmap.json` });
        cy.intercept('PUT', '**/v1/management/**', { statusCode: 200 });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/pac-bpm/rs/bpm/v3/**/boarding-document', { fixture: `${nameFlow}/boarding-document.json` });
        cy.intercept('POST', '**/pac-bpm/rs/bpm/v3/**/boarding-document/print', { fixture: `${nameFlow}/print.json` });
        cy.intercept('PUT', '**/cust-cust/rs/v2/newsletter**', { statusCode: 204 });
        cy.intercept('POST', '**api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
        cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
        cy.intercept('PUT', '**/pac-pacc/rs/pacc/v2/info/**/additional-info', { statusCode: 200 });
        cy.intercept('POST', '**/trm-apim/rs/v3/digital-boarding', { statusCode: 204 });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { statusCode: 200 });
        //cy.intercept('GET', '**/securepubads.g.doubleclick.net/**', { statusCode: 200 });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });

        // Intercept services to logged and payment
        cy.interceptServices({nameFlow: nameFlow, logged: true, payment: true});

        // Init flow CKI
        cy.visitQuadrigam({logged: true});
    });

    it('1ADL MAD-LHR, logged with select seat ancillaries and payment', () => {
        // Landing ibcose/uncose
        cy.checkInSearchController('K5TLG', 'test');

        // Landing ibcoac
        cy.flightsPassengersController({isLogged: true});

        // Landing ckianc
        const ancSeat: SeatParams = { idsSeatSelected: ['cabins-1-row-17-seat-5'], clickOpenSeatMap: true};
        cy.ancillariesPageController({addSeat: ancSeat});

        // Landing ibpurc
        cy.pmtPageController('2', '3');

        // Landing ibcobp
        cy.boardingCardsController();

        // Landing ibcocf-and-ibeccf
        cy.checkInConfirmationController(nameFlow);
    });
});
