/**
 * Site setting / option tests.
 */

describe('Coil Settings', function () {
  beforeEach(() => {
    cy.logInToWordPress('admin', 'password');
    cy.visit('/wp-admin/');
  })

	it('checks that admin users can access the settings screen', function() {
		cy.get('#adminmenu').find('div.wp-menu-name').contains('Coil').as('coilSettings');
		cy.get('@coilSettings').click();
		cy.contains('Welcome to Coil Web Monetization for WordPress');
  });
});
