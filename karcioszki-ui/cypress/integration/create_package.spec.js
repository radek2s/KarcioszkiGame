describe('Package creation Test', () => {

    beforeEach(() => {
        let user = {"id":1,"name":"CypressUser","team":"0","leader":false}
        localStorage.setItem('activePlayer', JSON.stringify(user))
    })

    it('Open main page', () => {
        localStorage.clear();
        cy.visit('/')
        cy.get('input').type('CypressUser').should('have.value', 'CypressUser')
        cy.contains('Zatwierdź').click();
        cy.contains("Karcioszki - Menu")
        cy.contains("Załóż grę")
    })
    
    it('Visit the package menu', () => {
        cy.visit('/package-editor')
        cy.contains('Zestawy kart');
    })

})