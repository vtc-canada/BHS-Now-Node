/*
 * The Maporder updates once a month.
 * 
 * 
 */

setInterval(function(){
    sails.controllers.geocoder.nullorder();
    setTimeout(function(){
	var req = {};
	req.params = {};
	req.params.id = 13378083245431;
	sails.controllers.geocoder.updatemaporder(req);
    },10000);
}, 30*24*60*60*1000 );