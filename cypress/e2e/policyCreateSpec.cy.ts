describe('policy spec', () => {
    beforeEach(() => {
        cy.login("test@test.com", "password")
        cy.get('[href="/dashboard/policies"]').click()
    })

    it('create policy', () => {
        cy.get('.h-10 > .hidden').contains('Create Policy').click()
        const nowSeconds = Math.floor(Date.now() / 1000)
        const recipient = nowSeconds + '@test.com'

        cy.get('#recipients').type(recipient)
        cy.get('#subject').type('test subject')
        cy.get('#body').type('test body')

        cy.get('.mt-6 > .rounded-md').contains('Create Policy').click()

        cy.get('table tbody tr').filter((k, tr) => {
            return tr.children[0].innerHTML === recipient
        }).should('exist')
    })
})