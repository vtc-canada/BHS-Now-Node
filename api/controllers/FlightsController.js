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
		return res.json({
		    error : 'Database Error :' + err
		}, 500);
	    }
	    Database.dataSproc('FMS_AIRPORTS_GetAirports', [], function(err, airports) {
		if (err) {
		    console.log('FMS_AIRPORTS_GetAirports Error:' + err);
		    return res.json({
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
    findFlights : function(req, res) {
	Database.dataSproc('FMS_FLIGHTS_GetFlightsByDateRange',[new Date(req.body.minDate),new Date(req.body.maxDate)],function(err,flights){
	    if (err) {
		console.log('FMS_FLIGHTS_GetFlightsByDateRange :' + err);
		return res.json({
		    error : 'FMS_FLIGHTS_GetFlightsByDateRange :' + err
		}, 500);
	    }
	    res.send(flights[0]);
	});
    },
    save:function(req,res){
	var flight = req.body;
	if(!flight.id){  // New Flight!
	    Database.dataSproc('FMS_FLIGHTS_CreateFlight',[flight.airline, flight.flight_number, flight.departure_time, flight.arrival_time, flight.origin_airport_code, flight.destination_airport_code],function(err,response){
		if(err){
		    console.log(err.toString());
		    return res.json({error:'FMS_FLIGHTS_CreateFlight :'+err},500);
		}
		res.json({success:'success'});
	    });
	}else{
	    Database.dataSproc('FMS_FLIGHTS_UpdateFlight',[flight.id, flight.airline, flight.flight_number, flight.departure_time, flight.arrival_time, flight.origin_airport_code, flight.destination_airport_code],function(err,response){
		if(err){
		    console.log(err.toString());
		    return res.json({error:'FMS_FLIGHTS_UpdateFlight :'+err},500);
		}
		res.json({success:'success'});
	    });
	    
	}
    }
};
