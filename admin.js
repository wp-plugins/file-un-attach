/**
 * File Un-Attach - Admin
 *
 * @file admin.js
 * @package File Un-Attach
 * @author Hafid Trujillo
 * @copyright 20010-2013
 * @filesource  wp-content/plugins/file-un-attach/admin.js
 * Object Copied from wp media-dev.js and renamed
 * @since 1.0.0
 */
 
var funFindPosts;
( function( $ ){ 
	funFindPosts = { 
		open : function( af_name, af_val ) { 
			overlay = $( '.ui-find-overlay' );
			var st = document.documentElement.scrollTop || $( document ).scrollTop( );
			
			if ( overlay.length == 0 ) { 
				$( 'body' ).append( '<div class="ui-find-overlay"></div>' );
				funFindPosts.overlay( );
			 }

			overlay.show( );
			
			if ( af_name && af_val ) { 
				$( '#fun-affected' ).attr( 'name', af_name ).val( af_val );
			 }
			 
			$( '#fun-find-posts' ).show( )
			.draggable( { 
				handle: '#fun-find-posts-head'
			 } ).css( { 'top':st + 30 + 'px','left':'50%','marginLeft':'-250px' } );
			
			$( '#fun-find-posts-input' ).val( '' );
			$( '#fun-find-posts-input' ).focus( ).keyup( function( e ){ 
				if ( e.which == 27 ) { funFindPosts.close( ); } // close on Escape
			 } );

			return false;
		 },

		close : function( ) { 
			$( '#fun-find-posts-response' ).html( '' );
			$( '#fun-find-posts' ).draggable( 'destroy' ).hide( );
			$( '.ui-find-overlay' ).hide( );
		 },

		overlay : function( ) { 
			$( '.find-box-inside' ).unbind('click');
			$( '.ui-find-overlay' ).css( 
				{ 'z-index': '999', 'width': $( document ).width( ) + 'px', 'height': $( document ).height( ) + 'px' }
			 ).bind( 'click', function ( ) { 
				funFindPosts.close( );
			 } );
		 },
		 
		send : function( ) { 
			var post = { 
				action: 'find_posts',
				type: $( '#fun_post_type' ).val( ),
				ps: $( '#fun-find-posts-input' ).val( ),
				exclude: $( "input[name='fun-current-attached']" ).val( ),
				_wpnonce : funlocal.nonceajax
			 };		
			
			$.ajax( { 
				data : post,
				type : 'POST',
				url : funlocal.adminurl+"ajax.php",
				success : function( x ) { funFindPosts.show( x ) },
				error : function( r ) { funFindPosts.error( r ) }
			 } );
		 },
		
		is_attached: function( imgid ){

		  var post = { 
			  img			:imgid,
			  postid		:funlocal.postid,
			  action		:'is_attached',
			  _wpnonce : funlocal.nonceajax
		   };
		   
		   $.ajax( { 
			  data : post,
			  type : 'POST',
			  url : funlocal.adminurl+"ajax.php",
			  success : function( data ){
				  $(' div.fun-actions').html( data )
			  }
		   } );
		},
		
		attchd: function( imgid ) { 
			var post = { 
				img: imgid,
				action: 'find_attached',
				ps: $( '#fun-find-posts-input' ).val( ),
				_wpnonce : funlocal.nonceajax
			 };
			
			$.ajax( { 
				data : post,
				type : 'POST',
				url : funlocal.adminurl + "ajax.php",
				success : function( x ) { funFindPosts.show( x ); },
				error : function( r ) { funFindPosts.error( r ); }
			 } );
		 },

		show : function( x ) { 
			$( '.fun-search-results' ).remove( ); 
			if ( typeof( x ) == 'string' ) { 
				this.error( { 'responseText': x } );
				return;
			 }

			var r = wpAjax.parseAjaxResponse( x );

			if ( r.errors ) { 
				this.error( { 'responseText': wpAjax.broken } );
			 }
			r = r.responses[0];
			$( '#fun-find-posts-response' ).append( r.data );
		 },

		error : function( r ) { 
			$( '.fun-search-results' ).remove( ); 
			var er = r.statusText;
			if ( r.responseText ) { 
				er = r.responseText;
			 }
			if ( er ) { 
				$( '#fun-find-posts-response' ).append( er );
			 }
		 }
	 };

	$( document ).ready( function( ) { 
		$( '#fun-find-posts-submit' ).click( function( e ) { 
			if ( '' == $( '#fun-find-posts-response' ).html( ) )
				e.preventDefault( );
		 } );
		$( '#fun-find-posts .find-box-search :input' ).keypress( function( event ) { 
			if ( 13 == event.which ) { 
				funFindPosts.send( );
				return false;
			 }
		 } );
		$( '#fun-find-posts-search' ).click( funFindPosts.send );
		$( '#fun-find-posts-close' ).click( funFindPosts.close );
		$( '#doaction, #doaction2' ).click( function( e ){ 
			$( 'select[name^="action"]' ).each( function( ){ 
				if ( $( this ).val( ) == 'attach' ) { 
					e.preventDefault( );
					funFindPosts.open( );
				 }
			 } );
		 } );
	 } );
 } )( jQuery );

// File Un-attach functions
jQuery( document ).ready( function( $ ){ 
								
	$( 'body' ).delegate( '.funattach', 'click',function( ){ 
		id = $( this ).attr( 'id' ).replace( 'unattach-','' );
		$( '.fun-mess-' + id ).show( );
		return false;
	 } );
	
	$( 'body' ).delegate( '.fun-no', 'click',function( ){ 
		$( this ).parents( '.fun-message' ).hide( );
		return false;
	 } );
	
	$( 'body' ).delegate( '.fun-yes', 'click',function( ){ 
	
		id = $( this ).attr( 'id' ).replace( 'file-unattch-','' );		 
		count = parseInt( $( '#attachments-count' ).html( ) );
		
		if( count > 0 ) 
			$( '#attachments-count' ).html( count-1 );
			
		post_id = $( '#post_id' ).val( );
		
		if( !post_id ) 
			post_id = $( '#post_ID' ).val( );
				
		$.post( funlocal.adminurl + "ajax.php",{ 
			imageid		:id,
			postid		:post_id,
			action		:'unattach',
			_wpnonce	:funlocal.nonceajax
		 } );
		 
		if( $( this ).parents( '.attachment-details' )[ 0 ] )
			$( '.media-sidebar .attachment-details, ' + 
			'.media-sidebar .attachment-display-settings' ).fadeOut( 'slow' );
		else $( this ).parents( '.media-item' ).fadeOut( 'slow' );
		
		
		return false;
	 } );
	
	
	
	$( 'body' ).delegate( '.fun-unattach-row', 'click',function( ){ 
	
		id = $( this ).attr( 'id' ).replace( 'file-unattch-','' );	
		
		post_id = $( '#post_id' ).val( );
		
		if( !post_id ) 
			post_id = $( '#post_ID' ).val( );
		 
		$.post( funlocal.adminurl + "ajax.php",{ 
			imageid		:id,
			postid		:post_id,
			action		:'unattach',
			_wpnonce	:funlocal.nonceajax
		 } );
		 
		td = $( this ).parents( 'td' );
		td.find( 'span' ).remove( );
		td.find( 'strong' ).replaceWith( '( ' + funlocal.detach + ' )' );
		$( this ).remove( );
		
		return false;
	 } );
	 
	 
	// attach single file on media pop up
	$( 'body' ).delegate( '.fileattach', 'click', function( ){ 
	
		$( this ).hide( );
		
		id = $( this ).attr( 'id' ).replace( 'attach-','' );
		$( '.fun-mess-' + id ).show( );
		
		postid = ( !funlocal.postid ) ? post_id : funlocal.postid;
		 
		$( '#attachments-count' ).html( parseInt( $( '#attachments-count' ).html( ) ) + 1 );
		$.post( funlocal.adminurl + "ajax.php",{ 
			imageid		:id,
			postid		:postid,
			action		:'attach',
			_wpnonce	:funlocal.nonceajax
		 } );
		 
		return false;
	 } );
	
	
	// attach all file selected on media pop up  
	$( 'body' ).delegate( '.fun-all-attach, .fun-all-detach', 'click', function( ){ 
		
		var $images = []
			  $link = $( this ),
			  directive = $( this ).attr( 'class' ).replace( 'fun-all-', '');
			  postid = ( ! funlocal.postid ) ? post_id : funlocal.postid;
			
		if( directive == 'attach' )
			labels = [ funlocal.attach,  funlocal.attached ];
		else labels = [ funlocal.detach,  funlocal.detached ];
		
		
		$( '.media-frame-content .attachments li.selected' ).each(function(){
			$images.push( $( this ).find( 'img' ).attr( 'data-attach' ) );
		});
		
		var reset_link =	function(){
			$link.html( labels[0] );
			$( '.media-frame-content .attachments li' ).off( 'click', reset_link );
		};
		
		
		$.post( funlocal.adminurl + "ajax.php", {
			postid		:postid, 
			images		:$images,
			directive	: directive,
			action		: 'attach_multiple',
			_wpnonce	:funlocal.nonceajax
			
		}, function(){
			
			$link.fadeOut().fadeIn().html(labels[1] );
			$( '.media-frame-content .attachments li' ).on( 'click', reset_link );
		});		
		
		return false;
	});
	
	
	// find post seach pop up
	$( '.fun-find-posts' ).click( function( ){ 
		id = $( this ).attr( 'id' ).replace( 'fun-find-posts-','' );
		funFindPosts.open( 'media[]', id );
		return false;
	 } );
	 
	 
	// attach image for the search list
	$( '.attached-list' ).click( function( ){ 
		id = $( this ).attr( 'id' ).replace( 'attached-list-','' );								
		funFindPosts.open( 'media[]',id );
		funFindPosts.attchd( id );
		return false;
	 } );
 } );