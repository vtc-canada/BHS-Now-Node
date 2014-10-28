/**
 * FlighttableController
 * 
 * @description :: Server-side logic for managing flighttables
 * @help :: See http://links.sailsjs.org/docs/controllers
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
		    // for SHIFTING HERE!!
		    // MySql
		    /*
		     * flighttable[curFlight].departure_time = new Date(
		     * flighttable[curFlight].departure_time
		     * .setMinutes(flighttable[curFlight].departure_time
		     * .getMinutes() + flighttable[curFlight].departure_time
		     * .getTimezoneOffset()));
		     */
		}
	    }
	    res.json(flighttable);
	});
    },
    // Saves the flight plan by date
    saveFlightsByCarouselandDate : function(req, res) {
	var schedDate = req.param("date");
	var flightPlans = req.param("flight_plans");

	// first it figures out if the flights being saved are in the 3-day
	// window,
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
	
	
	async.parallel({
	                deleteFlights : function(callback){
	                    async.each(flightPlans,function(flightPlan,callback){
	                	if (flightPlan.deleted) {
	                	    Database.dataSproc("BHS_FLIGHTS_DeleteCurOfflineSortPlanByFlightAndDate", [ flightPlan.flight_number, schedDate ], function(err, result) {
	                		if (err) {
	                		    console.log("Failure with flight tables!!" + err.toString());
	                		    return callback(err);
	                		}
	                		if (in3DayWindow) {
	                		    async.parallel({
	                		        deleteFlightOpenTimes : function(callback){
	                		            Database.dataSproc("BHS_FLIGHTS_DeleteCurFlightOpenTimesByFlightAndDate", [ flightPlan.flight_number,schedDate ], function(err, result) {
	                		            	if (err) {
	                		                	console.log("Failure with flight tables!!" + err.toString());
	                		                	return callback(err);
	                		                }
	                		            	callback(null);
	                		            });	                		            
	                		        },
	                		        deleteFlightSortPlan : function(callback){
	                		            Database.dataSproc("BHS_FLIGHTS_DeleteCurFlightSortPlanByFlightAndDate", [ flightPlan.flight_number,schedDate ], function(err, result) {
	                		            	if (err) {
	                		                	console.log("Failure with flight tables!!" + err.toString());
	                		                	return callback(err);
	                		                }
	                		            	callback(null);
	                		            });	 
	                		        }},
	                		    function(err,result){
	                			if(err){
        	            				return callback(err);
        	            			}
        	            			callback(null);
        	            		    });
        	            		}else{
        	            		    callback(null);
        	            		}
	                	    });
        	            	}else{// not deleted;
        	            	    callback(null);
        	            	}
	                    },function(err){
	                	if(err){
	                	    callback(err);
	                	}
	                	callback(null);
	                    });
	                }, // END OF DELETE FLIGHTS
	                
	                
	                
	                newFlights : function(callback){
	                    async.each(flightPlans,function(flightPlan,callback){
	                	if (!flightPlan.deleted && flightPlan.id.toString().substring(0, 4) == 'new_') {    // New
																    // Flights
	                	    Database.dataSproc("BHS_FLIGHTS_InsertCurOfflineSortPlan", [ flightPlan.airline,
	                	                                                                 flightPlan.flight_number, flightPlan.departure_date, flightPlan.virtual_early_dest,
	                	                                                                 flightPlan.virtual_on_time_dest, flightPlan.virtual_late_dest,
	                	                                                                 flightPlan.virtual_locked_out_dest, flightPlan.departure_time,
	                	                                                                 flightPlan.on_time_open_offset, flightPlan.late_open_offset,
	                	                                                                 flightPlan.locked_out_open_offset ], function(err, result) {
	                		if (err) {
	                		    console.log("Failure with flight tables!!" + err.toString());
	                		    return callback(err);
	                		}
	                		if (in3DayWindow) {
	                		    async.parallel({
	                		        insertCurFlightSortPlan : function(callback){
	                		            Database.dataSproc("BHS_FLIGHTS_InsertCurFlightSortPlan", [ flightPlan.airline,
	                		                                                                        flightPlan.flight_number, flightPlan.departure_date,
	                		                                                                        flightPlan.virtual_early_dest, flightPlan.virtual_on_time_dest,
	                		                                                                        flightPlan.virtual_late_dest, flightPlan.virtual_locked_out_dest ], function(err, result) {
	                		            	if (err) {
	                		                	console.log("Failure with flight tables!!" + err.toString());
	                		                	return callback(err);
	                		                }
	                		            	callback(null);
	                		            });	                		            
	                		        },
	                		        insertCurFlightOpenTimes : function(callback){
	                		            Database.dataSproc("BHS_FLIGHTS_InsertCurFlightOpenTimes", [ flightPlan.flight_number,
	                		                                                                         flightPlan.departure_date, flightPlan.departure_time,
	                		                                                                         flightPlan.on_time_open_offset, flightPlan.late_open_offset,
	                		                                                                         flightPlan.locked_out_open_offset ], function(err, result) {
	                		            	if (err) {
	                		                	console.log("Failure with flight tables!!" + err.toString());
	                		                	return callback(err);
	                		                }
	                		            	callback(null);
	                		            });	 
	                		        }},
	                		    function(err,result){
	                			if(err){
        	            				return callback(err);
        	            			}
        	            			callback(null);
        	            		    });
        	            		}else{
        	            		    callback(null);
        	            		}
	                	    });
        	            	}else{// not deleted;
        	            	    callback(null);
        	            	}
	                    },function(err){
	                	if(err){
	                	    callback(err);
	                	}
	                	callback(null);
	                    });
	                }, // END OF NEW FLIGHTS
	
	
	                updateFlights : function(callback){
	                    async.each(flightPlans,function(flightPlan,callback){
	                	if (!flightPlan.deleted && flightPlan.id.toString().substring(0, 4) != 'new_') {    // Update
																    // Flights
	                	    Database.dataSproc("BHS_FLIGHTS_UpdateCurOfflineSortPlan", [ flightPlan.departure_time,
	                	                                                                 flightPlan.on_time_open_offset, flightPlan.late_open_offset,
	                	                                                                 flightPlan.locked_out_open_offset, flightPlan.virtual_early_dest,
	                	                                                                 flightPlan.virtual_on_time_dest, flightPlan.virtual_late_dest,
	                	                                                                 flightPlan.virtual_locked_out_dest, flightPlan.id ], function(err, result) {
	                		if (err) {
	                		    console.log("Failure with flight tables!!" + err.toString());
	                		    return callback(err);
	                		}
	                		if (in3DayWindow) {
	                		    async.parallel({
	                		        updateCurFlightSortPlan : function(callback){
	                		            Database.dataSproc("BHS_FLIGHTS_UpdateCurFlightSortPlan", [ flightPlan.virtual_early_dest,
	                		                                                                        flightPlan.virtual_on_time_dest, flightPlan.virtual_late_dest,
	                		                                                                        flightPlan.virtual_locked_out_dest, flightPlan.flight_number, schedDate ],
	                		                                        				function(err, result) {
	                		            	if (err) {
	                		                	console.log("Failure with flight tables!!" + err.toString());
	                		                	return callback(err);
	                		                }
	                		            	callback(null);
	                		            });	                		            
	                		        },
	                		        updateCurFlightOpenTimes : function(callback){
	                		            Database.dataSproc("BHS_FLIGHTS_UpdateCurFlightOpenTimes", [ flightPlan.departure_time,
	                		                                                                         flightPlan.on_time_open_offset, flightPlan.late_open_offset,
	                		                                                                         flightPlan.locked_out_open_offset, flightPlan.flight_number, schedDate ],
	                		                                         				function(err, result) {
	                		            	if (err) {
	                		                	console.log("Failure with flight tables!!" + err.toString());
	                		                	return callback(err);
	                		                }
	                		            	callback(null);
	                		            });	 
	                		        }},
	                		    function(err,result){
	                			if(err){
        	            				return callback(err);
        	            			}
        	            			callback(null);
        	            		    });
        	            		}else{
        	            		    callback(null);
        	            		}
	                	    });
        	            	}else{// not deleted;
        	            	    callback(null);
        	            	}
	                    },function(err){
	                	if(err){
	                	    callback(err);
	                	}
	                	callback(null);
	                    });
	                } // END OF UPDATE FLIGHTS
	
	
	
	},
	function(err){
	    if(err){
        	return res.json({error:'Error:'+err},500);
	    }
    	    res.json({success:true});
	});
    }
};

function toLocalDateISOString(date) {
    date = new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()));
    return date.toISOString().substr(0, 10);
}
