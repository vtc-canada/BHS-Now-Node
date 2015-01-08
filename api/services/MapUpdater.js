/*
 * The Maporder updates once a month.
 * 
 * 
 */


console.log('Starting Mapupdater Service');

setInterval(function(){
    sails.controllers.geocoder.nullorder();
    setTimeout(function(){
	var req = {};
	req.params = {};
	req.params.id = 13378083245431;
	sails.controllers.geocoder.updatemaporder(req);
    },10000);
}, 2147483647 );  //25 Days