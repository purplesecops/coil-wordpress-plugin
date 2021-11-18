/* global coilAdminParams */

( function( $ ) {
	const activeTabID = $( '.nav-tab-wrapper a.nav-tab-active' ).attr( 'id' );

	// Welcome notice
	if ( activeTabID === 'coil-welcome-settings' ) {
		const $welcomeNoticeDismissButton = $( '.coil-welcome-notice .notice-dismiss' );

		// No welcome notice on this screen.
		if ( ! $welcomeNoticeDismissButton ) {
			return;
		}

		if ( ! coilAdminParams || ! coilAdminParams.ajax_url ) {
			return;
		}

		// Fire ajax request to dismiss notice permanently.
		$welcomeNoticeDismissButton.on( 'click', function() {
			$.ajax( {
				url: coilAdminParams.ajax_url,
				type: 'POST',
				data: {
					action: 'dismiss_welcome_notice',
				},
			} );
		} );
	}

	// No payment pointer
	if ( activeTabID === 'coil-general-settings' ) {
		const noPaymentPointerNotice = $( '.coil-no-payment-pointer-notice' );
		if ( noPaymentPointerNotice.length > 0 ) {
			noPaymentPointerNotice.hide();

			const settingsUpdated = $( '#setting-error-settings_updated' );
			if ( settingsUpdated.length > 0 ) {
				noPaymentPointerNotice.show();
			}
		}
	}

	$( document ).on( 'keyup', '#coil_paywall_title', function() {
		$( '.coil-paywall-heading' ).text( $( this ).val() );
	} );

	$( document ).on( 'keyup', '#coil_paywall_message', function() {
		$( '.coil-paywall-body' ).text( $( this ).val() );
	} );

	$( document ).on( 'keyup', '#coil_paywall_button_text', function() {
		$( '.coil-paywall-cta' ).text( $( this ).val() );
	} );

	$( document ).on( 'change', 'input[name="coil_exclusive_settings_group[coil_message_color_theme]"]', function() {
		const coilTheme = $( this ).val(),
			logoSetting = $( '#coil_branding' ).val();

		let logoSrc = '';

		$( '.coil-paywall-container' ).attr( 'data-theme', coilTheme );

		if ( logoSetting === 'coil_logo' ) {
			if ( 'light' === coilTheme ) {
				logoSrc = coilAdminParams.coil_logo_url.light;
			} else {
				logoSrc = coilAdminParams.coil_logo_url.dark;
			}
			$( '.coil-paywall-image' ).attr( 'src', logoSrc );
		}
	} );

	$( document ).on( 'change', '#coil_branding', function() {
		const logoSetting = $( this ).val(),
			coilTheme = $( '[name="coil_exclusive_settings_group[coil_message_color_theme]:checked"]' ).val();

		let logoSrc = '';

		$( '.coil-paywall-image' ).removeClass( 'no_logo site_logo coil_logo' ).addClass( logoSetting );

		if ( logoSetting === 'coil_logo' ) {
			if ( 'light' === coilTheme ) {
				logoSrc = coilAdminParams.coil_logo_url.light;
			} else {
				logoSrc = coilAdminParams.coil_logo_url.dark;
			}
		} else if ( logoSetting === 'site_logo' ) {
			logoSrc = coilAdminParams.site_logo_url;
		}

		$( '.coil-paywall-image' ).attr( 'src', logoSrc );
	} );
}( jQuery ) );
