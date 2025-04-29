/// <reference types="Cypress" />

const users = [
    'standard_user',
    'locked_out_user',
    'problem_user',
    'performance_glitch_user',
    'error_user',
    'visual_user'
];


function login(user) {
    cy.get('[data-test="username"]').click().type(user)
  
    cy.get('[data-test="password"]').click().type('secret_sauce')
  
    cy.get('[data-test="login-button"]').click()
}

function mensagemErro(mensagem){

    cy.get('[data-test="error"]').should('be.visible').and('contain', mensagem)

}

function verificadorImagem(){
    let encontrouErro = false;

    cy.get('img').each(($img) => {
    const src = $img.attr('src');
    if (src.includes('/static/media/sl-404')) {
      encontrouErro = true;
    }
    }).then(() => {
    expect(encontrouErro).to.be.true;
    });
}

function verificadorTempoEspera(){

     const tempoComeco = Date.now();
    cy.get('[data-test="title"]', {timeout: 10000}).should('be.visible').then(() => {
        const tempoFinal = Date.now();
        const duracao = tempoFinal - tempoComeco;
  
        // Esse usuário está com problema de performance, então o comportamente esperado é que ele demore mais de 3 segundos para carregar algum elemento da página.
        expect(duracao).to.be.greaterThan(3000);
    });
}

describe('Teste de Login para Múltiplos Usuários', () => {

    beforeEach(() => {

        cy.visit('https://www.saucedemo.com/')

    })

        it('Usuário e Senha Vazios', () => {
  
        cy.get('[data-test="login-button"]').click()

        mensagemErro('Epic sadface: Username is required')
  
    });
  
    it('Usuário Vazio', () => {
  
        cy.get('[data-test="password"]').click().type('secret_sauce')
  
        cy.get('[data-test="login-button"]').click()

        mensagemErro('Epic sadface: Username is required')
  
    });
  
    it('Senha Vazia', () => {
  
        cy.get('[data-test="username"]').click().type('locked_out_user')
  
        cy.get('[data-test="login-button"]').click()

        mensagemErro('Epic sadface: Password is required')
  
    });
  
    it('Login com sucesso', () => {
      
        login(users[0])
      
    });
  
    it('Usuário bloqueado', () => {
  
        login(users[1])

        mensagemErro('Epic sadface: Sorry, this user has been locked out.')
  
    });
  

    it('Usuário com problemas. A página aparece com todas as imagens de itens de vendas erradas', () => {
  
        login(users[2])

        verificadorImagem()

      });
  
    it('Verifica se o tempo de espera até aparecer um componente da outro página é maior que 3 segundos', () => {
  
        login(users[3])
        
        verificadorTempoEspera()
  
    });

    it('Usuário com erro', () => {
      
        login(users[4])
      
    });
  
    it('Usuário com  um problema. A página aparece com uma imagem de item de venda errada', () => {
  
        login(users[5])

        verificadorImagem()
    });
  
  })