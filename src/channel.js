(function( jQuery ) {

	var channels = {},
		channelMethods = {
			publish: "fire",
			subscribe: "add",
			unsubscribe: "remove"
		},
		sliceChannel = [].slice;

	jQuery.Channel = function( name ) {
		var callbacks,
			method,
			channel = name && channels[ name ];
		if ( !channel ) {
			callbacks = jQuery.Callbacks();
			channel = {};
			for ( method in channelMethods ) {
				channel[ method ] = callbacks[ channelMethods[ method ] ];
			}
			if ( name ) {
				channels[ name ] = channel;
			}
		}
		return channel;
	};

	jQuery.each( channelMethods, function( method ) {
		jQuery[ method ] = function( name ) {
			var channel = jQuery.Channel( name );
			channel[ method ].apply( channel, sliceChannel.call( arguments, 1 ) );
		};
	});

})( jQuery );
