/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (email: string, password: string) => { 
    cy.visit('http://localhost:3000/')

    cy.get('a[href*="login"]').click()

    cy.url().should('include', 'login')

    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)

    cy.contains('button', 'Log in').click()
 })

export {};

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password: string): Chainable<any>
    }
  }
}