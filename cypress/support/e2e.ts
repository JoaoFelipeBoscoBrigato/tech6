// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Custom commands for authentication
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
});

Cypress.Commands.add(
  'register',
  (userData: {
    name: string;
    email: string;
    cpf: string;
    password: string;
  }) => {
    cy.visit('/register');
    cy.get('[data-cy=name-input]').type(userData.name);
    cy.get('[data-cy=email-input]').type(userData.email);
    cy.get('[data-cy=cpf-input]').type(userData.cpf);
    cy.get('[data-cy=password-input]').type(userData.password);
    cy.get('[data-cy=register-button]').click();
  }
);

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=logout-button]').click();
});

// Custom commands for events
Cypress.Commands.add(
  'createEvent',
  (eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
  }) => {
    cy.visit('/create-event');
    cy.get('[data-cy=title-input]').type(eventData.title);
    cy.get('[data-cy=description-input]').type(eventData.description);
    cy.get('[data-cy=date-input]').type(eventData.date);
    cy.get('[data-cy=location-input]').type(eventData.location);
    cy.get('[data-cy=create-event-button]').click();
  }
);

// Custom commands for signatures
Cypress.Commands.add(
  'createSignature',
  (signatureData: { plan: string; paymentMethod: string }) => {
    cy.visit('/signature');
    cy.get(`[data-cy=plan-${signatureData.plan}]`).click();
    cy.get(`[data-cy=payment-${signatureData.paymentMethod}]`).click();
    cy.get('[data-cy=create-signature-button]').click();
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      register(userData: {
        name: string;
        email: string;
        cpf: string;
        password: string;
      }): Chainable<void>;
      logout(): Chainable<void>;
      createEvent(eventData: {
        title: string;
        description: string;
        date: string;
        location: string;
      }): Chainable<void>;
      createSignature(signatureData: {
        plan: string;
        paymentMethod: string;
      }): Chainable<void>;
    }
  }
}
