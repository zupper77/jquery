module("channel", { teardown: moduleTeardown });

test( "jQuery.Channel - Anonymous Channel", function() {

	expect( 4 );

	var channel = jQuery.Channel(),
		count = 0;

	function firstCallback( value ) {
		strictEqual( count, 1, "Callback called when needed" );
		strictEqual( value, "test", "Published value received" );
	}

	count++;
	channel.subscribe( firstCallback );
	channel.publish( "test" );
	channel.unsubscribe( firstCallback );
	count++;
	channel.subscribe(function( value ) {
		strictEqual( count, 2, "Callback called when needed" );
		strictEqual( value, "test", "Published value received" );
	});
	channel.publish( "test" );

});

test( "jQuery.Channel - Named Channel", function() {

	expect( 2 );

	function callback( value ) {
		ok( true, "Callback called" );
		strictEqual( value, "test", "Proper value received" );
	}

	jQuery.Channel( "test" ).subscribe( callback );
	jQuery.Channel( "test" ).publish( "test" );
	jQuery.Channel( "test" ).unsubscribe( callback );
	jQuery.Channel( "test" ).publish( "test" );
});

test( "jQuery.Channel - Helpers", function() {

	expect( 2 );

	function callback( value ) {
		ok( true, "Callback called" );
		strictEqual( value, "test", "Proper value received" );
	}

	jQuery.subscribe( "test", callback );
	jQuery.publish( "test" , "test" );
	jQuery.unsubscribe( "test", callback );
	jQuery.publish( "test" , "test" );
});
