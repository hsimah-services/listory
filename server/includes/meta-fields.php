<?php
/**
 * Register custom meta fields for Listory post types.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'listory_register_meta_fields' );

function listory_register_meta_fields(): void {
	// Permanent List meta: items array
	register_post_meta( 'listory_list', 'listory_items', [
		'type'          => 'array',
		'description'   => 'Template items for this permanent list',
		'single'        => true,
		'show_in_rest'  => [
			'schema' => [
				'type'  => 'array',
				'items' => [ 'type' => 'string' ],
			],
		],
		'auth_callback' => function() {
			return current_user_can( 'edit_posts' );
		},
	] );

	// Checklist meta: source list IDs
	register_post_meta( 'listory_checklist', 'listory_source_lists', [
		'type'          => 'array',
		'description'   => 'IDs of permanent lists merged into this checklist',
		'single'        => true,
		'show_in_rest'  => [
			'schema' => [
				'type'  => 'array',
				'items' => [ 'type' => 'integer' ],
			],
		],
		'auth_callback' => function() {
			return current_user_can( 'edit_posts' );
		},
	] );

	// Checklist meta: checklist items (array of objects)
	register_post_meta( 'listory_checklist', 'listory_checklist_items', [
		'type'          => 'array',
		'description'   => 'Checklist items with name, checked status, and source list ID',
		'single'        => true,
		'show_in_rest'  => [
			'schema' => [
				'type'  => 'array',
				'items' => [
					'type'       => 'object',
					'properties' => [
						'name'         => [ 'type' => 'string' ],
						'checked'      => [ 'type' => 'boolean' ],
						'sourceListId' => [ 'type' => [ 'integer', 'null' ] ],
					],
				],
			],
		],
		'auth_callback' => function() {
			return current_user_can( 'edit_posts' );
		},
	] );

	// Checklist meta: completed at timestamp
	register_post_meta( 'listory_checklist', 'listory_completed_at', [
		'type'          => 'string',
		'description'   => 'ISO 8601 timestamp when all items were checked (null if active)',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => function() {
			return current_user_can( 'edit_posts' );
		},
	] );
}
