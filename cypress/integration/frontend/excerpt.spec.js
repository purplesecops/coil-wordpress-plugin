describe('Excerpt behaviour', () => {
	beforeEach(() => {
		cy.logInToWordPress('admin', 'password');
	})

	it('Checks that the excerpt respects coil settings', () => {
		setExcerptVisibility(true)

		cy.visit('/');

		cy.get('.entry-title a')
			.contains('Excerpt post')
			.then($link => {
				$link[0].scrollIntoView();
				$link[0].click();
			})

		// cy.visit('/excerpt-post/');

		cy
			.contains('This content should be visible as an excerpt')
			.should('be.visible');

		setExcerptVisibility(false)

		cy.visit('/excerpt-post/');
		cy
			.contains('This content should be visible as an excerpt')
			.should('not.be.visible');
	})
})

/**
 * Sets whether excerpts are visible on posts
 *
 * @param {boolean} state
 */
function setExcerptVisibility(state) {
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
