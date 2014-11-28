/*
 * ISN - Prototypes.
 * 
 * Dependencies:
    <script src="/js/bootstrap-datetimepicker.min.js"></script>
 */


    $.fn.extend({
	initDateTimePicker : function(options) {
	    
	    var self = $(this);
	    
	    $(this).datetimepicker({
	    	language: options.language||'en',
	   	format: options.format||'yyyy-MM-dd',
	   	pickTime: options.pickTime||false,
	   	pick12HourFormat: options.pick12HourFormat||false,
	   	pickSeconds:options.pickSeconds||false,
	    }).on('changeDate',options.changeDate||null);
	   
	    $('.bootstrap-datetimepicker-widget:not([widgetAttribute])').attr('widgetAttribute',options.widgetAttribute);
	    $('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+'] > div > div.close-datetime').click(function(){
		//alert('close');
		self.data('datetimepicker').hide();
	    });
	        $(this).children('span').click(function(){
	            if($('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').css('right')=='auto'){
	                if($('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').position().left+$('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').width() > $(window).width()){
	                    $('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').css('left',$(window).width()-$('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').width()+'px');
	                    $('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').addClass('hide-before');
	                }
	            }else{
	                if($('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').position().left<0){// +$('.bootstrap-datetimepicker-widget').width()
														// >
														// $(window).width()){
	                    $('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').css('left','0px');
	                    $('.bootstrap-datetimepicker-widget[widgetAttribute='+options.widgetAttribute+']').addClass('hide-before');
	                }
	            }
	        });
	    
	    
	    return 'A';
	}
    });