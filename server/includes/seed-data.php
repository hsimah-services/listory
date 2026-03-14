<?php
/**
 * WP-CLI command to seed test data for Listory.
 *
 * Usage: wp listory seed
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	return;
}

WP_CLI::add_command( 'listory seed', 'listory_seed_data' );

/**
 * Seed sample permanent lists for development.
 *
 * ## EXAMPLES
 *
 *     wp listory seed
 *
 * @when after_wp_load
 */
function listory_seed_data(): void {
	// Check if data already exists.
	$existing = get_posts( [
		'post_type'   => 'listory_list',
		'numberposts' => 1,
		'post_status' => 'publish',
	] );

	if ( ! empty( $existing ) ) {
		WP_CLI::warning( 'Seed data already exists. Delete existing posts first to re-seed.' );
		return;
	}

	// Permanent Lists
	$lists = [
		[
			'name'  => 'BBQ',
			'items' => [ 'Tongs', 'Oil', 'Plates', 'Napkins', 'Charcoal', 'Lighter fluid', 'Meat', 'Buns', 'Condiments', 'Ice', 'Cooler' ],
		],
		[
			'name'  => 'Picnic',
			'items' => [ 'Blanket', 'Plates', 'Cups', 'Napkins', 'Sunscreen', 'Bug spray', 'Sandwiches', 'Fruit', 'Drinks', 'Utensils' ],
		],
		[
			'name'  => 'Beach Day',
			'items' => [ 'Towels', 'Sunscreen', 'Umbrella', 'Chairs', 'Cooler', 'Snacks', 'Water', 'Sandals', 'Hat', 'Sunglasses' ],
		],
		[
			'name'  => 'Camping',
			'items' => [ 'Tent', 'Sleeping bag', 'Pillow', 'Flashlight', 'Matches', 'Firewood', 'Cooking pot', 'Water bottle', 'First aid kit', 'Bug spray', 'Rope', 'Knife' ],
		],
		[
			'name'  => 'International Travel',
			'items' => [ 'Passport', 'Visa documents', 'Travel insurance', 'Charger adapter', 'Medications', 'Copies of documents', 'Foreign currency', 'Phone charger', 'Neck pillow', 'Earplugs' ],
		],
	];

	$list_ids = [];
	foreach ( $lists as $list ) {
		$post_id = wp_insert_post( [
			'post_type'   => 'listory_list',
			'post_title'  => $list['name'],
			'post_status' => 'publish',
		] );

		if ( is_wp_error( $post_id ) ) {
			WP_CLI::error( "Failed to create list: {$list['name']}" );
			return;
		}

		update_post_meta( $post_id, 'listory_items', $list['items'] );

		$list_ids[] = $post_id;
		WP_CLI::log( "Created list: {$list['name']} (ID: {$post_id})" );
	}

	// Create a sample checklist merging BBQ + Picnic
	$bbq_id    = $list_ids[0];
	$picnic_id = $list_ids[1];

	$bbq_items    = $lists[0]['items'];
	$picnic_items = $lists[1]['items'];

	// Merge and deduplicate
	$merged = [];
	$seen   = [];

	foreach ( $bbq_items as $item ) {
		$key = strtolower( $item );
		if ( ! isset( $seen[ $key ] ) ) {
			$seen[ $key ] = true;
			$merged[]     = [
				'name'         => $item,
				'checked'      => false,
				'sourceListId' => $bbq_id,
			];
		}
	}

	foreach ( $picnic_items as $item ) {
		$key = strtolower( $item );
		if ( ! isset( $seen[ $key ] ) ) {
			$seen[ $key ] = true;
			$merged[]     = [
				'name'         => $item,
				'checked'      => false,
				'sourceListId' => $picnic_id,
			];
		}
	}

	$checklist_id = wp_insert_post( [
		'post_type'   => 'listory_checklist',
		'post_title'  => 'Park BBQ Picnic - Sample',
		'post_status' => 'publish',
	] );

	if ( is_wp_error( $checklist_id ) ) {
		WP_CLI::error( 'Failed to create sample checklist' );
		return;
	}

	update_post_meta( $checklist_id, 'listory_source_lists', [ $bbq_id, $picnic_id ] );
	update_post_meta( $checklist_id, 'listory_checklist_items', $merged );

	WP_CLI::log( "Created checklist: Park BBQ Picnic - Sample (ID: {$checklist_id})" );

	WP_CLI::success( "Seeded " . count( $list_ids ) . " permanent lists and 1 sample checklist." );
}
