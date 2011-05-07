(function( jQuery ) {

// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 *	filter:	an optional function that will be applied to each added callbacks,
 *			what filter returns will then be added provided it is not falsy.
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	relocate:		like "unique" but will relocate the callback at the end of the list
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags, filter ) {

	// flags are optional
	if ( typeof flags !== "string" ) {
		filter = flags;
		flags = undefined;
	}

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// Index of cells to remove in the list after firing
		deleteAfterFire,
		// Add a list of callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// If we have to relocate, we remove the callback
					// if it already exists
					if ( flags.relocate ) {
						object.remove( elem );
					} else if ( flags.unique && object.has( elem ) ) {
						continue;
					}
					// Get the filtered function if needs be
					actual = filter ? filter( elem ) : elem;
					if ( actual ) {
						list.push( [ elem, actual ] );
					}
				}
			}
		},
		object = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// With memory, if we're not firing then
					// we should call right away
					if ( !firing && flags.memory && memory ) {
						// Trick the list into thinking it needs to be fired
						var tmp = memory;
						memory = undefined;
						object.fireWith( tmp[ 0 ], tmp[ 1 ], length );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( list[ i ] && fn === list[ i ][ 0 ] ) {
							if ( firing ) {
								list[ i ] = undefined;
								deleteAfterFire.push( i );
							} else {
								list.splice( i, 1 );
								i--;
							}
							// If we have some unicity property then
							// we only need to do this once
							if ( flags.unique || flags.relocate ) {
								break;
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( list[ i ] && fn === list[ i ][ 0 ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					object.disable();
				}
				return this;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args, start /* internal */ ) {
				var i,
					done,
					stoppedOnFalse;
				if ( list && stack && ( !flags.once || !memory && !firing ) ) {
					if ( firing ) {
						stack.push( [ context, args ] );
					} else {
						args = args || [];
						memory = !flags.memory || [ context, args ];
						firing = true;
						deleteAfterFire = [];
						try {
							for ( i = start || 0; list && i < list.length; i++ ) {
								if (( stoppedOnFalse = list[ i ] &&
										list[ i ][ 1 ].apply( context, args ) === false &&
										flags.stopOnFalse )) {
									break;
								}
							}
						} finally {
							firing = false;
							if ( list ) {
								done = ( stoppedOnFalse || i >= list.length );
								for ( i = 0; i < deleteAfterFire.length; i++ ) {
									list.splice( deleteAfterFire[ i ], 1 );
								}
								if ( !flags.once ) {
									if ( done && stack && stack.length ) {
										object.fireWith.apply( this, stack.shift() );
									}
								} else if ( !flags.memory ) {
									object.disable();
								} else {
									list = [];
								}
							}
						}
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				object.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return object;
};

})( jQuery );
