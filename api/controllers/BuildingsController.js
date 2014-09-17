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
var totalCount;
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
	    //return res.json([]);
	     sails.controllers.database.credSproc('GetBuildingNotes', [
	     parseInt(req.params.id) ], function(err, result) {
		 if(err)
		    return res.json({error:'Database Error:'+err},500);
		 res.json(result[0]);
	     });
		   
		    
	}
    },
    find : function(req, res) {
	sails.controllers.database.credQuery('SELECT * FROM ref_building_type', function(err, building_types) {
	    if (err) {
		console.log(err.toString);
	    } else {
		sails.controllers.database.credQuery('SELECT * FROM ref_heat_system_type', function(err, heat_types) {
		    if (err) {
			console.log(err.toString);
		    } else {
			var params = {
				    building_types : building_types,
				    heat_types : heat_types
				};
			if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
			    params.init_id = parseInt(req.params.id);
			    
			}
			res.view('buildings/index',params);
		    }
		});
	    }
	});
    },
    getcompaniesbycontactid : function(req, res) {

	var address_search = null;
	if (typeof(req.body.search)!='undefined'&&req.body.search != '') {
	    adr = req.body.search.trim().split(" ");
	    address_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    address_search=address_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    address_search = "'"+address_search.trim()+"'";
	}
	
	sails.controllers.database.credSproc('GetCompaniesByContactOrName', [ address_search,
		typeof (req.body.contactId) != 'undefined' ? req.body.contactId : null ], function(err, result) {
	    if (err)
		return res.json({
		    error : 'Database Error:' + err
		});
	    res.json(result[0]);
	});
    },
    getcontactsbycompanyid : function(req, res) {
	
	var address_search = null;
	if (typeof(req.body.search)!='undefined'&&req.body.search != '') {
	    adr = req.body.search.trim().split(" ");
	    address_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    address_search=address_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    address_search = "'"+address_search.trim()+"'";
	}
	
	sails.controllers.database.credSproc('GetContactsByCompanyOrName', [ address_search,
		typeof (req.body.companyId) != 'undefined' ? req.body.companyId : null ], function(err, result) {
	    if (err)
		return res.json({
		    error : 'Database Error:' + err
		});
	    res.json(result[0]);
	});
    },
    deletesale : function(req, res) {
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.credSproc('DeleteSaleAndMappings', [ parseInt(req.params.id) ], function(err, responseDelete) {
		if (err)
		    return res.json({
			error : 'Database Error' + err
		    }, 500);

		res.json({
		    success : 'Sale Deleted'
		});

	    });

	}
    },
    deletebuilding:function(req,res){
	if(req.session.user.policy[req.route.path].delete==1){  // Delete access on this route?
        	if(typeof(req.body.building_id)!='undefined'&&!isNaN(parseInt(req.body.building_id))){
        	    sails.controllers.database.credSproc('DeleteBuilding',[parseInt(req.body.building_id)],function(err,resultDelete){
        		if(err)
        		    return res.json({error:'Database Error:'+err},500);	
        		res.json({success:'success'});
        		
        	    });
        	}
	}
    },
    savebuilding : function(req, res) {
	
	

	var building = req.body.building;
	var buildingcontacts = req.body.buildingcontacts;
	var buildingnotes = req.body.buildingnotes;

	if(req.session.user.policy[req.route.path].update==0){  // readonly account Notes update.
	    processReadOnlyNotes(function(){
		    return res.json({
			success : true,
			building_id : building.building_id
		    });
	    });
	}else if (typeof (building.sale_id) != 'undefined') { // SALE MODE!!! (note a
							// new building)

	    if (building.sale_id == 'new') {
		new_sale_id = '@out' + Math.floor((Math.random() * 1000000) + 1);
		sails.controllers.database.credSproc('CreateSalesRecord', [ building.last_sale_price, "'" + toUTCDateTimeString(building.sale_date) + "'", building.heat_system_age,
			building.windows_installed_year, building.elevator_installed_year, building.last_elevator_upgrade_year,building.has_elevator, building.boiler_installed_year,
			"'" + building.cable_internet_provider + "'", building.assessed_value, building.heat_system_type, building.unit_quantity
			,building.unit_price,building.unit_price_manual_mode,building.building_income,building.building_income_manual_mode
			
			, building.bachelor_price, building.bedroom1_price, building.bedroom2_price, building.bedroom3_price,
			building.bachelor_units, building.bedroom1_units, building.bedroom2_units, building.bedroom3_units, "'"+building.property_mgmt_company+"'"
			,"'"+building.prev_property_mgmt_company+"'", isNaN(building.cap_rate)?0:building.cap_rate,building.building_type , building.last_boiler_upgrade_year, "'"+ building.mortgage_company+"'", "'" + toUTCDateTimeString(building.mortgage_due_date) + "'"
			,new_sale_id ], function(err, responseSalesRecord) {
		    if (err) {
			console.log(err);
			return res.json({
			    error : 'Database Error:' + err
			}, 500);
		    }
		    function loop(i) {
			var tempOutVar = '@out' + Math.floor((Math.random() * 1000000) + 1);
			sails.controllers.database.credSproc('CreateSalesContactMapping', [ responseSalesRecord[1][new_sale_id],
				buildingcontacts[i].contact_id, building.building_id, buildingcontacts[i].contact_type == 'owner' ? 1 : (buildingcontacts[i].contact_type == 'seller')?2:3,
				buildingcontacts[i].company_id, tempOutVar ], function(err, responseSalesMapping) {
			    i++;
			    if (i < buildingcontacts.length) {
				loop(i)
			    } else {
				checkAndUpdateBuildingLastSale(building,function(){
				    res.json({
					success : true,
					sale_id : responseSalesRecord[1][new_sale_id],
					building_id : building.building_id
				    });
				});
			    }
			});
		    }

		    if (buildingcontacts.length > 0) {
			loop(0);
		    } else {
			var tempOutVar = '@out' + Math.floor((Math.random() * 1000000) + 1);
			sails.controllers.database.credSproc('CreateSalesContactMapping', [ responseSalesRecord[1][new_sale_id],
				null, building.building_id, 1, null, tempOutVar ], function(err, responseSalesMapping) {
				checkAndUpdateBuildingLastSale(building,function(){
    					res.json({
    					    	success : true,
    					    	sale_id : responseSalesRecord[1][new_sale_id],
    				    		building_id : building.building_id
    					});
				});
			});
		    }
		    // sails.controllers.database.credSproc('CreateSalesContactMapping',
		    // [responseSalesRecord[1][new_sale_id])
		    // ,building.

		    // IN salesRecord INT,IN contactID INT, IN buildingID INT,IN
		    // contactType INT, OUT id INT

		    console.log(responseSalesRecord[1][new_sale_id]);
		});

	    } else if (!isNaN(parseInt(building.sale_id))) { // saving sale
		sails.controllers.database.credSproc('UpdateSalesRecord', [ building.sale_id, building.last_sale_price, "'"+toUTCDateTimeString(building.sale_date)+"'",
			building.heat_system_age, building.windows_installed_year, building.elevator_installed_year,building.last_elevator_upgrade_year, building.has_elevator, building.boiler_installed_year,
			"'"+building.cable_internet_provider+"'", building.assessed_value, building.heat_system_type, building.unit_quantity, building.unit_price,
			building.unit_price_manual_mode, building.building_income, building.building_income_manual_mode,
			building.bachelor_units, building.bedroom1_units, building.bedroom2_units, building.bedroom3_units, building.bachelor_price,
			building.bedroom1_price, building.bedroom2_price, building.bedroom3_price,  "'"+building.property_mgmt_company+"'", "'"+building.prev_property_mgmt_company+"'", isNaN(building.cap_rate)?0:building.cap_rate, building.building_type, building.last_boiler_upgrade_year,"'"+ building.mortgage_company+"'", "'" + toUTCDateTimeString(building.mortgage_due_date) + "'",building.parking_spots], function(err,
			responseUpdateSale) {

		    // TODO : Update building..
		    checkAndUpdateBuildingLastSale(building,function(){
			    res.json({
				success : true,
				sale_id : building.sale_id,
				building_id : building.building_id
			    });
		    });
		});

		console.log(building.sale_id);
	    }

	    // //////////////////////////////
	    // / NOT SALE MODE //////////////
	    // //////////////////////////////
	} else {
	    var street_number_end = (building.street_number_end == null || building.street_number_end == 0) ? '' : ' ' + building.street_number_end;
	    var addressSearch = building.street_number_begin + " " + street_number_end + " " + building.street_name + ', ' + building.city + ', '
		    + building.province + ', Canada, ' + building.postal_code;

	    var geocoderProvider = 'google';
	    var httpAdapter = 'http';
	    // optionnal
	    var extra = {
		// apiKey: 'YOUR_API_KEY', // for map quest
		formatter : null
	    // 'gpx', 'string', ...
	    };

	    var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

	    geocoder.geocode(addressSearch, function(err, responseGeocode) {
		var lat = null;
		var lng = null;
		if (typeof (responseGeocode) != 'undefined' && responseGeocode.length > 0) {
		    lat = responseGeocode[0].latitude;
		    lng = responseGeocode[0].longitude;
		}
		    if (building.building_id != 'new') {
			sails.controllers.database.credSproc('UpdateAddress', [ building.address_id, "'" + building.street_number_begin + "'",
				"'" + building.street_number_end + "'", "'" + building.street_name + "'", "'" + building.postal_code + "'",
				"'" + building.city + "'", "'" + building.province + "'", lat, lng ],
				function(err, responseAddress) {
			    		if(err)
			    		    return res.json({error:'Database Error'+err},500);

				    sails.controllers.database.credSproc('UpdateBuilding', [ building.building_id, building.address_id,
					    tryParseInt(building.building_type), tryParseInt(building.heat_system_age), building.windows_installed_year,
					    building.elevator_installed_year, building.boiler_installed_year, "'" + building.cable_internet_provider + "'",
					    "'" + building.assessed_value + "'", tryParseInt(building.heat_system_type), tryParseInt(building.unit_quantity),
					    "'" + toUTCDateTimeString(building.sale_date) + "'", building.unit_price,building.unit_price_manual_mode, "'" + building.property_mgmt_company + "'",
					    "'" + building.prev_property_mgmt_company + "'", building.last_sale_price,
					    "'" + JSON.stringify(building.images) + "'", building.bachelor_price, building.bedroom1_price,
					    building.bedroom2_price, building.bedroom3_price, tryParseInt(building.bachelor_units),
					    tryParseInt(building.bedroom1_units), tryParseInt(building.bedroom2_units), tryParseInt(building.bedroom3_units),
					    building.building_income, building.building_income_manual_mode, building.has_elevator, building.last_elevator_upgrade_year,
					    building.last_boiler_upgrade_year,"'"+building.mortgage_company+"'","'" + toUTCDateTimeString(building.mortgage_due_date) + "'", building.parking_spots], function(err, responseBuilding) {

					processContacts(function() {
					    processNotes(function(){
						    res.json({
							success : true,
							building_id : building.building_id
						    });
					    });
					});
				    });
				});
		    }else{// new building!
			var tempAddressId = '@out' + Math.floor((Math.random() * 1000000) + 1);
			sails.controllers.database.credSproc('CreateAddress', [  "'" + building.street_number_begin + "'"
			                        				,"'" + building.street_number_end + "'"
			                        				, "'" + building.street_name + "'"
			                        				, "'" + building.postal_code + "'"
			                        				,"'" + building.city + "'"
			                        				,1 // Type
										    // Asset
			                        				, "'" + building.province + "'"
			                        				, lat
			                        				, lng
			                        				,tempAddressId],
			                        				function(err, responseAddress) {
			    if(err)
		    		    return res.json({error:'Database Error'+err},500);
			    
			    building.address_id = responseAddress[1][tempAddressId];
			    var tempBuildingId = '@out' + Math.floor((Math.random() * 1000000) + 1);
			    sails.controllers.database.credSproc('CreateBuilding', [ building.address_id,
			                 					    tryParseInt(building.building_type), tryParseInt(building.heat_system_age), tryParseInt(building.windows_installed_year),
			                 					   tryParseInt(building.elevator_installed_year), tryParseInt(building.boiler_installed_year), "'" + building.cable_internet_provider + "'",
			                					    "'" + building.assessed_value + "'", tryParseInt(building.heat_system_type), tryParseInt(building.unit_quantity),
			                					    "'" + toUTCDateTimeString(building.sale_date) + "'", tryParseFloat(building.unit_price), "'" + building.property_mgmt_company + "'",
			                					    "'" + building.prev_property_mgmt_company + "'", building.last_sale_price,
			                					    "'" + JSON.stringify(building.images) + "'", tryParseFloat(building.bachelor_price), tryParseFloat(building.bedroom1_price),
			                					    tryParseFloat(building.bedroom2_price), tryParseFloat(building.bedroom3_price), tryParseInt(building.bachelor_units),
			                					    tryParseInt(building.bedroom1_units), tryParseInt(building.bedroom2_units), tryParseInt(building.bedroom3_units),
			                					    tryParseFloat(building.building_income), building.has_elevator, building.last_elevator_upgrade_year,
			                					    building.last_boiler_upgrade_year, "'"+ building.mortgage_company+"'", "'" + toUTCDateTimeString(building.mortgage_due_date) + "'", tempBuildingId], function(err, responseBuilding) {
				building.building_id = responseBuilding[1][tempBuildingId];
					// sails.controllers.database.credSproc('CreateCompanyAddressMapping',[null,
					// ])
				processContacts(function(){
				    res.json({
					success : true,
					building_id : building.building_id
				    });
				});
			    });
			    
			});
			
		    }
	    });
	    function checkAndUpdateBuildingLastSale(buildingsale,cb){
		if(isNaN(parseInt(buildingsale.building_id))){
		    return console.log('invalid building id');
		}
		sails.controllers.database.credSproc('GetBuilding', [ buildingsale.building_id ], function(err, building) {

		    if (err) {
			res.json({
			    error : 'Database Error'
			}, 500);
		    } else if(typeof(building[0][0])=='undefined'){
			res.json({
			    error : 'Database Error'
			}, 500);
		    }else {
			building = building[0][0];
			if(new Date(buildingsale.sale_date)>=building.sale_date){
			    
			    sails.controllers.database.credSproc('UpdateBuildingLastSale', [ building.building_id, "'" + toUTCDateTimeString(buildingsale.sale_date) + "'"
			                                                                     , buildingsale.last_sale_price,], function(err, updatesale) {
				if(err)
				    return console.log('error'+err);
				cb();
			    });
			}else{
			    cb();
			}
			
		    }
		});
	    }
	    
	    
	}

	function processContacts(cb) { // inline process contacts // loops,
					// creates / deletes mappings
	    function loopContacts(i) {
		if (typeof (buildingcontacts[i].dodelete) != 'undefined') { // delete
		    sails.controllers.database.credSproc('DeletePropertyContactMapping', [ buildingcontacts[i].mapping_id ], function(err, responseMapping) {
			if (err)
			    res.json({
				error : 'Database Error:' + err
			    }, 500);
			i++;
			if (i < buildingcontacts.length) {
			    loopContacts(i);
			} else {
			    cb();
			}
		    });
		} else if (typeof (buildingcontacts[i].dosync) != 'undefined') {
		    sails.controllers.database.credSproc('CreatePropertyContactMapping', [ buildingcontacts[i].contact_id, buildingcontacts[i].company_id,
			    building.address_id, buildingcontacts[i].contact_type == 'owner' ? 1 : (buildingcontacts[i].contact_type == 'seller'?2:3), '@outId' ], function(err, responseMapping) {
			if (err)
			    res.json({
				error : 'Database Error:' + err
			    }, 500);
			i++;
			if (i < buildingcontacts.length) {
			    loopContacts(i);
			} else {
			    cb();
			}
		    });
		} else {
		    i++;
		    if (i < buildingcontacts.length) {
			loopContacts(i);
		    } else {
			cb();
		    }
		}
	    }
	    if (buildingcontacts.length > 0) {
		loopContacts(0);
	    } else {
		cb();
	    }
	}
	
	function processNotes(cb){
	    function loopNotes(i){
		if (buildingnotes[i].id.toString().indexOf('new')>-1) { // new
									// Note!
		    var tempOutNoteVar = '@out' + Math.floor((Math.random() * 1000000) + 1);
		    sails.controllers.database.credSproc('CreateNote', [ "'"+buildingnotes[i].note+"'", "'"+req.session.user.username+"'", 'NOW()',tempOutNoteVar], function(err, responseNote) {
			if (err)
			    return res.json({
				error : 'Database Error:' + err
			    }, 500);
			
			sails.controllers.database.credSproc('CreateNoteMapping',[building.address_id, responseNote[1][tempOutNoteVar], 3,'@outId'],function(err,responseNoteMapping){
			    if (err)
				return res.json({
					error : 'Database Error:' + err
				    }, 500);
			    
    				i++;
    				if (i < buildingnotes.length) {
    				    loopNotes(i);
    				} else {
    				    cb();
    				}
			});
			
		    });
		}else if (typeof (buildingnotes[i].deleted) != 'undefined') { // delete
		    sails.controllers.database.credSproc('DeleteNote', [ buildingnotes[i].id ], function(err, responseNote) {
			if (err)
			    return res.json({
				error : 'Database Error:' + err
			    }, 500);
			i++;
			if (i < buildingnotes.length) {
			    loopNotes(i);
			} else {
			    cb();
			}
		    });
		} else if (typeof (buildingnotes[i].modified) != 'undefined') {
		    sails.controllers.database.credSproc('UpdateNote', [ buildingnotes[i].id, "'"+buildingnotes[i].note+"'", "'"+buildingnotes[i].user+"'", 'NOW()' ], function(err, responseNote) {
			if (err)
			    return res.json({
				error : 'Database Error:' + err
			    }, 500);
			i++;
			if (i < buildingnotes.length) {
			    loopNotes(i);
			} else {
			    cb();
			}
		    });
		} else {
		    i++;
		    if (i < buildingnotes.length) {
			loopNotes(i);
		    } else {
			cb();
		    }
		}
	    }
	    if(buildingnotes.length>0){
		loopNotes(0);
	    }else{
		cb();
	    }
	    
	}
	
	function processReadOnlyNotes(cb){
	    function loopNotes(i){
		if (buildingnotes[i].id.toString().indexOf('new')>-1) { // new
									// Note!
		    var tempOutNoteVar = '@out' + Math.floor((Math.random() * 1000000) + 1);
		    sails.controllers.database.credSproc('CreateNote', [ "'"+buildingnotes[i].note+"'", "'"+req.session.user.username+"'", 'NOW()',tempOutNoteVar], function(err, responseNote) {
			if (err)
			    return res.json({
				error : 'Database Error:' + err
			    }, 500);
			
			sails.controllers.database.credSproc('CreateNoteMapping',[building.address_id, responseNote[1][tempOutNoteVar], 3,'@outId'],function(err,responseNoteMapping){
			    if (err)
				return res.json({
					error : 'Database Error:' + err
				    }, 500);
			    
    				i++;
    				if (i < buildingnotes.length) {
    				    loopNotes(i);
    				} else {
    				    cb();
    				}
			});
			
		    });
		}else if (typeof (buildingnotes[i].deleted) != 'undefined') { // delete

		    sails.controllers.database.credSproc('GetNote',[buildingnotes[i].id],function(err,resultMyNote){
			if(err)
			    return console.log('Note error');
			if(resultMyNote[0].length!=1){
			    return console.log('error verifying note');
			}
			if(resultMyNote[0][0].user==req.session.user.username){
			    sails.controllers.database.credSproc('DeleteNote', [ buildingnotes[i].id ], function(err, responseNote) {
				if (err)
				    return res.json({
					error : 'Database Error:' + err
				    }, 500);
				i++;
				if (i < buildingnotes.length) {
				    loopNotes(i);
				} else {
				    cb();
				}
			    });
			}else{
			    return console.log('Attempted hacking');
			}
		    });
		    
		} else if (typeof (buildingnotes[i].modified) != 'undefined') {
		    sails.controllers.database.credSproc('GetNote',[buildingnotes[i].id],function(err,resultMyNote){
			if(err)
			    return console.log('Note error');
			if(resultMyNote[0].length!=1){
			    return console.log('error verifying note');
			}
			if(resultMyNote[0][0].user==req.session.user.username){
        		    sails.controllers.database.credSproc('UpdateNote', [ buildingnotes[i].id, "'"+buildingnotes[i].note+"'", "'"+buildingnotes[i].user+"'", 'NOW()' ], function(err, responseNote) {
        			if (err)
        			    return res.json({
        				error : 'Database Error:' + err
        			    }, 500);
        			i++;
        			if (i < buildingnotes.length) {
        			    loopNotes(i);
        			} else {
        			    cb();
        			}
        		    });
			}
		    });
		} else {
		    i++;
		    if (i < buildingnotes.length) {
			loopNotes(i);
		    } else {
			cb();
		    }
		}
	    }
	    if(buildingnotes.length>0){
		loopNotes(0);
	    }else{
		cb();
	    }
	    
	}
    },
    export:function(req,res){
	req.query = req.body;
	req.query.length = 999999;
	req.query.start = 0;
	sails.controllers.buildings.querybuildings(req,res,function(results){
	    if(typeof(results[0])!='undefined'){
		results = results[0];
	    }
	    var bodystring = 'Address,Building Type,Property Management Company,Previous Property Management Company,Heat System,Heat System Installed Year,Boiler Installed Year,Last Boiler Upgrade Year'
		+',Cable Internet Provider,Elevator,Elevator Installed Year,Last Elevator Upgrade Year,Windows Installed Year,Parking Spots,Assessed Value,Mortgage Company,Mortgage Due Date,Bachelor Price,1 Bedroom Price,2 Bedroom Price,3 Bedroom Price'
		+',Bachelor Units,1 Bedroom Units,2 Bedroom Units,3 Bedroom Units,Total Units,Building Income,Average Unit Price,CAP Rate,Last Sale Date,Last Sale Price'
		+'\r\n';
	    for(var i=0;i<results.length;i++){

		bodystring+='"'+buildAddressString(results[i])+'"';
		bodystring+=','+ (results[i].building_type==null?'':results[i].building_type);
		bodystring+=',"'+ (results[i].property_mgmt_company==null?'':results[i].property_mgmt_company)+'"';
		bodystring+=',"'+ (results[i].prev_property_mgmt_company==null?'':results[i].prev_property_mgmt_company)+'"';
		bodystring+=',"'+ (results[i].heat_system==null?'':results[i].heat_system)+'"';
		bodystring+=','+ (results[i].heat_system_age==null?'':results[i].heat_system_age);
		bodystring+=','+ (results[i].boiler_installed_year==null?'':results[i].boiler_installed_year);
		bodystring+=','+ (results[i].last_boiler_upgrade_year==null?'':results[i].last_boiler_upgrade_year);
		bodystring+=',"'+ (results[i].cable_internet_provider==null?'':results[i].cable_internet_provider)+'"';
		bodystring+=','+ (results[i].has_elevator==null?'':results[i].has_elevator);
		bodystring+=','+ (results[i].elevator_installed_year==null?'':results[i].elevator_installed_year);
		bodystring+=','+ (results[i].last_elevator_upgrade_year==null?'':results[i].last_elevator_upgrade_year);
		bodystring+=','+ (results[i].windows_installed_year==null?'':results[i].windows_installed_year);
		bodystring+=','+ (results[i].parking_spots==null?'':results[i].parking_spots);
		bodystring+=','+ (results[i].assessed_value==null?'':results[i].assessed_value);
		bodystring+=',"'+ (results[i].mortgage_company==null?'':results[i].mortgage_company)+'"';
		var mortgagetime = results[i].mortgage_due_date;
		mortgagetime = new Date(mortgagetime.setMinutes(mortgagetime.getMinutes() -req.query.timezoneoffset));
		bodystring+=',"'+toUTCDateTimeString(mortgagetime);
		bodystring+=','+ (results[i].bachelor_price==null?'':results[i].bachelor_price);
		bodystring+=','+ (results[i].bedroom1_price==null?'':results[i].bedroom1_price);
		bodystring+=','+ (results[i].bedroom2_price==null?'':results[i].bedroom2_price);
		bodystring+=','+ (results[i].bedroom3_price==null?'':results[i].bedroom3_price);
		bodystring+=','+ (results[i].bachelor_units==null?'':results[i].bachelor_units);
		bodystring+=','+ (results[i].bedroom1_units==null?'':results[i].bedroom1_units);
		bodystring+=','+ (results[i].bedroom2_units==null?'':results[i].bedroom2_units);
		bodystring+=','+ (results[i].bedroom3_units==null?'':results[i].bedroom3_units);
		bodystring+=','+ (results[i].unit_quantity==null?'':results[i].unit_quantity);
		bodystring+=','+ (results[i].building_income==null?'':results[i].building_income);
		bodystring+=','+ (results[i].unit_price==null?'':results[i].unit_price);
		bodystring+=','+ (results[i].cap_rate==null?'':results[i].cap_rate);
		var timestamp = results[i].sale_date;
		timestamp = new Date(timestamp.setMinutes(timestamp.getMinutes() -req.query.timezoneoffset));
		bodystring+=','+toUTCDateTimeString(timestamp);
		bodystring+=','+ (results[i].last_sale_price==null?'':results[i].last_sale_price);
		bodystring+='\r\n';
	    }
	    
	    var AWS = require('aws-sdk'); 
	    AWS.config.update({ "accessKeyId": "AKIAJ7AKNL3ASNPN3IBA", "secretAccessKey": "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", "region": "us-west-2" });
	    

	    var s3 = new AWS.S3(); 

	     //s3.createBucket({Bucket: 'myBucket'}, function() {

	    var crypto = require("crypto");
	    var current_date = (new Date()).valueOf().toString();
	    var random = Math.random().toString();
	    var filename = crypto.createHash('sha1').update(current_date + random).digest('hex')+'.csv';
	    var params = {Bucket: 'credcsv', Key: filename, Body: bodystring};

	    s3.putObject(params, function(err, data) {
	    	if (err){       
	        	return console.log(err);  
	    	}
	        var params = {Bucket: 'credcsv', Key: filename};
	        s3.getSignedUrl('getObject', params, function (err, url) {
	             res.json({url:url});
	        }); 
	     });
	});
    },
    getajax : function(req, res) {
	sails.controllers.buildings.querybuildings(req,res,function(result){
	    res.json({
		draw : req.query.draw,
		recordsTotal : result[1][totalCount],
		recordsFiltered : result[1][filteredCount],
		data : result[0]
	    });
	});

    },
    querybuildings:function(req,res,cb){
	var address_search = null;
	if (typeof(req.query.address_search)!='undefined'&&req.query.address_search != '') {
	    address_search = req.query.address_search.trim().split(" ");
	    adr = req.query.address_search.trim().split(" ");
	    address_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    address_search=address_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    address_search = "'"+address_search.trim()+"'";
	}
	var contact_search = null;
	if (typeof(req.query.contact_search)!='undefined'&&req.query.contact_search != '') {
	    contact_search = req.query.contact_search.trim().split(" ");
	    adr = req.query.contact_search.trim().split(" ");
	    contact_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    contact_search=contact_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    contact_search = "'"+contact_search.trim()+"'";
	}

	var company_search = null;
	if (typeof(req.query.company_search)!='undefined'&&req.query.company_search != '') {
	    company_search = req.query.company_search.trim().split(" ");
	    adr = req.query.company_search.trim().split(" ");
	    company_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    company_search=company_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    company_search = "'"+company_search.trim()+"'";
	}

	var mortgage_search = null;
	if (typeof(req.query.mortgage_search)!='undefined'&&req.query.mortgage_search != '') {
	    mortgage_search = req.query.mortgage_search.trim().split(" ");
	    adr = req.query.mortgage_search.trim().split(" ");
	    mortgage_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    mortgage_search=mortgage_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    mortgage_search = "'"+mortgage_search.trim()+"'";
	}

	
	
	var orderstring = null;
	if(typeof(req.query.order)!='undefined'){
        	if(req.query.order[0].column==1){  //Address column
        	    orderstring = 'street_number_begin';
        	}else if(req.query.order[0].column==5){
        	    orderstring = 'sale_date';
        	}else{
        	    orderstring = req.query.columns[req.query.order[0].column].data;
        	}
        	orderstring = "'"+orderstring+'_'+req.query.order[0].dir+"'";
	}
	totalCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	sails.controllers.database.credSproc('GetBuildings', [ contact_search, address_search, company_search, mortgage_search,
		(req.query.unitQuantityMin == ''||req.query.unitQuantityMin==null) ? null : parseInt(req.query.unitQuantityMin),
		(req.query.unitQuantityMax == ''||req.query.unitQuantityMax==null) ? null : parseInt(req.query.unitQuantityMax),
		(typeof(req.query.unit_price_min)=='undefined'||req.query.unit_price_min == ''||req.query.unit_price_min==null) ? null : parseInt(req.query.unit_price_min),
		(typeof(req.query.unit_price_max)=='undefined'||req.query.unit_price_max == ''||req.query.unit_price_max==null) ? null : parseInt(req.query.unit_price_max),
		(req.query.saleDateRangeStart == ''||req.query.saleDateRangeStart == null) ? null : "'"+toUTCDateTimeString(req.query.saleDateRangeStart)+"'",
		(req.query.saleDateRangeEnd == ''||req.query.saleDateRangeEnd == null) ? null : "'"+toUTCDateTimeString(req.query.saleDateRangeEnd)+"'",
					
		req.query.boundsLatitudeMin == ''?null:req.query.boundsLatitudeMin,
		req.query.boundsLatitudeMax == ''?null:req.query.boundsLatitudeMax,
		req.query.boundsLongitudeMin == ''?null:req.query.boundsLongitudeMin,
		req.query.boundsLongitudeMax == ''?null:req.query.boundsLongitudeMax,
		
		req.query.has_elevator == ''?null:req.query.has_elevator,
		req.query.elevator_installed_year_min == ''?null:req.query.elevator_installed_year_min,
		req.query.elevator_installed_year_max == ''?null:req.query.elevator_installed_year_max,
		req.query.elevator_upgrade_year_min == ''?null:req.query.elevator_upgrade_year_min,
		req.query.elevator_upgrade_year_max == ''?null:req.query.elevator_upgrade_year_max,	
		

		req.query.cap_rate_min == ''?null:req.query.cap_rate_min,	
		req.query.cap_rate_max == ''?null:req.query.cap_rate_max,	
			
		req.query.search_property_mgmt_company == ''?null:"'"+req.query.search_property_mgmt_company,
		req.query.search_prev_property_mgmt_company == ''?null:"'"+req.query.search_prev_property_mgmt_company,	
			
		req.query.heat_age_min == ''?null:req.query.heat_age_min,		
		req.query.heat_age_max == ''?null:req.query.heat_age_max,	
			
		req.query.boiler_installed_year_min == ''?null:req.query.boiler_installed_year_min,		
		req.query.boiler_installed_year_max == ''?null:req.query.boiler_installed_year_max,	
			
		req.query.boiler_upgrade_min == ''?null:req.query.boiler_upgrade_min,		
		req.query.boiler_upgrade_max == ''?null:req.query.boiler_upgrade_max,	
			
		req.query.assessed_value_min == ''?null:req.query.assessed_value_min,		
		req.query.assessed_value_max == ''?null:req.query.assessed_value_max,
			
		req.query.building_income_min == ''?null:req.query.building_income_min,	
		req.query.building_income_max == ''?null:req.query.building_income_max,	
			
		req.query.sale_price_min == ''?null:req.query.sale_price_min,		
		req.query.sale_price_max == ''?null:req.query.sale_price_max,	
			
		req.query.bachelor_units_min == ''?null:req.query.bachelor_units_min,		
		req.query.bachelor_units_max == ''?null:req.query.bachelor_units_max,
		req.query.bedroom1_units_min == ''?null:req.query.bedroom1_units_min,		
		req.query.bedroom1_units_max == ''?null:req.query.bedroom1_units_max,	
		req.query.bedroom2_units_min == ''?null:req.query.bedroom2_units_min,		
		req.query.bedroom2_units_max == ''?null:req.query.bedroom2_units_max,
		req.query.bedroom3_units_min == ''?null:req.query.bedroom3_units_min,		
		req.query.bedroom3_units_max == ''?null:req.query.bedroom3_units_max,

		req.query.bachelor_rent_min == ''?null:req.query.bachelor_rent_min,		
		req.query.bachelor_rent_max == ''?null:req.query.bachelor_rent_max,
		req.query.bedroom1_rent_min == ''?null:req.query.bedroom1_rent_min,		
		req.query.bedroom1_rent_max == ''?null:req.query.bedroom1_rent_max,	
		req.query.bedroom2_rent_min == ''?null:req.query.bedroom2_rent_min,		
		req.query.bedroom2_rent_max == ''?null:req.query.bedroom2_rent_max,
		req.query.bedroom3_rent_min == ''?null:req.query.bedroom3_rent_min,		
		req.query.bedroom3_rent_max == ''?null:req.query.bedroom3_rent_max,
				
		req.query.windows_installed_year_min == ''?null:req.query.windows_installed_year_min,		
		req.query.windows_installed_year_max == ''?null:req.query.windows_installed_year_max,
			
		req.query.cable_internet_provider == ''?null:req.query.cable_internet_provider,	
			
			
		(typeof(req.query.start_mortgage_due_date)=='undefined'||req.query.start_mortgage_due_date == '')?null:"'"+req.query.start_mortgage_due_date+"'",	
		(typeof(req.query.end_mortgage_due_date)=='undefined'||req.query.end_mortgage_due_date == '')?null:"'"+req.query.end_mortgage_due_date+"'",	
			
		req.query.sales_count_min == ''?null:req.query.sales_count_min,
		req.query.sales_count_max == ''?null:req.query.sales_count_max,
		
		req.query.checkbox_building_types == ''?null:req.query.checkbox_building_types,
		req.query.checkbox_heating_types == ''?null:req.query.checkbox_heating_types,
		req.query.parking_spots_min == ''?null:req.query.parking_spots_min,
		req.query.parking_spots_max == ''?null:req.query.parking_spots_max,
		req.query.start, req.query.length, orderstring, filteredCount, totalCount ], function(err, result) { // GetBuildings
	    if (err) {
		return res.json({
		    error : 'Database Error'+err
		}, 500);
	    } else {
		cb(result);
	    }
	});
    },
    getbuilding : function(req, res) {

	sails.controllers.database.credSproc('GetBuilding', [ req.param('id') ], function(err, building) {

	    // sails.controllers.database.credSproc('GetBuildingContacts', [
	    // req.param('id') ], function(err, buildingcontacts) {
	    if (err) {
		res.json({
		    error : 'Database Error'
		}, 500);
	    } else if(typeof(building[0][0])=='undefined'){
		res.json({
		    error : 'Database Error'
		}, 500);
	    }else {
		if (typeof (req.body.sale_id) != 'undefined' && !isNaN(parseInt(req.body.sale_id))) {
		    sails.controllers.database.credSproc('GetSale', [ parseInt(req.body.sale_id) ], function(err, responseSale) {
			if (err || responseSale[0].length < 1)
			    return res.json({
				error : 'Database error:' + err
			    }, 500);

			for ( var element in responseSale[0][0]) {
			    // console.log(element.toString());
			    if (element != 'id' && typeof (building[0][0]) != 'undefined'&&typeof (building[0][0][element]) != 'undefined') {
				if(element == 'building_income'){
					building[0][0][element] = parseFloat(responseSale[0][0][element]);
				}else{
					building[0][0][element] = responseSale[0][0][element];
				}
			    }
			}
			building[0][0].sale_id = parseInt(req.body.sale_id);
			res.json(building[0][0]);
		    });

		} else {
		    building[0][0]['building_income'] = parseFloat(building[0][0]['building_income']);
		    res.json(building[0][0]);
		}
	    }
	});

    },
    getcontacts : function(req, res) {
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    if (typeof (req.body.sale_id) != 'undefined' && !isNaN(parseInt(req.body.sale_id))) {
		sails.controllers.database.credSproc('GetBuildingSaleContacts', [ parseInt(req.params.id), parseInt(req.body.sale_id) ], function(err,
			buildingContacts) {
		    if (err)
			return res.json({
			    error : 'Database Error:' + err
			}, 500);
		    return res.json(buildingContacts);
		});
	    } else {
		sails.controllers.database.credSproc('GetBuildingContacts', [ parseInt(req.params.id) ], function(err, buildingContacts) {
		    if (err)
			return res.json({
			    error : 'Database Error:' + err
			}, 500);
		    return res.json(buildingContacts);
		});
	    }
	}
    },
    getsales : function(req, res) {
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.credSproc('GetBuildingSales', [ parseInt(req.params.id) ], function(err, buildingSales) {
		if (err)
		    return res.json({
			error : 'Database Error:' + err
		    }, 500);
		return res.json(buildingSales);
	    });
	}
    }

};

function tryParseInt(input) {

    return isNaN(parseInt(input)) ? null : parseInt(input);
}

function tryParseFloat(input) {

    return isNaN(parseFloat(input)) ? null : parseFloat(input);
}

function toUTCDateTimeString(date){
    if(date==null){
	date = new Date();
    }else if(typeof(date)!=='object'){
	date = new Date(date);
	//date = new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()));
    }
    
    return date.getUTCFullYear()+'-'+padLeft((date.getUTCMonth()+1).toString(),2)+'-'+ padLeft(date.getUTCDate(),2) + ' ' + padLeft(date.getUTCHours(),2)+':'+padLeft(date.getUTCMinutes(),2)+':'+padLeft(date.getUTCSeconds(),2);
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}


function buildAddressString(data){
	var street_number_begin = '';
	var street_number_end = '';
	var street_name = '';
	var city = '';
	var province = '';
	var postal_code = '';
	
	if(data.street_number_begin!=null){
		street_number_begin = data.street_number_begin;
	}
	if(data.street_number_end!=null&&data.street_number_end!=''){
		street_number_end = data.street_number_end==null||data.street_number_end=='null'?'':' - '+data.street_number_end;
	}
	if(data.street_name!=null&&data.street_name!='')
	{
		street_name= data.street_name==null||data.street_name=='null'?'':','+data.street_name;
	}
	if(data.city != null && data.city != '')
	{
		city = data.city==null||data.city=='null'?'':','+data.city;
	}
	if(data.province != null && data.province != '')
	{
		province = data.province==null||data.province=='null'?'':','+data.province;
	}
	if(data.postal_code != null && data.postal_code != '')
	{
		postal_code =  data.postal_code==null||data.postal_code=='null'?'':','+data.postal_code; 
	}
	return street_number_begin+street_number_end+street_name+city+province+postal_code; 

}
  
