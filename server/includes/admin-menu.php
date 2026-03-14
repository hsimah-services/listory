<?php
/**
 * Register the top-level Listory admin menu and landing page.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'listory_register_admin_menu', 9 );

function listory_register_admin_menu(): void {
	add_menu_page(
		__( 'Listory', 'listory' ),
		__( 'Listory', 'listory' ),
		'edit_posts',
		'listory',
		'listory_render_landing_page',
		'dashicons-list-view',
		26
	);

	add_submenu_page(
		'listory',
		__( 'Dashboard', 'listory' ),
		__( 'Dashboard', 'listory' ),
		'edit_posts',
		'listory',
		'listory_render_landing_page'
	);
}

add_action( 'admin_bar_menu', 'listory_register_dev_admin_bar', 100 );

function listory_register_dev_admin_bar( WP_Admin_Bar $wp_admin_bar ): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$wp_admin_bar->add_node( array(
		'id'     => 'listory-dev-open-site',
		'parent' => 'site-name',
		'title'  => __( 'Open Listory', 'listory' ),
		'href'   => home_url( '/listory' ),
		'meta'   => array( 'target' => '_blank' ),
	) );
}

function listory_render_landing_page(): void {
	$lists_count      = wp_count_posts( 'listory_list' );
	$checklists_count = wp_count_posts( 'listory_checklist' );
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Listory', 'listory' ); ?></h1>
		<p><?php esc_html_e( 'Composable checklist dashboard.', 'listory' ); ?></p>

		<div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
			<div class="card" style="flex: 1; padding: 1.5rem;">
				<h2 style="margin-top: 0;"><?php esc_html_e( 'Permanent Lists', 'listory' ); ?></h2>
				<p style="font-size: 2rem; margin: 0.5rem 0;"><?php echo esc_html( $lists_count->publish ?? 0 ); ?></p>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=listory_list' ) ); ?>" class="button button-primary">
					<?php esc_html_e( 'View Lists', 'listory' ); ?>
				</a>
			</div>

			<div class="card" style="flex: 1; padding: 1.5rem;">
				<h2 style="margin-top: 0;"><?php esc_html_e( 'Checklists', 'listory' ); ?></h2>
				<p style="font-size: 2rem; margin: 0.5rem 0;"><?php echo esc_html( $checklists_count->publish ?? 0 ); ?></p>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=listory_checklist' ) ); ?>" class="button button-primary">
					<?php esc_html_e( 'View Checklists', 'listory' ); ?>
				</a>
			</div>
		</div>
	</div>
	<?php
}
