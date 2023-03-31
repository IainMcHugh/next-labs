describe('e2e', () => {
  it('variant is correct', () => {
    cy.visit('/');
    Cypress.Cookies.debug(true);
    cy.setCookie('foo', 'bar');
    cy.get('h1').contains('Welcome');
  });
});
