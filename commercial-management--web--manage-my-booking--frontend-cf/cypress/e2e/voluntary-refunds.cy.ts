import { DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM } from '../support/quadrigams-voluntary-refunds';

describe('Test voluntary refunds workflows', () => {

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
        

        cy.intercept('GET', '**/sse-orm/rs/v6/mmb/**/reshop-conditions', {fixture: 'voluntary-refunds/reshop-conditions.json'});
        cy.intercept('POST', '**/trm-apim/rs/v4/digital-boarding', {statusCode: 200, fixture: 'round-trip/updates/digital-boarding.json'});
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries**', {statusCode: 400});
        cy.intercept('GET', '**/ass-fass/rs/fass/v5/**/ancillaries-summary', {fixture: 'voluntary-refunds/ancillaries-summary.json'});
        cy.intercept('POST', '**/sse-favl/rs/v1/digital-menus/status', {fixture: 'voluntary-refunds/status.json'});
        cy.intercept('GET', '**/ivm-ivs/rs/v1/invoice/details/filtered/**', {fixture: 'voluntary-refunds/invoice-details-filtered.json'});
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', {fixture: 'round-trip/updates/security.json'});

        cy.intercept('POST', '**/trm-apim/rs/v4/health-form', {statusCode: 200});
        cy.intercept('GET', '**/sse-orm/rs/v2/order/voluntaryChangesLog/**', {statusCode: 200});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', {statusCode: 200});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment-conditions', {statusCode: 200});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment-methods', {statusCode: 200});
        cy.intercept('GET', '**/pmt-ppm/rs/ppm/v7/**/payment/**/additional-fields/IBERIA_PAY', {statusCode: 200});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FPIBTASA/gcwcs/?retrieveHTML=yes', {statusCode: 200});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FLOWPAGEPAGCUO/gcwcs/?retrieveHTML=yes', { statusCode: 502});
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardFee', {statusCode: 200});
        cy.intercept('POST', '**/iberiapay/api/v2/public/creditCardBin', {statusCode: 200});

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
        cy.intercept('POST', '**/pmt-ppm/rs/ppm/v7/**/payment/**/additional-fields/IBERIA_PAY', { statusCode: 200 });
        cy.intercept('POST', '**/iberiapay/rb_bf68025iux**', { statusCode: 200 });
        cy.intercept('GET', '**/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });
        cy.intercept('POST', '**/pmt-ppm/rs/ppm/v7/payment-methods-info', { statusCode: 200 });
        cy.intercept('POST', '**/digitalweb/cloud/order-handler/v1/orders', {fixture: 'general/order-handler.json'});
    });

    it('voluntary refunds check when flag is false & channel is IBCOM', () => {
        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-flag-false.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-msg-alert__text.ib-msg-alert__text--title-large').contains('Lo sentimos: esta reserva no permite el reembolso online');
        cy.get('.ib-msg-alert__text--subtitle').contains('Obtén tu reembolso a través de nuestro Centro de Atención al Cliente, llamando al 901 201 214.');
    });

    it('voluntary refunds check when flag is false & channel is NDC_DIRECT', () => {
        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-flag-false-channel-ndc-direct.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-msg-alert__text.ib-msg-alert__text--title-large').contains('Lo sentimos: esta reserva no permite el reembolso online');
        cy.get('.ib-msg-alert__text--subtitle').contains('Para solicitar tu reembolso tendrás que contactar con la agencia de viajes o proveedor donde adquiriste tu reserva.');
    });

    it('voluntary refunds summary failure itin refund service with long currency case getting', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 401});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-msg-alert__text.ib-msg-alert__text--title-large').contains('Lo sentimos. En este momento no podemos procesar tu solicitud de su reembolso online. Por favor, inténtalo de nuevo más tarde.');
        cy.get('.ib-msg-alert__text--subtitle').contains('Si el problema persiste, por favor contacta con nuestro Centro de Atención al Cliente.');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVKO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary failure itin refund service with long currency case cashAndAvios', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-cashAndAvios.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 401});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-msg-alert__text.ib-msg-alert__text--title-large').contains('Lo sentimos. En este momento no podemos procesar tu solicitud de su reembolso online. Por favor, inténtalo de nuevo más tarde.');
        cy.get('.ib-msg-alert__text--subtitle').contains('Si el problema persiste, por favor contacta con nuestro Centro de Atención al Cliente.');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVKO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });
    });


    it('voluntary refunds summary failure itin refund service with long currency case voucher', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-voucher.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 401});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-msg-alert__text.ib-msg-alert__text--title-large').contains('Lo sentimos. En este momento no podemos procesar tu solicitud de su reembolso online. Por favor, inténtalo de nuevo más tarde.');
        cy.get('.ib-msg-alert__text--subtitle').contains('Si el problema persiste, por favor contacta con nuestro Centro de Atención al Cliente.');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVKO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary failure itin refund service with long currency case redention', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-redention.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 401});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-msg-alert__text.ib-msg-alert__text--title-large').contains('Lo sentimos. En este momento no podemos procesar tu solicitud de su reembolso online. Por favor, inténtalo de nuevo más tarde.');
        cy.get('.ib-msg-alert__text--subtitle').contains('Si el problema persiste, por favor contacta con nuestro Centro de Atención al Cliente.');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVKO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds completed summary with long currency case getting cancel response status 200', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-volrefund__amount').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVBK', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4('CHKTRP');
    });

    it('voluntary refunds completed summary with long currency case cashAndAvios cancel response status 200', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-cashAndAvios.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('1.313,35 € + 10.000 Avios');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('1.148,35 € + 10.000 Avios');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-volrefund__amount').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVBK', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4('CHKTRP');
    });

    it('voluntary refunds completed summary with long currency case voucher cancel response status 200', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-voucher.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-volrefund__amount').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVBK', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4('CHKTRP');
    });

    it('voluntary refunds completed summary with long currency case redention cancel response status 200', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-redention.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('13.000 Avios+ 802,00 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('13.000 Avios+ 967,00 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-volrefund__amount').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVBK', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4('CHKTRP');
    });

    it('voluntary refunds completed summary with long currency case getting cancel response status 409 & error code is HAL_SSE_ORM_0039', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 409, fixture: 'voluntary-refunds/cancel-409.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-volrefund__amount').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVBK', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4('CHKTRP');
    });

    it('voluntary refunds completed summary with long currency case getting cancel response status 409 & error code is SSE_MMB_1015', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 409, fixture: 'voluntary-refunds/cancel-409-code-1015.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-volrefund__amount').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVBK', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4('CHKTRP');
    });

    it('voluntary refunds summary error confirmation with long currency case getting response status 500', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 500, fixture: 'voluntary-refunds/cancel-500.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-heading.ib-heading--type-1').contains('Se ha producido un error');
        cy.get('.ib-text').contains('Hemos tenido problemas para procesar tu solicitud de reembolso. Por favor, inténtalo de nuevo y si el problema persiste, contacta con nuestro centro de atención al cliente.');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVER', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary error confirmation with long currency case cashAndAvios response status 500', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-cashAndAvios.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 500, fixture: 'voluntary-refunds/cancel-500.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('1.313,35 € + 10.000 Avios');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('1.148,35 € + 10.000 Avios');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-heading.ib-heading--type-1').contains('Se ha producido un error');
        cy.get('.ib-text').contains('Hemos tenido problemas para procesar tu solicitud de reembolso. Por favor, inténtalo de nuevo y si el problema persiste, contacta con nuestro centro de atención al cliente.');
        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVER', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary error confirmation with long currency case voucher response status 500', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-voucher.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 500, fixture: 'voluntary-refunds/cancel-500.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-heading.ib-heading--type-1').contains('Se ha producido un error');
        cy.get('.ib-text').contains('Hemos tenido problemas para procesar tu solicitud de reembolso. Por favor, inténtalo de nuevo y si el problema persiste, contacta con nuestro centro de atención al cliente.');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVER', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary error confirmation with long currency case redention response status 500', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-redention.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 500, fixture: 'voluntary-refunds/cancel-500.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('13.000 Avios+ 802,00 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('13.000 Avios+ 967,00 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-heading.ib-heading--type-1').contains('Se ha producido un error');
        cy.get('.ib-text').contains('Hemos tenido problemas para procesar tu solicitud de reembolso. Por favor, inténtalo de nuevo y si el problema persiste, contacta con nuestro centro de atención al cliente.');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVER', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary canceled summary page with long currency case getting', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING,{ avios: 0, cash: 63.87 });

        cy.get('.ib-navegation__link').eq(0).click();
    });

    it('voluntary refunds summary canceled summary page with long currency case cashAndAvios', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-cashAndAvios.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

         cy.get('.ib-box-prices__price').eq(0).contains('1.313,35 € + 10.000 Avios');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('1.148,35 € + 10.000 Avios');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS,{ avios: 0, cash: 63.87 });

        cy.get('.ib-navegation__link').eq(0).click();
    });

    it('voluntary refunds summary canceled summary page with long currency case voucher', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-voucher.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND,{ avios: 0, cash: 63.87 });

        cy.get('.ib-navegation__link').eq(0).click();
    });

    it('voluntary refunds summary canceled summary page with long currency case redention', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-redention.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('13.000 Avios+ 802,00 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('13.000 Avios+ 967,00 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION,{ avios: 0, cash: 63.87 });

        cy.get('.ib-navegation__link').eq(0).click();
    });

    it('voluntary refunds summary confirmation modal canceled with long currency case getting', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary confirmation modal canceled with long currency case cashAndAvios', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-cashAndAvios.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('1.313,35 € + 10.000 Avios');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('1.148,35 € + 10.000 Avios');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary confirmation modal canceled with long currency case voucher', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-voucher.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds summary confirmation modal canceled with long currency case redention', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-redention.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('13.000 Avios+ 802,00 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('13.000 Avios+ 967,00 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });
    });

    it('voluntary refunds check exit modal from summary with long currency case getting', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVEX', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();
    });

    it('voluntary refunds check exit modal from summary with long currency case cashAndAvios', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-cashAndAvios.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('1.313,35 € + 10.000 Avios');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('1.148,35 € + 10.000 Avios');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVEX', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();
    });

    it('voluntary refunds check exit modal from summary with long currency case voucher', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-voucher.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('90,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVEX', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();
    });

    it('voluntary refunds check exit modal from summary with long currency case redention', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-redention.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-no-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('13.000 Avios+ 802,00 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-165,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('13.000 Avios+ 967,00 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');
        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');
        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVEX', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();
    });

    it('voluntary refunds completed summary with long currency case getting cancel response status 200 less 24h with ancillaries', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-24h-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('100,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(2).contains('100,65 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', true, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('100,65 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');

        cy.get('.ib-table-breakdown__table.ib-table-breakdown__table--cols-alignement .ib-table-breakdown__cell.ib-journey.ib-journey__iatas.ib-journey__iatas--inverse .ib-table-breakdown__txt').eq(0).contains('MadridMAD - Palma de MallorcaPMI');
        cy.get('.ib-table-breakdown__table.ib-table-breakdown__table--cols-alignement').eq(1).find('.ib-table-breakdown__cell.ib-table-breakdown__cell--right .ib-table-breakdown__txt').eq(0).contains('1 x 10,00 €');
        cy.get('.ib-table-breakdown__table.ib-table-breakdown__table--cols-alignement').eq(1).find('.ib-table-breakdown__cell.ib-table-breakdown__cell--right .ib-table-breakdown__txt').eq(1).contains('10,00 €');

        cy.get('.ib-table-breakdown__total-without-penalty').contains('100,65 €');

        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(2).contains('-63,87 €');

        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 € 0,00 €');
        cy.get('.ib-table-breakdown__price').contains('100,65 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', true, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', true, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-volrefund__amount').contains('100,65 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVBK', true, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4('CHKTRP');
    });

    it('voluntary refunds completed summary with long currency case getting cancel response status 200 with ancillaries', () => {

        cy.intercept('POST', '**/sse-orm/rs/v2/order/import', {fixture: 'voluntary-refunds/import-getting.json'});
        cy.intercept('POST', '**/sse-orm/rs/v1/shopping/directItinRefund/**', {statusCode: 200, fixture: 'voluntary-refunds/rt-monopax-ancillaries.json'});
        cy.intercept('POST', '**/sse-orm/rs/v2/order/cancel/**', {statusCode: 200, fixture: 'voluntary-refunds/cancel-ok.json'});

        cy.visit(`${Cypress.env('url')}?language=es&market=es&channel=COM#!/chktrp`);

        cy.anonymousLogin('test', 'JRVXM');

        cy.scrollTo(0, 0);
        cy.get('.ib-lateral-menu__subitem').eq(8).click();

        cy.get('.ib-box-prices__price').eq(0).contains('100,65 €');
        cy.get('.ib-box-prices__price').eq(1).contains('-10,00 €');
        cy.get('.ib-box-prices__price').eq(2).contains('-63,87 €');
        cy.get('.ib-box-prices__price').eq(3).contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVDB', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(0).click();
        cy.scrollTo(0, 0);

        cy.get('.ib-voluntary-refunds-summary__subtitle-price').contains('26,78 €');
        cy.get('.ib-table-breakdown__txt.icon-persona').eq(0).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(0).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(1).contains('1 x 26,78 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(0).contains('90,65 €');

        cy.get('.ib-table-breakdown__total-without-penalty').contains('90,65 €');

        cy.get('.ib-table-breakdown__txt.icon-persona').eq(1).contains('1 x Adulto');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.ib-table-breakdown__cell--responsive').eq(2).contains('1 x 63,87 €');
        cy.get('.ib-table-breakdown__cell.ib-table-breakdown__cell--right.hidden-sm.hidden-xs').eq(1).contains('-63,87 €');

        cy.get('.ib-table-breakdown__total-penalty').contains('-63,87 €');
        cy.get('.ib-table-breakdown__price').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVRE', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(1).click();

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVCO', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-button').eq(2).click();

        cy.get('.ib-volrefund__amount').contains('26,78 €');

        cy.validateProcessAndStepGA4VoluntaryRefunds('REFVBK', false, DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING, { avios: 0, cash: 63.87 });

        cy.get('.ib-header-steps__link').eq(0).click();

        cy.validateProcessAndStepGA4('CHKTRP');
    });
});
