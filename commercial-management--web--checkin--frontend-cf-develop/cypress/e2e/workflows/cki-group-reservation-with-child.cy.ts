const nameFlow: string = 'cki-group-reservation-with-child';
const cyFlow = (folderCase: string) => {
    const locator = {
        case1: { pnr: 'LQMTL3', surname: 'CRUZ' },
        case2: { pnr: 'LQMTL3', surname: 'PEREZ', isReserverGroup: true },
        case3: { pnr: 'LQMTL3', surname: 'PEREZ', isReserverGroup: true }
    };

    // Landing ibcose
    cy.checkInSearchController(locator[folderCase].pnr, locator[folderCase].surname, locator[folderCase].isReserverGroup);

    // Landing ibcoac
    cy.flightsPassengersController();

    // Landing ckianc
    cy.ancillariesPageController();

    // Landing ibcobp
    cy.boardingCardsController();

    // Landing ibcocf-and-ibeccf
    const flowName = `${nameFlow}/${folderCase}`;
    cy.checkInConfirmationController(flowName, false);
};
const interceptCases = (nameCase: string) => {
    // MOCK SERVICES
    cy.intercept('GET', '**/iberia-web-content/literales/checkin/es.json', { fixture: 'statics/literals-checkin.json' });
    cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'statics/literals-general.json' });
    cy.intercept('GET', '**/iberia-web-content/links/checkin/es.json', { fixture: 'statics/links-checkin.json' });
    cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'statics/links-general.json' });
    cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', { fixture: 'statics/aerolineas.json' });
    cy.intercept('GET', '**/endpoints/**', { fixture: 'statics/endpoints.json' });
    cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: 'statics/companies.json' });
    cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: `${nameFlow}/${nameCase}/booking.json` }).as('srvBooking');
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'statics/phone-codes.json' });
    cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/additional-info**', {  fixture: `${nameFlow}/${nameCase}/additional-info.json` });
    cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/emergency**', { fixture: `${nameFlow}/${nameCase}/emergency.json` });
    cy.intercept('POST', '**/pac-pacc/rs/pacc/v2/**/accept', { fixture: `${nameFlow}/${nameCase}/accept.json` });
    cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', { fixture: `${nameFlow}/${nameCase}/ancillaries.json` });
    cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', { fixture: `${nameFlow}/${nameCase}/ancillaries-summary.json` });
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });
    cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
    cy.intercept('GET', '**payment-methods', { statusCode: 412, fixture: 'statics/payment-methods-412.json' });
    //cy.intercept('GET', '**payment-methods', { fixture: `${nameFlow}/${nameCase}/payment-methods.json` });
    cy.intercept('GET', '**/pac-bpm/rs/bpm/v3/**/boarding-document', { fixture: `${nameFlow}/${nameCase}/boarding-document.json` });
    cy.intercept('POST', '**/pac-bpm/rs/bpm/v3/**/boarding-document/print', { fixture: `${nameFlow}/${nameCase}/print.json` });
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

    if(nameCase === 'case2' || nameCase === 'case3') {
        const isLastNameRepited = true;
        if (isLastNameRepited) {
            // interception only if isReserverGroup is true
            cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', {
                fixture: `${nameFlow}/${nameCase}/booking.json`,
                statusCode: 409
            });
        }

        //  intercept to follow the flow of CKI
        cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/checkinId/**', {
            fixture: `${nameFlow}/${nameCase}/booking.json`
        }).as('srvBooking');
    }

    // Init flow CKI
    cy.visitQuadrigam();
};

describe('Test - CKI group reservation with child case1', () => {
    const caseName = 'case1';
    beforeEach(() => interceptCases(caseName));
    it('5ad + 1child BIO-MAD, adult passenger with last name not repeated in the reservation', () => cyFlow(caseName));
});

describe('Test - CKI group reservation with child case2', () => {
    const caseName = 'case2';
    beforeEach(() => interceptCases(caseName));
    it('5ad + 1child BIO-MAD, adult passenger with last name repeated in the reservation', () => cyFlow(caseName));
});

describe('Test - CKI group reservation with child case3', () => {
    const caseName = 'case3';
    beforeEach(() => interceptCases(caseName));
    it('5ad + 1child BIO-MAD, child passenger with last name repeated in the reservation', () => cyFlow(caseName));
});
