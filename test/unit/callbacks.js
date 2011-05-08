module("callbacks", { teardown: moduleTeardown });

(function() {

var output,
	addToOutput = function( string ) {
		return function() {
			output += string;
		};
	},
	outputA = addToOutput( "A" ),
	outputB = addToOutput( "B" ),
	outputC = addToOutput( "C" ),
	tests = {
		"":						"X		XABCABCC 	X 	XBB X",
		"once":					"X 		X 			X 	X 	X",
		"memory":				"XABC 	XABCABCCC 	XA 	XBB	XB",
		"unique":				"X		XABCA		X	XBB	X",
		"relocate":				"X		XAABC		X	XBB X",
		"stopOnFalse":			"X		XABCABCC	X	XBB	X",
		"once memory":			"XABC	X			XA	X	XA",
		"once unique":			"X		X			X	X	X",
		"once relocate":		"X		X			X	X	X",
		"once stopOnFalse":		"X		X			X	X	X",
		"memory unique":		"XA		XABCA		XA	XBB	XB",
		"memory relocate":		"XB		XAABC		XA	XBB	XB",
		"memory stopOnFalse":	"XABC	XABCABCCC	XA	XBB	XB",
		"unique relocate":		"X		XAABC		X	XBB	X",
		"unique stopOnFalse":	"X		XABCA		X	XBB	X",
		"relocate stopOnFalse":	"X		XAABC		X	XBB	X"
	},
	filters = {
		"no filter": undefined,
		"filter": function( fn ) {
			return function() {
				return fn.apply( this, arguments );
			};
		}
	};

jQuery.each( tests, function( flags, resultString ) {

		jQuery.each( filters, function( filterLabel, filter ) {

			test( "jQuery.Callbacks( \"" + flags + "\" ) - " + filterLabel, function() {

				expect( 17 );

				// Give qunit a little breathing room
				stop();
				setTimeout( start, 0 );

				var cblist;
					results = resultString.split( /\s+/ );

				// Basic binding and firing
				output = "X";
				cblist = jQuery.Callbacks( flags );
				cblist.add(function( str ) {
					output += str;
				});
				cblist.fire( "A" );
				strictEqual( output, "XA", "Basic binding and firing" );
				output = "X";
				cblist.disable();
				cblist.add(function( str ) {
					output += str;
				});
				strictEqual( output, "X", "Adding a callback after disabling" );
				cblist.fire( "A" );
				strictEqual( output, "X", "Firing after disabling" );

				// Basic binding and firing (context, arguments)
				output = "X";
				cblist = jQuery.Callbacks( flags );
				cblist.add(function() {
					equals( this, window, "Basic binding and firing (context)" );
					output += Array.prototype.join.call( arguments, "" );
				});
				cblist.fireWith( window, [ "A", "B" ] );
				strictEqual( output, "XAB", "Basic binding and firing (arguments)" );

				// fireWith with no arguments
				output = "";
				cblist = jQuery.Callbacks( flags );
				cblist.add(function() {
					equals( this, window, "fireWith with no arguments (context is window)" );
					strictEqual( arguments.length, 0, "fireWith with no arguments (no arguments)" );
				});
				cblist.fireWith();

				// Basic binding, removing and firing
				output = "X";
				cblist = jQuery.Callbacks( flags );
				cblist.add( outputA );
				cblist.add( outputB );
				cblist.add( outputC );
				cblist.remove( outputB );
				cblist.fire();
				strictEqual( output, "XAC", "Basic binding, removing and firing" );

				// Empty
				output = "X";
				cblist = jQuery.Callbacks( flags );
				cblist.add( outputA );
				cblist.add( outputB );
				cblist.add( outputC );
				cblist.empty();
				cblist.fire();
				strictEqual( output, "X", "Empty" );

				// Locking
				output = "X";
				cblist = jQuery.Callbacks( flags );
				cblist.add( function( str ) {
					output += str;
				});
				cblist.lock();
				cblist.add( function( str ) {
					output += str;
				});
				cblist.fire( "A" );
				cblist.add( function( str ) {
					output += str;
				});
				strictEqual( output, "X", "Lock early" );

				// Ordering
				output = "X";
				cblist = jQuery.Callbacks( flags );
				cblist.add( function() {
					cblist.add( outputC );
					outputA();
				}, outputB );
				cblist.fire();
				strictEqual( output, "XABC", "Proper ordering" );

				// Add and fire again
				output = "X";
				cblist.add( function() {
					cblist.add( outputC );
					outputA();
				}, outputB );
				strictEqual( output, results.shift(), "Add after fire" );

				output = "X";
				cblist.fire();
				strictEqual( output, results.shift(), "Fire again" );

				// Multiple fire
				output = "X";
				cblist = jQuery.Callbacks( flags );
				cblist.add( function( str ) {
					output += str;
				} );
				cblist.fire( "A" );
				strictEqual( output, "XA", "Multiple fire (first fire)" );
				output = "X";
				cblist.add( function( str ) {
					output += str;
				} );
				strictEqual( output, results.shift(), "Multiple fire (first new callback)" );
				output = "X";
				cblist.fire( "B" );
				strictEqual( output, results.shift(), "Multiple fire (second fire)" );
				output = "X";
				cblist.add( function( str ) {
					output += str;
				} );
				strictEqual( output, results.shift(), "Multiple fire (second new callback)" );

			});
		});
});

})();
