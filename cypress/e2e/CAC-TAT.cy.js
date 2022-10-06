/// <reference types="Cypress" />
describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  });
  it('Verificar o título da aplicação', () => {
    cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
  })

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, '
    cy.get('#firstName').type('Everton')
    cy.get('#lastName').type('Ferreira')
    cy.get('#email').type('everton@teste.com')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')
  });

  it('Exibe mensagem de erro so submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Everton')
    cy.get('#lastName').type('Ferreira')
    cy.get('#email').type('everton@teste,com')
    cy.get('#open-text-area').type("Teste")
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')    
  });

  it('Campo telefone continua vazio quando preenchido com valor não-numérico', () => {
    cy.get('#phone').type('abcdefg').should('have.value','')
  });

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Everton')
    cy.get('#lastName').type('Ferreira')
    cy.get('#email').type('everton@teste.com')
    cy.get('#phone-checkbox').click()
    cy.get('#open-text-area').type("Teste")
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')    
  });

  it('Preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Everton').should('have.value','Everton').clear().should('have.value','')
    cy.get('#lastName').type('Ferreira').should('have.value','Ferreira').clear().should('have.value','')
    cy.get('#email').type('everton@teste.com').should('have.value','everton@teste.com').clear().should('have.value','')
    cy.get('#phone').type("123456789").should('have.value','123456789').clear().should('have.value','')
  });

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible') 
  });

  it('Envia o formulário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.error').should('be.visible') 
  });

  it('Seleciona um produto (You Tube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  });

  it('Seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  });

  it.only('Selecione um produto (Blog) pelo seu índice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  });
})