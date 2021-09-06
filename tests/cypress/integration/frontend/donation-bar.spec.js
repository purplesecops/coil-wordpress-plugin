/**
 * Tests for options under the "Learn more button" Customiser panel.
 */

describe( 'Coil options panel', function() {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();
	} );

	it( 'checks that the donation bar be can be enabled/disabled', function() {
		toggleDonationBar( 'uncheck' );
		cy.visit( '/monetized-and-public/' );
		cy
			.get( '.banner-message-inner' )
			.should( 'not.exist' );

		toggleDonationBar( 'check' );
		cy.visit( '/monetized-and-public/' );
		cy
			.get( '.banner-message-inner' )
			.should( 'be.visible' );
		toggleDonationBar( 'uncheck' );
		cy.visit( '/monetized-and-public/' );
		cy
			.get( '.banner-message-inner' )
			.should( 'not.exist' );
	} );

	it( 'checks that the donation bar is no longer unchecked after database reset', function() {
		cy.visit( '/wp-admin/admin.php?page=coil_settings' );
		cy.get( '.nav-tab-wrapper > #coil-appearance-settings' )
			.contains( 'Appearance' )
			.click();

		cy.get( '#display_promotion_bar' ).should( 'be.checked' );
	} );

	it( 'Checks that you can dissmiss the donation bar as a WM enabled user', () => {
		cy.visit( '/monetized-and-public/' );

		cy.startWebMonetization();

		cy
			.get( '.banner-message-inner' )
			.should( 'not.exist' );

		cy.stopWebMonetization();
	} );

	it( 'Checks that you can dissmiss the donation bar as a WM disabled user', () => {
		cy.visit( '/monetized-and-public/' );
		cy
			.get( '.banner-message-inner' )
			.should( 'be.visible' );
		cy
			.get( '#js-coil-banner-dismiss' )
			.click();

		cy
			.get( '.banner-message-inner' )
			.should( 'not.exist' );

		cy.reload();

		cy
			.get( '.banner-message-inner' )
			.should( 'not.exist' );
	} );
} );

/**
 * Set the state of the Coil Promotion Bar option.
 *
 * @param {('check'|'uncheck')} checkboxState that the donation bar should be set to
 */
function toggleDonationBar( checkboxState ) {
	cy.visit( '/wp-admin/admin.php?page=coil_settings' );

	cy.get( '.nav-tab-wrapper > #coil-appearance-settings' )
		.contains( 'Appearance' )
		.click();

	switch ( checkboxState ) {
		case 'check':
			cy.get( '#display_promotion_bar' )
				.click()
				.check();
			break;
		case 'uncheck':
			cy.get( '#display_promotion_bar' )
				.click()
				.uncheck();
			break;
	}

	cy.get( '#submit' )
		.click( { force: true } );

	cy
		.get( '.notice-success' )
		.should( 'exist' );
}
