/**
 * Virtual2physicalController
 *
 * @description :: Server-side logic for managing virtual2physicals
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	res.view();
    },
    getRef_sort_destinations : function(req, res) {
	Database.dataSproc("BHS_UTIL_GetRefSortDestinations", [], function(err, ref_def) {
	    res.json(ref_def[0]);

	});
    },
    getRef_virtual_destinations : function(req, res) {
	Database.dataSproc("BHS_UTIL_GetRefVirtualDestinations", [], function(err, ref_virt_def) {
	    res.json(ref_virt_def[0]);
	});
    },
    getV2P : function(req, res) {
	Database.dataSproc("BHS_UTIL_GetCurVirtual2Physical", [], function(err, ref_def) {
	    res.json(ref_def[0]);
	});
    },
    saveV2P : function(req, res) {
	var v2ps = req.param("v2ps");
	for (var i = 0; i < v2ps.length; i++) {
	    Database.dataSproc("BHS_UTIL_UpdateCurVirtual2Physical", [ v2ps[i].phys_ID, v2ps[i].id ], function(err, result) {
	    });
	}
	res.json({
	    success : sails.config.views.locals.i18n(req,'Virtual to Physical settings have been successfully saved.')
	});
    }
};
