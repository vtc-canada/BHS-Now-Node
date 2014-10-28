/**
 * FlighttableController
 *
 * @description :: Server-side logic for managing flighttables
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	Database.dataSproc("BHS_UTIL_GetCurVirtual2Physical", [], function(err, mapping) {
	    if (err) {
		res.view('error');
		return;
	    }
	    Database.dataSproc("BHS_UTIL_GetActiveAirlines", [], function(error, ref_airline_code) {
		if (error) {
		    res.view('error');
		    return;
		}

		res.view({
		    locale : req.session.user.locale,
		    title : 'Flight Table',
		    url : 'flighttable',
		    username : req.session.user.username,
		    id : req.session.user.id,
		    airlines : ref_airline_code[0],
		    virtualmappings : mapping[0],
		    url_date : ""
		});
	    });

	});

    },

    // Loads the flight page when passing in a specific date. The date is passed
    // in as an argument to the template.
    getbydate : function(req, res) {
	sails.adapters[sails.config.adapters[sails.config.adapters['default']].module]
		.query(
			"users",
			"SELECT cur_virtual_2_physical.id,cur_virtual_2_physical.phys_ID,ref_sort_destinations.destination as virt_destination FROM cur_virtual_2_physical INNER JOIN ref_sort_destinations ON ref_sort_destinations.id = cur_virtual_2_physical.id",
			function(err, mapping) {
			    if (err) {
				res.view('error');
				return;
			    }
			    sails.adapters[sails.config.adapters[sails.config.adapters['default']].module]
				    .query(
					    "users",
					    "SELECT ref_airline_code.id, ref_airline_code.carrier, ref_airline_code.IATA_code, ref_airline_code.IATA_2_digit_ID FROM ref_airline_code INNER JOIN cfg_active_airlines ON cfg_active_airlines.id = ref_airline_code.id WHERE cfg_active_airlines.active = 1",
					    function(error, ref_airline_code) {
						if (err) {
						    res.view('error');
						    return;
						}
						if (typeof (req.param('message')) != 'undefined') {
						    res.view('flighttable/index.ejs', {
							postmessage : req.param('message'),
							locale : req.session.user.locale,
							title : 'Flight Table',
							url : 'flighttable',
							username : req.session.user.username,
							id : req.session.user.id,
							airlines : ref_airline_code,
							virtualmappings : mapping,
							url_date : req.url.split('/').pop()
						    });
						} else {
						    res.view('flighttable/index.ejs', {
							locale : req.session.user.locale,
							title : 'Flight Table',
							url : 'flighttable',
							username : req.session.user.username,
							id : req.session.user.id,
							airlines : ref_airline_code,
							virtualmappings : mapping,
							url_date : req.url.split('/').pop()
						    });
						}

					    });
			});

    },

    // Gets the flight plans by Date
    findByCarouselandDate : function(req, res) {
	Database.dataSproc("BHS_UTIL_GetFlightsByDate", [ req.param("date")], function(err, flighttable) {
	    if (err) {
		return json({
		    error : err
		});
	    }
	    flighttable = flighttable[0];
	    for (var curFlight = 0; curFlight < flighttable.length; curFlight++) {
		// console.log(flighttable.departure_time);
		if (typeof (flighttable[curFlight].departure_time) == 'string') { // corrects
		    // datetime
		    // for MsSql

		    flighttable[curFlight].departure_time = new Date(flighttable[curFlight].departure_time);

		} else if (typeof (flighttable[curFlight].departure_time) == 'object') { // corrects
		    // datetime
		    // for   SHIFTING HERE!!
		    // MySql
		    /* flighttable[curFlight].departure_time = new Date(
		         flighttable[curFlight].departure_time
		             .setMinutes(flighttable[curFlight].departure_time
		                 .getMinutes()
		                 + flighttable[curFlight].departure_time
		                     .getTimezoneOffset()));*/
		}
	    }
	    res.json(flighttable);
	});
    },
    // Saves the flight plan by date
    saveFlightsByCarouselandDate : function(req, res) {
	var schedDate = req.param("date");
	var flightPlans = req.param("flight_plans");

	// first it figures out if the flights being saved are in the 3-day window,
	// in order to know whether to update the ONLINE tables
	var todayDate = new Date();
	var tomorrowDate = new Date(todayDate.getTime() + 24 * 60 * 60 * 1000);
	var yesterdayDate = new Date(todayDate.getTime() - 24 * 60 * 60 * 1000);
	todayDate = toLocalDateISOString(todayDate);
	tomorrowDate = toLocalDateISOString(tomorrowDate);
	yesterdayDate = toLocalDateISOString(yesterdayDate);

	var in3DayWindow = false;

	if (todayDate == schedDate || tomorrowDate == schedDate || yesterdayDate == schedDate) {
	    in3DayWindow = true;
	}

	for (var curFlightPlan = 0; curFlightPlan < flightPlans.length; curFlightPlan++) {

	    // First iterate through and delete all the flights that are flagged for
	    // deletion
	    if (flightPlans[curFlightPlan].deleted) {
		Database.dataSproc("BHS_FLIGHTS_DeleteCurOfflineSortPlanByFlightAndDate", [ flightPlans[curFlightPlan].flight_number,
			schedDate ], function(err, result) {
		    if (err) {
			console.log("Failure with flight tables!!" + err.toString());
			return;
		    }
		});

		if (in3DayWindow) {
		    Database.dataSproc("BHS_FLIGHTS_DeleteCurFlightOpenTimesByFlightAndDate", [ flightPlans[curFlightPlan].flight_number,
			    schedDate ], function(err, result) {
			if (err) {
			    console.log("Failure with flight tables!!" + err.toString());
			    return;
			}
		    });
		    Database.dataSproc("BHS_FLIGHTS_DeleteCurFlightSortPlanByFlightAndDate", [ flightPlans[curFlightPlan].flight_number,
			    schedDate ], function(err, result) {
			if (err) {
			    console.log("Failure with flight tables!!" + err.toString());
			    return;
			}
		    });
		}
		res.json('success');
	    }
	}

	for (var curFlightPlan = 0; curFlightPlan < flightPlans.length; curFlightPlan++) {

	    // if NOT deleted
	    if (!flightPlans[curFlightPlan].deleted) {
		if (flightPlans[curFlightPlan].id.toString().substring(0, 4) == 'new_') { // if new entry        
		    //var flight_dep_date = toUTCDateTimeString(new Date());
		    Database.dataSproc("BHS_FLIGHTS_InsertCurOfflineSortPlan", [ flightPlans[curFlightPlan].airline,
			    flightPlans[curFlightPlan].flight_number, flightPlans[curFlightPlan].departure_date, flightPlans[curFlightPlan].virtual_early_dest,
			    flightPlans[curFlightPlan].virtual_on_time_dest, flightPlans[curFlightPlan].virtual_late_dest,
			    flightPlans[curFlightPlan].virtual_locked_out_dest, flightPlans[curFlightPlan].departure_time,
			    flightPlans[curFlightPlan].on_time_open_offset, flightPlans[curFlightPlan].late_open_offset,
			    flightPlans[curFlightPlan].locked_out_open_offset ], function(err, result) {
			if (err) {
			    console.log("Failure with flight tables!!" + err.toString());
			    return;
			}
		    });

		    if (in3DayWindow) {
			Database.dataSproc("BHS_FLIGHTS_InsertCurFlightSortPlan", [ flightPlans[curFlightPlan].airline,
				flightPlans[curFlightPlan].flight_number, flightPlans[curFlightPlan].departure_date,
				flightPlans[curFlightPlan].virtual_early_dest, flightPlans[curFlightPlan].virtual_on_time_dest,
				flightPlans[curFlightPlan].virtual_late_dest, flightPlans[curFlightPlan].virtual_locked_out_dest ], function(err, result) {
			    if (err) {
				console.log("Failure with flight tables!!" + err.toString());
				return;
			    }

			});
			Database.dataSproc("BHS_FLIGHTS_InsertCurFlightOpenTimes", [ flightPlans[curFlightPlan].flight_number,
				flightPlans[curFlightPlan].departure_date, flightPlans[curFlightPlan].departure_time,
				flightPlans[curFlightPlan].on_time_open_offset, flightPlans[curFlightPlan].late_open_offset,
				flightPlans[curFlightPlan].locked_out_open_offset ], function(err, result) {
			    if (err) {
				console.log("Failure with flight tables!!" + err.toString());
				return;
			    }
			});
		    }
		    res.json('success');

		} else { // An UPDATE to a current flight
		    //var flight_dep_date = toUTCDateTimeString(new Date(flightPlans[curFlightPlan].departure_time));

		    /*new Date(new Date(
		      flightPlans[curFlightPlan].departure_time).getTime());
		    flight_dep_date = new Date(flight_dep_date.setMinutes(flight_dep_date
		      .getMinutes()
		      - flight_dep_date.getTimezoneOffset())).toISOString();
		     */
		    Database.dataSproc("BHS_FLIGHTS_UpdateCurOfflineSortPlan", [ flightPlans[curFlightPlan].departure_time,
			    flightPlans[curFlightPlan].on_time_open_offset, flightPlans[curFlightPlan].late_open_offset,
			    flightPlans[curFlightPlan].locked_out_open_offset, flightPlans[curFlightPlan].virtual_early_dest,
			    flightPlans[curFlightPlan].virtual_on_time_dest, flightPlans[curFlightPlan].virtual_late_dest,
			    flightPlans[curFlightPlan].virtual_locked_out_dest, flightPlans[curFlightPlan].id ], function(err, result) {
			if (err) {
			    console.log("Failure with flight tables!!" + err.toString());
			    return;
			}
		    });

		    if (in3DayWindow) {
			Database.dataSproc("BHS_FLIGHTS_UpdateCurFlightSortPlan", [ flightPlans[curFlightPlan].virtual_early_dest,
				flightPlans[curFlightPlan].virtual_on_time_dest, flightPlans[curFlightPlan].virtual_late_dest,
				flightPlans[curFlightPlan].virtual_locked_out_dest, flightPlans[curFlightPlan].flight_number, schedDate ],
				function(err, result) {
				    // sails.adapters[sails.config.adapters[sails.config.adapters['default']].module].query("users","UPDATE
				    // cur_flight_sort_plan SET virtual_early_dest =
				    // "+flightPlans[i].virtual_early_dest+",
				    // virtual_on_time_dest =
				    // "+flightPlans[i].virtual_on_time_dest+", virtual_late_dest
				    // = "+flightPlans[i].virtual_late_dest+",
				    // virtual_locked_out_dest =
				    // "+flightPlans[i].virtual_locked_out_dest+" WHERE
				    // flight_number = "+ flightPlans[i].flight_number + " AND
				    // departure_date = '" + scheddate+"'", function(err,result){
				    if (err) {
					console.log("Failure with flight tables!!" + err.toString());
					return;
				    }
				});
			Database.dataSproc("BHS_FLIGHTS_UpdateCurFlightOpenTimes", [ flightPlans[curFlightPlan].departure_time,
				flightPlans[curFlightPlan].on_time_open_offset, flightPlans[curFlightPlan].late_open_offset,
				flightPlans[curFlightPlan].locked_out_open_offset, flightPlans[curFlightPlan].flight_number, schedDate ],
				function(err, result) {
				    // sails.adapters[sails.config.adapters[sails.config.adapters['default']].module].query("users","UPDATE
				    // cur_flight_open_times SET departure_time = v_time ,
				    // on_time_open_offset =
				    // "+flightPlans[i].on_time_open_offset+", late_open_offset =
				    // "+flightPlans[i].late_open_offset+", locked_out_open_offset
				    // = "+flightPlans[i].locked_out_open_offset+" WHERE
				    // flight_number = "+ flightPlans[i].flight_number + " AND
				    // departure_date = '" + scheddate+"'", function(err,result){
				    if (err) {
					console.log("Failure with flight tables!!" + err.toString());
					return;
				    }
				});
		    }
		    res.json('success');
		}
	    }
	}
    }
};

function toLocalDateISOString(date) {
    date = new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()));
    return date.toISOString().substr(0, 10);
}
