/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: '/usuarios'
    }).should((response) =>{
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let email = `beltrano${Math.floor(Math.random() * 100000000)}@qa.com.br`
    cy.cadastrarUsuario('Fulano', email, 'teste', 'true')
    .should((response) =>{
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request ({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false,
      body: {
        "nome": "Fulano da Silva",
        "email": "beltrano@qa.com.br",
        "password": "teste",
        "administrador": "true"
      }
    }).should((response) =>{
      expect(response.status).equal(400)
      expect(response.body.message).equal('Este email já está sendo usado')
      
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let email = `beltrano${Math.floor(Math.random() * 100000000)}@qa.com.br`
    cy.cadastrarUsuario('Fulano', email, '123', 'true')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'PUT',
          url: `/usuarios/${id}`,
          body: {
            "nome": "Fulano da Silva",
            "email": email,
            "password": "teste",
            "administrador": "true"
          }
        }).should(response =>{
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
      })
    
  });

  it.only('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario('Fulano', 'fulanodelete@qa.com.br', 'teste', 'true')
      .then(response => {
        let id = response.body._id
        cy.request({
          method:'DELETE',
          url:`/usuarios/${id}`
        })
      })
    });
});
