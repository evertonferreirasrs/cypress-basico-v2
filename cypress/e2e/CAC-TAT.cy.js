/// <reference types="Cypress" />
describe('Central de Atendimento ao Cliente TAT', () => {
  const THREE_SECONDS_IN_MS = 3000

  beforeEach(() => {
    cy.visit('./src/index.html')
  });
  it('Verificar o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, '

    cy.clock()

    cy.get('#firstName').type('Everton')
    cy.get('#lastName').type('Ferreira')
    cy.get('#email').type('everton@teste.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.success').should('not.be.visible')
  });

  it('Exibe mensagem de erro so submeter o formulário com um email com formatação inválida', () => {
    cy.clock()

    cy.get('#firstName').type('Everton')
    cy.get('#lastName').type('Ferreira')
    cy.get('#email').type('everton@teste,com')
    cy.get('#open-text-area').type("Teste")
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')
  });

  Cypress._.times(3, () => {
    it('Campo telefone continua vazio quando preenchido com valor não-numérico', () => {
      cy.get('#phone').type('abcdefg').should('have.value', '')
    })
  });


  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()

    cy.get('#firstName').type('Everton')
    cy.get('#lastName').type('Ferreira')
    cy.get('#email').type('everton@teste.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type("Teste")
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')
  });

  it('Preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Everton').should('have.value', 'Everton').clear().should('have.value', '')
    cy.get('#lastName').type('Ferreira').should('have.value', 'Ferreira').clear().should('have.value', '')
    cy.get('#email').type('everton@teste.com').should('have.value', 'everton@teste.com').clear().should('have.value', '')
    cy.get('#phone').type("123456789").should('have.value', '123456789').clear().should('have.value', '')
  });

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')
  });

  it('Envia o formulário com sucesso usando um comando customizado', () => {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')
  });

  it('Seleciona um produto (You Tube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  });

  it('Seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  });

  it('Selecione um produto (Blog) pelo seu índice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  });

  it('Marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
  });

  it('Marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]').should('have.length', 3).each(($radio) => {
      cy.wrap($radio).check()
      cy.wrap($radio).should('be.checked')
    })
  });

  it('Marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"').check().should('be.checked').last().uncheck().should('not.be.checked')
  });

  it('Seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]#file-upload').should('not.have.value').selectFile('./cypress/fixtures/example.json').should(($input) => {
      console.log($input)
      expect($input[0].files[0].name).to.equal('example.json')
    })
  });

  it('Seleciona um arquivo simulando drag-and-drop', () => {
    cy.get('input[type="file"]#file-upload').should('not.have.value').selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' }).should(($input) => {
      console.log($input)
      expect($input[0].files[0].name).to.equal('example.json')
    })
  });

  it('Selecione um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]#file-upload').should('not.have.value').selectFile('@sampleFile', { action: 'drag-drop' }).should(($input) => {
      console.log($input)
      expect($input[0].files[0].name).to.equal('example.json')
    })
  });

  it('Verifica que a política de privacidade abre em outra aba sem a neceddidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  });

  it('Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a').invoke('removeAttr', 'target').click()
    cy.contains('Talking About Testing').should('be.visible')
  });

  // Testa a página da política de privacidade de forma independente -> esta em outro arquivo JS

  it('Exibe e esconde as mensagens de sucesso e erro usando 0 .invoke()', () => {
    cy.get('.success').invoke('show').should('be.visible').and('contain', 'Mensagem enviada com sucesso.').invoke('hide').should('not.be.visible')
    cy.get('.error').should('not.be.visible').invoke('show').should('be.visible').and('contain', 'Valide os campos obrigatórios!').invoke('hide').should('not.be.visible')
  });

  it('Preenche a area de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('123456789', 20)

    cy.get('#open-text-area').invoke('val', longText).should('have.value', longText)
  });

  it('Faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html').should((response) => {
      //console.log(response)
      const { status, statusText, body } = response
      expect(status).to.equal(200)
      expect(statusText).to.equal('OK')
      expect(body).to.include('CAC TAT')
    })
  });

})