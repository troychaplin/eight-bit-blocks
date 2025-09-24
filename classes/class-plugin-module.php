<?php
/**
 * Base class for plugin modules which can be initialized.
 *
 * @package Eight_Bit_Blocks
 */

namespace Eight_Bit_Blocks;

/**
 * Plugin module extended by other classes.
 */
abstract class Plugin_Module {
	/**
	 * Initialize the module.
	 */
	abstract public function init();
}
