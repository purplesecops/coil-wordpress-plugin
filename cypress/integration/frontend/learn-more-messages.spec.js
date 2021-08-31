/**
 * Tests for options under the "Learn more button" Customiser panel.
 */

describe('"Learn more button" panel', function () {
	beforeEach(() => {
		cy.logInToWordPress('admin', 'password');
	})

	it('checks that the "Get Coil to access" button text can be changed', function() {
		// cy.server()
		// cy
		// 	.route({method: 'POST', url: '/wp-admin/admin-ajax.php'})
		// 	.as('settingsSubmitted')

		// cy.logInToWordPress('admin', 'password');
		cy.visit('/wp-admin/admin.php?page=coil_settings');

		cy.get('#coil-messaging-settings')
			.click()

		// Test the backend.
		const label = 'New Button Text ' + Date.now();
		cy.get('#coil_learn_more_button_text').clear().type(label);
		cy.get('#submit').click();
		// cy.wait('@settingsSubmitted')
		// cy.reload();

		cy.visit('/wp-admin/admin.php?page=coil_settings');

		cy.get('#coil-messaging-settings')
			.click()

		cy.get('#coil_learn_more_button_text').should('have.value', label);

		// Test the front-end.
		cy.visit('/?p=109/');
		cy.get('.coil-message-button')
			.contains(label);
	});

});


