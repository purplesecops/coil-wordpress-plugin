// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

/**
 * Authenticate with WordPress.
 *
 * @param {string} username WordPress user name.
 * @param {string} password WordPress password.
 */
 Cypress.Commands.add('logInToWordPress', (username, password) => {

	cy.request({
		method: 'POST',
		url: '/wp-login.php',
		form: true,
		body: {
			"log": username,
			"pwd": password,
		},
	});

	// Verify by asserting an authentication cookie exists.
	cy.getCookies().then((cookies) => {
		let authCookie = '';

		cookies.forEach(theCookie => {
			if (theCookie.name.startsWith('wordpress_logged_in_')) {
				authCookie = theCookie.name;
			}
		});

		expect(authCookie).to.include('wordpress_logged_in_');
	});
});

/**
 * Mock and start a (fake) web monetization session.
 */
Cypress.Commands.add('startWebMonetization', () => {

	cy.window().then((window) => {
		startMonetization(window);

		cy
			.reload()
			.then(window => {
				startMonetization(window);
			})
	});
});

/**
 * Mock and start a (fake) web monetization session.
 *
 * @param window
 */
function startMonetization(window) {
	const doc = window.document;

	// Shim the Web Monetization API: https://webmonetization.org/specification.html
	if (!doc.monetization) {
		doc.monetization = doc.createElement('div');
	}
	doc.monetization.state = 'started';

	// Re-init Coil.
	doc.dispatchEvent(new Event('coilstart'));

	window.Cypress.monetized = true;

	// Trigger the "user has paid $$$" event.
	doc.monetization.dispatchEvent(new Event('monetizationstart'));
}

/**
 * Stops fake monetization session. Must be ran after you are done testing
 * with monetization as it will affect subsequent tests otherwise
 */
Cypress.Commands.add('stopWebMonetization', () => {
	cy.window().then(window => {
		const doc = window.document;
		doc.monetization.state = 'stopped';
		window.Cypress.monetized = false;
		// Re-init Coil.
		doc.dispatchEvent(new Event('coilstart'));
	})
});

/**
 * Reset site to original state.
 * Only the block visibility options in the Split content tests are in the post itself not the database.
 * Each paragraph is looped through and reset to Public in the Block Visibility post.
 * The assumption is that only this post will be used for any Split content settings tests.
 */
 Cypress.Commands.add('resetSite', () => {
	// // Removes all custom data from the database
	// cy.exec('wp db query \'DELETE FROM wp_options WHERE option_name IN ("coil_global_settings_group", "coil_content_settings_posts_group", "coil_content_settings_excerpt_group", "coil_messaging_settings_group", "coil_appearance_settings_group");\' --allow-root');
	// // Adds a payment pointer in
	// cy.exec('wp db query \'INSERT INTO wp_options (option_name, option_value) VALUES ("coil_global_settings_group", "a:2:{s:23:coil_payment_pointer_id;s:35:https://example.com/.well-known/pay;s:22:coil_content_container;s:28:.content-area .entry-content;}");\' --allow-root');
	// Set the permalinks to default to the post name
	cy.exec('wp rewrite structure \'/%postname%\' --allow-root');
});