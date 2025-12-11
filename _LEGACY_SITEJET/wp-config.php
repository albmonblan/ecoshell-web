<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('WP_CACHE', true);
define( 'WPCACHEHOME', '/plesk/vhosts/upvecomarathon.webs.upv.es/httpdocs/wp-content/plugins/wp-super-cache/' );
define( 'DB_NAME', 'vicoro_wp_jvoaj' );

/** Database username */
define( 'DB_USER', 'vicor_wp_xywho' );

/** Database password */
define( 'DB_PASSWORD', 'yv5bJY1LJU3*_qZJ' );

/** Database hostname */
define( 'DB_HOST', 'localhost:3306' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'o2zk:078Y(@)n/)5Y6x00591d)ZKy8o(6o6s7H1L5#]v4)nM_/3PAIV4jUm)/[iN');
define('SECURE_AUTH_KEY', '6U#]RP9_H#4WBrq8M7@2Rw&l2v7y_|%u&&1N5Gg3S0N)ok@n:W5A0o4y25n;~Njj');
define('LOGGED_IN_KEY', 'S0A0v;k83lzJ%m6VXKb0grx62DsvxW8X9f6oZ8Y/641W&a@JiO26OQ52541s6(YA');
define('NONCE_KEY', 'Vt(aPDb_qk97C+M_R-4g#042Y:5pihgs556!I1[_S+y4Y%8P0)|l3|dpy4b/y1O]');
define('AUTH_SALT', 'HRt#u2)S9NP4/U&3K1:3%96OBXdWTZ833ue02BG6H2dV@8z;7IYfk1nFM~~05%9G');
define('SECURE_AUTH_SALT', '%sWlGP-eat5;rGY/6+skdm0[39;V86QJiO*/vaCtL:i51&hyPe(/]6y|KP2Roa5v');
define('LOGGED_IN_SALT', 'wJ2T0E3y362)#&J_8@:82#0CsPpXmeN|V*8t(%9(%P78hMP1r|[~21@1~:]SEp|4');
define('NONCE_SALT', ')H)GrK4~P0&s9w]CLHg~XOr7;I;94gkY05(e7COQw:w:p6*v30V4XZ9+%-4FfF1b');


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'RkzcmxF_';


/* Add any custom values between this line and the "stop editing" line. */

define('WP_ALLOW_MULTISITE', true);
/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_AUTO_UPDATE_CORE', 'true' );
define( 'DISALLOW_FILE_EDIT', true );
define( 'CONCATENATE_SCRIPTS', false );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
