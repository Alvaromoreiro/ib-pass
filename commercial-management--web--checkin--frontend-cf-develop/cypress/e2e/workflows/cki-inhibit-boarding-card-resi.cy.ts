import { IbcobpLanding } from 'cypress/support/command-models';

describe('Test - CKI inhibit boarding card RESI', () => {
    const nameFlow: string = 'cki-inhibit-boarding-card-resi';
    const dataBC: IbcobpLanding = {
        inhibitBC: {
            status: true,
            isHomogeneous: false,
            type: 'COUR'
        }
    };
    const cyFlow = (folderCase: string) => {
        const locator = {
            case1: { pnr: 'TAL8VW', surname: 'test' },
            case2: { pnr: 'JHJFK', surname: 'test' },
            case3: { pnr: 'JHJFK', surname: 'test' },
            case4: { pnr: 'TAL4AU', surname: 'test' }
        };
        const inhibitBCHomogeneous = !(folderCase === 'case4');
        dataBC.inhibitBC.isHomogeneous = inhibitBCHomogeneous;
        // Landing ibcose/uncose
        cy.checkInSearchController(locator[folderCase].pnr, locator[folderCase].surname);

        // Landing ibcoac
        cy.flightsPassengersController();

        // Landing ckianc
        cy.ancillariesPageController();

        // Landing ibcobp
        cy.boardingCardsController(dataBC);

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
        cy.intercept('GET', '**/iberia-web-content/imagenes/ciudades/cities.json', { fixture: 'statics/cities.json' });
        cy.intercept('GET', '**/pac-prm/rs/checkin/v2/user/bookings', { fixture: 'statics/bookings.json' });
        cy.intercept('GET', '**/endpoints/**', { fixture: 'statics/endpoints.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: 'statics/companies.json' });
        cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: `${nameFlow}/${nameCase}/booking.json` }).as('srvBooking'); // flightsPassengersController, wait end to get data result
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'statics/phone-codes.json' });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/additional-info**', { fixture: `${nameFlow}/${nameCase}/additional-info.json` });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/emergency**', { fixture: `${nameFlow}/${nameCase}/emergency.json` });
        cy.intercept('POST', '**/pac-pacc/rs/pacc/v2/**/accept', { fixture: `${nameFlow}/${nameCase}/accept.json` });
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', { fixture: `${nameFlow}/${nameCase}/ancillaries.json` });
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', { fixture: `${nameFlow}/${nameCase}/ancillaries-summary.json` });
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
        cy.intercept('POST', '**recoglobick**', { statusCode: 200 });
        cy.intercept('GET', '**load_times**', { statusCode: 200 });
        cy.intercept('GET', '**iberia-web-content/iconos/payment/creditcardlogo.json', { statusCode: 200 });
        cy.intercept('GET', '**fp/clear.png', { statusCode: 200 });
        cy.intercept('GET', '**iberia-web-content/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation', { statusCode: 200 });
        cy.intercept('GET', '**payment-methods', { statusCode: 412, fixture: 'statics/payment-methods-412.json' });
        cy.intercept('GET', '**/avatar', { statusCode: 200 });
        cy.intercept('GET', '**api/v1/bundles/availability/**', { statusCode: 200 });
        cy.intercept('GET', '**/cust-cust/rs/v1/customer/travel_info', { statusCode: 200 });
        cy.intercept('PUT', '**/cust-cust/rs/v1/customer/travel_info', { statusCode: 200 });
        cy.intercept('PUT', '**/trm-apim/rs/v3/info/**/security', { statusCode: 200 });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });

        let statusCodeBoardingDocument = 409;
        if (nameCase === 'case4') {
            cy.intercept('POST', '**/pac-bpm/rs/bpm/v3/**/boarding-document/print', { fixture: `${nameFlow}/${nameCase}/print.json` });
            cy.intercept('PUT', '**/pac-pacc/rs/pacc/v2/**/accept/upgrading', { statusCode: 204 });
            statusCodeBoardingDocument = 200;
        }
        cy.intercept('GET', '**/pac-bpm/rs/bpm/v3/**/boarding-document', { statusCode: statusCodeBoardingDocument, fixture: `${nameFlow}/${nameCase}/boarding-document.json` });

        // Init flow CKI
        cy.visitQuadrigam();
    };

    describe('2ADL BIO-MAD, all passengers inhibit RESI', () => {
        const caseName = 'case1';
        beforeEach(() => interceptCases(caseName));
        it('homogeneous', () => cyFlow(caseName));
    });

    describe('2ADL BIO-MAD, one passenger inhibit RESI and other passenger inhibit AVIH', () => {
        const caseName = 'case2';
        beforeEach(() => interceptCases(caseName));
        it('no homogeneous', () => cyFlow(caseName));
    });

    describe('2ADL BIO-MAD, one passenger inhibit RESI and other passenger inhibit PETC', () => {
        const caseName = 'case3';
        beforeEach(() => interceptCases(caseName));
        it('homogeneous', () => cyFlow(caseName));
    });

    describe('2ADL BIO-MAD, one passenger inhibit RESI and other passenger not inhibit (verifiede)', () => {
        const caseName = 'case4';
        beforeEach(() => interceptCases(caseName));
        it('no homogeneous', () => cyFlow(caseName));
    });
});
