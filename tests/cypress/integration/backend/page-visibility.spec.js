describe( 'Tests for visibility settings in editor', () => {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();
	} );

	it( 'Checks that visibility settings of a post can be changed in Gutenberg', () => {
		// Create a new post
		cy.visit( '/wp-admin/post-new.php' );
		cy.get( '#post-title-0' )
			.click( { force: true } )
			.type( 'Page Visibility Settings' );

		// Set the post to Split
		cy
			.get( '.interface-complementary-area' )
			.contains( 'Coil Web Monetization' )
			.click( { force: true } );
		cy
			.get( '#inspector-select-control-1' )
			.select( 'Enabled' );
		cy
			.get( '#inspector-radio-control-0-2' )
			.check();
		cy
			.get( '.editor-post-publish-panel__toggle' )
			.click();
		cy
			.get( '.editor-post-publish-panel__header-publish-button > .components-button' )
			.click();
		cy
			.get( '.editor-post-publish-panel__header > .components-button' )
			.click();

		// Check the Split setting is still there
		cy
			.get( '#inspector-radio-control-0-2' )
			.should( 'be.checked' );

		// Set the post to Enabled for Everyone
		cy
			.get( '#inspector-select-control-1' )
			.select( 'Enabled' );
		cy
			.get( '#inspector-radio-control-0-0' )
			.check();
		cy
			.get( '.editor-post-publish-button' )
			.click();

		// Check the Enabled for Everyone setting is still there
		cy
			.get( '#inspector-radio-control-0-0' )
			.should( 'be.checked' );

		// Set the post to Enabled and Exclusive
		cy
			.get( '#inspector-select-control-1' )
			.select( 'Enabled' );
		cy
			.get( '#inspector-radio-control-0-1' )
			.check();
		cy
			.get( '.editor-post-publish-button' )
			.click();

		// Check the Enabled and Exclusive setting is still there
		cy
			.get( '#inspector-radio-control-0-1' )
			.should( 'be.checked' );

		// Set the post to Disabled
		cy
			.get( '#inspector-select-control-1' )
			.select( 'Disabled' );
		cy
			.get( '.editor-post-publish-button' )
			.click();

		// Check the Disabled setting is still there
		cy
			.get( '#inspector-select-control-1' )
			.should( 'contain', 'Disabled' );
	} );
} );
