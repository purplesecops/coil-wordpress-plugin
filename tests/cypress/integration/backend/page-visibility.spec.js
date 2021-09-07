describe( 'Tests for visibility settings in editor', () => {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();
	} );

	it( 'Checks that visibility settings of a post can be changed in Gutenberg', () => {
		cy.visit( '/post-visibility' );

		const monetizationAndVisibilityCombinations = [
			{
				monetization: 'Enabled',
				visibility: '#inspector-radio-control-0-2', // Enabled with Split content
			},
			{
				monetization: 'Enabled',
				visibility: '#inspector-radio-control-0-0', // Enabled for Everyone
			},
			{
				monetization: 'Enabled',
				visibility: '#inspector-radio-control-0-1', // Enabled for Coil Members Only
			},
			{
				monetization: 'Disabled',
			},
		];
		saveAndCheckSettings( monetizationAndVisibilityCombinations );
	} );
} );

/**
 * Opens the Coil panel in the editor so that monetization and visibility can be set.
 * All setting combinations that are passed in are selected, saved and checked.
 *  @param {Array} Settings specifies the gating type
 */
function saveAndCheckSettings( Settings ) {
	const monetizationDropDown = '#inspector-select-control-1';

	Settings.foreach( ( selection ) => {
		cy
			.get( monetizationDropDown )
			.select( selection.monetization );
		if ( selection.monetization === 'Disabled' ) {
			cy
				.get( '.editor-post-publish-button' )
				.click();

			// Check the correct setting is still there
			cy
				.get( monetizationDropDown )
				.should( 'contain', selection.monetization );
		} else {
			cy
				.get( selection.visibility )
				.check();
			cy
				.get( '.editor-post-publish-button' )
				.click();

			// Check the correct setting is still there
			cy
				.get( selection.visibility )
				.should( 'be.checked' );
		}
	} );
}
