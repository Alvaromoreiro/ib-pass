describe('Test updates workflows', () => {

    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/iberia-web-content/literales/manage-my-booking/es.json', {fixture: 'literals/literales-mmb-es.json'});
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', {fixture: 'literals/literales-general-es.json'});
        cy.intercept('GET', '**/iberia-web-content/links/manage-my-booking/es.json', {fixture: 'literals/links-mmb-es.json'});
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', {fixture: 'literals/links-general-es.json'});
  
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', {fixture: 'general/phone-codes.json'});
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', {fixture: 'general/companies.json'});
  
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/market/commercialsellingdata', {fixture: 'general/commercial-selling-data.json'});
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', {fixture: 'general/aero-lineas.json'});

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'round-trip/updates/import.json'});
        cy.intercept('GET', '**/sse-orm/rs/v6/mmb/**/reshop-conditions', {fixture: 'round-trip/updates/reshop-conditions.json'});
        cy.intercept('POST', '**/trm-apim/rs/v4/digital-boarding', {statusCode: 200, fixture: 'round-trip/updates/digital-boarding.json'});
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries', {fixture: 'round-trip/updates/ancillaries.json'});
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary', {fixture: 'round-trip/updates/ancillaries-summary.json'});
        cy.intercept('POST', '**/sse-favl/rs/v1/digital-menus/status', {fixture: 'round-trip/updates/status.json'});
        cy.intercept('GET', '**/ivm-ivs/rs/v1/invoice/details/filtered/**', {fixture: 'round-trip/updates/filtered.json'});
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', {fixture: 'round-trip/updates/security.json'});
  
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country/nationality', {fixture: 'general/nationality.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/US/states', {fixture: 'general/states-us.json'});
  
        cy.intercept('POST', '**/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
        cy.intercept('PUT', '**/sse-orm/rs/v2/order/**/contact-info', {statusCode: 200});
        cy.intercept('PUT', '**/trm-apim/rs/v3/info/**/security', {statusCode: 200});
        cy.intercept('PUT', '**/sse-orm/rs/v2/order/**/special-needs', {statusCode: 200});
        cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
    });

    it(' documents', () => {
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-box-link.ib-box-link__gdr').eq(0).click();
        cy.get('.ib-box-cols__title.ib-box-cols__title--big.ng-binding').contains('Tus documentos');
        cy.validateProcessAndStepGA4('MODDOC');
    });

    it(' mail', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/**/receipt', { statusCode: 200 });
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-box-link.ib-box-link__gdr').eq(1).click();
        cy.get('.ib-heading.ib-heading--type-1.ng-binding').contains('E-mail de tu reserva actualizada');
        cy.validateProcessAndStepGA4('IBENIT');
        cy.get('.ib-button.ib-button--w-medium.ng-binding').click();
        cy.validateProcessAndStepGA4('IBCENIT');
    });

    it(' flights', () => {
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(0).click();

        cy.scrollTo(0, 0);
        cy.get('.ib-ticket-block__header-title.ng-binding').contains('Tu vuelo a Madrid');
        cy.validateProcessAndStepGA4('IBMTFL');
    });

    it(' passengers', () => {
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(1).click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-cols__title.icon-menu_web.ng-binding').contains('Datos comunes de la reserva');
        cy.validateProcessAndStepGA4('MODPAX');
    });

    it(' emergency contact details', () => {
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(1).click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-cols__title.icon-menu_web.ng-binding').contains('Datos comunes de la reserva');
        cy.validateProcessAndStepGA4('MODPAX');
        cy.get('.ib-box-link.ib-box-link__gdr').click();
        cy.scrollTo(0, 0);
        cy.get('.ib-heading.ib-heading--type-1.ng-binding').contains('Contacto de emergencia');
        cy.validateProcessAndStepGA4('MOEMER');
        cy.get('#name').click('top', {force: true}).type('test');
        cy.get('#phone').click('top', {force: true}).type('666666666');
        cy.get('.ib-button.ib-button--w-medium.ng-binding').click('top');
        cy.validateProcessAndStepGA4('MOCEME');
    });

    it(' additional information', () => {
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(1).click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-cols__title.icon-menu_web.ng-binding').contains('Datos comunes de la reserva');
        cy.validateProcessAndStepGA4('MODPAX');
        cy.get('.ib-box-cols__link.icon-modificar.ng-binding').eq(2).click();
        cy.scrollTo(0, 0);
        cy.get('.ib-heading.ib-heading--type-1.ng-binding').contains('Formulario de entrada al país');
        cy.validateProcessAndStepGA4('MOAPIS');
        cy.get('.ib-check__text.ib-check__text--unfocused.ng-binding').click('top');
        cy.get('.ib-button.ib-button--w-medium.ng-binding').click('top');
        cy.validateProcessAndStepGA4('MOCAPI');
    });

    it(' contact info', () => {
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(1).click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-cols__title.icon-menu_web.ng-binding').contains('Datos comunes de la reserva');
        cy.validateProcessAndStepGA4('MODPAX');
        cy.get('.ib-box-cols__link.icon-modificar.ng-binding').eq(3).click();
        cy.scrollTo(0, 0);
        cy.get('.ib-heading.ib-heading--type-1.ng-binding').contains('Datos de contacto');
        cy.validateProcessAndStepGA4('MOCONT');
        cy.get('#email').click('top', {force: true}).type('panel.niglesias@iberia.es');
        cy.get('#emailRepeat').click('top', {force: true}).type('panel.niglesias@iberia.es');
        cy.get('#phone').click('top', {force: true}).type('666666666');
        cy.get('.ib-button.ib-button--w-medium.ng-binding').click('top');
    });

    it(' frequent passenger', () => {
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(1).click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-cols__title.icon-menu_web.ng-binding').contains('Datos comunes de la reserva');
        cy.validateProcessAndStepGA4('MODPAX');
        cy.get('.ib-box-cols__link.icon-modificar.ng-binding').eq(4).click();
        cy.scrollTo(0, 0);
        cy.get('.ib-heading.ib-heading--type-1.ng-binding').contains('Datos de pasajero frecuente');
        cy.validateProcessAndStepGA4('MOFFLY');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').click('top');
        cy.get('#ui-select-choices-row-1-0').click('top');
        cy.get('#IBPAS_MMB_PASSENGER_FORM_NUMBER_CARD').click('top', {force: true}).type('00000008897183');
        cy.get('.ib-button.ib-button--w-medium.ng-binding').click('top');
        cy.validateProcessAndStepGA4('MOCFFL');
    });

    it(' special assistance', () => {
  
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
  
        cy.anonymousLogin('lindo', 'LVWL8');
  
        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(1).click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-cols__title.icon-menu_web.ng-binding').contains('Datos comunes de la reserva');
        cy.validateProcessAndStepGA4('MODPAX');
        cy.get('.ib-box-cols__link.icon-modificar.ng-binding').eq(5).click();
        cy.scrollTo(0, 0);
        cy.get('.ib-heading.ib-heading--type-1.ng-binding').contains('Necesidades especiales');
        cy.validateProcessAndStepGA4('MOPMR');
        cy.get('.ib-check__text.ng-binding').eq(0).click('top');
        cy.get('.ib-button.ib-button--w-medium.ng-binding').click('top');
        cy.validateProcessAndStepGA4('MOCPMR');
    });
});