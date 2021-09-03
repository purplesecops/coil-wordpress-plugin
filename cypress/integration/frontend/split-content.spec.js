const hiddenContentMessage = 'To keep reading, join Coil and install the browser extension. Visit coil.com for more information.';

describe('Visibility of content blocks for non WM-enabled users', () => {
	beforeEach(() => {
		resetSite();
		cy.visit('/block-visibility/')
	})

	it('Check visibility of content blocks hidden to non WM-enabled users', () => {
		cy
			.get('.coil-show-monetize-users')
			.invoke('text')
			.should('contain', hiddenContentMessage)
	})

	it('Check visibility of content blocks shown to non WM-enabled users', () => {
		cy
			.contains('Public')
			.should('not.contain', hiddenContentMessage)
			.should('be.visible')

		cy
			.get('img')
			.invoke('text')
			.should('not.contain', hiddenContentMessage)
	})

	it('Check visibility of content blocks hidden from WM-enabled users', () => {
		cy
			.contains('Hidden')
			.should('not.contain', hiddenContentMessage)
			.should('be.visible')
	})
})

describe('Check visibility of content blocks for WM-enabled users', () => {
	beforeEach(() => {
		resetSite();
		cy.visit('/block-visibility/')
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
			.should('contain', 'Coil only')
	})

	it('Check visibility of content blocks shown to non WM-enabled users', () => {
		cy
			.contains('Public')
			.should('not.contain', hiddenContentMessage)
			.should('be.visible')
			
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

