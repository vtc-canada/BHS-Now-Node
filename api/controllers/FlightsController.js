/**
 * FlightsController
 * 
 * @description :: Server-side logic for managing flights
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {

	Database.dataSproc('BHS_UTIL_GetActiveAirlines', [], function(err, airlines) {
	    if (err) {
		console.log('BHS_UTIL_GetActiveAirlines Error:' + err);
		return json({
		    error : 'Database Error :' + err
		}, 500);
	    }
	    Database.dataSproc('FMS_AIRPORTS_GetAirports', [], function(err, airports) {
		if (err) {
		    console.log('FMS_AIRPORTS_GetAirports Error:' + err);
		    return json({
			error : 'Database Error :' + err
		    }, 500);
		}
		res.view({
		    airlines : airlines[0], airports:airports[0]
		});
	    });
	});
	// Database.dataSproc('FMS_FLIGHTS_GetFlightsByDateRange',['2014-10-01
	// 00:00:00','2015-01-01 00:00:00'],function(err,flights){
	// });
    },
    findByDate : function(req, res) {

    }
};
