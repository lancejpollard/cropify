// JavaScript Document
/**************************
var start// the start time 
var end// the end time 
*/
var start = new Date(2009,12-1,10,16,3);/*format YYYY, MM-1, DD, HH, MM*/
var start_time=start.getTime();

var end = new Date(2010, 5-1, 25, 1, 55);
var end_time=end.getTime();  

(function($) {
	$.fn.progresbar = function(options) {
		var opts = $.extend({}, $.fn.progresbar.defaults, options);
		var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
		
		if (o.manual==false)
		{
			var auto_refresh = setInterval(
				function()
				{
					var current = new Date();
					var current_time=current.getTime();
					var time_max=(end_time-start_time);
					var time_elapsed=(current_time-start_time);
						
					var procent_to_calculate=(time_elapsed*100)/time_max;
					var procent=procent_to_calculate.toFixed(0);
					if (current_time>end_time)
						procent=100;
				
					var new_top=parseInt(((100-procent)*o.bar_height)/100);
					$this=$(this);
					$("#progresbar-bar").css('top',new_top+'px');
					$("#procent").css('top',new_top-15+'px');
					var new_height=parseInt((procent*o.bar_height)/100);
					$("#progresbar-bar").height(new_height);
					$("#procent").html(procent+"<span>%</span>");
					$("#progresbar-bar").show();
					$("#procent").show();
				}
			, 1000);
		} 
		else
		{	
			var procent_value=o.procent;
			var new_top=parseInt(((100-procent_value)*o.bar_height)/100);
			$("#progresbar-bar").css('top',new_top+'px');
			$("#procent").css('top',new_top-15+'px');
			var new_height=parseInt((procent_value*o.bar_height)/100);
			$("#progresbar-bar").height(new_height);
			$("#procent").html(procent_value+"<span>%</span>");
			$("#progresbar-bar").show();
			$("#procent").show();
		}
};

$.fn.progresbar.defaults = {
	procent:0,
	manual:false,
	bar_height:0
};

})(jQuery);
      
