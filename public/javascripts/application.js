$(document).ready(function() {
	$("input.add").live("click", function() {
		$("#cropify-table-body").append($(this).parent().parent().clone());
		return false;
	});
	$("input.remove").live("click", function() {
		$(this).parent().parent().remove();
		return false;
	});
	$('input[type=file]').change(function(e){
		amount = this.files.length;
		if (amount == 1)
			amount = "1 File"
		else
			amount = amount.toString() + " Files"
		$("#files .label").html("<p class='file'>" + amount + "</p>");
	});
//		$('.text_input').scale9Grid({top:15,bottom:15,left:15,right:15});
})