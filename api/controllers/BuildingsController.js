/**
 * BuildingsController
 * 
 * @module :: Controller
 * @description :: A set of functions called `actions`.
 * 
 * Actions contain code telling Sails how to respond to a certain type of
 * request. (i.e. do stuff, then send some JSON, show an HTML page, or redirect
 * to another URL)
 * 
 * You can configure the blueprint URLs which trigger these actions
 * (`config/controllers.js`) and/or override them with custom routes
 * (`config/routes.js`)
 * 
 * NOTE: The code you write here supports both HTTP and Socket.io automatically.
 * 
 * @docs :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js` (specific to
     * BuildingsController)
     */
    _config : {},

    index : function(req, res) {
	res.view({});
    },
    getajax : function(req, res) {
	sails.controllers.database.credSproc('andytemp', [ "'" + req.query.search + "'" ], function(err, result) { //GetBuildings
	    res.json({
		draw : req.query.draw,
		recordsTotal : 100,
		recordsFiltered : 50,
		data : result
	    });
	});
	var draw = req.query.draw;
	var data = [ [ 0, "Angelica", "System Architect", "London", "9th Oct 09", "$2,875" ],
		[ 1, "Ashton", "Technical Author", "San Francisco", "12th Jan 09", "$4,800" ] ];
    },
    getbuilding : function(req, res) {

	sails.controllers.database.credSproc('GetBuildingContacts', [ req.param('id') ], function(err,buildingcontacts) {
	    if(err){
		res.json({error:'Database Error'});
	    }
	    res.json({building:{buildingcontacts:buildingcontacts}});
	});
    }

};
