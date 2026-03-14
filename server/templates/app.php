<?php
/**
 * Minimal HTML shell for the Listory React app.
 * Bypasses wp_head()/wp_footer() to avoid theme interference.
 */

$assets    = listory_get_vite_assets();
$dist_url  = plugins_url( 'dist/', dirname( __FILE__ ) );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Listory</title>
    <?php foreach ( $assets['css'] as $css_file ) : ?>
    <link rel="stylesheet" href="<?php echo esc_url( $dist_url . $css_file ); ?>" />
    <?php endforeach; ?>
</head>
<body>
    <div id="root"></div>
    <?php
    $token = \WPGraphQL\JWT_Authentication\Auth::get_token( wp_get_current_user() );
    if ( $token && ! is_wp_error( $token ) ) : ?>
    <script>window.__LISTORY_TOKEN__ = <?php echo wp_json_encode( $token ); ?>;</script>
    <?php endif; ?>
    <?php if ( $assets['js'] ) : ?>
    <script type="module" src="<?php echo esc_url( $dist_url . $assets['js'] ); ?>"></script>
    <?php endif; ?>
</body>
</html>
