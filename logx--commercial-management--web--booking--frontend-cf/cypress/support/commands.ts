/// <reference types="cypress" />
import 'cypress-iframe';
import {RegressionDataLayerInformation, RegressionDigitalDataInformation, RegressionDataLayerEvent } from 'cypress/support/command-models';

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
declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>
            drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
            dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
            visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
            /**
             * Validate the datalayer_general object stored information for GA4 analytics.
             */
            validateDataLayerInformation(datalayerObject: RegressionDataLayerInformation): Chainable<any>;
            /**
             * Validate the digital_data object stored information for GA4 analytics.
             */
            validateDigitalDataInformation(digital_data: RegressionDigitalDataInformation): Chainable<any>;

            /**
             * Validate the dataLayer array to check if an event has been made with the given data.
             * By default, it checks the last 10 events.
             * @param event Event information to check
             * @param items Number of events to check. By default, 10.
             */
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
