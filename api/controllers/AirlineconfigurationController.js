/**
 * AirlineconfigurationController
 *
 * @description :: Server-side logic for managing airlineconfigurations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	res.view();
    },
    // Utility- Gets the carriers and their current values
    getCarriers : function(req, res) {
	Database.dataSproc("BHS_DEFAULT_CARRIER_DESTINATION_GetCarriers", [], function(err, default_destination) {
	    if (err) {
		res.json({
		    error : 'Database Error'
		});
		return;
	    }
	    res.json(default_destination[0]);
	});
    },
    getRef_sort_destinations : function(req, res) {
	Database.dataSproc("BHS_DEFAULT_CARRIER_DESTINATION_GetRefSortDestinations", [], function(err, ref_def) {
	    if (err) {
		res.json({
		    error : 'Database Error'
		});
		return;
	    }
	    res.json(ref_def[0]);
	});
    },
    // Iterates and updates each of the carriers.
    saveCfg_Carrier_Defs : function(req, res) {
	var cfgCarrierVals = req.param("cfg_carrier_vals");

	async.each(cfgCarrierVals, function(curCarrierVal, callback) {
	    Database.dataSproc("BHS_DEFAULT_CARRIER_DESTINATION_SaveCfgCarrierDefs", [ cfgCarrierVals.default_destination, cfgCarrierVals.carrier_sort_active,
		    cfgCarrierVals.flight_sort_active, cfgCarrierVals.id ], function(err, response) {
		if (err) {
		    callback(err);
		}
		callback(null,response);
	    });
	}, function(err, response) {
	    if (err) {
		return res.json({
		    error : 'Database Error'
		});
	    }
	    res.json({
		success : req.__('Airline Configurations have been successfully saved.')
	    });
	});
    }
};
