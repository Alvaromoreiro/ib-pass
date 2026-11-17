import { IbcobpLanding } from 'cypress/support/command-models';
import { disabledGA4 } from '../../support/commands-utils';

const nameFlow: string = 'cki-inhibit-boarding-card-umnr';
const dataBC: IbcobpLanding = {
    inhibitBC: {
        status: true,
        isHomogeneous: true,
        type: 'UMNR'
    }
};
const cyFlow = (folderCase: string) => {
    const locator = {
        case1: { pnr: 'VA446Z', surname: 'PEREZ' },
        case2: { pnr: 'VFTCNK', surname: 'CORREAUMNR' },
        case3: { pnr: 'VAC47D', surname: 'BURTON' },
        case4: { pnr: 'VASW3S', surname: 'NORTON' }
    };

    // Landing ibcose
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
    cy.intercept('GET', '**/pac-bpm/rs/bpm/v3/**/boarding-document', { statusCode: 409, fixture: `${nameFlow}/${nameCase}/boarding-document.json` });

    // Init flow CKI
    cy.visitQuadrigam();
};

describe('Test - CKI inhibit boarding card UMNR', () => {
    const caseName = 'case1';
    beforeEach(() => interceptCases(caseName));
    it('1child BIO-MAD, passengers item UMNR', () => cyFlow(caseName));
});

describe('Test - CKI inhibit boarding card UMNR and RESI', () => {
    const caseName = 'case2';
    beforeEach(() => interceptCases(caseName));
    it('1child MAD-TFN, items UMNR and RESI', () => cyFlow(caseName));
});

describe('Test - CKI inhibit boarding card UMNR and AVIH', () => {
    const caseName = 'case3';
    beforeEach(() => interceptCases(caseName));
    it('1child BIO-MAD, items UMNR and AVIH', () => cyFlow(caseName));
});

describe('Test - CKI inhibit boarding card UMNR and PETC', () => {
    const caseName = 'case4';
    beforeEach(() => interceptCases(caseName));
    it('1child BIO-MAD, items UMNR and PETC', () => cyFlow(caseName));
});
