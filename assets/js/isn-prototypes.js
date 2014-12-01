/*
 * ISN - Prototypes.
 * 
 * Dependencies:
    <script src="/js/bootstrap-datetimepicker.min.js"></script>
 */


    $.fn.extend({
	
	//isnDateTimePickers : [],
	initDateTimePicker : function(options) {
	    
	    $('.bootstrap-datetimepicker-widget:not([widgetAttribute])').attr('widgetAttribute','widgetAttribute');
	    
    	    var $self = $(this);
    	    var $input = $(this).children('input');
    	    var options = options;
    	    
	    $(this).datetimepicker({
	    	language: options.language||'en',
	   	format: options.format||'yyyy-MM-dd',
	   	pickTime: options.pickTime||false,
	   	pick12HourFormat: options.pick12HourFormat||false,
	   	pickSeconds:options.pickSeconds||false,
	   	appendTo:options.appendTo||undefined,
	    }).on('changeDate',options.changeDate||null)
	    .on('show',function(){
		setTimeout(function(){
			fixPosition();
		},10);
		if(options.show){
		    options.show(); // call options
		}
	    });
	    
	    
	    function fixPosition(){
		var $window = $(window);
		if(options.appendTo){
		    $window = $(options.appendTo);
		}
		if($widget.css('right')=='auto'){
	            if($widget.position().left+$widget.width() > $window.width()){
	                $widget.css('left',$window.width()-$widget.width()+'px');
	                $widget.addClass('hide-before');
	            }
	        }else{
	            if($widget.position().left<  (options.appendTo?$(options.appendTo).offset().left:0)){// +$('.bootstrap-datetimepicker-widget').width()> $(window).width()){
	                $widget.css('left','2px');
	                $widget.addClass('hide-before');
	            }
	        }
	        //if($(window).width()>979||options.alwaysCenter){
	    	//	
	        //}  
	    }
	    
	   
	    var $widget = $('.bootstrap-datetimepicker-widget:not([widgetAttribute])');
	    $widget.attr('widgetAttribute',options.widgetAttribute).find('div > div.close-datetime').click(function(){
		//alert('close');
		$self.data('datetimepicker').hide();
	    });
	    $(this).children('span').click(function(){
		
	    });
	    $input.on('focus',$.proxy(function(e){
		//if($input.val()==''){
		    //$(this).children('spa')
		    //e.preventDefault();
		//    $(this).children('span:first').click();
		//}else{
		    setTimeout($.proxy(function(){
			$(this).closest('.modal-body').scrollTop($(this).offset().top);
		    },this),1000);
		//}
		
	    },this));
	    
	    
	    return 'A';
	}
    });