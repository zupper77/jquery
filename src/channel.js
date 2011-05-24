(function( jQuery ) {

	var channels = {},
		sliceChannel = [].slice;

	jQuery.Channel = function( name ) {
		var callbacks,
			method,
			channel = name && channels[ name ];
		if ( !channel ) {
			callbacks = jQuery.Callbacks();
			channel = {
				publish: callbacks.fire,
				subscribe: callbacks.add,
				unsubscribe: callbacks.remove
			};
			if ( name ) {
				channels[ name ] = channel;
			}
		}
		return channel;
	};

	jQuery.extend({
		subscribe: function( id ) {
			var channel = jQuery.Channel( id ),
				args = sliceChannel.call( arguments, 1 );
			channel.subscribe.apply( channel, args );
			return {
				channel: channel,
				args: args
			};
		},
		unsubscribe: function( id ) {
			var channel = id && id.channel || jQuery.Channel( id );
			channel.unsubscribe.apply( channel, id && id.args ||
					sliceChannel.call( arguments, 1 ) );
		},
		publish: function( id ) {
			var channel = jQuery.Channel( id );
			channel.publish.apply( channel, sliceChannel.call( arguments, 1 ) );
		}
	});

})( jQuery );
