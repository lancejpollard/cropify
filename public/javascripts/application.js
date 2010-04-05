$(document).ready(function() {
	$("#add-size").click(function() {
		$("#sizes").append($(".size:first").clone());
	});
	$('input[type=file]').change(function(e){
		// $("#files").append("<div class='file'>" + $(this).val() + "</div>");
	});
})

$(window).load(function(){
				var jcrop_api;
				var i, ac;

				initJcrop();
				
				function initJcrop()//{{{
				{

					jcrop_api = $.Jcrop('#cropbox');

					$('#can_click,#can_move,#can_size')
						.attr('checked','checked');

					$('#ar_lock,#size_lock,#bg_swap').attr('checked',false);

				};
				//}}}

				// A handler to kill the action
				// Probably not necessary, but I like it
				function nothing(e)
				{
					e.stopPropagation();
					e.preventDefault();
					return false;
				};

				// Use the API to find cropping dimensions
				// Then generate a random selection
				// This function is used by setSelect and animateTo buttons
				// Mainly for demonstration purposes
				function getRandom() {
					var dim = jcrop_api.getBounds();
					return [
						Math.round(Math.random() * dim[0]),
						Math.round(Math.random() * dim[1]),
						Math.round(Math.random() * dim[0]),
						Math.round(Math.random() * dim[1])
					];
				};

				// Attach interface buttons
				// This may appear to be a lot of code but it's simple stuff

				$('#setSelect').click(function(e) {
					// Sets a random selection
					jcrop_api.setSelect(getRandom());
				});

				$('#animateTo').click(function(e) {
					// Animates to a random selection
					jcrop_api.animateTo(getRandom());
				});

				$('#release').click(function(e) {
					// Release method clears the selection
					jcrop_api.release();
				});

				$('#disable').click(function(e) {
					jcrop_api.disable();

					$('#enable').show();
					$('.requiresjcrop').hide();
				});

				$('#enable').click(function(e) {
					jcrop_api.enable();

					$('#enable').hide();
					$('.requiresjcrop').show();
				});

				$('#rehook').click(function(e) {
					initJcrop();
					$('#rehook,#enable').hide();
					$('#unhook,.requiresjcrop').show();
					return nothing(e);
				});

				$('#unhook').click(function(e) {
					jcrop_api.destroy();

					$('#unhook,#enable,.requiresjcrop').hide();
					$('#rehook').show();
					return nothing(e);
				});

				// The checkboxes simply set options based on it's checked value
				// Options are changed by passing a new options object

				// Also, to prevent strange behavior, they are initially checked
				// This matches the default initial state of Jcrop

				$('#can_click').change(function(e) {
					jcrop_api.setOptions({ allowSelect: !!this.checked });
					jcrop_api.focus();
				});

				$('#can_move').change(function(e) {
					jcrop_api.setOptions({ allowMove: !!this.checked });
					jcrop_api.focus();
				});

				$('#can_size').change(function(e) {
					jcrop_api.setOptions({ allowResize: !!this.checked });
					jcrop_api.focus();
				});

				$('#ar_lock').change(function(e) {
					jcrop_api.setOptions(this.checked? { aspectRatio: 4/3 }: { aspectRatio: 0 });
					jcrop_api.focus();
				});
				$('#size_lock').change(function(e) {
					jcrop_api.setOptions(this.checked? {
						minSize: [ 80, 80 ],
						maxSize: [ 350, 350 ]
					}: {
						minSize: [ 0, 0 ],
						maxSize: [ 0, 0 ]
					});
					jcrop_api.focus();
				});
				$('#bg_swap').change(function(e) {
					jcrop_api.setOptions( this.checked? {
						outerImage: 'demo_files/sagomod.png',
						bgOpacity: 1
					}: {
						outerImage: 'demo_files/sago.jpg',
						bgOpacity: .6
					});
					jcrop_api.release();
				});

			});