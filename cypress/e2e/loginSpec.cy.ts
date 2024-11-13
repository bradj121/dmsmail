describe('login spec', () => {
  it('login to dashboard', () => {
    cy.visit('http://localhost:3000/')

    cy.get('a[href*="login"]').click()

    cy.url().should('include', 'login')

    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="password"]').type('password')

    cy.contains('button', 'Log in').click()

    cy.contains('Dashboard Page')
  })
})