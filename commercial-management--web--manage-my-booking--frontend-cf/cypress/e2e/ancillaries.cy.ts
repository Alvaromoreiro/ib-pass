import {searchDigitalData as dataSearch,
    dashboardDigitalData as dataDash,
    ancillariesPageData as dataAnc,
    paymentsDigitalData as dataPay,
    confirmationDigitalData as dataConf
  } from '../fixtures/ancillaries-flow/datalayer-objects/digital-data'
describe('Test ancillaries workflows', () => {

    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', {fixture: 'literals/literales-general-es.json'});
        cy.intercept('GET', '**/iberia-web-content/literales/manage-my-booking/es.json', {fixture: 'literals/literales-mmb-es.json'});
        cy.intercept('GET', '**/iberia-web-content/links/manage-my-booking/es.json', {fixture: 'literals/links-mmb-es.json'});
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', {fixture: 'literals/links-general-es.json'});
        cy.intercept('GET', '**/iberia-web-content/iconos/payment/creditcardlogo.json', {statusCode: 200});
        // cy.intercept('GET', '**/iberia-web-content/imagenes/payment-tabs/transitions/CREDIT_CARD.svg', {statusCode: 200});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', {fixture: 'general/phone-codes.json'});
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', {fixture: 'general/companies.json'});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/market/commercialsellingdata', {fixture: 'general/commercial-selling-data.json'});
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', {fixture: 'general/aero-lineas.json'});

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'ancillaries-flow/import.json'});
        cy.intercept('GET', '**/sse-orm/rs/v2/order/import-cached/**', {fixture: 'ancillaries-flow/import-cached.json'});
        cy.intercept('GET', '**/sse-orm/rs/v6/mmb/**/reshop-conditions', {fixture: 'ancillaries-flow/reshop-conditions.json'});
        cy.intercept('POST', '**/trm-apim/rs/v4/digital-boarding', {statusCode: 204, fixture: 'ancillaries-flow/digital-boarding.json'});
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', {fixture: 'ancillaries-flow/ancillaries.json'});
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', {fixture: 'ancillaries-flow/ancillaries-summary.json'});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/ancillaries-calculation**', {fixture: 'ancillaries-flow/ancillaries-calculation.json'});
        cy.intercept('POST', '**/api/ass-fass/rs/fass/v6/**/ancillaries/pay-and-issue', {fixture: 'ancillaries-flow/pay-and-issue.json'});
        cy.intercept('GET', '**/api/sea-cism/rs/cism/v4/**/flight/IB044820240422/seatmapLayout', {fixture: 'ancillaries-flow/seatmapLayout.json'});
        cy.intercept('PUT', '**/api/v1/management/**', { statusCode: 200 });
        cy.intercept('POST', '**/sse-favl/rs/v1/digital-menus/status', {fixture: 'ancillaries-flow/status.json'});
        cy.intercept('GET', '**/ivm-ivs/rs/v1/invoice/details/filtered/**', {fixture: 'round-trip/updates/filtered.json'});
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', {fixture: 'round-trip/updates/security.json'});

        cy.intercept('POST', '**/trm-apim/rs/v4/health-form', {fixture: 'round-trip/voluntary-changes/health-form.json'});
        cy.intercept('GET', '**/sse-orm/rs/v2/order/voluntaryChangesLog/**', {fixture: 'round-trip/voluntary-changes/voluntary-change-log.json'});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', {fixture: 'round-trip/voluntary-changes/summary-calculation.json'});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment-conditions', { fixture: 'round-trip/voluntary-changes/payment-conditions.json'});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment-methods', { fixture: 'ancillaries-flow/payment-methods.json'});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment/**/additional-fields/IBERIA_PAY', { fixture: 'round-trip/voluntary-changes/iberia-pay.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FPIBTASA/gcwcs/?retrieveHTML=yes', { fixture: 'round-trip/voluntary-changes/fpibtasa.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FLOWPAGEPAGCUO/gcwcs/?retrieveHTML=yes', { statusCode: 200});
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardFee', { fixture: 'round-trip/voluntary-changes/credit-card-fee.json'});
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardBin', { fixture: 'round-trip/voluntary-changes/credit-card-bin.json'});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country/nationality', {fixture: 'general/nationality.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/CL/states', {fixture: 'general/states-empty.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', {fixture: 'general/country.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', {fixture: 'general/states.json'});

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
        cy.intercept('POST', '**/pmt-ppm/rs/ppm/v7/payment-methods-info', { statusCode: 200 });

        cy.intercept('POST', 'https://pre.be.bob.io/widget/**', {fixture: 'ancillaries-flow/bob.json'});
        cy.intercept('POST', 'https://pre.be.bob.io/widget/**&isOpen=true', { statusCode: 200 });

        cy.intercept('POST', 'https://www.sandbox.paypal.com/**', { statusCode: 200 });
        cy.intercept('GET','https://www.sandbox.paypal.com/**', { statusCode: 200 });
        cy.intercept('GET', 'https://cdn.nemuru.com/pricings/stg/494cfa22-8a95-4318-91e2-9d67870ea542/pricings.json', { statusCode: 200 });
        cy.intercept('POST', 'https://www.test.indra-netplus.com/**', { statusCode: 200 });


        cy.intercept('GET', 'https://pagead2.googlesyndication.com/**', { statusCode: 200 });
        cy.intercept('GET', 'https://securepubads.g.doubleclick.net/pagead/ppub_config?ippd=localhost%3A9008', { statusCode: 200 });

        cy.intercept('POST', '**/sse-favl/rs/v1/digital-menus/download-menu', { fixture: 'ancillaries-flow/download-menu.json', statusCode: 200 }).as('downloadMenu');
        cy.intercept('POST', '**/sse-favl/rs/v1/digital-menus', {fixture: 'ancillaries-flow/digital-menu.json', statusCode: 200}).as('digitalMenus');

    });

    //MODBAG & MOBAGG & MOPURC & MOBKCF
    it('1. Buy Baggages of Dashboard page', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        cy.validateProcessAndStepGA4('CHKTRP');
        cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        cy.get('.ib-box-cols__link-container.ib-box-cols__link-container--icon-caret').eq(0).click();
        cy.validateProcessAndStepGA4('MODBAG');

        //CLICK TO OPEN MODAL
        cy.get('.ib-link').eq(0).click();
        cy.scrollTo(0, 0);
        cy.validateProcessAndStepGA4('MOBAGG');

        //ADD BAG 15KG
        cy.get('.ib-add-bags__button.ib-add-bags__button--add').eq(0).click();
        //ACCEPT BUTTON CLICK
        cy.get('.ib-button.ib-button--large').eq(0).click();
        //CLICK BASKET
        cy.get('.ib-header-common--basket a').eq(0).click();
        //CLICK BASKET PAYMENT BUTTON
        cy.get('.ib-button.ib-button--block').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');
        cy.validateDigitalDataInformation(dataPay as any);

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0).wait(2000);
        cy.validateProcessAndStepGA4('MOBKCF');
        cy.validateDigitalDataInformation(dataConf as any);

    });

    //MODSEA & MOPURC & MOBKCF
    it('2. Buy Seats of Dashboard page', () => {
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', {fixture: 'ancillaries-flow/ancillaries-summary-pending-seats.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        cy.get('ib-mmb-manage-seat-info .ib-box-cols__link-container.ib-box-cols__link-container--icon-caret').eq(0).click();
        cy.validateProcessAndStepGA4('MODSEA');
        //CLICK TO OPEN MODAL
        cy.get('.ib-button.ib-button--w-medium').eq(0).click();
        cy.wait(3000);

        //CLICK BASKET
        cy.get('.ib-header-common--basket a').eq(0).click();
        //CLICK BASKET PAYMENT BUTTON
        cy.get('.ib-button.ib-button--block').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0).wait(2000);
        cy.validateProcessAndStepGA4('MOBKCF');

    });

    //MODSEA & MOUPG & MOPURC & MOBKCF
    it('3. Buy UPGrading of Dashboard page', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        cy.get('.ib-box-link.ib-box-link__gdr').eq(0).click();
        cy.wait(1000);
        cy.validateProcessAndStepGA4('MOUPG');

        cy.get('.ib-input-tooltip__input').eq(0).click('top', {force: true}).type('60', {force: true});
        cy.get('.ib-input-tooltip__input').eq(0).blur();
        cy.wait(1000);

        cy.get('.ib-button.ib-button--w-medium.ib-button--block-xs').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4212345678901237', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-6').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('737', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0).wait(2000);
        cy.validateProcessAndStepGA4('MOBKCF');

    });

    //MOANCI & MOBAGG & MOPURC & MOBKCF
    it('4. Buy Baggages', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK BAGGAGES TO OPEN MODAL
        cy.get('#OPEN_BAGGAGES').click();
        cy.validateProcessAndStepGA4('MOBAGG');

        //ADD BAG 15KG
        cy.get('.ib-add-bags__button.ib-add-bags__button--add').eq(0).click();
        //ACCEPT BUTTON CLICK
        cy.get('.ib-button.ib-button--large').eq(0).click();
        cy.wait(1000);

        //CLICK BASKET
        cy.get('.ib-header-common--basket a').eq(0).click();
        //CLICK BASKET PAYMENT BUTTON
        cy.get('.ib-button.ib-button--block').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0).wait(2000);
        cy.validateProcessAndStepGA4('MOBKCF');

    });

    //ERROR CHARGE CONFIRMATION
    //MOANCI & MOSEAT & MOPURC & MOBKCF
    it('5. Buy Seats', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK SEATS TO OPEN MODAL
        cy.get('.ib-button.ib-button--w-small.ib-button--block-xs.ib-button--default-normal').eq(1).click();
        cy.wait(3000);
        cy.validateProcessAndStepGA4('MOSEAT');
        //SELECT A SEAT 1
        cy.get('[for="cabins-1-row-3-seat-0"]').click('top', {force: true});
        //NEXT BUTTON CLICK
        cy.get('.ib-button.ib-button--w-medium').eq(0).click();
        //SELECT A SEAT 2
        cy.get('[for="cabins-1-row-3-seat-1"]').click('top', {force: true});
        //NEXT BUTTON CLICK
        cy.get('.ib-button.ib-button--w-medium').eq(0).click();
        //SELECT A SEAT 3
        cy.get('[for="cabins-1-row-3-seat-2"]').click('top', {force: true});
        //NEXT BUTTON CLICK
        cy.get('.ib-button.ib-button--w-medium').eq(0).click();

        cy.wait(1000);
        //ACCEPT BUTTON CLICK
        cy.get('.ib-button.ib-button--large').eq(0).click();
        cy.wait(1000);

        //CLICK BASKET
        cy.get('.ib-header-common--basket a').eq(0).click();
        //CLICK BASKET PAYMENT BUTTON
        cy.get('.ib-button.ib-button--block').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0).wait(2000);
        cy.validateProcessAndStepGA4('MOBKCF');

    });

    //MOANCI & MOPRIO & MOPURC & MOBKCF
    it('6. Buy Priority Boarding', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK PRIORITY BOARDING BUTTON TO OPEN MODAL
        cy.get('#anc-comp-card-priorityBoarding-button').eq(0).click();
        cy.validateProcessAndStepGA4('MOPRIO');
        //ADD TO DEPARTURE
        cy.get('#trip--0').click('top', {force: true});

        cy.wait(1000);
        //ACCEPT BUTTON CLICK
        cy.get('.ib-button.ib-button--large').eq(0).click();
        cy.wait(1000);

        //CLICK BASKET
        cy.get('.ib-header-common--basket a').eq(0).click();
        //CLICK BASKET PAYMENT BUTTON
        cy.get('.ib-button.ib-button--block').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0).wait(2000);
        cy.validateProcessAndStepGA4('MOBKCF');

    });

    //MOANCI & MOLUGG & MOPURC & MOBKCF
    it('7. Buy SPECS', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK PRIORITY BOARDING BUTTON TO OPEN MODAL
        cy.get('#mmb-customize-flights-speqs-box-4 .ib-button').eq(0).click();
        cy.validateProcessAndStepGA4('MOLUGG');
        //ADD A BIKE
        cy.get('.ib-add-bags__button.ib-add-bags__button--middle.ib-add-bags__button--small.ib-add-bags__button--add.ib-add-bags__button--flex-center').eq(0).click('top', {force: true});

        //ACCEPT BUTTON CLICK
        cy.get('.ib-button.ib-button--large').eq(0).click();
        cy.wait(1000);

        //CLICK BASKET
        cy.get('.ib-header-common--basket a').eq(0).click();
        //CLICK BASKET PAYMENT BUTTON
        cy.get('.ib-button.ib-button--block').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0).wait(2000);
        cy.validateProcessAndStepGA4('MOBKCF');

    });

    //MOANCI & MODINS & MOPURC & MOBKCF
    it('8. Buy Insurance', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK PRIORITY BOARDING BUTTON TO OPEN MODAL
        cy.get('#mmb-customize-flights-insurance-box-8 .ib-button').eq(0).click();
        cy.validateProcessAndStepGA4('MODINS');

        //ADD A INSURANCE
        cy.get('#radio_IBAESONA05MMBEST').eq(0).click('top', {force: true});
        cy.get('#checkAcceptConditions').eq(0).click('top', {force: true});

        cy.wait(1000);
        //ACCEPT BUTTON CLICK
        cy.get('.ib-button.ib-button--large').eq(0).click();
        cy.wait(1000);

        //CLICK BASKET
        cy.get('.ib-header-common--basket a').eq(0).click();
        //CLICK BASKET PAYMENT BUTTON
        cy.get('.ib-button.ib-button--block').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('5499830000000015', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-2-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-3-2').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0).wait(2000);
        cy.validateProcessAndStepGA4('MOBKCF');

    });

    //MOANCI & MOUPG & MOPURC & MOBKCF
    it('9. Buy UPG', () => {

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        //CLICK UPG BUTTON TO OPEN MODAL
        cy.get('#mmb-customize-flights-upgrade-box-2 .ib-button').eq(0).click();
        cy.wait(1000);
        cy.validateProcessAndStepGA4('MOUPG');

        cy.get('.ib-input-tooltip__input').eq(0).click('top', {force: true}).type('60', {force: true});
        cy.get('.ib-input-tooltip__input').eq(0).blur();
        cy.wait(1000);

        cy.get('.ib-button.ib-button--w-medium.ib-button--block-xs').eq(0).click();

        cy.scrollTo(0, 0).wait(4000);

        cy.validateProcessAndStepGA4('MOPURC');

        //TYPE CREDIT CARD
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4212345678901237', {force: true});
        cy.get('#name').click('top', {force: true}).type('test', {force: true});
        cy.get('#surnames').click('top', {force: true}).type('test', {force: true});
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-2').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-6').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('737', {force: true});
        // cy.get('#dccRadio2').click('topLeft');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.wait(10000);
        cy.validateProcessAndStepGA4('MOBKCF');

    });

    //MOANCI & MODBOB & EXTERNAL
    it('10. Buy BOB', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 1500);

        //CLICK BOB BUTTON TO OPEN MODAL
        cy.get('#test-widget-bob .ib-button.ib-button--block-xs').click();
        cy.wait(1000);
        cy.get('#test-widget-bob .ib-button.ib-button--block-xs').click();
        cy.validateProcessAndStepGA4('MODBOB');
        //EXTERNAL

    });

    //MOANCI & MODGCA & MOMEAL & MEALCF
    it('11.1 Enter Gastronomic Proposal and choose SPECIALMEALS option', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK GASTRONOMIC BUTTON TO OPEN MODAL
        cy.get('#mmb-customize-flights-meals-box-10 .ib-button').eq(0).click();
        cy.wait(1000);
        cy.validateProcessAndStepGA4('MODGCA');

        //OPEN SPECIAL MEALS OPTION
        cy.get('#SPECIAL_MEALS_OPTION .ib-button').eq(0).click();
        cy.wait(1000);
        cy.validateProcessAndStepGA4('MOMEAL');

        cy.get('.ib-radio__input').eq(0).click('top', {force: true});
        cy.get('.ib-button.ib-button--w-medium').eq(0).click();
        cy.get('.ib-radio__input').eq(0).click('top', {force: true});
        cy.get('.ib-button.ib-button--w-medium').eq(0).click();

        cy.wait(4000);
        cy.validateProcessAndStepGA4('MEALCF');
    });

    it('11.2. Enter Gastronomic Proposal and choose ONBOARDMENU option', ()=> {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK GASTRONOMIC BUTTON TO OPEN MODAL
        cy.get('#mmb-customize-flights-meals-box-10 .ib-button').eq(0).click();
        cy.wait(1000);
        cy.validateProcessAndStepGA4('MODGCA');


        //OPEN ONBOARDMENU OPTION
        cy.get('#ONBOARD_MENU_OPTION .ib-button').eq(0).click();
        cy.wait(1000);
        cy.validateDigitalDataInformation({
            'Quadrigam': 'MODGCA',
            'TrackingCode': 'es/ES/MODGCA',
            'Process': 'ancillaries',
            'Step': 'buyonboard'} as any
        );
    });

    it('11.3. Enter Gastronomic Proposal and choose PREORDER option', ()=> {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK GASTRONOMIC BUTTON TO OPEN MODAL
        cy.get('#mmb-customize-flights-meals-box-10 .ib-button').eq(0).click();
        cy.wait(1000);
        cy.validateProcessAndStepGA4('MODGCA');


        //OPEN ONBOARDMENU OPTION
        cy.get('#PREORDER_OPTION .ib-button').eq(0).click();
        cy.wait(1000);
        cy.validateDigitalDataInformation({
            'Quadrigam': 'MODGCA',
            'TrackingCode': 'es/ES/MODGCA',
            'Process': 'ancillaries',
            'Step': 'preorder'} as any
        );
    });

    it('11.4. Enter Gastronomic Proposal and choose DIGITAL_MENU option', ()=> {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);

        cy.scrollTo(0, 0);

        //CLICK GASTRONOMIC BUTTON TO OPEN MODAL
        cy.get('#mmb-customize-flights-meals-box-10 .ib-button').eq(0).click();
        cy.wait(1000);
        cy.validateProcessAndStepGA4('MODGCA');


        //OPEN DIGITAL MENU OPTION
        cy.get('#DIGITAL_MENU_OPTION .ib-button').eq(0).click();

        cy.wait(['@digitalMenus'], { timeout: 2000 })
        .then((interceptions) => {
            cy.validateDigitalDataInformation({
                'Quadrigam': 'MODDIM',
                'TrackingCode': 'es/ES/MODDIM',
                'Process': 'ancillaries',
                'Step': 'digital menu'} as any
            );
        });
    });

    //MOANCI & IBMCYT
    it('12. Buy Hotel and Car', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK COMPLETE YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-editar').click();
        cy.validateProcessAndStepGA4('IBMCYT');

    });

    //MOANCI & SEATMPJBR
    it('13. MODAL external BA JBA', () => {
        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'ancillaries-flow/import-aa.json'});
        cy.intercept('GET', '**/sse-orm/rs/v6/mmb/**/reshop-conditions', {fixture: 'ancillaries-flow/reshop-conditions-aa.json'});
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', {fixture: 'ancillaries-flow/ancillaries-aa.json'});
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary**', {fixture: 'ancillaries-flow/ancillaries-summary-aa.json'});
        cy.intercept('GET', '**/prlm-pc/rs/v1/points/ancillaries-calculation**', {fixture: 'ancillaries-flow/ancillaries-calculation-aa.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        // cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
         //CLICK CUSTOM YOUR FLIGHT
         cy.get('.ib-lateral-menu__link.icon-vuelos').click();
         cy.validateProcessAndStepGA4('MOANCI');
        // cy.validateDigitalDataInformation(dataAnc as any);

         cy.get('#mmb-customize-flights-select-flight-0-link').click();
         cy.wait(2000);
         cy.validateProcessAndStepGA4('SEATMPJBR');

    });

    //MOANCI & MOSEATJBR
    it('14. Buy seats external BA JBA', () => {
        cy.intercept('GET', '**/sse-orm/rs/v2/order/import-deeplink/**', {fixture: 'ancillaries-flow/import-deeplink.json'});
        cy.visit(`${Cypress.env('url')}?language=en&market=es&channel=COM&state=seats&source=BA&locale=es_ES&code=vrjRV0BSEjC45R9uEFHmLlkQtn7nyFHto1iTIzJHu38=&returnURL=l37FXK4dOwAIFAtD3eeItOe9X20l80X%2FTm7NLKMd9B%2BHQsql4L%2BcNlB8vwW6HKshYeCcGPqUhAaGCJkzYX9yiy3cBoNvJjIIE6FvV0vfmhdQQkfEwJdTUWUeFXwaZ1cL81r%2FR%2FZwFkLlcMI5xw%2BSn7nYh0PDtnBoQci9RgEA%2BLL82id6kLDwnmY6piMx8OW6Wqv1HnDHx3AIZlGdryq%2BnWakdvEEN8XuzMVE1vHE7xtEEAXxEPrilL7s1W0HBwYfI1qSHawxf7dM0CijzDQA6Q%3D%3D#!/ibdash`);
        // cy.anonymousLogin('aaa', 'KZ8F6');

         cy.wait(2000);
         cy.validateProcessAndStepGA4('MOSEATJBR');

    });

    //BBDD BLOCKED
    //MOANCI & MOFLEX
    xit('15. Buy flex', () => {
        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);
        //cy.validateProcessAndStepGA4('CHKTRP');
        //cy.validateDigitalDataInformation(dataSearch as any);

        cy.anonymousLogin('aaa', 'KZ8F6');
        cy.wait(2000);
        cy.validateProcessAndStepGA4('IBMMBR');
        cy.validateDigitalDataInformation(dataDash as any);

        cy.wait(1000);
        //CLICK CUSTOM YOUR FLIGHT
        cy.get('.ib-lateral-menu__link.icon-vuelos').click();
        cy.validateProcessAndStepGA4('MOANCI');
        cy.validateDigitalDataInformation(dataAnc as any);
    });
});
