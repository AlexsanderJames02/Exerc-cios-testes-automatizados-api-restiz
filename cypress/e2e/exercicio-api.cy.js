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
    cy.request ({
      method: 'POST',
      url: '/usuarios',
      body: {
        "nome": "Fulano da Silva",
        "email": "beltrano@qa.com.br",
        "password": "teste",
        "administrador": "true"
      }
    }).should((response) =>{
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
    cy.request({
      method: 'PUT',
      url: '/usuarios/ukPDeW1GaRjCRpnJ',
      body: {
        "nome": "Beltrano da Silva",
        "email": "beltrano@qa.com.br",
        "password": "teste",
        "administrador": "true"
      }
    }).should(response => {
      expect(response.status).equal(200)
      expect(response.body.message).equal('Registro alterado com sucesso')
    })
  });

  it.only('Deve deletar um usuário previamente cadastrado', () => {
    cy.request({
      method: 'DELETE',
      url: '/usuarios/ukPDeW1GaRjCRpnJ'
    }).should(response => {
      expect(response.status).equal(200)
      expect(response.body.message).equal('Registro excluído com sucesso | Nenhum registro excluído')
    })
  });


});
