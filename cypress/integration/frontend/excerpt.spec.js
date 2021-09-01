describe('Excerpt behaviour', () => {
	beforeEach(() => {
		cy.logInToWordPress('admin', 'password');
	})

	it('Checks that the post excerpts respect the coil settings', () => {
		setPostExcerptVisibility(true)

		cy.visit('/?p=105/');

		cy
			.contains('This content should be visible as an excerpt')
			.should('be.visible');

		setPostExcerptVisibility(false)

		cy.visit('/?p=105/');
		cy
			.contains('This content should be visible as an excerpt')
			.should('not.be.visible');
	})

// 	it('Checks that the page excerpts respect the coil settings', () => {
// 		setPageExcerptVisibility(true)

// 		cy.visit('/?p=105/');

// 		cy
// 			.contains('This content should be visible as an excerpt')
// 			.should('be.visible');

// 		setPageExcerptVisibility(false)

// 		cy.visit('/?p=105/');
// 		cy
// 			.contains('This content should be visible as an excerpt')
// 			.should('not.be.visible');
// 	})
// })

/**
 * Sets whether excerpts are visible on posts
 *
 * @param {boolean} state
 */
function setPostExcerptVisibility(state) {
	cy.visit('/wp-admin/admin.php?page=coil_settings&tab=excerpt_settings');
	switch (state) {
		case true:
			cy
				.get('#post_display_excerpt')
				.check();
			break;

		case false:
			cy
				.get('#post_display_excerpt')
				.uncheck();
			break;
	}

	cy
		.get('#submit')
		.click();
}

/**
 * Sets whether excerpts are visible on pages
 *
 * @param {boolean} state
 */
 function setPageExcerptVisibility(state) {
	cy.visit('/wp-admin/admin.php?page=coil_settings&tab=excerpt_settings');
	switch (state) {
		case true:
			cy
				.get('#page_display_excerpt')
				.check();
			break;

		case false:
			cy
				.get('#page_display_excerpt')
				.uncheck();
			break;
	}

	cy
		.get('#submit')
		.click();
}
