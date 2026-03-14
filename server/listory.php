<?php
/**
 * Plugin Name: Listory
 * Description: Composable checklist app — define permanent lists, merge them into ephemeral checklists. Exposed via WPGraphQL.
 * Version: 1.0.0
 * Author: hsimah
 * Text Domain: listory
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LISTORY_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

require_once LISTORY_PLUGIN_DIR . 'includes/post-types.php';
require_once LISTORY_PLUGIN_DIR . 'includes/meta-fields.php';
require_once LISTORY_PLUGIN_DIR . 'includes/graphql.php';
require_once LISTORY_PLUGIN_DIR . 'includes/admin-menu.php';
require_once LISTORY_PLUGIN_DIR . 'includes/seed-data.php';
require_once LISTORY_PLUGIN_DIR . 'includes/frontend.php';

register_activation_hook( __FILE__, 'listory_activate' );
register_deactivation_hook( __FILE__, 'listory_deactivate' );
