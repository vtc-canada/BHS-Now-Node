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
var filteredCount; // This is here because struggles with scope issues...
// became unscoped after callback from database controller
// method

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js` (specific to
     * BuildingsController)
     */
    _config : {},

    notes : function(req, res) {
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.credSproc('GetBuildingNotes', [ parseInt(req.params.id) ], function(err, result) {
		res.json(result[0]);
	    });
	}
    },
    index : function(req, res) {
	sails.controllers.database.credQuery('SELECT * FROM ref_building_type', function(err, building_types) {
	    if (err) {
		console.log(err.toString);
	    } else {
		sails.controllers.database.credQuery('SELECT * FROM ref_heat_system_type', function(err, heat_types) {
		    if (err) {
			console.log(err.toString);
		    } else {
			sails.controllers.database.credQuery('SELECT * FROM ref_boiler_type', function(err, boiler_types) {
			    if (err) {
				console.log(err.toString);
			    } else {
				res.view({
				    building_types : building_types,
				    heat_types : heat_types,
				    boiler_types : boiler_types
				});
			    }
			});
		    }
		});
	    }
	});
    },
    getajax : function(req, res) {
	/*
	 * null req.query.search req.query.unitQuantityMin
	 * req.query.unitQuantityMax req.query.saleDateRangeStart
	 * req.query.saleDateRangeEnd req.query.start req.query.length
	 * req.query.order
	 */

	// Append the asterisks
	if (req.query.search != '') {
	    req.query.search = req.query.search.split(" ").join("* ") + "*";
	}

	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	sails.controllers.database.credSproc('GetBuildings', [ req.query.search == '' ? null : "'" + req.query.search + "'",
		req.query.unitQuantityMin == '' ? null : parseInt(req.query.unitQuantityMin),
		req.query.unitQuantityMax == '' ? null : parseInt(req.query.unitQuantityMax),
		req.query.saleDateRangeStart == '' ? null : req.query.saleDateRangeStart, req.query.saleDateRangeEnd == '' ? null : req.query.saleDateRangeEnd,
		req.query.start, req.query.length, null, filteredCount ], function(err, result) { // GetBuildings
	    if (err) {
		res.json({
		    error : 'Database Error'
		}, 500);
	    } else {
		sails.controllers.database.credSproc('GetBuildingsCount', [], function(err, buildingscount) {
		    res.json({
			draw : req.query.draw,
			recordsTotal : buildingscount[0][0].number_of_buildings,
			recordsFiltered : result[1][filteredCount],
			data : result[0]
		    });
		});
	    }

	});

    },
    getbuilding : function(req, res) {

	sails.controllers.database.credSproc('GetBuilding', [ req.param('id') ], function(err, building) {

	    sails.controllers.database.credSproc('GetBuildingContacts', [ req.param('id') ], function(err, buildingcontacts) {
		if (err) {
		    res.json({
			error : 'Database Error'
		    });
		} else {
		    building[0][0].buildingcontacts = buildingcontacts;
		    res.json(building[0][0]);
		}
	    });
	});

    }

};
