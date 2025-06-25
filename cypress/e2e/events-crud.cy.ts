describe('Eventos - CRUD', () => {
  beforeEach(() => {
    // Login como organizador
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type('organizer@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=login-button]').click();
    cy.url().should('include', '/home');
  });

  it('deve criar um novo evento', () => {
    cy.visit('/criar-evento');
    cy.get('[data-cy=title-input]').type('Evento Teste');
    cy.get('[data-cy=description-input]').type('Descrição do evento teste');
    cy.get('[data-cy=date-input]').type('2025-12-25');
    cy.get('[data-cy=location-input]').type('Local Teste');
    cy.get('[data-cy=create-event-button]').click();
    cy.url().should('include', '/home');
    cy.get('[data-cy=event-card]').should('exist');
  });

  it('deve mostrar erro ao tentar criar evento com campos vazios', () => {
    cy.visit('/criar-evento');
    cy.get('[data-cy=create-event-button]').click();
    cy.get('[data-cy=error-message]').should('be.visible');
  });

  it('deve listar eventos na home', () => {
    cy.visit('/home');
    cy.get('[data-cy=event-card]').should('exist');
  });

  it('deve acessar detalhes de um evento', () => {
    cy.visit('/home');
    cy.get('[data-cy=event-card]').first().click();
    cy.get('[data-cy=event-title]').should('be.visible');
    cy.get('[data-cy=event-description]').should('be.visible');
    cy.get('[data-cy=event-date]').should('be.visible');
    cy.get('[data-cy=event-location]').should('be.visible');
  });

  it('deve editar um evento', () => {
    cy.visit('/home');
    cy.get('[data-cy=event-card]').first().click();
    cy.get('[data-cy=edit-event-button]').click();
    cy.get('[data-cy=title-input]').clear().type('Evento Editado');
    cy.get('[data-cy=update-event-button]').click();
    cy.get('[data-cy=event-title]').should('contain', 'Evento Editado');
  });

  it('deve excluir um evento', () => {
    cy.visit('/home');
    cy.get('[data-cy=event-card]').first().click();
    cy.get('[data-cy=delete-event-button]').click();
    cy.get('[data-cy=confirm-delete-button]').click();
    cy.url().should('include', '/home');
  });
});
