/*
 * Requires:
 * Underscore (lodash)
 */

$.widget("isn.isnajaxfield", function() {
    var self;

    return {
	options : {
	    value : 0
	},

	_create : function() {
	    self = this;

	    $(this.element).keyup(function(event) {
		self._ajaxFieldChanged(event);
	    });
	    
	    $('body').unbind('click', this._bodyclick);
	    $('body').on('click', this._bodyclick);

	},
	_ajaxFieldChanged : function(event) {
	    self.options.ajax($(event.target).val(), function(results) {
		self.options.results.empty();
		for (key in results) {
		    self.options.results.append(self.options.template(results[key]));
		    self.options.results.children(':last-child').addClass('isnajaxfield-result');
		    self.options.results.css('display', '');
		    self._bindClicks();
		}
	    });
	},
	_bodyclick : function(event) {
	    if ($(event.target).closest('.isnajaxfield-parent').length == 0) {
		self.options.results.css('display', 'none');
	    }
	},
	_destroy : function() {

	},
	_bindClicks : function() {
	    this.options.results.find('.isnajaxfield-result').unbind('click');
	    this.options.results.find('.isnajaxfield-result').click(_.partial(function(self, event) {
		self.options.click($(this));
		self.options.results.css('display', 'none');
		$(self.element).val('');
	    }, this));
	}
    };
}());