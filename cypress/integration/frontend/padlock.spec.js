describe('Padlock test', () => {

	beforeEach(() => {
		cy.logInToWordPress('admin', 'password');
	})

	it('Checks if a padlock appears when enabled', () => {
		togglePadlock('check');

		cy.visit('/coil-members-only/')
		cy
			.get('.entry-title > .emoji')
			.should('exist')

		togglePadlock('uncheck');

		cy.visit('/?p=109/')
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
	cy.visit('/wp-admin/admin.php?page=coil_settings')

	cy.get('.nav-tab-wrapper > #coil-appearance-settings')
		.contains('Appearance')
		.click()

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
}
