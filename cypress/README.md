# Testes End-to-End (E2E) com Cypress

Este diretório contém os testes E2E automatizados para a aplicação, escritos em Cypress.

## Estrutura dos Testes

### Testes de Autenticação

- **login.cy.ts**: Testes de login (sucesso e falha)
- **user-registration.cy.ts**: Testes de criação de usuário (sucesso e falha)

### Testes CRUD Completos

- **events-crud.cy.ts**: Testes completos para CRUD de eventos
- **signatures-crud.cy.ts**: Testes completos para CRUD de assinaturas

## Como Executar os Testes

### Pré-requisitos

1. Certifique-se de que o backend está rodando na porta padrão
2. Certifique-se de que o frontend está rodando na porta 5173 (Vite)

### Comandos Disponíveis

```bash
# Abrir interface gráfica do Cypress
npm run cypress:open

# Executar todos os testes em modo headless
npm run test:e2e

# Executar testes com interface gráfica
npm run test:e2e:headed

# Executar testes em navegador específico
npm run test:e2e:chrome
npm run test:e2e:firefox
```

## Configuração

O arquivo `cypress.config.ts` na raiz do projeto configura:

- URL base: `http://localhost:5173`
- Timeout padrão: 10 segundos
- Viewport: 1280x720
- Screenshots em caso de falha

## Comandos Customizados

### Autenticação

- `cy.login(email, password)`: Faz login com credenciais
- `cy.register(userData)`: Registra novo usuário
- `cy.logout()`: Faz logout

### Eventos

- `cy.createEvent(eventData)`: Cria novo evento

### Assinaturas

- `cy.createSignature(signatureData)`: Cria nova assinatura

## Data Attributes

Os testes utilizam data attributes para seletores estáveis:

### Login/Registro

- `[data-cy=email-input]`
- `[data-cy=password-input]`
- `[data-cy=login-button]`
- `[data-cy=register-button]`
- `[data-cy=name-input]`
- `[data-cy=cpf-input]`

### Eventos

- `[data-cy=title-input]`
- `[data-cy=description-input]`
- `[data-cy=date-input]`
- `[data-cy=location-input]`
- `[data-cy=create-event-button]`
- `[data-cy=edit-event-button]`
- `[data-cy=delete-event-button]`

### Assinaturas

- `[data-cy=plan-basic]`
- `[data-cy=plan-premium]`
- `[data-cy=payment-credit-card]`
- `[data-cy=create-signature-button]`
- `[data-cy=edit-signature-button]`
- `[data-cy=cancel-signature-button]`

## Cenários de Teste

### Login

- ✅ Login com credenciais válidas
- ❌ Login com credenciais inválidas
- ❌ Validação de campos vazios
- ❌ Validação de formato de email inválido

### Criação de Usuário

- ✅ Registro com dados válidos
- ❌ Registro com email já existente
- ❌ Validação de campos obrigatórios
- ❌ Validação de formato de email inválido
- ❌ Validação de CPF inválido
- ❌ Validação de senha fraca

### CRUD de Eventos

- ✅ Criar evento
- ✅ Listar eventos
- ✅ Visualizar detalhes do evento
- ✅ Editar evento
- ✅ Excluir evento
- ❌ Validações de campos obrigatórios
- ❌ Validação de data no passado
- ❌ Acesso negado para não proprietários

### CRUD de Assinaturas

- ✅ Criar assinatura
- ✅ Listar assinaturas
- ✅ Visualizar detalhes da assinatura
- ✅ Atualizar plano
- ✅ Renovar assinatura
- ✅ Cancelar assinatura
- ❌ Validações de campos obrigatórios
- ❌ Validação de cartão de crédito inválido
- ❌ Operações em assinaturas expiradas

## Dados de Teste

Os testes utilizam dados fictícios para demonstração:

- Emails: `test@example.com`, `organizer@example.com`, `user@example.com`
- Senhas: `password123`
- CPFs: `12345678901`, `98765432109`

## Relatórios

Os testes geram:

- Screenshots automáticos em caso de falha
- Vídeos (desabilitados por padrão)
- Logs detalhados no console

## Manutenção

Para manter os testes atualizados:

1. Adicione data attributes aos elementos HTML
2. Atualize os seletores quando a interface mudar
3. Adicione novos cenários de teste conforme necessário
4. Mantenha os dados de teste consistentes
