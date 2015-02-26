/**
 * FlightsController
 * 
 * @description :: Server-side logic for managing flights
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    self : this,
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
		    airlines : airlines[0],
		    airports : airports[0]
		});

	    });
	});
    },
    watchCompany : function(req, res) {
	req.socket.join('gantt');
	res.json({
	    success : 'joined gantt'
	});
    },
    getCompanyResourceSharingByFlightId : function(req, res) {
	Database.dataSproc('FMS_FLIGHTS_GetCompanyResourceSharingByFlightId', [ req.body.id ], function(err, companies) {
	    if (err) {
		console.log('FMS_FLIGHTS_GetCompanyResourceSharingByFlightId :' + err);
		return res.json({
		    error : 'FMS_FLIGHTS_GetCompanyResourceSharingByFlightId :' + err
		}, 500);
	    }
	    res.json(companies[0]);
	});
    },
    getCfgCompanyFlightMappings : function(req, res) {
	Database.dataSproc('FMS_FLIGHTS_GetCfgCompanyFlightMappings', [ req.body.id ], function(err, companies) {
	    if (err) {
		console.log('FMS_FLIGHTS_GetCfgCompanyFlightMappings :' + err);
		return res.json({
		    error : 'FMS_FLIGHTS_GetCfgCompanyFlightMappings :' + err
		}, 500);
	    }
	    res.json(companies[0]);
	});
    },
    findFlights : function(req, res) {

	function getIndexById(array, id) {
	    for (var i = 0; i < array.length; i++) {
		if (array[i].id == id) {
		    return i;
		}
	    }
	    return -1;
	}

	Database.dataSproc('FMS_FLIGHTS_GetFlightsByDateRange', [ new Date(req.body.minDate), new Date(req.body.maxDate) ], function(err, flights) {
	    if (err) {
		console.log('FMS_FLIGHTS_GetFlightsByDateRange :' + err);
		return res.json({
		    error : 'FMS_FLIGHTS_GetFlightsByDateRange :' + err
		}, 500);
	    }

	    var flightgroups = [];

	    async.eachSeries(flights[0], function(leg, cb) {  // ordered by departure time.. means it will fill up the first groups properly
		if (getIndexById(flightgroups, leg.flight_id) == -1) { // checks and adds flightgroup
		    flightgroups.push({
			id : leg.flight_id,
			flights : []
		    });
		}
		Database.dataSproc('FMS_FLIGHTS_GetCompanyResourceSharingByLegId', [ leg.id ], function(err, companies) {  // these will come back out of order.
		    if (err)
			return cb(err);
		    var index = getIndexById(flightgroups, leg.flight_id); // gets the index
		    leg.company_seats = companies
		    flightgroups[index].flights.push(leg); // adds leg
		    cb(null);
		});
	    }, function(err, result) {
		if (err) {
		    return res.json(err);
		}
		res.send(flightgroups);
	    });
	});
    },
    destroy : function(req, res) {
	var flightdata = req.body;
	async.each(flightdata.flights, function(flight, cb) {
	    sails.controllers.manifests.clearManifestByLegId(flight.id, function(err) {
		sails.controllers.flights.clearCompanyFlightMappings(null, flight.id, function(err) {
		    if (err)
			return cb(err);
		    Database.dataSproc('FMS_FLIGHTS_DeleteLeg', [ flight.id ], function(err) {
			if (err)
			    return cb(err);

			cb(null);
		    });
		});
	    });
	}, function(err, result) {
	    if (err)
		return res.json({
		    error : 'Error:' + err
		}, 500);
	    res.json({
		success : 'Success'
	    });
	    sails.io.sockets.emit('gantt', {
		success : 'do the update'
	    });
	});
    },
    save : function(req, res) {
	var flightdata = req.body;

	// Updates the companyflight mappings for the flight
	function updateCompanyMappings(cb) {
	    return cb(null);
	    sails.controllers.flights.clearCompanyFlightMappings(null, flight.id, function(err) {
		if (err)
		    return cb(err);
		async.each(flight.company_mappings, function(company_mapping, callback) {
		    if (company_mapping.assigned == 0) { // skip making the
			// mapping if it's
			// not assigned
			return callback(null);
		    }
		    sails.controllers.flights.createCompanyFlightMapping(company_mapping.id, flight.id, function(err) {
			if (err)
			    return callback(err);
			callback(null);
		    });
		}, function(err) {
		    if (err)
			return cb(err);
		    cb(null);
		});
	    });
	}

	// Before iterating through flight legs.. check to see if it's an
	// entirely new flight.

	if (flightdata.id == null) { // new flight
	    Database.dataQuery('SELECT MAX(flight_id) AS flight_id from cur_legs', function(err, response) {
		if (err) {
		    console.log(err.toString());
		    return res.json(err);
		}
		flightdata.id = response[0].flight_id + 1;
		processLegs();
	    });
	} else {
	    processLegs();
	}

	function processLegs() {
	    async.each(flightdata.flights, function(flight, cb) {
		if (flight.flight_id == null) { // add missing flight_id
		    flight.flight_id = flightdata.id;
		}
		if (!flight.id) { // New Flight!
		    var newFlightId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		    Database.dataSproc('FMS_FLIGHTS_CreateLeg', [ flight.flight_id, flight.airline, flight.flight_number, flight.departure_time, flight.arrival_time, flight.origin_airport_code, flight.destination_airport_code, 1, newFlightId ], function(err, response) {
			if (err)
			    return cb(err);
			Database.dataSproc('FMS_MANIFEST_CreateManifest', [ response[1][newFlightId] ], function(err, response) {
			    if (err)
				return cb(err);
			    cb(null, response);
			});
		    });
		} else if (typeof (flight.is_deleted) == 'undefined') { // if
		    // not
		    // deleted.
		    Database.dataSproc('FMS_FLIGHTS_UpdateLeg', [ flight.flight_id, flight.id, flight.airline, flight.flight_number, flight.departure_time, flight.arrival_time, flight.origin_airport_code, flight.destination_airport_code, 1 ], function(err, response) {
			if (err)
			    return cb(err);
			updateCompanyMappings(function(err) {
			    if (err)
				return cb(err);
			    cb(null, response);
			});
		    });

		} else if (typeof (flight.is_deleted) != 'undefined' && flight.is_deleted) {
		    sails.controllers.manifests.clearManifestByLegId(flight.id, function(err) {
			sails.controllers.flights.clearCompanyFlightMappings(null, flight.id, function(err) {
			    if (err)
				return cb(err);
			    Database.dataSproc('FMS_FLIGHTS_DeleteLeg', [ flight.id ], function(err) {
				if (err)
				    return cb(err);
				cb(null)
			    });
			});
		    });
		}
	    }, function(err, data) {
		if (err) {
		    return res.json({
			error : 'Failed Updating Company Mappings :' + err
		    }, 500);
		}
		res.json({
		    success : 'success'
		});
		sails.io.sockets.emit('gantt', {
		    success : 'do the update'
		});
	    });
	}

    },

    // / Utility Functions
    clearCompanyFlightMappings : function(company_ID, flight_ID, cb) {
	Database.dataSproc('FMS_FLIGHTS_ClearCfgCompanyFlightMappings', [ company_ID, flight_ID ], function(err, result) {
	    if (err) {
		console.log('FMS_FLIGHTS_ClearCfgCompanyFlightMappings Error' + err);
		return cb(err);
	    }
	    cb(null);
	});
    },
    createCompanyFlightMapping : function(company_ID, flight_ID, cb) {
	Database.dataSproc('FMS_FLIGHTS_CreateCfgCompanyFlightMapping', [ company_ID, flight_ID ], function(err, result) {
	    if (err) {
		console.log('FMS_FLIGHTS_CreateCfgCompanyFlightMapping Error' + err);
		return cb(err);
	    }
	    cb(null);
	});
    }
};
