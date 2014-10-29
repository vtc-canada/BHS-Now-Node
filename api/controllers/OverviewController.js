/**
 * OverviewController
 *
 * @description :: Server-side logic for managing overviews
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	if (!req.session.user) {
	    return res.json({
		error : "Log in"
	    });
	}
	res.view();
    },
    joinroom : function(req, res) {
	req.socket.join('overview');
    }
};
