<?php
/**
 * Register custom post types for Listory.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'listory_register_post_types' );

function listory_register_post_types(): void {
	// Permanent List
	register_post_type( 'listory_list', [
		'labels'       => [
			'name'               => __( 'Lists', 'listory' ),
			'singular_name'      => __( 'List', 'listory' ),
			'add_new_item'       => __( 'Add New List', 'listory' ),
			'edit_item'          => __( 'Edit List', 'listory' ),
			'new_item'           => __( 'New List', 'listory' ),
			'view_item'          => __( 'View List', 'listory' ),
			'search_items'       => __( 'Search Lists', 'listory' ),
			'not_found'          => __( 'No lists found', 'listory' ),
			'not_found_in_trash' => __( 'No lists found in Trash', 'listory' ),
		],
		'public'              => false,
		'show_ui'             => true,
		'show_in_rest'        => true,
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'show_in_menu' => 'listory',
		'supports'     => [ 'title', 'custom-fields' ],
		'show_in_graphql'    => true,
		'graphql_single_name' => 'ListoryList',
		'graphql_plural_name' => 'ListoryLists',
	] );

	// Checklist (Ephemeral List)
	register_post_type( 'listory_checklist', [
		'labels'       => [
			'name'               => __( 'Checklists', 'listory' ),
			'singular_name'      => __( 'Checklist', 'listory' ),
			'add_new_item'       => __( 'Add New Checklist', 'listory' ),
			'edit_item'          => __( 'Edit Checklist', 'listory' ),
			'new_item'           => __( 'New Checklist', 'listory' ),
			'view_item'          => __( 'View Checklist', 'listory' ),
			'search_items'       => __( 'Search Checklists', 'listory' ),
			'not_found'          => __( 'No checklists found', 'listory' ),
			'not_found_in_trash' => __( 'No checklists found in Trash', 'listory' ),
		],
		'public'              => false,
		'show_ui'             => true,
		'show_in_rest'        => true,
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'show_in_menu' => 'listory',
		'supports'     => [ 'title', 'custom-fields' ],
		'show_in_graphql'    => true,
		'graphql_single_name' => 'ListoryChecklist',
		'graphql_plural_name' => 'ListoryChecklists',
	] );
}
