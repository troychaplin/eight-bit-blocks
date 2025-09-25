<?php
/**
 * Register our blocks.
 *
 * @package Eight_Bit_Blocks
 */

namespace Eight_Bit_Blocks;

/**
 * This class is responsible for registering custom Gutenberg blocks for the plugin.
 *
 * @package Eight_Bit_Blocks
 */
class Register_Blocks extends Plugin_Module {
	/**
	 * Path resolver for blocks directory.
	 *
	 * @var Plugin_Paths
	 */
	private Plugin_Paths $blocks_dir;

	/**
	 * Setup the class.
	 *
	 * @param string $blocks_dir Absolute path to the built directory.
	 */
	public function __construct( string $blocks_dir ) {
		$this->blocks_dir = new Plugin_Paths( $blocks_dir );
	}

	/**
	 * Initialize the module.
	 */
	public function init() {
		add_action( 'init', array( $this, 'register_blocks' ) );
        add_filter( 'block_categories_all', array( $this, 'add_order_block_category' ), 10, 2 );
	}

	/**
	 * Register blocks.
	 */
	public function register_blocks() {
		$blocks_manifest_path = $this->blocks_dir->get_path( 'blocks-manifest.php' );

		if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
			wp_register_block_types_from_metadata_collection(
				$this->blocks_dir->get_path( 'blocks' ),
				$blocks_manifest_path
			);
		} elseif ( function_exists( 'wp_register_block_metadata_collection' ) ) {
			wp_register_block_metadata_collection(
				$this->blocks_dir->get_path( 'blocks' ),
				$blocks_manifest_path
			);
		} else {
			// Generic fallback.
			$manifest_data = include $blocks_manifest_path;

			foreach ( array_keys( $manifest_data ) as $block_type ) {
				register_block_type( $this->blocks_dir->get_path( 'blocks/' . $block_type ) );
			}
		}
	}

    public function add_order_block_category( $categories ) {
        $custom_category = array(
            'slug'     => 'eight-bit-blocks',
            'title'    => __( 'Eight Bit Blocks', 'eight-bit-blocks' ),
            'icon'     => null,
            'position' => 1,
        );

        // Extract position from the custom category array.
        $position = $custom_category['position'];

        // Remove position from the custom category array.
        unset( $custom_category['position'] );

        // Insert the custom category at the desired position.
        array_splice( $categories, $position, 0, array( $custom_category ) );

        return $categories;
    }
}
