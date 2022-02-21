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
		$default_coil_button_display = Admin\get_coil_button_setting( 'coil_button_toggle' );

		$this->assertSame( true, $default_coil_button_display );
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
}
