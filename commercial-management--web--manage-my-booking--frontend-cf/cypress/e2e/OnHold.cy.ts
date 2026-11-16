import {importResponse} from '../fixtures/OnHold/import';
import {dashboardDigitalData as dataDash, 
  paymentsDigitalData as dataPay,
  confirmationDigitalData as dataConf
} from '../fixtures/OnHold/datalayer-objects/digital-data'
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
      cy.intercept('POST', '**/sse-orm/rs/v2/order/import', importResponse);
      cy.intercept('GET', '**/sse-orm/rs/v6/mmb/**/reshop-conditions', {fixture: 'OnHold/reshop-conditions.json'});
      cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardFee', {statusCode: 200});
      cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardBin', {statusCode: 200});



      cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', {fixture: 'general/country.json'});
      cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', {fixture: 'general/states.json'});
      cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment-methods', { fixture: 'OnHold/payment-methods.json'});
      cy.intercept('PUT', '**/iberiapay/api/v2/public/vault/**/credit-card', {fixture: 'general/credit-card.json'});
      cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
      cy.intercept('GET', '**/fp/clear.png', { statusCode: 200 });
      cy.intercept('POST', '**/v2/client_infos', { statusCode: 201 });
      cy.intercept('POST', '**/iberiapay/rb_bf68025iux**', { statusCode: 200 });
      cy.intercept('GET', '**/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });
      cy.intercept('POST', '**/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
      cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
      cy.intercept('POST','**/sse-orm/rs/v2/on-hold/issue', {fixture: 'OnHold/issue.json'});
      cy.intercept('POST','**/prlm-pc/rs/v1/points/summary-calculation', {fixture: 'OnHold/summary-calculation.json'});
      cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries(\/?\?.*)?/, { fixture: 'OnHold/ancillaries.json' });
  });

  it('Confirm onHold annonymous', () => {
      cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
      cy.scrollTo(0, 0);
      cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type('Miles');
      cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type('L5L0T');
      cy.get('#ANONYMOUS_LOGIN_BOTON').click();

      cy.scrollTo(0, 0).wait(1000);
      cy.validateProcessAndStepGA4('OHMTDT');
      cy.validateDigitalDataInformation(dataDash as any);
      cy.get('#ON_HOLD_CONTINUE').click()
      cy.scrollTo(0, 0).wait(3000);
      cy.get('#pmt-nav-tab-IBERIA_PAY-contain');

     // cy.validateDigitalDataInformation({Quadrigam: 'IBPURC', Process: 'booking slice by slice', Step: 'pago'});
      cy.scrollTo(0, 0).wait(1000);
      cy.validateProcessAndStepGA4('OHINFO');
      cy.validateDigitalDataInformation(dataPay as any);
      cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4012999999999999');
      cy.get('#name').click('top').type('test');
      cy.get('#surnames').click('top').type('test');
      cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
      cy.get('#ui-select-choices-row-1-2').click();
      cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
      cy.get('#ui-select-choices-row-2-6').click();
      cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555');
      cy.get('#check_terms_conditions_span').click('topLeft');
      cy.get('#pmt-total-price-pay-btn').click();
      cy.scrollTo(0, 0).wait(1000);
      cy.validateProcessAndStepGA4('RTBKCF');
      cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
      cy.validateDigitalDataInformation(dataConf as any);
      cy.scrollTo(0, 0);    
  });

});
