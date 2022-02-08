<?php
declare(strict_types=1);
/**
 * Coil admin screens and options.
 */

namespace Coil\Admin;

use Coil;
use Coil\Gating;
use const Coil\COIL__FILE__;
use const Coil\PLUGIN_VERSION;

/**
 * Maybe save the Coil metabox data on content save.
 *
 * @param int $post_id The ID of the post being saved.
 *
 * @return void
 */
function maybe_save_post_metabox( int $post_id ) : void {

	if ( ! current_user_can( 'edit_post', $post_id ) || empty( $_REQUEST['coil_metabox_nonce'] ) ) {
		return;
	}

	// Check the nonce.
	check_admin_referer( 'coil_metabox_nonce_action', 'coil_metabox_nonce' );

	$do_autosave = defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE;
	if ( $do_autosave || wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
		return;
	}

	$post_monetization = sanitize_text_field( $_REQUEST['_coil_monetization_post_status'] ?? '' );

	if ( $post_monetization !== '' ) {
		switch ( $post_monetization ) {
			case 'monetized':
				$post_visibility = sanitize_text_field( $_REQUEST['_coil_visibility_post_status'] ?? get_visibility_default() );
				break;
			default:
				$post_visibility = get_visibility_default();
				break;
		}
		Gating\set_post_status( $post_id, '_coil_monetization_post_status', $post_monetization );
		Gating\set_post_status( $post_id, '_coil_visibility_post_status', $post_visibility );
	} else {
		delete_post_meta( $post_id, '_coil_monetization_post_status' );
		delete_post_meta( $post_id, '_coil_visibility_post_status' );
	}
}

/**
 * Fires after a term has been updated, but before the term cache has been cleaned.
 *
 * @param int    $term_id  Term ID.
 * @param int    $tt_id    Term taxonomy ID.
 * @param string $taxonomy Taxonomy slug.
 *
 * @return void
 */
function maybe_save_term_meta( int $term_id, int $tt_id, $taxonomy ) : void {

	$tax_obj = get_taxonomy( $taxonomy );
	if ( ! current_user_can( $tax_obj->cap->manage_terms ) || empty( $_REQUEST['term_gating_nonce'] ) ) {
		return;
	}

	// Check the nonce.
	check_admin_referer( 'coil_term_gating_nonce_action', 'term_gating_nonce' );

	$term_monetization = sanitize_text_field( $_REQUEST['_coil_monetization_term_status'] ?? '' );

	if ( $term_monetization !== '' ) {
		switch ( $term_monetization ) {
			case 'monetized':
				$term_visibity = sanitize_text_field( $_REQUEST['_coil_visibility_term_status'] ?? get_visibility_default() );
				break;
			default:
				$term_visibity = get_visibility_default();
				break;
		}
		Gating\set_term_status( $term_id, '_coil_monetization_term_status', $term_monetization );
		Gating\set_term_status( $term_id, '_coil_visibility_term_status', $term_visibity );
	} else {
		delete_term_coil_status_meta( $term_id );
	}

}

/**
 * Deletes any term meta when a term is deleted.
 *
 * @param int $term The term id.
 * @return void
 */
function delete_term_coil_status_meta( $term_id ) {

	if ( empty( $term_id ) ) {
		return;
	}
	delete_term_meta( $term_id, '_coil_monetization_term_status' );
	delete_term_meta( $term_id, '_coil_visibility_term_status' );
	// Deleted deprecated term meta
	delete_term_meta( $term_id, '_coil_monetizatize_term_status' );
}

/**
 * Add action links to the list on the plugins screen.
 *
 * @param array $links An array of action links.
 *
 * @return array $links Updated array of action links.
 */
function add_plugin_action_links( array $links ) : array {

	if ( ! current_user_can( 'manage_options' ) ) {
		return $links;
	}

	$action_links = [
		'settings' => '<a href="' . add_query_arg( [ 'page' => 'coil_settings' ], admin_url( 'admin.php' ) ) . '" aria-label="' . esc_attr__( 'Settings for Coil', 'coil-web-monetization' ) . '">' . esc_attr__( 'Settings', 'coil-web-monetization' ) . '</a>',
	];

	return array_merge( $action_links, $links );
}

/**
 * Add extra information to the meta section on the list on the plugins screen.
 *
 * @param string[] $metadata Plugin metadata.
 * @param string   $file     Path to this plugin's main file. Used to identify which row we're in.
 *
 * @return array $metadata Updated array of plugin meta.
 */
function add_plugin_meta_link( array $metadata, string $file ) : array {

	if ( $file !== 'coil-web-monetization/plugin.php' ) {
		return $metadata;
	}

	$row_meta = [
		'community' => '<a href="' . esc_url( 'https://wordpress.org/support/plugin/coil-web-monetization/' ) . '">' . esc_html__( 'Support forum', 'coil-web-monetization' ) . '</a>',
	];

	return array_merge( $metadata, $row_meta );
}

/**
 * Adds admin body class for the Coil settings screen.
 *
 * @param string $classes CSS classes.
 *
 * @return string $classes Updated CSS classes.
 */
function add_admin_body_class( string $classes ) : string {

	$screen = get_current_screen();
	if ( ! $screen ) {
		return $classes;
	}

	if ( $screen->id === 'toplevel_page_coil' ) {
		$classes = ' coil ';
	}

	return $classes;
}

/**
 * Load admin-only CSS/JS.
 *
 * @return void
 */
function load_admin_assets() : void {

	$screen = get_current_screen();
	if ( ! $screen ) {
		return;
	}

	$load_on_screens = [
		'toplevel_page_coil',
		'toplevel_page_coil_settings',
	];
	if ( ! in_array( $screen->id, $load_on_screens, true ) ) {
		return;
	}

	$site_logo = get_custom_logo();

	$suffix       = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
	$admin_params = apply_filters(
		'coil_admin_js_params',
		[
			'ajax_url'      => admin_url( 'admin-ajax.php' ),
			'site_logo_url' => ( ! empty( $site_logo ) ? $site_logo : false ),
			'coil_logo_url' => [
				'light' => plugin_dir_url( dirname( __DIR__ ) ) . 'assets/images/coil-icn-black.svg',
				'dark'  => plugin_dir_url( dirname( __DIR__ ) ) . 'assets/images/coil-icn-white.svg',
			],
		]
	);

	wp_enqueue_style(
		'coil_admin',
		esc_url_raw( plugin_dir_url( dirname( __DIR__ ) ) . 'assets/css/admin/coil' . $suffix . '.css' ),
		[],
		PLUGIN_VERSION
	);

	wp_register_script(
		'coil_admin_notices',
		esc_url_raw( plugin_dir_url( dirname( __DIR__ ) ) . 'assets/js/admin/admin-notices' . $suffix . '.js' ),
		[ 'jquery' ],
		time(),
		true
	);

	wp_localize_script(
		'coil_admin_notices',
		'coilAdminParams',
		$admin_params
	);

	// Enqueue localized script.
	wp_enqueue_script( 'coil_admin_notices' );
}

/**
 * Adds a Coil Web Monetization section to the Customizer that redirects users from the customizer
 * (where these customization settings were found previously)
 * to the Coil Settings panel.
 *
 * @param \WP_Customize_Manager $wp_customize WordPress Customizer object.
 * @return void
 */
function add_redirect_customizer_section( $wp_customize ) : void {

	// Message and Monetization customization options relocation section.
	$redirect_section = 'coil_customizer_section';

	$wp_customize->add_section(
		$redirect_section,
		[
			'title'      => __( 'Coil Web Monetization', 'coil-web-monetization' ),
			'capability' => apply_filters( 'coil_settings_capability', 'manage_options' ),
		]
	);

	$redirect_setting_id = 'customization-redirect-id';

	$wp_customize->add_setting(
		$redirect_setting_id,
		[
			'capability' => apply_filters( 'coil_settings_capability', 'manage_options' ),
			'default'    => true,
		]
	);

	$description  = '<p>' . sprintf(
		__( 'Message customization and post visibility settings have moved to the ', 'coil-web-monetization' ) . '<a href="%s">' . __( 'Exclusive Content tab', 'coil-web-monetization' ) . '</a>' . '.',
		esc_url( admin_url( 'admin.php?page=coil_settings&tab=exclusive_settings', COIL__FILE__ ) )
	) . '</p>';
	$description .= '<p>' . sprintf(
		__( 'Monetization options have been moved to the ', 'coil-web-monetization' ) . '<a href="%s">' . __( 'General Settings tab', 'coil-web-monetization' ) . '</a>' . '.',
		esc_url( admin_url( 'admin.php?page=coil_settings&tab=general_settings', COIL__FILE__ ) )
	) . '</p>';

	$wp_customize->add_control(
		$redirect_setting_id,
		[
			'type'        => 'hidden',
			'section'     => $redirect_section,
			'label'       => __( 'Customization options have all been moved to the Coil settings panel.', 'coil-web-monetization' ),
			'description' => $description,
		]
	);
}

/**
 * Gets the taxonomies and allows the output to be filtered.
 *
 * @return array Taxonomies or empty array
 */
function get_valid_taxonomies() : array {

	$all_taxonomies = get_taxonomies(
		[],
		'objects'
	);

	// Set up options to exclude certain taxonomies.
	$taxonomies_exclude = [
		'nav_menu',
		'link_category',
		'post_format',
	];

	$taxonomies_exclude = apply_filters( 'coil_settings_taxonomy_exclude', $taxonomies_exclude );

	// Store the available taxonomies using the above exclusion options.
	$taxonomy_options = [];
	foreach ( $all_taxonomies as $taxonomy ) {

		if ( ! empty( $taxonomies_exclude ) && in_array( $taxonomy->name, $taxonomies_exclude, true ) ) {
			continue;
		}
		if ( ! in_array( $taxonomy->name, $taxonomy_options, true ) ) {
			$taxonomy_options[] = $taxonomy->name;
		}
	}

	return $taxonomy_options;
}

/**
 * Get whatever settings are stored in the plugin as the default
 * content monetization settings (post, page, cpt etc).
 *
 * @return array Setting stored in options, or blank array.
 */
function get_general_settings() : array {

	$general_settings = get_option( 'coil_general_settings_group', [] );
	if ( ! empty( $general_settings ) ) {
		return $general_settings;
	}

	return [];
}

/**
 * Retrieve the payment pointer using a key from the general
 * settings group (serialized).
 *
 * @return string
 */
function get_payment_pointer_setting() {

	$settings = get_general_settings();

	return isset( $settings['coil_payment_pointer'] ) ? $settings['coil_payment_pointer'] : '';
}

/**
 * @return array Valid monetization states - Monetized or Not Monetized.
 */
function get_monetization_types() {

	$monetization_types = [
		'monetized'     => 'Monetized',
		'not-monetized' => 'Not Monetized',
	];

	return $monetization_types;
}

/**
 * Returns the single default 'monetized'.
 *
 * @return string
 */
function get_monetization_default() {
	return 'monetized';
}

/**
 * Retrieve the Exclusive Content settings.
 * @return array Setting stored in options.
 */
function get_exclusive_settings(): array {

	// Set up defaults.
	$defaults = [ 'coil_content_container' => '.content-area .entry-content' ];

	$exclusive_options = get_option( 'coil_exclusive_settings_group', [] );
	if ( empty( $exclusive_options ) || ! isset( $exclusive_options['coil_content_container'] ) ) {
		$exclusive_options['coil_content_container'] = $defaults['coil_content_container'];
	}

	return $exclusive_options;
}

/**
 * Retrieve the exclusive content toggle setting
 *
 * @return bool setting stored in options
 */
function is_exclusive_content_enabled() {
	$exclusive_options   = get_exclusive_settings();
	$exclusive_toggle_id = 'coil_exclusive_toggle';
	return isset( $exclusive_options[ $exclusive_toggle_id ] ) ? $exclusive_options[ $exclusive_toggle_id ] : get_exclusive_content_enabled_default();
}

/**
 * Provides the exclusive content toggle setting default
 *
 * @return bool The default is true
 */
function get_exclusive_content_enabled_default() {
	return true;
}

/**
 * Retrieve the paywall text field defaults
 * This includes the title, message, button text and button link
 *
 * @return array Text field default values
 */
function get_paywall_text_defaults() {

	// Set up defaults.
	return [
		'coil_paywall_title'       => __( 'Keep Reading with Coil', 'coil-web-monetization' ),
		'coil_paywall_message'     => __( 'We partnered with Coil to offer exclusive content. Access this and other great content with a Coil membership.', 'coil-web-monetization' ),
		'coil_paywall_button_text' => __( 'Become a Coil Member', 'coil-web-monetization' ),
		'coil_paywall_button_link' => __( 'https://coil.com/', 'coil-web-monetization' ),
	];
}

/**
 * Retrieve the paywall text fields.
 * If a value has been set then return it, otherwise return the default.
 * This includes the title, message, button text and button link
 *
 * @return string Text field value
 */
function get_paywall_text_settings_or_default( $field_id ) {
	$text_fields = [ 'coil_paywall_title', 'coil_paywall_message', 'coil_paywall_button_text', 'coil_paywall_button_link' ];
	if ( in_array( $field_id, $text_fields, true ) ) {
		$value = get_paywall_appearance_setting( $field_id ) === '' ? get_paywall_appearance_setting( $field_id, true ) : get_paywall_appearance_setting( $field_id );
		return $value;
	}
	return '';
}

/**
 * Retrieve the paywall appearance settings
 * using a key from coil_exclusive_settings_group (serialized).
 *
 * @param string $field_id The named key in the wp_options serialized array.
 * @param bool $default set to either return the text field default if the text field item is empty or to return an empty string.
 * @return string
 */
function get_paywall_appearance_setting( $field_id, $use_text_default = false ) {

	$exclusive_options = get_exclusive_settings();

	$text_fields    = [ 'coil_paywall_title', 'coil_paywall_message', 'coil_paywall_button_text', 'coil_paywall_button_link' ];
	$paywall_styles = [ 'coil_message_color_theme', 'coil_message_branding', 'coil_message_font' ];

	// Text inputs can be empty strings, in which the placeholder text will display or the default text will be returned.
	if ( in_array( $field_id, $text_fields, true ) ) {

		// The default is returned as a placeholder or as a coil_js_ui_messages field when no custom input has been provided
		if ( $use_text_default && empty( $exclusive_options[ $field_id ] ) ) {
			$text_defaults = get_paywall_text_defaults();
			return $text_defaults[ $field_id ];
		} else {
			return ( ! empty( $exclusive_options[ $field_id ] ) ) ? $exclusive_options[ $field_id ] : '';
		}
	} elseif ( in_array( $field_id, $paywall_styles, true ) ) {
		if ( isset( $exclusive_options[ $field_id ] ) ) {
			$setting_value = $exclusive_options[ $field_id ];
		} else {
			$style_defaults = get_paywall_appearance_defaults();
			$setting_value  = $style_defaults[ $field_id ];
		}
		return $setting_value;

	}
	return null;
}

/**
 * @return array Valid colour theme states
 */
function get_theme_color_types() {

	$theme_colors = [ 'light', 'dark' ];

	return $theme_colors;
}

/**
 * @return array Valid branding options.
 */
function get_paywall_branding_options() {

	$branding_choices = [ 'site_logo', 'coil_logo', 'no_logo' ];

	return $branding_choices;
}


/**
 * @return array Valid padlock positions.
 */
function get_padlock_title_icon_position_options() {

	$positions = [ 'before', 'after' ];

	return $positions;
}

/**
 * @return array Valid padlock icon styles.
 */
function get_padlock_title_icon_style_options() {

	$icon_styles = [ 'lock', 'coil_icon', 'bonus', 'exclusive' ];

	return $icon_styles;
}
/**
 * Returns the paywall appearance settings for all fields that are not text based.
 * This includes the color theme, branding choice, and font style.
 *
 * @return array
 */
function get_paywall_appearance_defaults(): array {
	$paywall_appearance_defaults = [
		'coil_message_color_theme' => 'light',
		'coil_message_branding'    => 'coil_logo',
		'coil_message_font'        => false,
	];

	return $paywall_appearance_defaults;
}

/**
 * Retrieve the exclusive post appearance settings
 * using a key from coil_exclusive_settings_group (serialized).
 *
 * @param string $field_id The named key in the wp_options serialized array.
 * @return string
 */
function get_exlusive_post_setting( $field_id ) {

	$padloack_settings = [ 'coil_padlock_icon_position', 'coil_padlock_icon_style' ];

	$exclusive_options  = get_exclusive_settings();
	$exclusive_defaults = get_exclusive_post_defaults();

	if ( $field_id === 'coil_title_padlock' ) {
		$setting_value = isset( $exclusive_options[ $field_id ] ) ? $exclusive_options[ $field_id ] : false;
		return $setting_value;
	} elseif ( in_array( $field_id, $padloack_settings, true ) ) {
		$setting_value = isset( $exclusive_options[ $field_id ] ) ? $exclusive_options[ $field_id ] : $exclusive_defaults[ $field_id ];
		return $setting_value;
	}
	return false;
}

/**
 * Returns the padlock default as true.
 *
 * @return array
 */
function get_exclusive_post_defaults(): array {
	$exclusive_post_defaults = [
		'coil_title_padlock'         => true,
		'coil_padlock_icon_position' => 'before',
		'coil_padlock_icon_style'    => 'lock',
	];

	return $exclusive_post_defaults;
}

/**
 * @return array Valid visibility states - Public or Exclusive.
 */
function get_visibility_types() : array {

	$visibility_types = [
		'public'    => 'Keep public',
		'exclusive' => 'Make exclusive',
	];

	return $visibility_types;
}

/**
 * Returns the visibility default which is 'public' for all post types.
 *
 * @return string
 */
function get_visibility_default() {

	return 'public';
}

/**
* Returns the default excerpt display for all post types. The default is to not display.
*
* @return boolean
*/
function get_excerpt_display_default() {

	return false;
}

/**
 * Retrieve the CSS selector setting settings.
 * @return string Setting stored in options.
 */
function get_css_selector() {

	$exclusive_options = get_exclusive_settings();
	if ( empty( $exclusive_options ['coil_content_container'] ) ) {
		return '.content-area .entry-content';
	} else {
		return $exclusive_options ['coil_content_container'];
	}
}

/**
 * Retrieve the Coil Button settings.
 * @return array Setting stored in options.
 */
function get_coil_button_settings() : array {

	$coil_button_settings = get_option( 'coil_button_settings_group', [] );
	return $coil_button_settings;
}

/**
 * Retrieve the Coil button toggle setting
 *
 * @return bool setting stored in options
 */
function is_coil_button_enabled() {
	$coil_button_options = get_coil_button_settings();
	$exclusive_toggle_id = 'coil_button_toggle';
	return isset( $coil_button_options[ $exclusive_toggle_id ] ) ? $coil_button_options[ $exclusive_toggle_id ] : false;
}

/**
 * Retrieve the Coil button settings.
 * @param string $field_name
 * @return string Setting stored in options.
 */
function get_coil_button_setting( $field_id ) {

	$coil_button_settings = get_coil_button_settings();
	$value                = false;
	$margin_keys          = array_keys( get_button_margin_key_defaults() );
	$default_settings     = get_coil_button_defaults();
	if ( in_array( $field_id, $margin_keys, true ) ) {
		$margin = get_coil_button_margin( $field_id );
		if ( $margin !== false && $margin !== 0 ) {
			$value = strval( $margin );
		} else {
			$value = '';
		}
	} elseif ( in_array( $field_id, array_keys( $default_settings ), true ) ) {
		$value = isset( $coil_button_settings[ $field_id ] ) ? $coil_button_settings[ $field_id ] : $default_settings[ $field_id ];
	}

	return $value;
}

/**
 * Retrieve the Coil button margins.
 * @param string $field_name
 * @return int Setting stored in options.
 */
function get_coil_button_margin( $field_id ) {

	$coil_button_settings = get_coil_button_settings();
	$value                = false;
	$margin_defaults      = get_button_margin_key_defaults();
	$margin_keys          = array_keys( $margin_defaults );
	if ( in_array( $field_id, $margin_keys, true ) ) {
		$value = isset( $coil_button_settings[ $field_id ] ) ? $coil_button_settings[ $field_id ] : $margin_defaults[ $field_id ];
	}

	return $value;
}

/**
 * Retrieve the Coil button settings defaults
 *
 * @return array Default values
 */
function get_coil_button_defaults() {
	// Set up defaults.
	$settings        = [
		'coil_show_promotion_bar'    => true,
		'coil_button_toggle'         => true,
		'coil_button_member_display' => true,
		'coil_button_text'           => __( 'Support us with Coil', 'coil-web-monetization' ),
		'coil_button_link'           => __( 'https://coil.com/', 'coil-web-monetization' ),
		'coil_members_button_text'   => __( 'Thanks for your support!', 'coil-web-monetization' ),
		'coil_button_color_theme'    => 'dark',
		'coil_button_size'           => 'large',
		'coil_button_position'       => 'bottom-right',
	];
	$margin_defaults = get_button_margin_key_defaults();
	return array_merge( $settings, $margin_defaults );
}

/**
 * @return array Default margins for the Coil button.
 */
function get_button_margin_key_defaults() {
	return [
		'coil_button_top_margin'    => 0,
		'coil_button_right_margin'  => 0,
		'coil_button_bottom_margin' => 0,
		'coil_button_left_margin'   => 0,
	];
}

/**
 * @return array Valid button sizes.
 */
function get_button_size_options() {

	$sizes = [ 'large', 'small' ];

	return $sizes;
}

/**
 * @return array Valid button positions.
 */
function get_button_position_options() {

	$position_options = [
		'bottom-right' => 'Bottom - Right',
		'bottom-left'  => 'Bottom - Left',
		'top-right'    => 'Top - Right',
		'top-left'     => 'Top - Left',
	];

	return $position_options;
}
