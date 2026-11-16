describe('Test invoice tab', () => {

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
      cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'invoices/import.json'});
      cy.intercept('GET', '**/sse-orm/rs/v6/mmb/**/reshop-conditions', {fixture: 'invoices/reshop-conditions.json'});
      cy.intercept('POST', '**/sse-orm/rs/v1/refund/voucher/', {fixture: 'invoices/voucher.json'});
      cy.intercept('POST', '**/trm-apim/rs/v4/digital-boarding', {statusCode: 204, fixture: 'invoices/digital-boarding-204.json'});
      cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', {fixture: 'invoices/ancillaries.json'});
      cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', {fixture: 'invoices/ancillaries-summary.json'});
      cy.intercept('POST', '**/sse-favl/rs/v1/digital-menus/status', {fixture: 'invoices/status.json'});
      cy.intercept('GET', '**/ivm-ivs/rs/v1/invoice/details/filtered/**', {fixture: 'invoices/invoice-details-filtered.json'});

      cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', {fixture: 'general/country.json'});
      cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', {fixture: 'general/states.json'});

      cy.intercept('POST', '**/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
      cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
  });

  it(' request invoice', () => {

      cy.intercept('POST', '**/ivm-ivs/rs/v1/invoice/issue/**', {statusCode: 204, fixture: 'invoices/invoice-issue-204.json'});

      cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

      cy.scrollTo(0, 0);
      cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type('test');
      cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type('M4BQT');
      cy.get('#ANONYMOUS_LOGIN_BOTON').click();

      cy.scrollTo(0, 0);
      cy.get('.ib-lateral-menu__sublink.ib-link--button.ng-binding').click();

      cy.scrollTo(0, 0);
      cy.validateProcessAndStepGA4('FACGDR');
      cy.get('.ib-link.ib-link--button.ib-link--primary.ib-link--hover-primary.ib-link--underline.ib-link--black.ib-link--arrow.ib-link__icon--arrow-right.ng-binding.ng-scope').click();

      cy.scrollTo(0, 0);
      cy.validateProcessAndStepGA4('FACLIS');
      cy.get('.ib-check__label.ib-check__label--vertical-align-baseline.ib-check__label--vertical-align-sub').eq(0).click();
      cy.get('#identityInformation').click('top').type('12345678Z');
      cy.get('#email').click('top').type('test@test.com');
      cy.get('#address').click('top').type('Calle Iberia');
      cy.get('#floor').click('top').type('1');
      cy.get('#city').click('top').type('Madrid');
      cy.get('#postalCode').click('top').type('28001');
      cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').click();
      cy.get('#ui-select-choices-row-1-0').click();
      cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').eq(1).click();
      cy.get('#ui-select-choices-row-2-0').click();
      cy.get('.ib-button.ib-button--w-medium.ng-binding').eq(1).click();
      
      cy.scrollTo(0, 0);
      cy.validateProcessAndStepGA4('FACRES');
      cy.get('.ib-button.ib-button--w-medium.ng-binding').click();
      

      cy.scrollTo(0, 0);
      cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.u-width-auto.ng-binding').contains('Solicitada');
      cy.validateProcessAndStepGA4('FACSOK');
      cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.ib-link.ib-link--underline.u-width-auto.ng-binding.ng-scope').eq(0).click();

      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Adulto Dos');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Test');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('12345678Z');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('test@test.com');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Calle Iberia');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('1');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Madrid');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('28001');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('A Coruña');
      cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Spain');
      cy.validateProcessAndStepGA4('FACSOL');
      cy.get('.ib-button.ib-button--normal.ib-button--only-full-mobile.ng-binding').click();
  });

  it(' request invoice mobile format', () => {

    cy.intercept('POST', '**/ivm-ivs/rs/v1/invoice/issue/**', {statusCode: 204, fixture: 'invoices/invoice-issue-204.json'});

    cy.viewport('iphone-x')
    cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

    cy.scrollTo(0, 0);
    cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type('test');
    cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type('M4BQT');
    cy.get('#ANONYMOUS_LOGIN_BOTON').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-lateral-menu__open.hidden-xl.hidden-lg').click();
    cy.get('.ib-lateral-menu__sublink.ib-link--button.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACGDR');
    cy.get('.ib-button.ib-button--block.ng-binding.ng-scope').eq(0).click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACLISF');
    cy.get('.ib-check__label.ib-check__label--vertical-align-baseline.ib-check__label--vertical-align-sub').eq(0).click();
    cy.get('.ib-button.ib-button--w-medium.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.get('#identityInformation').click('top').type('12345678Z');
    cy.get('#email').click('top').type('test@test.com');
    cy.get('#address').click('top').type('Calle Iberia');
    cy.get('#floor').click('top').type('1');
    cy.get('#city').click('top').type('Madrid');
    cy.get('#postalCode').click('top').type('28001');
    cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').click();
    cy.get('#ui-select-choices-row-1-0').click();
    cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').eq(1).click();
    cy.get('#ui-select-choices-row-2-0').click();
    cy.get('.ib-button.ib-button--w-medium.ng-binding').click();
    
    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACRES');
    cy.get('.ib-button.ib-button--w-medium.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.u-width-auto.ng-binding').contains('Solicitada');
    cy.validateProcessAndStepGA4('FACSOK');
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.ib-link.ib-link--underline.u-width-auto.ng-binding.ng-scope').eq(0).click();

    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Adulto Dos');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Test');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('12345678Z');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('test@test.com');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Calle Iberia');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('1');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Madrid');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('28001');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('A Coruña');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Spain');
    cy.validateProcessAndStepGA4('FACSOL');
    cy.get('.ib-button.ib-button--normal.ib-button--only-full-mobile.ng-binding').click();
  });

  it(' request invoice duplicated', () => {

    cy.intercept('POST', '**/ivm-ivs/rs/v1/invoice/issue/**', {statusCode: 204, fixture: 'invoices/invoice-issue-204.json'});
    cy.intercept('POST', '**/api/ivm-ivs/rs/v1/invoice/duplicate/**', {statusCode: 204, fixture: 'invoices/duplicate-204.json'});

    cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

    cy.scrollTo(0, 0);
    cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type('test');
    cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type('M4BQT');
    cy.get('#ANONYMOUS_LOGIN_BOTON').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-lateral-menu__sublink.ib-link--button.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACGDR');
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.ib-link.ib-link--underline.u-width-auto.ng-binding.ng-scope').eq(0).click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACEMT');
    cy.get('.ib-button.ib-button--inverse.ib-button--h-xmedium-responsive-2.ib-button--w-normal.ib-button--only-full-mobile.ng-binding').click();
    cy.get('.ib-msg-alert__text.ib-msg-alert__text--bold.ng-binding').contains('Te hemos reenviado la copia de tu factura');
    cy.validateProcessAndStepGA4('FACROK');
  });

  it(' fail with 400 request invoice duplicated', () => {

    cy.intercept('POST', '**/ivm-ivs/rs/v1/invoice/issue/**', {statusCode: 204, fixture: 'invoices/invoice-issue-204.json'});
    cy.intercept('POST', '**/api/ivm-ivs/rs/v1/invoice/duplicate/**', {statusCode: 400, fixture: 'invoices/duplicate-400.json'});

    cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

    cy.scrollTo(0, 0);
    cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type('test');
    cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type('M4BQT');
    cy.get('#ANONYMOUS_LOGIN_BOTON').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-lateral-menu__sublink.ib-link--button.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACGDR');
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.ib-link.ib-link--underline.u-width-auto.ng-binding.ng-scope').eq(0).click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACEMT');
    cy.get('.ib-button.ib-button--inverse.ib-button--h-xmedium-responsive-2.ib-button--w-normal.ib-button--only-full-mobile.ng-binding').click();
    cy.get('.ib-msg-alert__text.ib-msg-alert__text--bold.ng-binding').contains('Factura no reenviada');
    cy.validateProcessAndStepGA4('FACRKO');
  });

  it(' request invoice and issue return 206', () => {

    cy.intercept('POST', '**/ivm-ivs/rs/v1/invoice/issue/**', {statusCode: 206, fixture: 'invoices/invoice-issue-206.json'});

    cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

    cy.scrollTo(0, 0);
    cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type('test');
    cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type('M4BQT');
    cy.get('#ANONYMOUS_LOGIN_BOTON').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-lateral-menu__sublink.ib-link--button.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACGDR');
    cy.get('.ib-link.ib-link--button.ib-link--primary.ib-link--hover-primary.ib-link--underline.ib-link--black.ib-link--arrow.ib-link__icon--arrow-right.ng-binding.ng-scope').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACLIS');
    cy.get('.ib-check__label.ib-check__label--vertical-align-baseline.ib-check__label--vertical-align-sub').eq(0).click();
    cy.get('.ib-check__label.ib-check__label--vertical-align-baseline.ib-check__label--vertical-align-sub').eq(1).click();
    cy.get('#identityInformation').click('top').type('12345678Z');
    cy.get('#email').click('top').type('test@test.com');
    cy.get('#address').click('top').type('Calle Iberia');
    cy.get('#floor').click('top').type('1');
    cy.get('#city').click('top').type('Madrid');
    cy.get('#postalCode').click('top').type('28001');
    cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').click();
    cy.get('#ui-select-choices-row-1-0').click();
    cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').eq(1).click();
    cy.get('#ui-select-choices-row-2-0').click();
    cy.get('.ib-button.ib-button--w-medium.ng-binding').eq(1).click();
    
    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACRES');
    cy.get('.ib-button.ib-button--w-medium.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.u-width-auto.ng-binding').contains('Solicitada');
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.u-width-auto.ng-binding.ib-table-breakdown__txt--red.ib-text--underline').contains('No disponible');
    cy.validateProcessAndStepGA4('FACPKO');
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.ib-link.ib-link--underline.u-width-auto.ng-binding.ng-scope').eq(0).click();

    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Adulto Dos');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Test');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('12345678Z');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('test@test.com');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Calle Iberia');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('1');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Madrid');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('28001');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('A Coruña');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Spain');
    cy.validateProcessAndStepGA4('FACSOL');
    cy.get('.ib-button.ib-button--normal.ib-button--only-full-mobile.ng-binding').click();
  });

  it(' request invoice and issue return 400', () => {

    cy.intercept('POST', '**/ivm-ivs/rs/v1/invoice/issue/**', {statusCode: 400, fixture: 'invoices/invoice-issue-400.json'});

    cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

    cy.scrollTo(0, 0);
    cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type('test');
    cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type('M4BQT');
    cy.get('#ANONYMOUS_LOGIN_BOTON').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-lateral-menu__sublink.ib-link--button.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACGDR');
    cy.get('.ib-link.ib-link--button.ib-link--primary.ib-link--hover-primary.ib-link--underline.ib-link--black.ib-link--arrow.ib-link__icon--arrow-right.ng-binding.ng-scope').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACLIS');
    cy.get('.ib-check__label.ib-check__label--vertical-align-baseline.ib-check__label--vertical-align-sub').eq(0).click();
    cy.get('.ib-check__label.ib-check__label--vertical-align-baseline.ib-check__label--vertical-align-sub').eq(1).click();
    cy.get('#identityInformation').click('top').type('12345678Z');
    cy.get('#email').click('top').type('test@test.com');
    cy.get('#address').click('top').type('Calle Iberia');
    cy.get('#floor').click('top').type('1');
    cy.get('#city').click('top').type('Madrid');
    cy.get('#postalCode').click('top').type('28001');
    cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').click();
    cy.get('#ui-select-choices-row-1-0').click();
    cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').eq(1).click();
    cy.get('#ui-select-choices-row-2-0').click();
    cy.get('.ib-button.ib-button--w-medium.ng-binding').eq(1).click();
    
    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACRES');
    cy.get('.ib-button.ib-button--w-medium.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-msg-alert__text.ib-msg-alert__text--bold.ng-binding').contains('Solicitud no enviada');
    cy.validateProcessAndStepGA4('FACSKO');
  });

  it(' request invoice logged', () => {

    cy.intercept('POST', '**/ivm-ivs/rs/v1/invoice/issue/**', {statusCode: 204, fixture: 'invoices/invoice-issue-204.json'});
    cy.intercept('GET', '**/prlm-mbm/rs/v2/members/00000008438798', { statusCode: 200 });
    cy.intercept('POST', '**/iberia--identity.sandbox.my.site.com/IbIdentity/**', { statusCode: 200 });
    cy.intercept('POST', '**/api/auth/realms/commercial_platform/protocol/openid-connect/**', { statusCode: 200 });

    cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

    cy.logging();

    cy.scrollTo(0, 0);
    cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type('test');
    cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type('M4BQT');
    cy.get('#ANONYMOUS_LOGIN_BOTON').click();

    cy.scrollTo(0, 0);
    cy.get('.ib-lateral-menu__sublink.ib-link--button.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACGDR');
    cy.get('.ib-link.ib-link--button.ib-link--primary.ib-link--hover-primary.ib-link--underline.ib-link--black.ib-link--arrow.ib-link__icon--arrow-right.ng-binding.ng-scope').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACLIS');
    cy.get('.ib-check__label.ib-check__label--vertical-align-baseline.ib-check__label--vertical-align-sub').eq(0).click();
    cy.get("input[id=identityInformation]").should('have.value', '94454725G');
    cy.get("input[id=email]").should('have.value', 'qaloya.l.t.y1@gmail.com');
    cy.get("input[id=address]").should('have.value', 'Nueva casa chuli');
    cy.get('#floor').click('top').type('1');
    cy.get('#city').click('top').type('Madrid');
    cy.get("input[id=postalCode]").should('have.value', '8941');
    cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').click();
    cy.get('#ui-select-choices-row-1-0').click();
    cy.get('.ib-select__list-ipt.ui-select-match.ng-scope').eq(1).click();
    cy.get('#ui-select-choices-row-2-0').click();
    cy.get('.ib-button.ib-button--w-medium.ng-binding').eq(1).click();
    
    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACRES');
    cy.get('.ib-button.ib-button--w-medium.ng-binding').click();

    cy.scrollTo(0, 0);
    cy.validateProcessAndStepGA4('FACSOK');
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.u-width-auto.ng-binding').contains('Solicitada');
    cy.get('.ib-table-breakdown__txt.ib-table-breakdown__txt--responsive--invoice.ib-link.ib-link--underline.u-width-auto.ng-binding.ng-scope').eq(0).click();

    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Atul');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Singh P');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('94454725G');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('qaloya.l.t.y1@gmail.com');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Nueva casa chuli');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('1');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Madrid');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('8941');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('A Coruña');
    cy.get('.ib-text.ib-text--block.ib-text--lh-medium.ng-binding').contains('Spain');
    cy.validateProcessAndStepGA4('FACSOL');
    cy.get('.ib-button.ib-button--normal.ib-button--only-full-mobile.ng-binding').click();
  });
});
