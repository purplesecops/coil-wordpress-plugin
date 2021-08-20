describe('Padlock test', () => {

	beforeEach(() => {
		cy.logInToWordPress('admin', 'password');
	})

	it('Checks if a padlock appears when enabled', () => {
		// cy.server()
		// cy.route({method: 'POST', url: '/wp-admin/admin-ajax.php'}).as('settingsSubmitted')

		togglePadlock('check');

		cy.visit('/coil-members-only/')
		cy
			.get('.entry-title')
			.should('contain', '🔒')

		togglePadlock('uncheck');

		cy.visit('/coil-members-only/')
		cy
			.get('.entry-title > .emoji')
			.should('not.exist')
	})
})

/**
 * Checks or unchecks the display padlock option
 *
 * @param {('check'|'uncheck')} checkboxState
 */
function togglePadlock(checkboxState) {
	cy.visit('/wp-admin/admin.php?page=coil_settings&tab=messaging_settings')

	cy
		.get('#coil-appearance-settings')
		.click();

	switch(checkboxState) {
		case 'check':
			cy
				.get('#display_padlock_id')
				.click()
				.check();
			break;
		case 'uncheck':
			cy
				.get('#display_padlock_id')
				.click()
				.uncheck();
			break;
	}

	cy
		.get('#submit')
		.click({force: true});

	// cy.wait('@settingsSubmitted')
}
