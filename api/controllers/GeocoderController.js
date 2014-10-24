/**
 * GeocoderController
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

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js` (specific to
     * GeocoderController)
     */
    _config : {},
    nullorder:function(req,res){
	sails.controllers.database.credQuery('UPDATE cur_buildings set order NULL', function(err, resposne) {
	    if (err)
		    return res.json({
			    error : 'error blanking' + err
		    });
		
	});
    },
    updatemaporder : function(req, res) {
	var closest = parseInt(req.param('id'));
	var ordered = null;
	var coords = null;
	var countupdated = 0;
	var orderindex = 0;
	var geolib = require('geolib');
	    
	sails.controllers.database.credQuery('SELECT cur_address.id, latitude, longitude, maporder FROM cur_buildings INNER JOIN cur_address ON cur_address.id = cur_buildings.cur_address_id WHERE latitude IS NOT NULL AND maporder IS NOT NULL', function(err, paramOrdered) {
		if (err)
		    return res.json({
			error : 'error getting coords' + err
		    });
		ordered = paramOrdered;
		for(var i=0;i<ordered.length;i++){
		    if(ordered[i].maporder>orderindex){
			orderindex = ordered[i].maporder;
		    }
		}
		sails.controllers.database.credQuery('SELECT cur_address.id, latitude, longitude, maporder FROM cur_buildings INNER JOIN cur_address ON cur_address.id = cur_buildings.cur_address_id WHERE latitude IS NOT NULL AND maporder IS NULL', function(err, paramCoords) {
		    if (err)
			return res.json({
			    error : 'error getting coords' + err
			});
		    coords = paramCoords;
		    
		    function loopCoords(i){
			var clearopen = true;
			for(var j=0;j<ordered.length;j++){
			    
			    var distance = geolib.getDistance(
				    {latitude: ordered[j].latitude, longitude: ordered[j].longitude}, 
				    {latitude: coords[i].latitude, longitude: coords[i].longitude}
				);
			    if(distance<closest){
				clearopen = false;
				break;
			    }
			}
			if(clearopen){
			    orderindex++;
			    ordered.push({id:coords[i].id,latitude:coords[i].latitude,longitude:coords[i].longitude,order:orderindex});
			    updateOrder(coords[i].id,orderindex,function(err){
				if(err){
				    return res.json('err'+err);
				}
				i++;
				if(i<coords.length){
				    loopCoords(i);
				}else{
				    console.log('done '+countupdated);
				    return res.json('done '+countupdated);
				}
			    });
			}else{
			    i++;
				if(i<coords.length){
				    loopCoords(i);
				}else{
				    console.log('done '+countupdated);
				    return res.json('done '+countupdated);
				}
			}
		    }
		    if(coords.length>0){
			loopCoords(0);
		    }else{
			console.log('no coords');
			    return res.json('done '+countupdated);
		    }
		});


	});
	
	function updateOrder(id,order,cb){
	    sails.controllers.database.credQuery('UPDATE cur_address SET maporder = '+order+' WHERE id = '+id,function(err,response){
		if(err){
		    console.log('err'+err);
		    cb(err);
		}
		countupdated++;
		cb(null);
	    })
	}

    },
    updatecaprate : function(req, res) {
	sails.controllers.database.credQuery('SELECT id, building_income, last_sale_price FROM cur_buildings', function(err, buildings) {
	    if (err)
		return res.json({
		    error : 'error selecting' + err
		});

	    for (var i = 0; i < buildings.length; i++) {
		if (buildings[i].building_income != null) {
		    console.log(buildings[i].building_income);
		}
		console.log(buildings[i].id);
	    }
	});
    },
    clearzeros : function(req, res) {
	sails.controllers.database.credQuery('UPDATE cur_address SET latitude = NULL, longitude = NULL WHERE latitude = 0', function(err, results) {
	    if (err) {
		res.json(err.toString());
	    }
	    res.json(results);
	});
    },
    batch : function(req, res) {
	// sails
	var count = 50;
	if (typeof (req.params.id) != 'undefined') {
	    count = parseInt(req.params.id);
	}
	var geocoderProvider = 'google';
	var httpAdapter = 'http';
	// optionnal
	var extra = {
	    // apiKey: 'YOUR_API_KEY', // for map quest
	    formatter : null
	// 'gpx', 'string', ...
	};

	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

	// Using callback
	// geocoder.geocode('29 champs elysée paris', function(err, res) {
	// console.log(res);
	// });

	sails.controllers.database.credQuery(
		'SELECT * FROM cur_address WHERE street_name IS NOT NULL AND  postal_code IS NOT NULL AND latitude IS NULL ORDER BY id',
		function(err, results) {
		    if (err)
			return res.json({
			    error : 'Database Error:' + err
			});
		    function doLoop(i) {
			var address = results[i];
			if (typeof (address) == 'undefined') {
			    return res.json({
				success : 'Ran out of null addresses on index:' + i
			    });
			}
			var street_number_end = (address.street_number_end == null || address.street_number_end == 0) ? '' : ' ' + address.street_number_end;
			var addressSearch = address.street_number_begin + " " + street_number_end + " " + address.street_name + ', ' + address.city + ', '
				+ address.province + ', Canada, ' + address.postal_code;

			geocoder.geocode(addressSearch, function(err, resgeo) {
			    if (err) {

				if (err.toString() == 'Error: Status is ZERO_RESULTS.') {
				    console.log('zero results');
				} else {
				    return res.json({
					error : 'error geocoding' + err
				    });
				}
			    }
			    console.log(resgeo);
			    if (typeof (resgeo) != 'undefined' && resgeo.length > 0) {
				sails.controllers.database.credQuery('UPDATE cur_address SET latitude = ' + resgeo[0].latitude + ', longitude = '
					+ resgeo[0].longitude + ' WHERE id = ' + results[i].id, function(err, add) {
				    // console.log(add);

				    i++;
				    if (i > count) {
					return res.json({
					    success : 'success'
					});
				    }
				    setTimeout(function() {
					doLoop(i);
				    }, 300);
				});
			    } else {
				sails.controllers.database.credQuery('UPDATE cur_address SET latitude = ' + 0 + ', longitude = ' + 0 + ' WHERE id = '
					+ results[i].id, function(err, add) {
				    // console.log(add);

				    i++;
				    if (i > count) {
					return res.json({
					    success : 'success'
					});
				    }
				    setTimeout(function() {
					doLoop(i);
				    }, 300);
				});
			    }
			});

		    }
		    doLoop(0);

		});

	/*
	 * var address = { street_number_begin:25,street_number_end :1406,
	 * street_name:'Westmount Road North',city:'Waterloo',postal_code:'N2L
	 * 5G7'}; var addressSearch = address.street_number_begin +
	 * address.street_number_end == null ? '' : ' ' +
	 * address.street_number_end + " " + address.street_name + ', ' +
	 * address.city + ', Ontario, Canada, ' + address.postal_code;
	 * 
	 * geocoder.geocode(addressSearch, function(err, res) {
	 * console.log(res); });
	 */

    },
    batchmore : function(req, res) {
	// sails
	var count = 50;
	if (typeof (req.params.id) != 'undefined') {
	    count = parseInt(req.params.id);
	}
	var geocoderProvider = 'google';
	var httpAdapter = 'http';
	// optionnal
	var extra = {
	    // apiKey: 'YOUR_API_KEY', // for map quest
	    formatter : null
	// 'gpx', 'string', ...
	};

	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

	// Using callback
	// geocoder.geocode('29 champs elysée paris', function(err, res) {
	// console.log(res);
	// });

	sails.controllers.database.credQuery('SELECT * FROM cur_address WHERE street_name IS NOT NULL AND city IS NOT NULL AND latitude IS NULL ORDER BY id',
		function(err, results) {
		    if (err)
			return res.json({
			    error : 'Database Error:' + err
			});
		    function doLoop(i) {
			var address = results[i];
			if (typeof (address) == 'undefined') {
			    return res.json({
				success : 'Ran out of null addresses on index:' + i
			    });
			}
			var street_number_end = (address.street_number_end == null || address.street_number_end == 0) ? '' : ' ' + address.street_number_end;
			var addressSearch = address.street_number_begin + " " + street_number_end + " " + address.street_name + ', ' + address.city + ', '
				+ address.province + ', Canada, ' + address.postal_code;

			geocoder.geocode(addressSearch, function(err, resgeo) {
			    if (err) {
				if (err.toString() == 'Error: Status is ZERO_RESULTS.') {
				    console.log('zero results');
				} else {
				    return res.json({
					error : 'error geocoding' + err
				    });
				}
			    }
			    console.log(resgeo);
			    if (typeof (resgeo) != 'undefined' && resgeo.length > 0) {
				sails.controllers.database.credQuery('UPDATE cur_address SET latitude = ' + resgeo[0].latitude + ', longitude = '
					+ resgeo[0].longitude + ' WHERE id = ' + results[i].id, function(err, add) {
				    // console.log(add);

				    i++;
				    if (i > count) {
					return res.json({
					    success : 'success'
					});
				    }
				    setTimeout(function() {
					doLoop(i);
				    }, 300);
				});
			    } else {
				sails.controllers.database.credQuery('UPDATE cur_address SET latitude = ' + 0 + ', longitude = ' + 0 + ' WHERE id = '
					+ results[i].id, function(err, add) {
				    // console.log(add);

				    i++;
				    if (i > count) {
					return res.json({
					    success : 'success'
					});
				    }
				    setTimeout(function() {
					doLoop(i);
				    }, 300);
				});
			    }
			});

		    }
		    doLoop(0);

		});

	/*
	 * var address = { street_number_begin:25,street_number_end :1406,
	 * street_name:'Westmount Road North',city:'Waterloo',postal_code:'N2L
	 * 5G7'}; var addressSearch = address.street_number_begin +
	 * address.street_number_end == null ? '' : ' ' +
	 * address.street_number_end + " " + address.street_name + ', ' +
	 * address.city + ', Ontario, Canada, ' + address.postal_code;
	 * 
	 * geocoder.geocode(addressSearch, function(err, res) {
	 * console.log(res); });
	 */

    },
    batchblockpostal : function(req, res) {
	// sails
	var count = 50;
	if (typeof (req.params.id) != 'undefined') {
	    count = parseInt(req.params.id);
	}
	var geocoderProvider = 'google';
	var httpAdapter = 'http';
	// optionnal
	var extra = {
	    // apiKey: 'YOUR_API_KEY', // for map quest
	    formatter : null
	// 'gpx', 'string', ...
	};

	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

	// Using callback
	// geocoder.geocode('29 champs elysée paris', function(err, res) {
	// console.log(res);
	// });

	sails.controllers.database.credQuery('SELECT * FROM cur_address WHERE street_name IS NOT NULL AND city IS NOT NULL AND latitude IS NULL ORDER BY id',
		function(err, results) {
		    if (err)
			return res.json({
			    error : 'Database Error:' + err
			});
		    function doLoop(i) {
			var address = results[i];
			if (typeof (address) == 'undefined') {
			    return res.json({
				success : 'Ran out of null addresses on index:' + i
			    });
			}
			var street_number_end = (address.street_number_end == null || address.street_number_end == 0) ? '' : ' ' + address.street_number_end;
			var addressSearch = address.street_number_begin + " " + street_number_end + " " + address.street_name + ', ' + address.city + ', '
				+ address.province + ', Canada';

			geocoder.geocode(addressSearch, function(err, resgeo) {
			    if (err) {
				if (err.toString() == 'Error: Status is ZERO_RESULTS.') {
				    console.log('zero results');
				} else {
				    return res.json({
					error : 'error geocoding' + err
				    });
				}
			    }
			    console.log(resgeo);
			    if (typeof (resgeo) != 'undefined' && resgeo.length > 0) {
				sails.controllers.database.credQuery('UPDATE cur_address SET latitude = ' + resgeo[0].latitude + ', longitude = '
					+ resgeo[0].longitude + ' WHERE id = ' + results[i].id, function(err, add) {
				    // console.log(add);

				    i++;
				    if (i > count) {
					return res.json({
					    success : 'success'
					});
				    }
				    setTimeout(function() {
					doLoop(i);
				    }, 300);
				});
			    } else {
				sails.controllers.database.credQuery('UPDATE cur_address SET latitude = ' + 0 + ', longitude = ' + 0 + ' WHERE id = '
					+ results[i].id, function(err, add) {
				    // console.log(add);

				    i++;
				    if (i > count) {
					return res.json({
					    success : 'success'
					});
				    }
				    setTimeout(function() {
					doLoop(i);
				    }, 300);
				});
			    }
			});

		    }
		    doLoop(0);

		});

	/*
	 * var address = { street_number_begin:25,street_number_end :1406,
	 * street_name:'Westmount Road North',city:'Waterloo',postal_code:'N2L
	 * 5G7'}; var addressSearch = address.street_number_begin +
	 * address.street_number_end == null ? '' : ' ' +
	 * address.street_number_end + " " + address.street_name + ', ' +
	 * address.city + ', Ontario, Canada, ' + address.postal_code;
	 * 
	 * geocoder.geocode(addressSearch, function(err, res) {
	 * console.log(res); });
	 */

    }

};
