import { SeatParams } from 'cypress/support/command-models';

/**
 * Test Special Needs
 * BLND: vision
 * DEAF: audicion
 * SVAN: perro lazarillo
 * WCHC: silla ruedas
 */
const nameFlow: string = 'cki-special-needs';
const cyFlow = (folderCase: string, modalInfo?: boolean, addAncAndPay?: boolean) => {
    const locator = {
        case1: 'MLWTF',
        case2: 'K7NXP',
        case3: 'K7PJN'
    };
    // Landing ibcose/uncose
    cy.checkInSearchController(locator[folderCase], 'test');

    // Landing ibcoac
    cy.flightsPassengersController({ modalInfo: modalInfo });

    // Landing ckianc
    let addSeat: SeatParams = undefined;
    let addBaggages = false;
    if (addAncAndPay) {
        addSeat = { idsSeatSelected: ['cabins-1-row-23-seat-5'], clickOpenSeatMap: true };
        addBaggages = true;
    }
    cy.ancillariesPageController({ addSeat, addBaggages });

    if (addAncAndPay) {
        // Landing ibpurc
        cy.pmtPageController('2', '3');
    }

    // Landing ibcobp
    cy.boardingCardsController();

    // Landing ibcocf-and-ibeccf
    const flowName = `${nameFlow}/${folderCase}`;
    cy.checkInConfirmationController(flowName, false);
};

const interceptCases = (nameCase: string, addAncAndPay?: boolean) => {
    // MOCK SERVICES
    cy.intercept('GET', '**/iberia-web-content/literales/checkin/es.json', { fixture: 'statics/literals-checkin.json' });
    cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'statics/literals-general.json' });
    cy.intercept('GET', '**/iberia-web-content/links/checkin/es.json', { fixture: 'statics/links-checkin.json' });
    cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'statics/links-general.json' });
    cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'statics/aerolineas.json' });
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/DIGTRABOB/gdpr', { fixture: 'statics/gdpr-digtrabob.json' });
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/BOWINEPRIVAC/gdpr', { fixture: 'statics/gdpr-bowineprivac.json' });
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/IBPRIVAC/gdpr', { fixture: 'statics/gdpr-ibprivac.json' });
    cy.intercept('GET', '**/endpoints/**', { fixture: 'statics/endpoints.json' });
    cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: 'statics/companies.json' });
    cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: `${nameFlow}/${nameCase}/booking.json` }).as('srvBooking'); // flightsPassengersController, wait end to get data result
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'statics/phone-codes.json' });
    cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/additional-info**', { fixture: `${nameFlow}/${nameCase}/additional-info.json` });
    cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/emergency**', { fixture: `${nameFlow}/${nameCase}/emergency.json` });
    cy.intercept('POST', '**/pac-pacc/rs/pacc/v2/**/accept', { fixture: `${nameFlow}/${nameCase}/accept.json` });
    cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', { fixture: `${nameFlow}/${nameCase}/ancillaries.json` });
    cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', { fixture: `${nameFlow}/${nameCase}/ancillaries-summary.json` });

    if (addAncAndPay) {
        cy.intercept('GET', '**/sea-cism/rs/cism/v4/**/flight/**/seatmap', { fixture: `${nameFlow}/${nameCase}/seatmap.json` });
        cy.intercept('PUT', '**/v1/management/**', { statusCode: 200 });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/US/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/**/gcwcs/**', { fixture: 'statics/gcwcs.json' });
        cy.intercept('GET', '**/avatar', { statusCode: 200 });
        cy.intercept('GET', '**iberia-web-content/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });
        cy.intercept('GET', '**iberia-web-content/iconos/payment/creditcardlogo.json', { statusCode: 200 });
        cy.intercept('POST', '**/iberiapay/rb_bf68025iux**', { statusCode: 200 });
        cy.intercept('PUT', '**/iberiapay/api/v2/public/vault/**/credit-card', '{}');
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardFee', { fixture: 'statics/credit-card-fee.json' });
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardBin', { fixture: 'statics/credit-card-bin.json' });
        cy.intercept('POST', '**/ass-fass/rs/fass/v6/**/ancillaries/pay-and-issue', { fixture: `${nameFlow}/${nameCase}/pay-and-issue.json` });
        cy.intercept('GET', '**payment-methods', { fixture: `${nameFlow}/${nameCase}/payment-methods.json` });
    } else {
        cy.intercept('GET', '**payment-methods', { statusCode: 412, fixture: 'statics/payment-methods-412.json' });
    }

    cy.intercept('GET', '**/pac-bpm/rs/bpm/v3/**/boarding-document', { fixture: `${nameFlow}/${nameCase}/boarding-document.json` });
    cy.intercept('POST', '**/pac-bpm/rs/bpm/v3/**/boarding-document/print', { fixture: `${nameFlow}/${nameCase}/print.json` });
    cy.intercept('PUT', '**/cust-cust/rs/v2/newsletter**', { statusCode: 204 });
    cy.intercept('POST', '**api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
    cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
    cy.intercept('PUT', '**/pac-pacc/rs/pacc/v2/info/**/additional-info', { statusCode: 200 });
    cy.intercept('POST', '**/trm-apim/rs/v3/digital-boarding', { statusCode: 204 });
    cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { statusCode: 200 });
    cy.intercept('GET', '**/securepubads.g.doubleclick.net/**', { statusCode: 200 });
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });

    // Init flow CKI
    cy.visitQuadrigam();
};

describe('Test - CKI Special Needs - case 1', () => {
    beforeEach(() => interceptCases('case1', true));

    it('1ADL, Special Needs (SVAN,DEAF), add seat and baggage', () => {
        cyFlow('case1', true, true);
    });
});

describe('Test - CKI Special Needs - case 2', () => {
    beforeEach(() => interceptCases('case2'));

    it('1ADL and 1 CHD, Special Needs (SVAN,DEAF,BLND)', () => {
        cyFlow('case2', true);
    });
});

describe('Test - CKI Special Needs - case 3', () => {
    beforeEach(() => interceptCases('case3'));

    it('2ADL, Special Needs (BLND, DEAF, WCHC, SVAN)', () => {
        cyFlow('case3', true);
    });
});
