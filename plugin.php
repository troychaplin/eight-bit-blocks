<?php
/**
 * Plugin Name:       Eight Bit Blocks
 * Description:       A plugin of eight bit blocks.
 * Requires at least: 6.6
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Troy Chaplin
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       eight-bit-blocks
 *
 * @package Eight_Bit_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Include our bundled autoload if not loaded globally.
if ( ! class_exists( Eight_Bit_Blocks\Plugin_Paths::class ) && file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

if ( ! class_exists( Eight_Bit_Blocks\Plugin_Paths::class ) ) {
	wp_trigger_error( 'Eight Bit Blocks Plugin: Composer autoload file not found. Please run `composer install`.', E_USER_ERROR );
	return;
}

// Instantiate our modules.
$eight_bit_blocks_modules = array(
	new Eight_Bit_Blocks\Register_Blocks( __DIR__ . '/build' ),
	new Eight_Bit_Blocks\Enqueues( __DIR__ . '/build' ),
);


foreach ( $eight_bit_blocks_modules as $eight_bit_blocks_module ) {
	if ( is_a( $eight_bit_blocks_module, Eight_Bit_Blocks\Plugin_Module::class ) ) {
		$eight_bit_blocks_module->init();
	}
}
