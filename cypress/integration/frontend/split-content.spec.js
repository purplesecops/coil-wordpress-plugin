const hiddenContentMessage = 'To keep reading, join Coil and install the browser extension. Visit coil.com for more information.';

describe('Visibility of content blocks for non WM-enabled users', () => {
	beforeEach(() => {
		cy.visit('/block-visibility/')
	})

	it('Check visibility of content blocks hidden to non WM-enabled users', () => {
		// Why do we expect the heading to be hidden?
		// cy
		// 	.get('.wm-shown h3')
		// 	.invoke('text')
		// 	.should('contain', hiddenContentMessage)

		cy
			.get('.coil-show-monetize-users')
			.invoke('text')
			.should('contain', hiddenContentMessage)
	})

	it('Check visibility of content blocks shown to non WM-enabled users', () => {
		cy
			// .get('.everyone-shown h3')
			// .invoke('text')
			// .should('not.contain', hiddenContentMessage)

		cy
			.get('img')
			.invoke('text')
			.should('not.contain', hiddenContentMessage)
	})

	it('Check visibility of content blocks hidden from WM-enabled users', () => {
		// cy
		// 	.get('.wm-hidden h3')
		// 	.invoke('text')
		// 	.should('not.contain', hiddenContentMessage)

		cy
			.contains('Hidden')
			.should('be.visible');
	})
})

describe('Check visibility of content blocks for WM-enabled users', () => {
	beforeEach(() => {
		cy.visit('/block-visibility/')
		cy.startWebMonetization();
	})

	afterEach(() => {
		cy.stopWebMonetization();
	})

	it('Check visibility of content blocks hidden to non WM-enabled users', () => {
		// cy
		// 	.get('.wm-shown h3')
		// 	.invoke('text')
		// 	.should('not.contain', hiddenContentMessage)

		cy
			.get('.coil-show-monetize-users')
			.invoke('text')
			.should('not.contain', hiddenContentMessage)
	})

	it('Check visibility of content blocks shown to non WM-enabled users', () => {
		// cy
		// 	.get('.everyone-shown h3')
		// 	.invoke('text')
		// 	.should('not.contain', hiddenContentMessage)

		cy
			.get('img')
			.invoke('text')
			.should('not.contain', hiddenContentMessage)
	})

	it('Check visibility of content blocks hidden from WM-enabled users', () => {
		cy
			.get('.coil-hide-monetize-users')
			.should('not.be.visible')
	})
})

