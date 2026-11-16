describe('Test voluntary changes workflows', () => {

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

        cy.intercept('POST', '**/trm-apim/rs/v4/health-form', {fixture: 'round-trip/voluntary-changes/health-form.json'});
        cy.intercept('GET', '**/sse-orm/rs/v2/order/voluntaryChangesLog/**', {fixture: 'round-trip/voluntary-changes/voluntary-change-log.json'});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', {fixture: 'round-trip/voluntary-changes/summary-calculation.json'});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment-conditions', { fixture: 'round-trip/voluntary-changes/payment-conditions.json'});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment-methods', { fixture: 'round-trip/voluntary-changes/payment-methods.json'});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment/**/additional-fields/IBERIA_PAY', { fixture: 'round-trip/voluntary-changes/iberia-pay.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FPIBTASA/gcwcs/?retrieveHTML=yes', { fixture: 'round-trip/voluntary-changes/fpibtasa.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FLOWPAGEPAGCUO/gcwcs/?retrieveHTML=yes', { statusCode: 502});
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardFee', { fixture: 'round-trip/voluntary-changes/credit-card-fee.json'});
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardBin', { fixture: 'round-trip/voluntary-changes/credit-card-bin.json'});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country/nationality', {fixture: 'general/nationality.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/CL/states', {fixture: 'general/states-empty.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', {fixture: 'general/country.json'});

        cy.intercept('POST', '**/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });
        cy.intercept('PUT', '**/sse-orm/rs/v2/order/**/contact-info', {statusCode: 200});
        cy.intercept('PUT', '**/trm-apim/rs/v3/info/**/security', {statusCode: 200});
        cy.intercept('PUT', '**/sse-orm/rs/v2/order/**/special-needs', {statusCode: 200});
        cy.intercept('GET', '**/cs/Satellite**', { statusCode: 200 });
        cy.intercept('GET', '**/fp/clear.png', { statusCode: 200 });
        cy.intercept('POST', '**/v2/client_infos', { statusCode: 201 });
        cy.intercept('PUT', '**/iberiapay/api/v2/public/vault/**/credit-card', {fixture: 'general/credit-card.json'});
        cy.intercept('POST', '**/pmt-ppm/rs/ppm/v7/**/payment/**/additional-fields/IBERIA_PAY', { fixture: 'round-trip/voluntary-changes/iberia-pay-post.json'});
        cy.intercept('POST', '**/iberiapay/rb_bf68025iux**', { statusCode: 200 });
        cy.intercept('GET', '**/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });
    });

    it(' voluntary changes', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'round-trip/updates/import.json'});
        cy.intercept('POST', '**/sse-avm/rs/v3/reshop-availability', {fixture: 'round-trip/voluntary-changes/reshop-availability.json'});
        cy.intercept('POST', '**/sse-avm/rs/v2/reshop-fare', {fixture: 'round-trip/voluntary-changes/reshop-fare.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/orderchange', { fixture: 'round-trip/voluntary-changes/orderchange.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('lindo', 'LVWL8');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(7).click();
        cy.validateProcessAndStepGA4('ATCFRT');
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(0).click();
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(1).click();
        cy.get('.ib-input__button').eq(0).click();
        cy.get('.btn.btn-default.btn-sm').eq(36).click();
        cy.get('.ib-input__button').eq(1).click();
        cy.get('.btn.btn-default.btn-sm').eq(37).click();
        cy.get('.ib-button.ib-button--w-big.ib-button--right.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-mini-fare__box.ib-box-mini-fare__box--type-1.ib-box-mini-fare__box--first.ib-box-mini-fare__box--outstanding.ib-box-mini-fare__box--mr').eq(0).click();
        cy.get('.ib-box-mini-fare__box.ib-box-mini-fare__box--type-1.ib-box-mini-fare__box--first.ib-box-mini-fare__box--outstanding.ib-box-mini-fare__box--mr').eq(4).click();
        cy.validateProcessAndStepGA4('ATCPRT');
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.get('.ib-button.ib-button--block.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-text.ib-text--especial.ib-text__spacing.ib-text--spacing-medium.ib-text--lh-xnormal.u-font-large.u-mb-xmedium.ng-binding').contains('Resumen');
        cy.validateProcessAndStepGA4('ATCSUM');
        cy.checkDataLayerEvent({event:'add_to_cart'});
        cy.get('.ib-check__text.ib-check__text--unfocused.ng-binding.ng-scope').click();
        cy.get('.ib-button.ib-button--block.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateProcessAndStepGA4('ATCPURC');
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-text.ib-text--block.ib-text--to-center.ib-text--color-unfocused.ng-binding').contains('Código de confirmación:');
        cy.validateProcessAndStepGA4('ATCBKCF');
        cy.checkDataLayerEvent({event:'purchase'});
    });

    it(' voluntary changes and import have volantury change to false', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'round-trip/updates/import-without-voluntary-change.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('lindo', 'LVWL8');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(7).click();
        cy.validateProcessAndStepGA4('ATCFCNA');
    });

    it(' voluntary changes and fail reshop availability with 404', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'round-trip/updates/import.json'});
        cy.intercept('POST', '**/sse-avm/rs/v3/reshop-availability', {statusCode: 404});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('lindo', 'LVWL8');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(7).click();
        cy.validateProcessAndStepGA4('ATCFRT');
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(0).click();
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(1).click();
        cy.get('.ib-input__button').eq(0).click();
        cy.get('.btn.btn-default.btn-sm').eq(36).click();
        cy.get('.ib-input__button').eq(1).click();
        cy.get('.btn.btn-default.btn-sm').eq(37).click();
        cy.get('.ib-button.ib-button--w-big.ib-button--right.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-msg-alert__text.ib-msg-alert__text--title-large.ng-binding').contains('Lo sentimos, no hay vuelos para esta fecha');
        cy.validateProcessAndStepGA4('ATCERR');
    });

    it(' voluntary changes and fail reshop without fare families', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'round-trip/updates/import.json'});
        cy.intercept('POST', '**/sse-avm/rs/v3/reshop-availability', {fixture: 'round-trip/voluntary-changes/reshop-not-fare-families.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('lindo', 'LVWL8');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(7).click();
        cy.validateProcessAndStepGA4('ATCFRT');
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(0).click();
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(1).click();
        cy.get('.ib-input__button').eq(0).click();
        cy.get('.btn.btn-default.btn-sm').eq(36).click();
        cy.get('.ib-input__button').eq(1).click();
        cy.get('.btn.btn-default.btn-sm').eq(37).click();
        cy.get('.ib-button.ib-button--w-big.ib-button--right.ng-binding').click();
        cy.get('.ib-text.ib-text--large.ib-text--bold.ng-binding').contains('Se ha producido un error');
        cy.validateProcessAndStepGA4('ATCERD');
        cy.get('#MOD_ERROR_BOTON_ACCEPT').click();
    });

    it(' voluntary changes and fail reshop fare', () => {
        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'round-trip/updates/import.json'});
        cy.intercept('POST', '**/sse-avm/rs/v3/reshop-availability', {fixture: 'round-trip/voluntary-changes/reshop-availability.json'});
        cy.intercept('POST', '**/sse-avm/rs/v2/reshop-fare', {statusCode: 409});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('lindo', 'LVWL8');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(7).click();
        cy.validateProcessAndStepGA4('ATCFRT');
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(0).click();
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(1).click();
        cy.get('.ib-input__button').eq(0).click();
        cy.get('.btn.btn-default.btn-sm').eq(36).click();
        cy.get('.ib-input__button').eq(1).click();
        cy.get('.btn.btn-default.btn-sm').eq(37).click();
        cy.get('.ib-button.ib-button--w-big.ib-button--right.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-mini-fare__box.ib-box-mini-fare__box--type-1.ib-box-mini-fare__box--first.ib-box-mini-fare__box--outstanding.ib-box-mini-fare__box--mr').eq(0).click();
        cy.get('.ib-box-mini-fare__box.ib-box-mini-fare__box--type-1.ib-box-mini-fare__box--first.ib-box-mini-fare__box--outstanding.ib-box-mini-fare__box--mr').eq(4).click();
        cy.validateProcessAndStepGA4('ATCPRT');
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.get('.ib-button.ib-button--block.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-text.ib-text--large.ib-text--bold.ng-binding').contains('Se ha producido un error');
        cy.validateProcessAndStepGA4('ATCERT');
        cy.get('#MOD_ERROR_BOTON_ACCEPT').click();
    });

    it(' voluntary changes and fail orderchange', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'round-trip/updates/import.json'});
        cy.intercept('POST', '**/sse-avm/rs/v3/reshop-availability', {fixture: 'round-trip/voluntary-changes/reshop-availability.json'});
        cy.intercept('POST', '**/sse-avm/rs/v2/reshop-fare', {fixture: 'round-trip/voluntary-changes/reshop-fare.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/orderchange', {statusCode: 417});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('lindo', 'LVWL8');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__sublink.ng-binding').eq(7).click();
        cy.validateProcessAndStepGA4('ATCFRT');
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(0).click();
        cy.get('.ib-check__text.ib-check__text--big.ib-check__text--special.ng-binding').eq(1).click();
        cy.get('.ib-input__button').eq(0).click();
        cy.get('.btn.btn-default.btn-sm').eq(36).click();
        cy.get('.ib-input__button').eq(1).click();
        cy.get('.btn.btn-default.btn-sm').eq(37).click();
        cy.get('.ib-button.ib-button--w-big.ib-button--right.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-box-mini-fare__box.ib-box-mini-fare__box--type-1.ib-box-mini-fare__box--first.ib-box-mini-fare__box--outstanding.ib-box-mini-fare__box--mr').eq(0).click();
        cy.get('.ib-box-mini-fare__box.ib-box-mini-fare__box--type-1.ib-box-mini-fare__box--first.ib-box-mini-fare__box--outstanding.ib-box-mini-fare__box--mr').eq(4).click();
        cy.validateProcessAndStepGA4('ATCPRT');
        cy.checkDataLayerEvent({event:'view_item_list'});
        cy.checkDataLayerEvent({event:'select_item'});
        cy.get('.ib-button.ib-button--block.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-text.ib-text--especial.ib-text__spacing.ib-text--spacing-medium.ib-text--lh-xnormal.u-font-large.u-mb-xmedium.ng-binding').contains('Resumen');
        cy.validateProcessAndStepGA4('ATCSUM');
        cy.checkDataLayerEvent({event:'add_to_cart'});
        cy.get('.ib-check__text.ib-check__text--unfocused.ng-binding.ng-scope').click();
        cy.get('.ib-button.ib-button--block.ng-binding').click();

        cy.scrollTo(0, 0);
        cy.get('#pmt-nav-tab-IBERIA_PAY-contain');
        cy.validateProcessAndStepGA4('ATCPURC');
        cy.checkDataLayerEvent({event:'add_payment_info'});
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0);
        cy.get('.ib-heading.ib-heading--type-1.ng-binding').contains('Solicitud de compra pendiente de confirmación');
        cy.validateProcessAndStepGA4('ATCBKER');
    });
});
