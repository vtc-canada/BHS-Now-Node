/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	var search_field = '';
	if (typeof (req.param('search_field')) != 'undefined') {
	    search_field = req.param('search_field');
	}
	res.view('reports/index',{
	    search_field : search_field
	});
    }
};
