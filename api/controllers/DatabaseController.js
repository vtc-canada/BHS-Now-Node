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



var localPool = mysql.createPool({
    connectionLimit : 10,
    user : 'root',
    password : 'Glasgow931',
    database : 'bhs_dummy',
    host : 'localhost'
});

var credPool = mysql.createPool({
    connectionLimit : 10,
    user : 'root',
    password : 'Glasgow931',
    database : 'cred',
    host : 'localhost'//10.1.1.60'
});

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js` (specific to
     * DatabaseController)
     */
    _config : {},
    localQuery : function(query, cb) {
	localPool.getConnection(function(err, connection) {
	    if (err) {
		cb(err);
	    } else {
		connection.query(query, function(err, results) {
		    connection.release();
		    cb(err, results);
		});
	    }
	});
    },
    localSproc: function(sprocName, data, cb) {
	var sprocArgs = "(";
	sprocArgs += BuildSproc(data);
	sprocArgs += ");";
	localPool.getConnection(function(err, connection) {
	    if (err) {
		cb(err);
	    } else {
		connection.query("call " + sprocName + sprocArgs, function(err, results) {
		    if (err) {
			cb(err);
		    } else {
			if (typeof (results) != 'undefined'&&typeof(results.serverStatus)!='undefined') {
			    results = [[],results];// corrects controversial responses
			}
			function loop(i) {
			    if (data[i] != null && data[i].length > 0 && data[i].substring(0, 1) == '@') {
				connection.query('SELECT ' + data[i], function(outerr, outresult) {
				    if (outerr) {
					console.log('broke out of parameters early:' + outerr);

					connection.release();
					cb(err, results);
				    } else {

					results[1][data[i]] = outresult[0][data[i]];



					i++;
					if (i < data.length) {
					    loop(i);
					} else {
					    connection.release();
					    cb(err, results);
					}
				    }
				});
			    } else {
				i++;
				if (i < data.length) {
				    loop(i);
				} else {
				    connection.release();
				    cb(err, results);
				}
			    }
			}
			if (!err && data.length > 0) {
			    loop(0);
			} else {
			    connection.release();
			    cb(err, results);
			}
		    }
		});
	    }

	});
    },
    credQuery : function(query, cb) {
	credPool.getConnection(function(err, connection) {
	    if (err) {
		cb(err);
	    } else {
		connection.query(query, function(err, results) {
		    connection.release();
		    cb(err, results);
		});
	    }
	});
    },
    credSproc : function(sprocName, data, cb) {
	var sprocArgs = "(";
	sprocArgs += BuildSproc(data);
	sprocArgs += ");";
	credPool.getConnection(function(err, connection) {
	    if (err) {
		cb(err);
	    } else {
		connection.query("call " + sprocName + sprocArgs, function(err, results) {
		    if (err) {
			cb(err);
		    } else {
			function loop(i) {
			    if (data[i] != null && data[i].length > 0 && data[i].substring(0, 1) == '@') {
				connection.query('SELECT ' + data[i], function(outerr, outresult) {
				    if (outerr) {
					console.log('broke out of parameters early:' + outerr);

					connection.release();
					cb(err, results);
				    } else {
					if (typeof (results) == 'undefined') {
					    console.log('undefined results[1]');

					}
					results[1][data[i]] = outresult[0][data[i]];
					i++;
					if (i < data.length) {
					    loop(i);
					} else {
					    connection.release();
					    cb(err, results);
					}
				    }
				});
			    } else {
				i++;
				if (i < data.length) {
				    loop(i);
				} else {
				    connection.release();
				    cb(err, results);
				}
			    }
			}
			if (!err && data.length > 0) {
			    loop(0);
			} else {
			    connection.release();
			    cb(err, results);
			}
		    }
		});
	    }

	});

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