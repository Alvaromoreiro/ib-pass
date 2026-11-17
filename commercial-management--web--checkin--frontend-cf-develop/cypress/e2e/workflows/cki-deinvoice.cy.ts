describe('Test - cki-deinvoice', () => {
    const nameFlow: string = 'cki-deinvoice';
    const cyFlow = (folderCase: string) => {
        const locator = {
            case1: {pnr: 'V9U9LD', surname: 'test'},
            case2: {pnr: 'JDGR3', surname: 'test'},
            case3: {pnr: 'JDGR3', surname: 'test'}
        };
        // Landing ibcose/uncose
        cy.checkInSearchController(locator[folderCase].pnr, locator[folderCase].surname);

        // Landing ibcoac
        const isAllPassenger = folderCase === 'case3';
        cy.flightsPassengerDesController(isAllPassenger);

        const flowName = `${nameFlow}/${folderCase}`;
        cy.validateConfirmationGA4(flowName);
    };
    const interceptCases = (nameCase: string) => {
        // MOCK SERVICES
        cy.intercept('GET', '**/iberia-web-content/literales/checkin/es.json', { fixture: 'statics/literals-checkin.json' });
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', { fixture: 'statics/literals-general.json' });
        cy.intercept('GET', '**/iberia-web-content/links/checkin/es.json', { fixture: 'statics/links-checkin.json' });
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', { fixture: 'statics/links-general.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/**/gdpr', { fixture: 'statics/gdpr-digtrabob.json' });
        cy.intercept('GET', '**/endpoints/**', { fixture: 'statics/endpoints.json' });
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', { fixture: 'statics/companies.json' });
        cy.intercept('GET', '**/pac-prm/rs/checkin/v3/booking/**', { fixture: `${nameFlow}/${nameCase}/booking.json` }).as('srvBooking'); // flightsPassengersController, wait end to get data result
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', { fixture: 'statics/phone-codes.json' });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/additional-info**', { fixture: `${nameFlow}/${nameCase}/additional-info.json` });
        cy.intercept('GET', '**/pac-pacc/rs/pacc/v2/info/**/emergency**', { fixture: `${nameFlow}/${nameCase}/emergency.json` }).as('srvEmergency');
        cy.intercept('POST', '**/pac-pacc/rs/pacc/v1/**/accept/delete', { fixture: `${nameFlow}/${nameCase}/delete.json` });
        cy.intercept('POST', '**api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
        cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', { fixture: 'statics/states.json' });
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', { fixture: 'statics/country.json' });

        // Init flow CKI
        cy.visitQuadrigam({isDeinvoice: true});
    };

    let caseName = 'case1';
    beforeEach(() => interceptCases(caseName));
    it('1ADL BIO-MAD, deinvoice', () => cyFlow(caseName));

    caseName = 'case2';
    beforeEach(() => interceptCases(caseName));
    it('2ADL BIO-MAD, deinvoice only one passenger', () => cyFlow(caseName));

    caseName = 'case3';
    beforeEach(() => interceptCases(caseName));
    it('2ADL BIO-MAD, deinvoice all passenger', () => cyFlow(caseName));
});
