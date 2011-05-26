<?php sleep(3) ?><!DOCTYPE html>
<html>
<head>
	<title>
		jQuery Abort-On-Unload Test
	</title>
	<style>
		div { margin-top: 10px; }
		.alphalist { list-style-type: upper-alpha; }
	</style>
	<script src="../src/core.js"></script>
	<script src="../src/deferred.js"></script>
	<script src="../src/support.js"></script>
	<script src="../src/data.js"></script>
	<script src="../src/queue.js"></script>
	<script src="../src/attributes.js"></script>
	<script src="../src/event.js"></script>
	<script src="../src/sizzle/sizzle.js"></script>
	<script src="../src/sizzle-jquery.js"></script>
	<script src="../src/traversing.js"></script>
	<script src="../src/manipulation.js"></script>
	<script src="../src/css.js"></script>
	<script src="../src/ajax.js"></script>
	<script src="../src/ajax/jsonp.js"></script>
	<script src="../src/ajax/script.js"></script>
	<script src="../src/ajax/xhr.js"></script>
	<script src="../src/effects.js"></script>
	<script src="../src/offset.js"></script>
	<script src="../src/dimensions.js"></script>
	<script type="text/javascript">
	$( function() {
		var done = true,
			button = $( "button" );
		button.click(function() {
			jQuery.ajax({
				url: "data/name.php?wait=10",
				cache: false,
				beforeSend: function() {
					button.attr( "disabled" , true );
					done = false;
				},
				success: function() {
					console.log( "success", arguments );
				},
				error: function() {
					console.log( "error", arguments );
					alert( "error" );
				},
				complete: function() {
					button.attr( "disabled" , false );
					done = true;
				}
			});
			document.location = document.location.href;
		});
		jQuery( window ).bind( "beforeunload", function( evt ) {
			if ( !done ) {
				return evt.returnValue = "Fire unload?";
			}
		});
	});
	</script>
</head>
<body>
	<h1>
		jQuery Abort-On-Unload Test
	</h1>
	<div>
		This page tests a fix that will abort requests on abort so that Internet Explorer
		does not keep connections alive.
	</div>
	<div>
		In this situation, no callback should be triggered.
	</div>
	<div>Take the following steps:</div>
	<ol>
		<li>
			open the console,
		</li>
		<li>
			set it to persistent mode if available,
		</li>
		<li>
			click this
			<button>
				button
			</button>
			to make a request and trigger the beforeunload event,
		</li>
		<li>
			then either:
			<ol class="alphalist">
				<li>
					wait for the request to complete then cancel unload,
				</li>
				<li>
					fire unload (you have 10 seconds to do so).
				</li>
			</ol>
		</li>
	</ol>
	<div>
		Test passes if:
		<ol class="alphalist">
			<li>
				you get a "success" logged,
			</li>
			<li>
				you get no "error" log and no alert.
			</li>
		</ol>
	</div>
</body>
</html>