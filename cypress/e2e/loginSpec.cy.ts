describe('login spec', () => {
  beforeEach(() => {
    cy.login("test@test.com", "password")
  })

  it('user can log in to dashboard', () => {
    cy.get('.flex-grow > p').contains('Dashboard Page')
  })
})