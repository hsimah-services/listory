<?php
/**
 * Frontend routing and asset loading for the Listory React app.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register rewrite rules so /listory and /listory/* are handled by WordPress.
 */
function listory_rewrite_rules() {
	add_rewrite_rule( '^listory(/.*)?$', 'index.php?listory_app=1', 'top' );
}
add_action( 'init', 'listory_rewrite_rules' );

/**
 * Register the listory_app query variable.
 */
function listory_query_vars( $vars ) {
	$vars[] = 'listory_app';
	return $vars;
}
add_filter( 'query_vars', 'listory_query_vars' );

/**
 * Load the app template when listory_app query var is set.
 */
function listory_template_include( $template ) {
	if ( get_query_var( 'listory_app' ) ) {
		if ( ! is_user_logged_in() ) {
			auth_redirect();
			exit;
		}
		return LISTORY_PLUGIN_DIR . 'templates/app.php';
	}
	return $template;
}
add_filter( 'template_include', 'listory_template_include' );

/**
 * Extend JWT expiry to 1 hour for SPA sessions.
 */
add_filter( 'graphql_jwt_auth_expire', function () {
	return HOUR_IN_SECONDS;
} );

/**
 * Read the Vite manifest and return the entry point JS and CSS filenames.
 *
 * @return array{js: string, css: string[]} Asset paths relative to dist/.
 */
function listory_get_vite_assets() {
	$manifest_path = LISTORY_PLUGIN_DIR . 'dist/.vite/manifest.json';

	if ( ! file_exists( $manifest_path ) ) {
		return array(
			'js'  => '',
			'css' => array(),
		);
	}

	$manifest = json_decode( file_get_contents( $manifest_path ), true );
	$entry    = $manifest['index.html'] ?? array();

	return array(
		'js'  => $entry['file'] ?? '',
		'css' => $entry['css'] ?? array(),
	);
}

/**
 * Flush rewrite rules on plugin activation.
 */
function listory_activate() {
	listory_rewrite_rules();
	flush_rewrite_rules();
}

/**
 * Flush rewrite rules on plugin deactivation.
 */
function listory_deactivate() {
	flush_rewrite_rules();
}
