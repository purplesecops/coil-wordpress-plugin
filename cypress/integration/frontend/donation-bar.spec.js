/**
 * Tests for options under the "Learn more button" Customiser panel.
 */

describe('Coil options panel', function () {
	beforeEach(() => {
		cy.logInToWordPress('admin', 'password');
	})

	it('checks that the donation bar be can be enabled/disabled', function() {
		toggleDonationBar('uncheck');
		cy.visit('/?p=103/');
		cy
			.get('.banner-message-inner')
			.should('not.exist');

		toggleDonationBar('check');
		cy.visit('/?p=103/');
		cy
			.get('.banner-message-inner')
			.should('be.visible');
	});

	it('Checks that you can dissmiss the donation bar as a WM enabled user', () => {
		cy.visit('/?p=103/');

		cy.startWebMonetization();

		cy
			.get('.banner-message-inner')
			.should('not.exist');

		cy.stopWebMonetization();
	})

	it('Checks that you can dissmiss the donation bar as a WM disabled user', () => {
		cy.visit('/?p=103/');
		cy
			.get('.banner-message-inner')
			.should('be.visible');
		cy
			.get('#js-coil-banner-dismiss')
			.click();

		cy
			.get('.banner-message-inner')
			.should('not.exist');

		cy.reload();

		cy
			.get('.banner-message-inner')
			.should('not.exist');
	})
});

/**
 * Set the state of the Coil Promotion Bar option.
 *
 * @param {('check'|'uncheck')} checkboxState
 */
function toggleDonationBar(checkboxState) {
	cy.visit('/wp-admin/admin.php?page=coil_settings');

	cy.get('.nav-tab-wrapper > #coil-appearance-settings')
		.contains('Appearance')
		.click()

	switch (checkboxState) {
		case 'check':
			cy.get('#display_promotion_bar')
				.click()
				.check();
			break;
		case 'uncheck':
			cy.get('#display_promotion_bar')
				.click()
				.uncheck();
			break;
	}

	cy.get('#submit')
		.click({force: true});

	cy
		.get('.notice-success')
		.should('exist');
}
