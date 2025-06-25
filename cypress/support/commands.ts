// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to clear database or reset state
Cypress.Commands.add('resetDatabase', () => {
  // This would typically make an API call to reset the database
  // For now, we'll just log that this would happen
  cy.log('Database reset would happen here');
});

// Custom command to wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.wait(1000); // Small delay to ensure page is fully loaded
});

// Custom command to check if user is logged in
Cypress.Commands.add('isLoggedIn', () => {
  cy.get('body').should('contain', 'Logout');
});

// Custom command to check if user is not logged in
Cypress.Commands.add('isNotLoggedIn', () => {
  cy.get('body').should('contain', 'Login');
});

declare global {
  namespace Cypress {
    interface Chainable {
      resetDatabase(): Chainable<void>;
      waitForPageLoad(): Chainable<void>;
      isLoggedIn(): Chainable<void>;
      isNotLoggedIn(): Chainable<void>;
    }
  }
}
