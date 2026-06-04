describe('test da tela de login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('deve mostrar erro quando o login estiver errado', () => {
    cy.get('#login').clear().type('usuario_erro')
    cy.get('#senha').clear().type('senha_erro')

    cy.get('#btn-login').click()

    cy.get('#mensagem-erro').should('contain', 'Usuário não encontrado')
  })

  it('deve mostrar o usuario encontrado com login e senha correta', () => {
    cy.get('#login').clear().type('admin')
    cy.get('#senha').clear().type('admin')
    cy.get('#btn-login').click()

    cy.get('#mensagem-sucesso').should('contain', 'Usuário encontrado')
    cy.get('#mensagem-erro').should('not.exist')
  })
})