/**
 * Coil button settings.
*/

describe( 'Coil button for WM-enabled users', function() {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();
		cy.visit( '/wp-admin/admin.php?page=coil_settings&tab=coil_button' );
	} );

	afterEach( () => {
		cy.stopWebMonetization();
	} );

	it( 'Checks the Coil button can be set to not display for Coil members', () => {
		// Set the Coil button to not display for Coil members.
		cy
			.get( '#coil_button_member_display' )
			.uncheck();

		cy
			.get( '#post_button_visibility_show' )
			.should( 'be.checked' );

		cy
			.get( '#submit' )
			.click();

		cy.visit( '/monetized-and-public/' );

		cy
			.get( '.coil-banner-message-button' )
			.should( 'be.visible' );

		cy.startWebMonetization();

		cy
			.get( '.coil-banner-message-button' )
			.should( 'not.exist' );
	} );

	it( 'Checks the Coil button is not shown to Coil members when it is disabled', () => {
		// Disable the Coil button.
		cy
			.get( '.coil-checkbox' )
			.click();

		cy
			.get( '#submit' )
			.click();

		cy.visit( '/monetized-and-public/' );
		cy.startWebMonetization();

		cy
			.get( '.coil-banner-message-button' )
			.should( 'not.exist' );
	} );

	it( 'Checks the Coil button can have a customized message for Coil members', () => {
		// Set a custom message for Coil members.
		const buttonMemberText = 'Thank you!';

		cy
			.get( '#coil_members_button_text' )
			.type( `{selectall}${ buttonMemberText }` );
		cy
			.get( '#coil_button_member_display' )
			.check();
		cy
			.get( '#post_button_visibility_show' )
			.should( 'be.checked' );
		cy
			.get( '#submit' )
			.click();

		cy.visit( '/monetized-and-public/' );
		cy.startWebMonetization();

		cy
			.get( '.coil-banner-message-button' )
			.should( 'be.visible' );
		cy
			.get( '.coil-banner-message-button > a' )
			.should( 'contain', buttonMemberText );
	} );
} );

describe( 'Coil button for non WM-enabled users', function() {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();
	} );

	it( 'Checks that the Coil button be can be enabled/disabled', function() {
		// Disable the Coil button.
		cy.visit( '/wp-admin/admin.php?page=coil_settings&tab=coil_button' );
		cy
			.get( '.coil-checkbox' )
			.click();

		cy
			.get( '#submit' )
			.click();

		cy.visit( '/monetized-and-public/' );
		cy
			.get( '.coil-banner-message-button' )
			.should( 'not.exist' );

		// Enable the Coil button and set it to display.
		cy.visit( '/wp-admin/admin.php?page=coil_settings&tab=coil_button' );
		cy
			.get( '.coil-checkbox' )
			.click();
		cy
			.get( '#post_button_visibility_show' )
			.should( 'be.checked' );
		cy
			.get( '#post_button_visibility_show' )
			.should( 'be.checked' );

		cy
			.get( '#submit' )
			.click();

		cy.visit( '/monetized-and-public/' );
		cy
			.get( '.coil-banner-message-button' )
			.should( 'be.visible' );
	} );

	it( 'Checks the Coil button can have a customized message and link', () => {
		// Set a custom message and link.
		const buttonText = 'Coil Eyes Only';
		const buttonLink = 'https://example.com/';

		cy.visit( '/wp-admin/admin.php?page=coil_settings&tab=coil_button' );
		cy
			.get( '#coil_button_text' )
			.type( `{selectall}${ buttonText }` );
		cy
			.get( '#coil_button_link' )
			.type( `{selectall}${ buttonLink }` );

		cy
			.get( '#post_button_visibility_show' )
			.should( 'be.checked' );
		cy
			.get( '#submit' )
			.click();

		cy.visit( '/monetized-and-public/' );

		cy
			.get( '.coil-banner-message-button > a' )
			.should( 'contain', buttonText );
		cy
			.get( '.coil-banner-message-button > a' )
			.should( 'have.attr', 'href', buttonLink );
	} );

	it( 'Checks that you can dissmiss the Coil button', () => {
		cy.visit( '/monetized-and-public/' );
		cy
			.get( '.coil-banner-message-button' )
			.should( 'be.visible' );
		cy
			.get( '#js-coil-banner-dismiss' )
			.click();

		cy
			.get( '.coil-banner-message-button' )
			.should( 'not.exist' );

		cy.reload();

		cy
			.get( '.coil-banner-message-button' )
			.should( 'not.exist' );

		cy
			.getCookie( 'ShowCoilPublicMsg' )
			.should( 'have.property', 'value', '1' );
	} );
} );
