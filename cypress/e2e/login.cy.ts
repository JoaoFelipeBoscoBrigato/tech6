describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('deve logar com credenciais válidas', () => {
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=login-button]').click();
    cy.url().should('include', '/home');
  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.get('[data-cy=email-input]').type('usuario@invalido.com');
    cy.get('[data-cy=password-input]').type('senhaerrada');
    cy.get('[data-cy=login-button]').click();
    cy.get('[data-cy=error-message]').should('be.visible');
  });

  it('deve mostrar erros de validação para campos vazios', () => {
    cy.get('[data-cy=login-button]').click();
    cy.get('[data-cy=email-error]').should('be.visible');
    cy.get('[data-cy=password-error]').should('be.visible');
  });

  it('deve mostrar erro para email inválido', () => {
    cy.get('[data-cy=email-input]').type('emailinvalido');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=login-button]').click();
    cy.get('[data-cy=email-error]').should('be.visible');
  });

  it('deve navegar para registro ao clicar no link', () => {
    cy.get('[data-cy=register-link]').click();
    cy.url().should('include', '/register');
  });
});
