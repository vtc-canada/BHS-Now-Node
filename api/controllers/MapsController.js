/**
 * MapsController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MapsController)
   */
  _config: {}
  ,index : function(req, res) {
	sails.controllers.database.credQuery('SELECT * FROM ref_building_type', function(err, building_types) {
	    if (err) {
		console.log(err);
	    } else {
		sails.controllers.database.credQuery('SELECT * FROM ref_heat_system_type', function(err, heat_types) {
		    if (err) {
			console.log(err);
		    } else {
			res.view({
			    building_types : building_types,
			    heat_types : heat_types
			});
		    }
		});
	    }
	});
  }

  
};
