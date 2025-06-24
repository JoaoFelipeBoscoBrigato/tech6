describe('Testes de Registro de Usuário', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('deve registrar novo usuário com dados válidos', () => {
    cy.get('[data-cy=name-input]').type('Usuário Teste');
    cy.get('[data-cy=email-input]').type('novo.teste@example.com');
    cy.get('[data-cy=cpf-input]').type('12345678901');
    cy.get('[data-cy=password-input]').type('senha123');
    cy.get('[data-cy=register-button]').click();
    cy.get('[data-cy=success-message]').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('deve mostrar erro ao tentar registrar com email já existente', () => {
    cy.get('[data-cy=name-input]').type('Usuário Existente');
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=cpf-input]').type('12345678901');
    cy.get('[data-cy=password-input]').type('senha123');
    cy.get('[data-cy=register-button]').click();
    cy.get('[data-cy=error-message]').should('be.visible');
    cy.url().should('include', '/register');
  });

  it('deve mostrar erros de validação para campos obrigatórios vazios', () => {
    cy.get('[data-cy=register-button]').click();
    cy.get('[data-cy=name-error]').should('be.visible');
    cy.get('[data-cy=email-error]').should('be.visible');
    cy.get('[data-cy=cpf-error]').should('be.visible');
    cy.get('[data-cy=password-error]').should('be.visible');
  });

  it('deve mostrar erro para email inválido', () => {
    cy.get('[data-cy=name-input]').type('Teste');
    cy.get('[data-cy=email-input]').type('emailinvalido');
    cy.get('[data-cy=cpf-input]').type('12345678901');
    cy.get('[data-cy=password-input]').type('senha123');
    cy.get('[data-cy=register-button]').click();
    cy.get('[data-cy=email-error]').should('be.visible');
  });

  it('deve mostrar erro para CPF inválido', () => {
    cy.get('[data-cy=name-input]').type('Teste');
    cy.get('[data-cy=email-input]').type('teste@teste.com');
    cy.get('[data-cy=cpf-input]').type('123');
    cy.get('[data-cy=password-input]').type('senha123');
    cy.get('[data-cy=register-button]').click();
    cy.get('[data-cy=cpf-error]').should('be.visible');
  });

  it('deve mostrar erro para senha fraca', () => {
    cy.get('[data-cy=name-input]').type('Teste');
    cy.get('[data-cy=email-input]').type('teste@teste.com');
    cy.get('[data-cy=cpf-input]').type('12345678901');
    cy.get('[data-cy=password-input]').type('123');
    cy.get('[data-cy=register-button]').click();
    cy.get('[data-cy=password-error]').should('be.visible');
  });

  it('deve navegar para login ao clicar no link', () => {
    cy.get('[data-cy=login-link]').click();
    cy.url().should('include', '/login');
  });
});
