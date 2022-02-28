<?php
/**
 * Test.
 */
namespace Coil\Tests;

use Coil;
use Coil\Admin;
use WP_UnitTestCase;

/**
 * Testing the Coil button settings.
 */
class Test_Coil_Button_Settings extends WP_UnitTestCase {

	/**
	 * Testing if the Coil button shows by default.
	 *
	 * @return void
	 */
	public function test_if_default_coil_button_display_is_enabled() :  void {

		// Database defaults must first be setup
		Coil\maybe_update_database();
		$defaults        = Admin\get_coil_button_defaults();
		$retrieved_value = Admin\get_coil_button_setting( 'coil_button_toggle' );

		// The default is true
		$this->assertSame( $defaults['coil_button_toggle'], true );
		$this->assertSame( $defaults['coil_button_toggle'], $retrieved_value );
	}

	/**
	 * Testing if the Coil button display setting is retrieved correctly from the wp_options table.
	 *
	 * @return void
	 */
	public function test_if_the_coil_button_display_setting_is_retrieved_successfully() :  void {

		$coil_button_display = [ 'coil_button_toggle' => false ];
		update_option( 'coil_button_settings_group', $coil_button_display );

		$coil_button_settings = Admin\get_coil_button_setting( 'coil_button_toggle' );

		$this->assertSame( false, $coil_button_settings );

		$coil_button_display = [ 'coil_button_toggle' => true ];
		update_option( 'coil_button_settings_group', $coil_button_display );

		$coil_button_settings = Admin\get_coil_button_setting( 'coil_button_toggle' );

		$this->assertSame( true, $coil_button_settings );
	}

	/**
	 * Testing the Coil button message and link defaults.
	 *
	 * @return void
	 */
	public function test_coil_button_message_and_link_defaults() :  void {
		// Database defaults must first be setup
		Coil\maybe_update_database();
		$default_values  = Admin\get_coil_button_defaults();
		$retrieved_value = [
			'default_coil_button_text'        => Admin\get_coil_button_setting( 'coil_button_text', true ),
			'default_coil_button_link'        => Admin\get_coil_button_setting( 'coil_button_link', true ),
			'default_coil_member_button_text' => Admin\get_coil_button_setting( 'coil_members_button_text', true ),
		];

		$this->assertSame( $default_values['coil_button_text'], 'Support us with Coil' );
		$this->assertSame( $default_values['coil_button_text'], $retrieved_value['default_coil_button_text'] );
		$this->assertSame( $default_values['coil_button_link'], 'https://coil.com/' );
		$this->assertSame( $default_values['coil_button_link'], $retrieved_value['default_coil_button_link'] );
		$this->assertSame( $default_values['coil_members_button_text'], 'Thanks for your support!' );
		$this->assertSame( $default_values['coil_members_button_text'], $retrieved_value['default_coil_member_button_text'] );
	}

	// /**
	//  * Testing if the Coil button message and link settings are retrieved correctly from the wp_options table.
	//  *
	//  * @return void
	//  */
	// public function test_if_the_coil_button_message_and_link_settings_are_retrieved_successfully() :  void {
	// }

	/**
	 * Testing the Coil button shows to members by default.
	 *
	 * @return void
	 */
	public function test_coil_button_member_display_default() :  void {
		// Database defaults must first be setup
		Coil\maybe_update_database();
		$defaults        = Admin\get_coil_button_defaults();
		$retrieved_value = Admin\get_coil_button_setting( 'coil_button_member_display' );

		// The default is true
		$this->assertSame( $defaults['coil_button_member_display'], true );
		$this->assertSame( $defaults['coil_button_member_display'], $retrieved_value );
	}

	// /**
	//  * Testing if the Coil button member display option can be retrieved correctly from the wp_options table.
	//  *
	//  * @return void
	//  */
	// public function test_if_the_coil_button_member_display_setting_can_be_retrieved_successfully() :  void {
	// }

	/**
	 * Testing the Coil button color theme default.
	 *
	 * @return void
	 */
	public function test_coil_button_color_theme_default() :  void {
		// Database defaults must first be setup
		Coil\maybe_update_database();
		$defaults        = Admin\get_coil_button_defaults();
		$retrieved_value = Admin\get_coil_button_setting( 'coil_button_color_theme' );

		// The default is dark
		$this->assertSame( $defaults['coil_button_color_theme'], 'dark' );
		$this->assertSame( $defaults['coil_button_color_theme'], $retrieved_value );
	}

	// /**
	//  * Testing if the Coil button color theme option can be retrieved correctly from the wp_options table.
	//  *
	//  * @return void
	//  */
	// public function test_if_the_coil_button_color_theme_can_be_retrieved_successfully() :  void {
	// }

	/**
	 * Testing the Coil button size default.
	 *
	 * @return void
	 */
	public function test_coil_button_size_default() :  void {
		// Database defaults must first be setup
		Coil\maybe_update_database();
		$defaults        = Admin\get_coil_button_defaults();
		$retrieved_value = Admin\get_coil_button_setting( 'coil_button_size' );

		// The default is large
		$this->assertSame( $defaults['coil_button_size'], 'large' );
		$this->assertSame( $defaults['coil_button_size'], $retrieved_value );
	}

	// /**
	//  * Testing if the Coil button size can be retrieved correctly from the wp_options table.
	//  *
	//  * @return void
	//  */
	// public function test_if_the_coil_button_size_can_be_retrieved_successfully() :  void {
	// }

	/**
	 * Testing the Coil button position default.
	 *
	 * @return void
	 */
	public function test_coil_button_position_default() :  void {
		// Database defaults must first be setup
		Coil\maybe_update_database();
		$defaults        = Admin\get_coil_button_defaults();
		$retrieved_value = Admin\get_coil_button_setting( 'coil_button_position' );

		// The default is bottom-right
		$this->assertSame( $defaults['coil_button_position'], 'bottom-right' );
		$this->assertSame( $defaults['coil_button_position'], $retrieved_value );
	}

	// /**
	//  * Testing if the Coil button position can be retrieved correctly from the wp_options table.
	//  *
	//  * @return void
	//  */
	// public function test_if_the_coil_button_position_can_be_retrieved_successfully() :  void {
	// }

	/**
	 * Testing the Coil button margin defaults.
	 *
	 * @return void
	 */
	public function test_coil_button_margin_defaults() :  void {
		// Database defaults must first be setup
		Coil\maybe_update_database();
		$expected_values = [
			'coil_button_top_margin'    => '',
			'coil_button_right_margin'  => '',
			'coil_button_bottom_margin' => '',
			'coil_button_left_margin'   => '',
		];
		$retrieved_value = [
			'coil_button_top_margin'    => Admin\get_coil_button_setting( 'coil_button_top_margin' ),
			'coil_button_right_margin'  => Admin\get_coil_button_setting( 'coil_button_right_margin' ),
			'coil_button_bottom_margin' => Admin\get_coil_button_setting( 'coil_button_bottom_margin' ),
			'coil_button_left_margin'   => Admin\get_coil_button_setting( 'coil_button_left_margin' ),
		];

		// The default is always '-'
		$this->assertSame( $expected_values['coil_button_top_margin'], $retrieved_value['coil_button_top_margin'] );
		$this->assertSame( $expected_values['coil_button_right_margin'], $retrieved_value['coil_button_right_margin'] );
		$this->assertSame( $expected_values['coil_button_bottom_margin'], $retrieved_value['coil_button_bottom_margin'] );
		$this->assertSame( $expected_values['coil_button_left_margin'], $retrieved_value['coil_button_left_margin'] );
	}

	// /**
	//  * Testing if the Coil button margins can be retrieved correctly from the wp_options table.
	//  *
	//  * @return void
	//  */
	// public function test_if_the_coil_button_margins_can_be_retrieved_successfully() :  void {
	// }

	/**
	 * Testing the Coil button post-type visibility defaults.
	 *
	 * @return void
	 */
	public function test_coil_button_visibility_defaults() :  void {
	}

	// /**
	//  * Testing if the Coil button post-type visibility settings can be retrieved correctly from the wp_options table.
	//  *
	//  * @return void
	//  */
	// public function test_if_the_coil_button_visibility_settings_can_be_retrieved_successfully() :  void {
	// }

	/**
	 * Testing the Coil button mobile display default.
	 *
	 * @return void
	 */
	public function test_coil_button_mobile_display_default() :  void {
		// Database defaults must first be setup
		Coil\maybe_update_database();
		$defaults        = Admin\get_coil_button_defaults();
		$retrieved_value = Admin\get_coil_button_setting( 'coil_mobile_button_display' );

		// The default is true
		$this->assertSame( $defaults['coil_mobile_button_display'], true );
		$this->assertSame( $defaults['coil_mobile_button_display'], $retrieved_value );
	}

	// /**
	//  * Testing if the Coil button mobile display setting can be retrieved correctly from the wp_options table.
	//  *
	//  * @return void
	//  */
	// public function test_if_the_coil_button_mobile_display_setting_can_be_retrieved_successfully() :  void {
	// }
}
