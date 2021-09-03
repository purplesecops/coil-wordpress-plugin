describe( 'Tests for block-level visibility settings', () => {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();

	})

	it("Checks that a block\s visibility settings can be changed in the block editor", () => {

		cy.visit('/wp-admin/post.php?post=1&action=edit')

		// Removal nag modal and open panel.
		cy
			.get('.interface-complementary-area')
			.contains('Coil Web Monetization')
			.click({force: true});

		// Select split content mode.
		cy
			.get('#inspector-select-control-1')
			.select("Enabled")
		cy
			.get('#inspector-radio-control-0-2')
			.check();

		// Find and select the first block (a paragraph block).
		cy
			.window()
			.its('wp')
			.then(wp => {
				const blocks = wp.data.select( 'core/block-editor' ).getBlocks();

				// figure out how to "Select" it
				wp.data.dispatch( 'core/block-editor' ).selectBlock( blocks[0].clientId );
			});

		// Open Coil panel for the selected block and change visiblity state.
		cy
			.get('.interface-complementary-area')
			.contains('Coil Web Monetization')
			.click({force: true});

		// Make block visible for only Coil Members
		cy
			.get('.interface-complementary-area')
			.contains('Only Show Coil Members')
			.prev('input[type="radio"]')
			.check();

		// Check that a "this block will be shown to monetized users only" message appear.
		// This is a CSS :before attribute, which we can't check for directly.
		cy
			.get('.coil-show-monetize-users:not(.has-warning)')
			.should('exist');

		cy
			.get('.coil-hide-monetize-users:not(.has-warning)')
			.should('not.exist');

		// Make block visible for Everyone
		cy
			.get('.interface-complementary-area')
			.contains('Always Show')
			.get('#inspector-radio-control-1-0')
			.check();

		// Check that a no message will appear.
		// This is a CSS :before attribute, which we can't check for directly.
		cy
			.get('.coil-show-monetize-users:not(.has-warning)')
			.should('not.exist');

		cy
			.get('.coil-hide-monetize-users:not(.has-warning)')
			.should('not.exist');

		// Hide block from Coil Members
		cy
			.get('.interface-complementary-area')
			.contains('Hide For Coil Members')
			.prev('input[type="radio"]')
			.get('#inspector-radio-control-1-2')
			.check();

		// Check that a "this block will be shown to non-monetized users only" message appear.
		// This is a CSS :before attribute, which we can't check for directly.
		cy
			.get('.coil-show-monetize-users:not(.has-warning)')
			.should('not.exist');

		cy
			.get('.coil-hide-monetize-users:not(.has-warning)')
			.should('exist');
	})
})
