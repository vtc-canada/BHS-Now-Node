/**
 * MainController
 * 
 * @description :: Server-side logic for managing mains
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	if (req.session&&req.session.user) {
            res.writeHead(302,{
        	'Location':'/flights'
            });
            res.end();
        } else {
            res.writeHead(302,{
        	'Location':'/auth'
            });
            res.end();
        }
    }
};
