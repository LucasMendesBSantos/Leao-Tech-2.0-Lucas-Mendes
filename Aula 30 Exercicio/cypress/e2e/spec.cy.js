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
    cy.get('#login').clear().type('joao')
    cy.get('#senha').clear().type('1234')
    cy.get('#btn-login').click()

    cy.get('#mensagem-sucesso').should('contain', 'Usuário encontrado')
    cy.get('#mensagem-erro').should('not.exist')
  })
})

describe('test de cadastro de produto', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('#login').clear().type('admin')
    cy.get('#senha').clear().type('admin')
    cy.get('#btn-login').click()
    cy.url().should('include', '/admin/produtos')
  })

  it('deve cadastrar um novo produto e exibi-lo na lista', () => {
    cy.get('#nome').type('Produto Teste')
    cy.get('#preco').type('99.99')
    cy.get('#descricao').type('Descrição do produto teste')
    cy.get('#quantidade').type('10')

    cy.get('#btn-cadastrar').click()

    cy.get('#mensagem-cadastro').should('contain', 'sucesso')

    cy.get('#btn-listar').click()
    cy.get('#lista-produtos').should('contain', 'Produto Teste')
    cy.get('#lista-produtos').should('contain', '99.99')
    cy.get('#lista-produtos').should('contain', '10')
  })

  it('deve mostrar erro ao tentar cadastrar produto sem preencher os campos', () => {
    cy.get('#btn-cadastrar').click()

    cy.get('#mensagem-cadastro').should('contain', 'Preencha todos os campos')
  })
})
