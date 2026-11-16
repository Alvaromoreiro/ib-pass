/// <reference types="cypress" />
import { requiredCypressEnv } from './requiredCypressEnv';
import 'cypress-iframe';
import {RegressionDataLayerEvent, RegressionDataLayerInformation, RegressionDigitalDataInformation } from 'cypress/support/command-models';
import { quadrigams } from './quadrigams';
import { DIGITAL_DATA_REFUND_STEP, DIGITAL_DATA_REFUND_PROCESS_BY_TYPE } from './quadrigams-voluntary-refunds';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>
            drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
            dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
            visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
            validateDataLayerInformation(datalayerObject: RegressionDataLayerInformation): Chainable<any>;
            validateDigitalDataInformation(digital_data: RegressionDigitalDataInformation): Chainable<any>;
            validateProcessAndStepGA4(quadrigam: string): Chainable<any>;
            validateProcessAndStepGA4VoluntaryRefunds(quadrigam: string, isLess24Hours: boolean, processByPaymentItem: string, penalty): Chainable<any>;
            logging(): Chainable<any>;
            anonymousLogin(surname: string, pnr: string): Chainable<any>;
            checkDataLayerEvent(event: RegressionDataLayerEvent, items?: number): Chainable<any>;
        }
    }
}

Cypress.Commands.add('validateDataLayerInformation', (datalayerObject: RegressionDataLayerInformation) => {
    cy.log('Validating datalayer information');
    return cy.window().then((window: any) => {
        Object.entries(datalayerObject).forEach(([key, value]) => {
            expect(window.datalayer_general[key]).to.be.equal(value);
        });
    });
});

Cypress.Commands.add('validateDigitalDataInformation', (digitalData: RegressionDigitalDataInformation) => {
    cy.log('Validating digital data information');
    return cy.window().then((window: any) => {
        Object.entries(digitalData).forEach(([key, value]) => {
            expect(window.digital_data[key]).to.be.equal(value);
        });
    });
});

Cypress.Commands.add('validateProcessAndStepGA4', (quadrigam: string) => {
    const processAndStep = quadrigams;
    cy.log(`Validating Process and step (GA4)(${quadrigam})`);

    quadrigam = quadrigam.toUpperCase();
    if (processAndStep[quadrigam]) {
        cy.validateDataLayerInformation(processAndStep[quadrigam].datalayer);
        cy.validateDigitalDataInformation(processAndStep[quadrigam].digitaldata);
    } else {
        throw new Error('ERROR validate process and step: ' + quadrigam);
    }
});

Cypress.Commands.add('validateProcessAndStepGA4VoluntaryRefunds', (quadrigam: string, less24Hours: boolean, processByPaymentItem: string, penalty) => {
    cy.log(`Validating Process and step (GA4)(${quadrigam})`);

    let process: string = '';
    let processByType: string = '';
    if(less24Hours) processByType = DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.QUALITY_COMMITMENT;
    else if(penalty.avios > 0 || penalty.cash > 0) processByType = DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.PENALTY;
    else processByType = DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.WITHOUT_PENALTY;

    quadrigam === 'REFVKO' ? process = processByPaymentItem : process = processByPaymentItem + ' ' + processByType;
    quadrigam = quadrigam.toUpperCase();

    let quadrigamObject = {
        datalayer: { quadrigam: quadrigam, proceso: process, paso: DIGITAL_DATA_REFUND_STEP[quadrigam] },
        digitaldata: { Quadrigam: quadrigam, Process: process, Step: DIGITAL_DATA_REFUND_STEP[quadrigam] }
    };

    if (quadrigamObject) {
        cy.validateDataLayerInformation(quadrigamObject.datalayer);
        cy.validateDigitalDataInformation(quadrigamObject.digitaldata);
    } else {
        throw new Error('ERROR validate process and step: ' + quadrigam);
    }
});

Cypress.Commands.add('logging', () => {
    cy.setCookie('IBERIACOM_SSO_TYPE', 'IBPLUS');
    cy.setCookie('IBERIACOM_SSO_REFRESH', requiredCypressEnv('IBERIACOM_SSO_REFRESH'));
    cy.setCookie('IBERIACOM_SSO_ACCESS_TO', '13/12/2116 19:26');
    cy.setCookie('IBERIACOM_SSO_REFRESH_TO', '13/12/2116 19:26');
    cy.setCookie('IBERIACOM_SSO_ACCESS', requiredCypressEnv('IBERIACOM_SSO_ACCESS'));
    cy.setCookie('IBERIACOM_SSO_ACCESS_SALESFORCE', requiredCypressEnv('IBERIACOM_SSO_ACCESS_SALESFORCE'));
    cy.setCookie('IBERIACOM_SSO_REFRESH_SALESFORCE', requiredCypressEnv('IBERIACOM_SSO_REFRESH_SALESFORCE'));
    cy.setCookie('IBERIACOM_SSO_ACCESS_TO_SALESFORCE', '13/12/2116 19:26');
    cy.setCookie('IBERIACOM_SSO_REFRESH_TO_SALESFORCE', '13/12/2116 19:26');

    cy.window().then( win => {
      sessionStorage.setItem('customerData', '{"segment":3,"category":"INFINITA","id":"8438798","idComplete":"TEST-USER-001","name":"Test","surname":"User","surnames":"User","documentId":"TEST-USER-001","email":"test@example.com","avios":6180336,"preferredLanguage":"EN","address":"Nueva casa chuli","number":"2095","numberExtra":"8","postalCode":"00000","completeProfile":true,"parentalControl":true,"termsAndConditions":true,"dataMarket":"ES","dataLanguage":"en","partnersInfo":[],"hashEID":"test-hash"}');
      sessionStorage.setItem('accessTokenSalesforce', requiredCypressEnv('SALESFORCE_ACCESS_TOKEN'));
      sessionStorage.setItem('ib-MmB-app.loginSF', JSON.stringify(requiredCypressEnv('SALESFORCE_LOGIN_TOKEN')));
      sessionStorage.setItem('ib-MmB-app.FFUser', '"00000008438798"');
      sessionStorage.setItem('ib-MmB-app.loggedToken', JSON.stringify(requiredCypressEnv('SALESFORCE_LOGGED_TOKEN')));
      sessionStorage.setItem('ib-MmB-app.userLogged', 'true');
      sessionStorage.setItem('ib-MmB-app.IberiaUserType', '"ROLE_IBERIA_PLUS"');
    });
});

Cypress.Commands.add('anonymousLogin', (surname: string, pnr: string) => {
    cy.scrollTo(0, 0);
    cy.get('#ANONYMOUS_LOGIN_INPUT_SURNAME').click('top').type(surname);
    cy.get('#ANONYMOUS_LOGIN_INPUT_PNR').click('top').type(pnr);
    cy.get('#ANONYMOUS_LOGIN_BOTON').click();
});
Cypress.Commands.add('checkDataLayerEvent', (event: RegressionDataLayerEvent, items = 10) => {
    cy.log(`Validating datalayer "${event.event}" event in last ${items} events`);
    return cy.window().then((window: any) => {
        const eventFound = window.dataLayer
            .slice(-items)
            .findLast((datalayerEvent) => {
                return Object.entries(event).every(([key, value]) => {
                    return datalayerEvent?.[key] === value;
                }) ;
            });
        if (eventFound === undefined) throw new Error('DataLayer event not found');
        else expect(eventFound).not.to.be.empty;
    });
});

