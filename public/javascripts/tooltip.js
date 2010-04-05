/*START tootlip initialisation*/
/*________________________________________________________*/
$(function() {
    $('.easttool').tipsy({gravity: 'e'});
    $('.westtool').tipsy({gravity: 'w'});
    
  });
/*________________________________________________________*/
/*END tootlip initialisation*/

(function($) {
    $.fn.tipsy = function(opts) {

        opts = $.extend({fade: false, gravity: 'n'}, opts || {});
        var tip = null, cancelHide = false;

        this.hover(function() {
            
            $.data(this, 'cancel.tipsy', true);

            var tip = $.data(this, 'active.tipsy');
            if (!tip) {
                tip = $('<div class="tipsy"><div class="tipsy-inner"><span>' + $(this).attr('title') + '</span><div class="arrow"></div></div></div>');
                tip.css({position: 'absolute', zIndex: 100000});
                $(this).attr('title', '');
                $.data(this, 'active.tipsy', tip);
            }
            
            var pos = $.extend({}, $(this).offset(), {width: this.offsetWidth, height: this.offsetHeight});
            tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
            var actualWidth = tip[0].offsetWidth, actualHeight = tip[0].offsetHeight;
            
            switch (opts.gravity.charAt(0)) {
                case 'e':
                    tip.css({top: pos.top + pos.height / 2 - actualHeight / 2-4, left: pos.left - actualWidth-10}).addClass('tipsy-east');
					$(".tipsy .tipsy-inner span").addClass('east');
                    break;
                case 'w':
                    tip.css({top: pos.top + pos.height / 2 - actualHeight / 2-4, left: pos.left + pos.width+10}).addClass('tipsy-west');
					$(".tipsy .tipsy-inner span").addClass('west');
                    break;
            }

            if (opts.fade) {
                tip.css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: 1});
            } else {
                tip.css({visibility: 'visible'});
            }

        }, function() {
            $.data(this, 'cancel.tipsy', false);
            var self = this;
            setTimeout(function() {
                if ($.data(this, 'cancel.tipsy')) return;
                var tip = $.data(self, 'active.tipsy');
                if (opts.fade) {
                    tip.stop().fadeOut(function() { $(this).remove(); });
                } else {
                    tip.remove();
                }
            }, 100);
            
        });

    };
})(jQuery);


