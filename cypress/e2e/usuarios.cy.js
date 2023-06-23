  /// <reference types= 'cypress' />
 import contrato from "../contratos/usuarios.contract"

 describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
        cy.request('http://localhost:3000/usuarios').then(response => {
            return contrato.validateAsync(response.body)
        }) 
    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({

            method: 'GET',
            url: 'http://localhost:3000/usuarios'

        }).then((response) => {

            expect(response.status).to.equal(200)
            ///expect(response.body).to.have.property('produtos')
            ///expect(response.duration).to.be.lessThan(15)
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        let usuario = `Usuário ${Math.floor(Math.random() * 10000000)}`
        let email = `emailteste${Math.floor(Math.random() * 10000000)}@teste.com`
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/usuarios',
            body: {
                "nome": usuario,
  
                "email": email,
  
                "password": "teste",
  
                "administrador": "true"
            }

        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
        })
        
    });

    it('Deve validar um usuário com email inválido', () => {
        let usuario = `Usuário ${Math.floor(Math.random() * 10000000)}`
        
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/usuarios',
            failOnStatusCode: false,
            body: {
                "nome": usuario,
  
                "email": "beltrano@qa.com.br",
  
                "password": "teste",
  
                "administrador": "true"
            }

        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal("Este email já está sendo usado")
        }) 
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let usuario = `Usuário ${Math.floor(Math.random() * 10000000)}`
        let email = `emailteste${Math.floor(Math.random() * 10000000)}@teste.com`
        cy.cadastrar(usuario,email).then(response => {
            let id = response.body._id
            cy.request({

                method: 'PUT',
                url: `http://localhost:3000/usuarios/${id}`,
                body: {
                    "nome": `Usuário editado ${Math.floor(Math.random() * 10000000)}`,
  
                
                    "email": `email${Math.floor(Math.random() * 10000000)}@editado.com`,
  
                
                    "password": "teste123",
  
                
                    "administrador": "true"
                },
                
            }).then(response => {
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })
        })
         
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        let usuario = `Usuário ${Math.floor(Math.random() * 10000000)}`
        let email = `emailteste${Math.floor(Math.random() * 10000000)}@teste.com`
        cy.cadastrar(usuario,email).then(response => {
            let id = response.body._id
            cy.request({

                method: 'DELETE',
                url: `http://localhost:3000/usuarios/${id}`,
             })
        }).then(response => {
            expect(response.body.message).to.equal("Registro excluído com sucesso")
        })
    });


});