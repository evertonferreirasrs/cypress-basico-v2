Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () =>{
    cy.get('#firstName').type('Everton')
    cy.get('#lastName').type('Ferreira')
    cy.get('#email').type('everton@teste.com')
    cy.get('#phone-checkbox').click()
    cy.get('#open-text-area').type("Teste")
    cy.get('button[type="submit"]').click()
})