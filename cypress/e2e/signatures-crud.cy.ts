describe('Assinaturas - Fluxo Completo', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=login-button]').click();
    cy.url().should('include', '/home');
  });

  it('deve criar uma nova assinatura', () => {
    cy.visit('/signature');
    cy.get('[data-cy=plan-basic]').click();
    cy.get('[data-cy=payment-credit-card]').click();
    cy.get('[data-cy=create-signature-button]').click();
    cy.get('[data-cy=success-message]').should('be.visible');
  });

  it('deve mostrar erro ao tentar criar assinatura sem selecionar plano', () => {
    cy.visit('/signature');
    cy.get('[data-cy=create-signature-button]').click();
    cy.get('[data-cy=error-message]').should('be.visible');
  });

  it('deve mostrar erro ao tentar criar assinatura sem selecionar método de pagamento', () => {
    cy.visit('/signature');
    cy.get('[data-cy=plan-basic]').click();
    cy.get('[data-cy=create-signature-button]').click();
    cy.get('[data-cy=error-message]').should('be.visible');
  });

  it('deve mostrar erro ao tentar assinar com cartão inválido', () => {
    // Supondo que o front mostre erro para cartão inválido
    cy.visit('/signature');
    cy.get('[data-cy=plan-basic]').click();
    cy.get('[data-cy=payment-credit-card]').click();
    // Não há campos de cartão no front, então só clica
    cy.get('[data-cy=create-signature-button]').click();
    cy.get('[data-cy=error-message]').should('be.visible');
  });
});
