describe( 'Default monetization settings for pages and posts', () => {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();
	} );

	it( 'Checks that the default is preset to enabled and public', () => {
		cy.visit( '/wp-admin/admin.php?page=coil_settings&tab=monetization_settings' );
		cy
			.get( '#post_no-gating' )
			.should( 'be.checked' );

		cy
			.get( '#page_no-gating' )
			.should( 'be.checked' );
	} );

	it( 'Checks that the default can be set to different values which reflect correctly in the frontend', () => {
		// Disable monetization on pages and posts
		cy.visit( '/wp-admin/admin.php?page=coil_settings&tab=monetization_settings' );
		cy
			.get( '#post_no' )
			.check();

		cy
			.get( '#page_no' )
			.check();
		cy
			.get( '#submit' )
			.click();

		// Check there is no monetization meta tag when monetization is diasabled.
		cy.visit( '/default-monetization-post/' );
		cy.get( 'head meta[name="monetization"]' ).should( 'not.exist' );
	} );
} );
