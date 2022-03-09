/**
 * Exclusive Content settings.
*/

describe( 'Exclusive Content settings tab', () => {
	beforeEach( () => {
		cy.logInToWordPress( 'admin', 'password' );
		cy.resetSite();
		cy.visit( '/wp-admin/admin.php?page=coil_settings&tab=exclusive_settings' );
	} );

	it( 'Checks paywall appearance defaults', () => {
		// Checks the button text and link deafults
		checkTextInputs( '', '', '', '' );

		cy
			.get( '#light_color_theme' )
			.should( 'be.checked' );

		cy
			.get( '#coil_branding' )
			.should( 'have.value', 'coil_logo' );

		cy
			.get( '#coil_message_font' )
			.should( 'not.be.checked' );
	} );

	it( 'Checks the paywall appearance settings can be changed', () => {
		const title = 'Coil Eyes Only';
		const message = ' ';
		const buttonText = 'Coil Eyes Only';
		const buttonLink = 'https://example.com/';

		cy
			.get( '#coil_paywall_title' )
			.type( `{selectall}${ title }` );
		cy
			.get( '#coil_paywall_message' )
			.type( `{selectall}${ message }` );
		cy
			.get( '#coil_paywall_button_text' )
			.type( `{selectall}${ buttonText }` );
		cy
			.get( '#coil_paywall_button_link' )
			.type( `{selectall}${ buttonLink }` );

		cy
			.get( '#dark_color_theme' )
			.click();

		cy
			.get( '#coil_branding' )
			.select( 'no_logo' );

		cy
			.get( '#coil_message_font' )
			.click();

		cy
			.get( '#submit' )
			.click();

		checkTextInputs( title, message, buttonText, buttonLink );

		cy
			.get( '#dark_color_theme' )
			.should( 'be.checked' );

		cy
			.get( '#coil_branding' )
			.should( 'have.value', 'no_logo' );

		cy
			.get( '#coil_message_font' )
			.should( 'be.checked' );
	} );

	it( 'Checks Exclusive Post Appearnce defaults', () => {
		cy
			.get( '#coil_title_padlock' )
			.should( 'be.checked' );

		cy
			.get( '#padlock_icon_position_before' )
			.should( 'be.checked' );

		cy
			.get( '#coil_padlock_icon_style_lock' )
			.should( 'be.checked' );
	} );

	it.only( 'Checks that the member sections are shown or hidden depending on whether the Exclusive Content is enabled for Coil members', () => {
		// By default the icon is displayed to members.
		cy
			.get( '#coil_title_padlock + label + h4' )
			.should( 'contain', 'Icon Position' )
			.should( 'be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group' )
			.should( 'be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group + h4' )
			.should( 'contain', 'Icon Style' )
			.should( 'be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group + h4 + .coil-radio-group' )
			.should( 'be.visible' );

		// Remove the icon from the title of exclusive posts.
		cy
			.get( '#coil_title_padlock' )
			.click();

		cy
			.get( '#coil_title_padlock + label + h4' )
			.should( 'contain', 'Icon Position' )
			.should( 'not.be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group' )
			.should( 'not.be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group + h4' )
			.should( 'contain', 'Icon Style' )
			.should( 'not.be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group + h4 + .coil-radio-group' )
			.should( 'not.be.visible' );

		// Enable the icon to appear in the title of exclusive posts.
		cy
			.get( '#coil_title_padlock' )
			.click();

		cy
			.get( '#coil_title_padlock + label + h4' )
			.should( 'contain', 'Icon Position' )
			.should( 'be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group' )
			.should( 'be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group + h4' )
			.should( 'contain', 'Icon Style' )
			.should( 'be.visible' );

		cy
			.get( '#coil_title_padlock + label + h4 + .coil-radio-group + h4 + .coil-radio-group' )
			.should( 'be.visible' );
	} );

	it( 'Checks that when the Exclusive Content is set to hide for Coil members that the members settings are hidden', () => {
		cy
			.get( '#coil_title_padlock' )
			.click();

		cy.get( '#submit' ).click();

		cy.reload();

		cy
			.get( '#coil_title_padlock + label + h4' )
			.should( 'contain', 'Message for Coil Members' )
			.should( 'not.be.visible' );

		cy
			.get( '#coil_members_button_text' )
			.should( 'not.be.visible' );
	} );

	it( 'Checks Exclusive Post Appearnce settings can be changed', () => {
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

	it( 'Checks Exclusive Content visibility defaults', () => {
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

	it( 'Checks Exclusive Content visibility settings can be changed', () => {
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
 * Checks the text input contents in the Exclusive Content tab.
 *
 * @param {String} title The paywall's expected title.
 * @param {String} message The paywall's expected text.
 * @param {String} buttonText The button's expected text.
 * @param {String} buttonLink The button's expected link.
 */
function checkTextInputs( title, message, buttonText, buttonLink ) {
	cy
		.get( '#coil_paywall_title' )
		.should( 'have.attr', 'placeholder', 'Keep Reading with Coil' )
		.should( 'have.value', title );

	cy
		.get( '#coil_paywall_message' )
		.should( 'have.attr', 'placeholder', 'We partnered with Coil to offer exclusive content. Access this and other great content with a Coil membership.' )
		.should( 'have.value', message );

	cy
		.get( '#coil_paywall_button_text' )
		.should( 'have.attr', 'placeholder', 'Become a Coil Member' )
		.should( 'have.value', buttonText );

	cy
		.get( '#coil_paywall_button_link' )
		.should( 'have.attr', 'placeholder', 'https://coil.com/' )
		.should( 'have.value', buttonLink );
}
