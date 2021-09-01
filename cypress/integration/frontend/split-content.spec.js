const hiddenContentMessage = 'To keep reading, join Coil and install the browser extension. Visit coil.com for more information.';

describe('Visibility of content blocks for non WM-enabled users', () => {
	beforeEach(() => {
		cy.visit('/?p=116/')
	})

	it('Check visibility of content blocks hidden to non WM-enabled users', () => {
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
		cy.visit('/?p=116/')
		cy.startWebMonetization();
	})

	afterEach(() => {
		cy.stopWebMonetization();
	})

	it('Check visibility of content blocks hidden to non WM-enabled users', () => {
		cy
			.get('.coil-show-monetize-users')
			.invoke('text')
			.should('not.contain', hiddenContentMessage)
	})

	it('Check visibility of content blocks shown to non WM-enabled users', () => {
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

