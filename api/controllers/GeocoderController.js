/**
 * GeocoderController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to GeocoderController)
     */
    _config : {},

    updateBuildings : function(req, res) {
	//sails
	var geocoderProvider = 'google';
	var httpAdapter = 'http';
	// optionnal
	var extra = {
	    //apiKey: 'YOUR_API_KEY', // for map quest
	    formatter : null
	// 'gpx', 'string', ...
	};

	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

	// Using callback
	//geocoder.geocode('29 champs elys�e paris', function(err, res) {
	//    console.log(res);
	//});
	
	sails.controllers.database.credQuery('SELECT * FROM cur_address',function(err,results){
	    if(err)
		return res.json({error:'Database Error:'+err});
	    for(var i=0;i<5;i++){
		var address = results[i];
		var street_number_end =(address.street_number_end == null ||address.street_number_end==0)?'':' '+address.street_number_end;
		var addressSearch = address.street_number_begin + " " + street_number_end + " " + address.street_name
			+ ', ' + address.city + ', Ontario, Canada, ' + address.postal_code;

		geocoder.geocode(addressSearch, function(err, res) {
		    console.log(res);
		    if(typeof(res)!='undefined'&&res.length>0){
			sails.controllers.database.credQuery('UPDATE cur_address SET lat = '+res[0].latitude+', lng = '+res[0].longitude+ ' WHERE id = '+results[i].id,function(err,add){
			    console.log(add);
			});
		    }
		});
	    }
	});
	
	/*var address = { street_number_begin:25,street_number_end :1406, street_name:'Westmount Road North',city:'Waterloo',postal_code:'N2L 5G7'};
	var addressSearch = address.street_number_begin + address.street_number_end == null ? '' : ' ' + address.street_number_end + " " + address.street_name
		+ ', ' + address.city + ', Ontario, Canada, ' + address.postal_code;

	geocoder.geocode(addressSearch, function(err, res) {
	    console.log(res);
	});*/

    }

};
