describe('Fully restricted posts', () => {

	beforeEach(() => {
		cy.logInToWordPress('admin', 'password')
	})

	it('Checks that you can edit text that appears on fully restricted posts', () => {
		cy.visit('/wp-admin/admin.php?page=coil_settings')
		cy
			.get('#coil-messaging-settings')
			.click();

		const lockedMessage = 'This post is fully locked!'

		cy
			.get('#coil_fully_gated_content_message')
			.type(`{selectall}${lockedMessage}`)

		cy
			.get('#submit')
			.click();

		cy.visit('/?p=109/');
		cy
			.contains(lockedMessage)
			.should('be.visible');
	})

	it('Checks that a VM enabled user can view monetized content', () => {
		cy.visit('/?p=109/');
		cy
			.contains('This is a test post for the Coil Members Only state.')
			.should('not.be.visible');

		cy.startWebMonetization();

		cy
			.contains('This is a test post for the Coil Members Only state.')
			.should('be.visible');

		cy.stopWebMonetization();
	})
})
