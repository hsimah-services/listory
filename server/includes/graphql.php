<?php
/**
 * Register WPGraphQL types, fields, and mutations for Listory.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'graphql_register_types', 'listory_register_graphql_types' );

function listory_register_graphql_types(): void {
	listory_register_graphql_object_types();
	listory_register_list_fields();
	listory_register_checklist_fields();
	listory_register_list_mutation_inputs();
	listory_register_custom_mutations();
}

/**
 * Register the ChecklistItem object type.
 */
function listory_register_graphql_object_types(): void {
	register_graphql_object_type( 'ListoryChecklistItem', [
		'description' => 'A single item in a checklist',
		'fields'      => [
			'name' => [
				'type'        => [ 'non_null' => 'String' ],
				'description' => 'Item name',
			],
			'checked' => [
				'type'        => [ 'non_null' => 'Boolean' ],
				'description' => 'Whether the item is checked',
			],
			'sourceListId' => [
				'type'        => 'Int',
				'description' => 'ID of the permanent list this item came from (null for ad-hoc items)',
			],
		],
	] );
}

/**
 * Register GraphQL fields for ListoryList.
 */
function listory_register_list_fields(): void {
	register_graphql_field( 'ListoryList', 'items', [
		'type'        => [ 'list_of' => [ 'non_null' => 'String' ] ],
		'description' => 'Template items in this permanent list',
		'resolve'     => function ( $post ) {
			$items = get_post_meta( $post->databaseId, 'listory_items', true );
			if ( empty( $items ) || ! is_array( $items ) ) {
				return [];
			}
			return $items;
		},
	] );
}

/**
 * Register GraphQL fields for ListoryChecklist.
 */
function listory_register_checklist_fields(): void {
	register_graphql_field( 'ListoryChecklist', 'sourceLists', [
		'type'        => [ 'list_of' => 'ListoryList' ],
		'description' => 'Permanent lists that were merged into this checklist',
		'resolve'     => function ( $post, $args, $context ) {
			$source_ids = get_post_meta( $post->databaseId, 'listory_source_lists', true );
			if ( empty( $source_ids ) || ! is_array( $source_ids ) ) {
				return [];
			}
			$results = [];
			foreach ( $source_ids as $id ) {
				$results[] = $context->get_loader( 'post' )->load_deferred( (int) $id );
			}
			return $results;
		},
	] );

	register_graphql_field( 'ListoryChecklist', 'items', [
		'type'        => [ 'list_of' => [ 'non_null' => 'ListoryChecklistItem' ] ],
		'description' => 'Checklist items with checked state',
		'resolve'     => function ( $post ) {
			$items = get_post_meta( $post->databaseId, 'listory_checklist_items', true );
			if ( empty( $items ) || ! is_array( $items ) ) {
				return [];
			}
			return array_map( function ( $item ) {
				return [
					'name'         => $item['name'] ?? '',
					'checked'      => (bool) ( $item['checked'] ?? false ),
					'sourceListId' => isset( $item['sourceListId'] ) ? (int) $item['sourceListId'] : null,
				];
			}, $items );
		},
	] );

	register_graphql_field( 'ListoryChecklist', 'completedAt', [
		'type'        => 'String',
		'description' => 'ISO 8601 timestamp when all items were checked (null if active)',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->databaseId, 'listory_completed_at', true ) ?: null;
		},
	] );

	register_graphql_field( 'ListoryChecklist', 'completed', [
		'type'        => [ 'non_null' => 'Boolean' ],
		'description' => 'Whether all items are checked',
		'resolve'     => function ( $post ) {
			$completed_at = get_post_meta( $post->databaseId, 'listory_completed_at', true );
			return ! empty( $completed_at );
		},
	] );
}

/**
 * Register mutation input fields for ListoryList create/update.
 */
function listory_register_list_mutation_inputs(): void {
	$fields = [
		'items' => [
			'type'        => [ 'list_of' => 'String' ],
			'description' => 'Template items for this permanent list',
		],
	];

	foreach ( [ 'CreateListoryListInput', 'UpdateListoryListInput' ] as $input_type ) {
		foreach ( $fields as $field_name => $config ) {
			register_graphql_field( $input_type, $field_name, $config );
		}
	}
}

/**
 * Save custom meta fields when standard WPGraphQL mutations fire.
 */
add_action( 'graphql_post_object_mutation_update_additional_data', 'listory_save_mutation_meta', 10, 6 );

function listory_save_mutation_meta( $post_id, $input, $post_type_object, $mutation_name, $context, $info ): void {
	$post_type = get_post_type( $post_id );

	if ( 'listory_list' === $post_type ) {
		if ( isset( $input['items'] ) ) {
			update_post_meta( $post_id, 'listory_items', $input['items'] );
		}
	}
}

/**
 * Register custom mutations for checklist operations.
 */
function listory_register_custom_mutations(): void {
	// createListoryChecklist — create a checklist by merging permanent lists
	register_graphql_mutation( 'createListoryChecklist', [
		'inputFields' => [
			'title' => [
				'type'        => [ 'non_null' => 'String' ],
				'description' => 'Checklist name',
			],
			'sourceListIds' => [
				'type'        => [ 'list_of' => [ 'non_null' => 'Int' ] ],
				'description' => 'IDs of permanent lists to merge',
			],
		],
		'outputFields' => [
			'checklist' => [
				'type'    => 'ListoryChecklist',
				'resolve' => function ( $payload ) {
					return get_post( $payload['postId'] );
				},
			],
		],
		'mutateAndGetPayload' => function ( $input ) {
			$title       = sanitize_text_field( $input['title'] );
			$source_ids  = $input['sourceListIds'] ?? [];

			$post_id = wp_insert_post( [
				'post_type'   => 'listory_checklist',
				'post_title'  => $title,
				'post_status' => 'publish',
			] );

			if ( is_wp_error( $post_id ) ) {
				throw new \GraphQL\Error\UserError( 'Failed to create checklist.' );
			}

			// Merge items from source lists with deduplication
			$merged = [];
			$seen   = [];

			foreach ( $source_ids as $list_id ) {
				$items = get_post_meta( (int) $list_id, 'listory_items', true );
				if ( ! is_array( $items ) ) {
					continue;
				}
				foreach ( $items as $item_name ) {
					$key = strtolower( $item_name );
					if ( ! isset( $seen[ $key ] ) ) {
						$seen[ $key ] = true;
						$merged[]     = [
							'name'         => $item_name,
							'checked'      => false,
							'sourceListId' => (int) $list_id,
						];
					}
				}
			}

			update_post_meta( $post_id, 'listory_source_lists', array_map( 'intval', $source_ids ) );
			update_post_meta( $post_id, 'listory_checklist_items', $merged );

			return [ 'postId' => $post_id ];
		},
	] );

	// updateListoryChecklist — update title
	register_graphql_mutation( 'updateListoryChecklist', [
		'inputFields' => [
			'id' => [
				'type'        => [ 'non_null' => 'Int' ],
				'description' => 'Checklist post ID',
			],
			'title' => [
				'type'        => 'String',
				'description' => 'New checklist name',
			],
		],
		'outputFields' => [
			'checklist' => [
				'type'    => 'ListoryChecklist',
				'resolve' => function ( $payload ) {
					return get_post( $payload['postId'] );
				},
			],
		],
		'mutateAndGetPayload' => function ( $input ) {
			$post_id = (int) $input['id'];
			$post    = get_post( $post_id );

			if ( ! $post || 'listory_checklist' !== $post->post_type ) {
				throw new \GraphQL\Error\UserError( 'Checklist not found.' );
			}

			if ( isset( $input['title'] ) ) {
				wp_update_post( [
					'ID'         => $post_id,
					'post_title' => sanitize_text_field( $input['title'] ),
				] );
			}

			return [ 'postId' => $post_id ];
		},
	] );

	// deleteListoryChecklist
	register_graphql_mutation( 'deleteListoryChecklist', [
		'inputFields' => [
			'id' => [
				'type'        => [ 'non_null' => 'Int' ],
				'description' => 'Checklist post ID',
			],
		],
		'outputFields' => [
			'deletedId' => [
				'type'    => 'Int',
				'resolve' => function ( $payload ) {
					return $payload['deletedId'];
				},
			],
		],
		'mutateAndGetPayload' => function ( $input ) {
			$post_id = (int) $input['id'];
			$post    = get_post( $post_id );

			if ( ! $post || 'listory_checklist' !== $post->post_type ) {
				throw new \GraphQL\Error\UserError( 'Checklist not found.' );
			}

			wp_delete_post( $post_id, true );

			return [ 'deletedId' => $post_id ];
		},
	] );

	// toggleChecklistItem — check/uncheck a single item
	register_graphql_mutation( 'toggleChecklistItem', [
		'inputFields' => [
			'checklistId' => [
				'type'        => [ 'non_null' => 'Int' ],
				'description' => 'Checklist post ID',
			],
			'itemName' => [
				'type'        => [ 'non_null' => 'String' ],
				'description' => 'Name of the item to toggle',
			],
			'checked' => [
				'type'        => [ 'non_null' => 'Boolean' ],
				'description' => 'New checked state',
			],
		],
		'outputFields' => [
			'checklist' => [
				'type'    => 'ListoryChecklist',
				'resolve' => function ( $payload ) {
					return get_post( $payload['postId'] );
				},
			],
		],
		'mutateAndGetPayload' => function ( $input ) {
			$post_id   = (int) $input['checklistId'];
			$item_name = $input['itemName'];
			$checked   = (bool) $input['checked'];

			$post = get_post( $post_id );
			if ( ! $post || 'listory_checklist' !== $post->post_type ) {
				throw new \GraphQL\Error\UserError( 'Checklist not found.' );
			}

			$items = get_post_meta( $post_id, 'listory_checklist_items', true );
			if ( ! is_array( $items ) ) {
				$items = [];
			}

			$found = false;
			foreach ( $items as &$item ) {
				if ( $item['name'] === $item_name ) {
					$item['checked'] = $checked;
					$found           = true;
					break;
				}
			}
			unset( $item );

			if ( ! $found ) {
				throw new \GraphQL\Error\UserError( 'Item not found in checklist.' );
			}

			update_post_meta( $post_id, 'listory_checklist_items', $items );

			// Auto-set completedAt when all items are checked
			$all_checked = true;
			foreach ( $items as $item ) {
				if ( ! $item['checked'] ) {
					$all_checked = false;
					break;
				}
			}

			if ( $all_checked && ! empty( $items ) ) {
				update_post_meta( $post_id, 'listory_completed_at', gmdate( 'c' ) );
			} else {
				delete_post_meta( $post_id, 'listory_completed_at' );
			}

			return [ 'postId' => $post_id ];
		},
	] );

	// addListToChecklist — merge a permanent list into an existing checklist
	register_graphql_mutation( 'addListToChecklist', [
		'inputFields' => [
			'checklistId' => [
				'type'        => [ 'non_null' => 'Int' ],
				'description' => 'Checklist post ID',
			],
			'listId' => [
				'type'        => [ 'non_null' => 'Int' ],
				'description' => 'Permanent list post ID to add',
			],
		],
		'outputFields' => [
			'checklist' => [
				'type'    => 'ListoryChecklist',
				'resolve' => function ( $payload ) {
					return get_post( $payload['postId'] );
				},
			],
		],
		'mutateAndGetPayload' => function ( $input ) {
			$checklist_id = (int) $input['checklistId'];
			$list_id      = (int) $input['listId'];

			$checklist = get_post( $checklist_id );
			if ( ! $checklist || 'listory_checklist' !== $checklist->post_type ) {
				throw new \GraphQL\Error\UserError( 'Checklist not found.' );
			}

			$list = get_post( $list_id );
			if ( ! $list || 'listory_list' !== $list->post_type ) {
				throw new \GraphQL\Error\UserError( 'List not found.' );
			}

			// Get current state
			$source_ids = get_post_meta( $checklist_id, 'listory_source_lists', true );
			if ( ! is_array( $source_ids ) ) {
				$source_ids = [];
			}

			$items = get_post_meta( $checklist_id, 'listory_checklist_items', true );
			if ( ! is_array( $items ) ) {
				$items = [];
			}

			// Add source list ID if not already present
			if ( ! in_array( $list_id, $source_ids, true ) ) {
				$source_ids[] = $list_id;
				update_post_meta( $checklist_id, 'listory_source_lists', $source_ids );
			}

			// Merge new items (deduplicate by name)
			$existing_names = [];
			foreach ( $items as $item ) {
				$existing_names[ strtolower( $item['name'] ) ] = true;
			}

			$list_items = get_post_meta( $list_id, 'listory_items', true );
			if ( is_array( $list_items ) ) {
				foreach ( $list_items as $item_name ) {
					$key = strtolower( $item_name );
					if ( ! isset( $existing_names[ $key ] ) ) {
						$existing_names[ $key ] = true;
						$items[] = [
							'name'         => $item_name,
							'checked'      => false,
							'sourceListId' => $list_id,
						];
					}
				}
			}

			update_post_meta( $checklist_id, 'listory_checklist_items', $items );

			// Clear completedAt since new unchecked items were added
			delete_post_meta( $checklist_id, 'listory_completed_at' );

			return [ 'postId' => $checklist_id ];
		},
	] );

	// removeListFromChecklist — remove a permanent list's items from a checklist
	register_graphql_mutation( 'removeListFromChecklist', [
		'inputFields' => [
			'checklistId' => [
				'type'        => [ 'non_null' => 'Int' ],
				'description' => 'Checklist post ID',
			],
			'listId' => [
				'type'        => [ 'non_null' => 'Int' ],
				'description' => 'Permanent list post ID to remove',
			],
		],
		'outputFields' => [
			'checklist' => [
				'type'    => 'ListoryChecklist',
				'resolve' => function ( $payload ) {
					return get_post( $payload['postId'] );
				},
			],
		],
		'mutateAndGetPayload' => function ( $input ) {
			$checklist_id = (int) $input['checklistId'];
			$list_id      = (int) $input['listId'];

			$checklist = get_post( $checklist_id );
			if ( ! $checklist || 'listory_checklist' !== $checklist->post_type ) {
				throw new \GraphQL\Error\UserError( 'Checklist not found.' );
			}

			// Remove from source lists
			$source_ids = get_post_meta( $checklist_id, 'listory_source_lists', true );
			if ( is_array( $source_ids ) ) {
				$source_ids = array_values( array_filter( $source_ids, fn( $id ) => (int) $id !== $list_id ) );
				update_post_meta( $checklist_id, 'listory_source_lists', $source_ids );
			}

			// Remove items from that source list
			$items = get_post_meta( $checklist_id, 'listory_checklist_items', true );
			if ( is_array( $items ) ) {
				$items = array_values( array_filter( $items, fn( $item ) =>
					! isset( $item['sourceListId'] ) || (int) $item['sourceListId'] !== $list_id
				) );
				update_post_meta( $checklist_id, 'listory_checklist_items', $items );
			}

			// Re-evaluate completedAt
			$all_checked = true;
			foreach ( $items as $item ) {
				if ( ! $item['checked'] ) {
					$all_checked = false;
					break;
				}
			}

			if ( $all_checked && ! empty( $items ) ) {
				update_post_meta( $checklist_id, 'listory_completed_at', gmdate( 'c' ) );
			} else {
				delete_post_meta( $checklist_id, 'listory_completed_at' );
			}

			return [ 'postId' => $checklist_id ];
		},
	] );
}
