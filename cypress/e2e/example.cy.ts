// Example test file to demonstrate Cypress setup
describe('Teste de Navegação', () => {
  it('deve acessar a tela de login', () => {
    cy.visit('/login');
    cy.get('[data-cy=login-button]').should('be.visible');
  });

  it('deve acessar a tela de registro', () => {
    cy.visit('/register');
    cy.get('[data-cy=register-button]').should('be.visible');
  });
});
