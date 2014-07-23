/**
 * DatabaseController
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

var mysql = require('mysql2');
var connection = mysql.createConnection({
    user : 'root',
    password : 'Glasgow931',
    database : 'bhs_scada',
    host : 'localhost'
});
var localConnection = mysql.createConnection({
    user : 'root',
    password : 'Glasgow931',
    database : 'bhs_dummy',
    host : 'localhost'
});

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js` (specific to
     * DatabaseController)
     */
    _config : {},
    localSproc : function(sprocName,data,cb){
	if (sails.config.adapters['default'] != "mssql") {

	    var sprocArgs = "(";
	    sprocArgs += BuildSproc(data);
	    sprocArgs += ");";
	    localConnection.query("call " + sprocName + sprocArgs, function(err, results) {
		if (results != undefined && results[0] != undefined) {
		    results = results[0];
		}
		cb(err, results || []);
	    });
	} else if (sails.config.adapters['default'] == "mssql") {
	    var sprocArgs = " ";
	    sprocArgs += BuildSproc(data);
	    sails.adapters["sails-mssql"].query("users", sprocName + sprocArgs, function(err, results) {
		cb(err, results);
	    });
	}
    },
    sp : function(sprocName, data, cb) {

	if (sails.config.adapters['default'] != "mssql") {

	    var sprocArgs = "(";
	    sprocArgs += BuildSproc(data);
	    sprocArgs += ");";
	    connection.query("call " + sprocName + sprocArgs, function(err, results) {
		if (results != undefined && results[0] != undefined) {
		    results = results[0];
		}
		cb(err, results || []);
	    });
	} else if (sails.config.adapters['default'] == "mssql") {
	    var sprocArgs = " ";
	    sprocArgs += BuildSproc(data);
	    sails.adapters["sails-mssql"].query("users", sprocName + sprocArgs, function(err, results) {
		cb(err, results);
	    });
	}
    }

};

// This is a shared function that builds the sproc parameters
// based on the parameters that will are passed in
function BuildSproc(data) {
    var sprocArgs = "";

    for (var curArg = 0; curArg < data.length; curArg++) {
	if (curArg > 0) {
	    sprocArgs += ",";
	}
	if (data[curArg] == null) {
	    sprocArgs += "NULL";
	} else {
	    sprocArgs += data[curArg].toString();
	}
    }
    return sprocArgs;
};