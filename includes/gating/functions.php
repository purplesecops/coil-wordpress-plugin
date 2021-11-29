<?php
declare(strict_types=1);
/**
 * Coil gating.
 */

namespace Coil\Gating;

use Coil\Admin;

/**
 * Register post/user meta.
 */
function register_content_meta() : void {

	register_meta(
		'post',
		'_coil_monetization_post_status',
		[
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
		]
	);

	register_meta(
		'post',
		'_coil_visibility_post_status',
		[
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
		]
	);
}

/**
 * Register term meta.
 *
 * @return void
 */
function register_term_meta() {

	register_meta(
		'term',
		'_coil_monetization_term_status',
		[
			'auth_callback' => function() {

				return current_user_can( 'edit_posts' );
			},
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
		]
	);

	register_meta(
		'term',
		'_coil_visibility_term_status',
		[
			'auth_callback' => function() {

				return current_user_can( 'edit_posts' );
			},
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
		]
	);
}

/**
 * Declare all the valid monetization slugs used as a reference
 * before the particular option is saved in the database.
 *
 * @return array An array of valid monetization slug types.
 */
function get_valid_monetization_types() {

	$valid = [
		'monetized', // Monetization is enabled.
		'not-monetized', // Monetization is disabled.
		'default', // Whatever is set on the post to revert back.
	];
	return $valid;
}

/**
 * Declare all the valid visibility slugs used as a reference
 * before the particular option is saved in the database.
 *
 * @return array An array of valid visibility slug types.
 */
function get_valid_visibility_types() {

	$valid = [
		'public', // visable to everyone.
		'exclusive', // visable to Coil members only.
		'gate-tagged-blocks', // split content.
		'default', // Whatever is set on the post to revert back.
	];
	return $valid;
}

/**
 * Maybe prefix a padlock emoji to the post title.
 *
 * Used on archive pages to represent if a post is gated.
 *
 * @param string $title The post title.
 * @param int    $id    The post ID. Optional.
 *
 * @return string The updated post title.
 */
function maybe_add_padlock_to_title( string $title, int $id = 0 ) : string {

	// If no explicit post ID passed, try to grab implicit one
	$id = ( empty( $id ) ? get_the_ID() : $id );

	// No post ID found. Assume no padlock.
	if ( empty( $id ) ) {
		return $title;
	}

	if ( ! Admin\get_exlusive_post_setting( 'coil_title_padlock' ) ) {
		return $title;
	}

	$status = get_content_status( $id, 'visibility' );
	if ( $status !== 'exclusive' ) {
		return $title;
	}

	$post_title = sprintf(
		/* translators: %s: Gated post title. */
		__( '🔒 %s', 'coil-web-monetization' ),
		$title
	);

	return apply_filters( 'coil_maybe_add_padlock_to_title', $post_title, $title, $id );
}

/**
 * Maybe restrict (gate) visibility of the post content on archive pages, home pages, and feeds.
 * If the post is exclusive then no excerpt will show unless one has been set explicitly.
 *
 * @param string $content Post content.
 *
 * @return string $content Updated post content.
 */
function maybe_restrict_content( string $content ) : string {

	// Plugins can call the `the_content` filter outside of the post loop.
	if ( is_singular() || ! get_the_ID() ) {
		return $content;
	}

	$coil_visibility_status = get_content_status( get_the_ID(), 'visibility' );
	$post_obj               = get_post( get_the_ID() );
	$content_excerpt        = $post_obj->post_excerpt;
	$public_content         = '';

	switch ( $coil_visibility_status ) {
		case 'exclusive':
		case 'gate-tagged-blocks':
			// Restrict all / some excerpt content based on gating settings.
			if ( get_excerpt_gating( get_queried_object_id() ) ) {
				$public_content .= sprintf(
					'<p>%s</p>',
					$content_excerpt
				);
			}
			break;

		/**
		 * case 'default': doesn't exist in this context because the last possible
		 * saved option will be 'public', after a post has fallen back to the taxonomy
		 * and then the default post options.
		 */
		case 'public':
		default:
			$public_content = $content;
			break;
	}

	return apply_filters( 'coil_maybe_restrict_content', $public_content, $content, $coil_visibility_status );
}

/**
 * Get the value of the "Display Excerpt" setting for this post .
 *
 * @param integer $post_id The post to check.
 * @return bool true show excerpt, false hide excerpt.
 */
function get_excerpt_gating( $post_id ) : bool {

	$post_id   = (int) $post_id;
	$post_type = get_post_type( $post_id );

	$display_excerpt   = false;
	$exclusive_options = Admin\get_exclusive_settings();
	if ( ! empty( $exclusive_options ) && isset( $exclusive_options[ $post_type . '_excerpt' ] ) ) {
		$display_excerpt = $exclusive_options[ $post_type . '_excerpt' ];
	}
	return $display_excerpt;
}


/**
 * Get the monetization / visibility status for the specified term.
 *
 * @param integer $term_id The term_id to check.
 * @param string $meta_key { '_coil_monetization_term_status' | '_coil_visibility_term_status' }
 *
 * @return string Either "default" (default), or the applicable status.
 */
function get_term_status( $term_id, $meta_key ) {

	$term_id     = (int) $term_id;
	$term_status = get_term_meta( $term_id, $meta_key, true );

	if ( empty( $term_status ) ) {
		$term_status = 'default';
	}
	return $term_status;
}

/**
 * Get any terms attached to the post and return their highest monetization / visibility status.
 *
 * @param string $meta_key { '_coil_monetization_term_status' | '_coil_visibility_term_status' }
 * @return string Coil status.
 */
function get_taxonomy_term_status( $post_id, $meta_key ) {

	$post_id           = (int) $post_id;
	$final_term_status = 'default';

	$valid_taxonomies = Admin\get_valid_taxonomies();

	// 1) Get any terms assigned to the post.
	$post_terms = wp_get_post_terms(
		$post_id,
		$valid_taxonomies,
		[
			'fields' => 'ids',
		]
	);

	// 2) Has a Coil status been attached to this taxonomy?
	if ( ! is_wp_error( $post_terms ) && ! empty( $post_terms ) ) {

		// Specifies the highest status possible
		if ( $meta_key === '_coil_monetization_term_status' ) {
			$highest_status = 'monetized';
		} elseif ( $meta_key === '_coil_visibility_term_status' ) {
			$highest_status = 'exclusive';
		} else {
			// Invalid meta key was used.
			return '';
		}

		foreach ( $post_terms as $term_id ) {

			$post_term_status = get_term_status( $term_id, $meta_key );
			// If a term is assigned the highest status simply break out of loop and return.
			if ( $post_term_status === $highest_status ) {
				$final_term_status = $post_term_status;
				break;
				// If a term's status has been set then save it - in contrast to it being 'default'.
				// Don't break yet, keep checking for a higher state.
			} elseif ( $post_term_status !== 'default' ) {
				$final_term_status = $post_term_status;
			}
		}
	}

	return $final_term_status;
}

/**
 * Return the single source of truth for post monetization & visibility
 * status based on the fallback options  * if the post status selection is 'default'.
 * E.g. If return value of each function is default, move onto the next function,
 * otherwise return immediately.
 *
 * @param integer $post_id
 * @param string $status_type {'monetization' | 'visibility'}
 * @return string $content_status Monetization or visibility status slug.
 */
function get_content_status( $post_id, $status_type ) : string {

	$post_id = (int) $post_id;

	// Set a default value in case nothing has been set on the post or in the database.
	if ( $status_type === 'monetization' ) {
		$content_status = Admin\get_monetization_default();
	} elseif ( $status_type === 'visibility' ) {
		$content_status = Admin\get_visibility_default();
	} else {
		// Return if an unrecognised status type is being used
		return '';
	}

	// Hierarchy 1 - Check what is set on the post.
	if ( $status_type === 'monetization' ) {
		$post_status = get_post_status( $post_id, 'monetization' );
	} elseif ( $status_type === 'visibility' ) {
		$post_status = get_post_status( $post_id, 'visibility' );
	}

	if ( 'default' !== $post_status ) {

		$content_status = $post_status; // Honour what is set on the post.

	} else {

		// Hierarchy 2 - Check what is set on the taxonomy.
		if ( $status_type === 'monetization' ) {
			$term_status = get_taxonomy_term_status( $post_id, '_coil_monetization_term_status' );
		} elseif ( $status_type === 'visibility' ) {
			$term_status = get_taxonomy_term_status( $post_id, '_coil_visibility_term_status' );
		}

		if ( 'default' !== $term_status ) {

			$content_status = $term_status; // Honour what is set on the taxonomy.

		} else {

			// Hierarchy 3 - Check what is set in the global default.
			// Get the post type for this post to check against what is set for default.
			$post = get_post( $post_id );

			if ( $status_type === 'monetization' ) {
				// Get the post type from what is saved in the global options
				$general_settings = Admin\get_general_settings();
				if ( ! empty( $general_settings ) && ! empty( $post ) && isset( $general_settings[ $post->post_type . '_monetization' ] ) ) {
					$content_status = $general_settings[ $post->post_type . '_monetization' ];
				}
			} elseif ( $status_type === 'visibility' ) {
				// Get the post type from what is saved in the exclusive options
				$exclusive_settings = Admin\get_exclusive_settings();
				if ( ! empty( $exclusive_settings ) && ! empty( $post ) && isset( $exclusive_settings[ $post->post_type . '_visibility' ] ) ) {
					$content_status = $exclusive_settings[ $post->post_type . '_visibility' ];
				}
			}
		}
	}

	return $content_status;
}

/**
 * Set the monetization / visibility status for the specified term.
 *
 * @param integer $term_id  The term to set the status for.
 * @param string $meta_key  { '_coil_monetization_term_status' | '_coil_visibility_term_status' }
 * @param string $status    Either "default", "not-monetized", or "monetized".
 *
 * @return void
 */
function set_term_status( $term_id, string $meta_key, string $status ) : void {

	$term_id = (int) $term_id;

	if ( $meta_key === '_coil_monetization_term_status' ) {
		$valid_status_options = get_valid_monetization_types();
	} elseif ( $meta_key === '_coil_visibility_term_status' ) {
		$valid_status_options = get_valid_visibility_types();
	} else {
		// Invalid meta key.
		return;
	}
	if ( ! in_array( $status, $valid_status_options, true ) ) {
		return;
	}

	update_term_meta( $term_id, $meta_key, $status );
}

/**
 * New function to determine if the content is monetized
 * based on the output of get_content_status.
 *
 * @param int $post_id
 * @return boolean
 */
function is_content_monetized( $post_id ) : bool {

	$monetization_status = get_content_status( $post_id, 'monetization' );
	return ( $monetization_status === 'not-monetized' ) ? false : true;
}

function is_monetization_and_visibility_compatible() {

	if ( get_monetization_setting() === 'not-monetized' && get_visibility_setting() === 'exclusive' ) {
		return false;
	}
	return true;

}

/**
 * Get the monetization / visibility status for the specified post.
 *
 * @param integer $post_id The post to check.
 * @param string $status_type
 *
 * @return string Coil status.
 */
function get_post_status( $post_id, $status_type ) : string {

	$post_id = (int) $post_id;
	if ( $status_type === 'monetization' ) {
		$status = get_post_meta( $post_id, '_coil_monetization_post_status', true );
	} elseif ( $status_type === 'visibility' ) {
		$status = get_post_meta( $post_id, '_coil_visibility_post_status', true );
	}

	if ( empty( $status ) ) {
		$status = 'default';
	}

	return $status;
}

/**
 * Set the monetization / visibility status for the specified post.
 *
 * @param integer $post_id The post to set gating for.
 * @param string $meta_key { '_coil_monetization_post_status' | '_coil_visibility_post_status' }
 * @param string $post_status Coil status.
 *
 * @return void
 */
function set_post_status( $post_id, string $meta_key, string $post_status ) : void {

	$post_id = (int) $post_id;

	if ( $meta_key === '_coil_monetization_post_status' ) {
		$valid_status_options = get_valid_monetization_types();
	} elseif ( $meta_key === '_coil_visibility_post_status' ) {
		$valid_status_options = get_valid_visibility_types();
	} else {
		// Unrecognised meta key.
		return;
	}

	if ( ! in_array( $post_status, $valid_status_options, true ) ) {
		$post_status = 'default';
	}

	update_post_meta( $post_id, $meta_key, $post_status );
}
