$(document).ready(function() {
	$("#add-size").click(function() {
		$("#cropify-table-body").append($("#cropify-table-body tr:first").clone());
	});
	$('input[type=file]').change(function(e){
		// $("#files").append("<div class='file'>" + $(this).val() + "</div>");
	});
//		$('.text_input').scale9Grid({top:15,bottom:15,left:15,right:15});
})