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
	for (var curCarrierVal = 0; curCarrierVal < cfgCarrierVals.length; curCarrierVal++) {
	    Database.dataSproc("BHS_DEFAULT_CARRIER_DESTINATION_SaveCfgCarrierDefs", [ cfgCarrierVals[curCarrierVal].default_destination,
		    cfgCarrierVals[curCarrierVal].carrier_sort_active, cfgCarrierVals[curCarrierVal].flight_sort_active, cfgCarrierVals[curCarrierVal].id ],
		    function(req2, res2) {

		    });
	}
	res.json({
	    success : sails.config.views.locals.i18n(req,'Airline Configurations have been successfully saved.')
	});
    }
};
