/**
 * Coil button settings.
*/

describe( 'Coil button settings tab', () => {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();
		cy.visit( '/wp-admin/admin.php?page=coil_settings&tab=coil_button' );
	} );

	it( 'Checks coil button setting defaults', () => {
		// Checks the button text and link deafults
		checkButtonText( '', '', '' );

		cy
			.get( '#coil_button_toggle' )
			.should( 'be.checked' );

		cy
			.get( '#dark_color_theme' )
			.should( 'be.checked' );

		cy
			.get( '#large_size' )
			.should( 'be.checked' );

		cy
			.get( '#coil_button_member_display' )
			.should( 'be.checked' );

		cy
			.get( '#position_dropdown' )
			.should( 'have.value', 'bottom-right' );

		// Checks the margin defaults
		checkButtonMargins( '', '', '', '' );
	} );

	it( 'Checks the button settings can be changed', () => {
		const buttonText = 'Coil Eyes Only';
		const buttonLink = 'https://example.com/';
		const buttonMemberText = 'Thank you for using Coil!';
		const topMargin = '0';
		const rightMargin = '10px';
		const bottomMargin = '-40';
		const leftMargin = 'abc';

		cy
			.get( '#coil_button_text' )
			.type( `{selectall}${ buttonText }` );
		cy
			.get( '#coil_button_link' )
			.type( `{selectall}${ buttonLink }` );
		cy
			.get( '#coil_members_button_text' )
			.type( `{selectall}${ buttonMemberText }` );

		// TODO: Disable Coil button and check that the other button settings are hidden.
		cy
			.get( '.coil-checkbox' )
			.click();

		cy
			.get( '#light_color_theme' )
			.click();

		cy
			.get( '#small_size' )
			.click();

		cy
			.get( '#coil_button_member_display' )
			.click();

		cy
			.get( '#coil_button_top_margin' )
			.type( `{selectall}${ topMargin }` );
		cy
			.get( '#coil_button_right_margin' )
			.type( `{selectall}${ rightMargin }` );
		cy
			.get( '#coil_button_bottom_margin' )
			.type( `{selectall}${ bottomMargin }` );
		cy
			.get( '#coil_button_left_margin' )
			.type( `{selectall}${ leftMargin }` );

		cy
			.get( '#submit' )
			.click();

		checkButtonText( buttonText, buttonLink, buttonMemberText );

		cy
			.get( '#coil_button_toggle' )
			.should( 'not.be.checked' );

		cy
			.get( '#light_color_theme' )
			.should( 'be.checked' );

		cy
			.get( '#small_size' )
			.should( 'be.checked' );

		cy
			.get( '#coil_button_member_display' )
			.should( 'not.be.checked' );

		checkButtonMargins( '', '10', bottomMargin, '' );
	} );

	it( 'Checks coil button visibility defaults', () => {
		cy
			.get( '#post_button_visibility_show' )
			.should( 'be.checked' );

		cy
			.get( '#page_button_visibility_show' )
			.should( 'be.checked' );

		cy
			.get( '#coil_mobile_button_display' )
			.should( 'be.checked' );
	} );

	it( 'Checks coil button visibility settings can be changed', () => {
		cy
			.get( '#post_button_visibility_hide' )
			.click();

		cy
			.get( '#page_button_visibility_hide' )
			.click();

		cy
			.get( '#coil_mobile_button_display' )
			.click();

		cy
			.get( '#submit' )
			.click();

		cy
			.get( '#post_button_visibility_hide' )
			.should( 'be.checked' );

		cy
			.get( '#page_button_visibility_hide' )
			.should( 'be.checked' );

		cy
			.get( '#coil_mobile_button_display' )
			.should( 'not.be.checked' );
	} );
} );

/**
 * Checks the button text and link contents in the Coil button tab.
 *
 * @param {String} buttonText The button's expected text.
 * @param {String} buttonLink The button's expected link.
 * @param {String} buttonMemberText The member's button expected text.

 */
function checkButtonText( buttonText, buttonLink, buttonMemberText ) {
	cy
		.get( '#coil_button_text' )
		.should( 'have.attr', 'placeholder', 'Support us with Coil' )
		.should( 'have.value', buttonText );
	cy
		.get( '#coil_button_link' )
		.should( 'have.attr', 'placeholder', 'https://coil.com/' )
		.should( 'have.value', buttonLink );
	cy
		.get( '#coil_members_button_text' )
		.should( 'have.attr', 'placeholder', 'Thanks for your support!' )
		.should( 'have.value', buttonMemberText );
}

/**
 * Checks the button margin contents in the Coil button tab.
 *
 * @param {String} topMargin The button's top margin.
 * @param {String} rightMargin The button's right margin.
 * @param {String} bottomMargin The member's bottom margin.
 * @param {String} leftMargin The member's button left margin.
 */
function checkButtonMargins( topMargin, rightMargin, bottomMargin, leftMargin ) {
	cy
		.get( '#coil_button_top_margin' )
		.should( 'have.attr', 'placeholder', '-' )
		.should( 'have.value', topMargin );
	cy
		.get( '#coil_button_right_margin' )
		.should( 'have.attr', 'placeholder', '-' )
		.should( 'have.value', rightMargin );
	cy
		.get( '#coil_button_bottom_margin' )
		.should( 'have.attr', 'placeholder', '-' )
		.should( 'have.value', bottomMargin );

	cy
		.get( '#coil_button_left_margin' )
		.should( 'have.attr', 'placeholder', '-' )
		.should( 'have.value', leftMargin );
}
