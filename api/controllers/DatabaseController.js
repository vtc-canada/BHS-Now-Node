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


var localPool = mysql.createPool({
    connectionLimit : 1000,
    user : 'root', //paadmin
    password : 'Glasgow931', //.SampsonMews8
    database : 'bhs_dummy', //now_management_base
    host : 'localhost' //pa-cred-database.c1midzvqwdqm.us-west-2.rds.amazonaws.com
});

var credPool = mysql.createPool({
    connectionLimit : 1000, 
    user : 'root',//paadmin',
    password : 'Glasgow931',//.SampsonMews8',
    database : 'cred',
    host : '10.1.1.60'//pa-cred-database.c1midzvqwdqm.us-west-2.rds.amazonaws.com'//10.1.1.60'//10.1.1.60'
});

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js` (specific to
     * DatabaseController)
     */
    _config : {},
    localQuery : function(query, cb) {
	console.log(query);
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
		console.log("call " + sprocName + sprocArgs);
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

	console.log(query);
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
		console.log("call " + sprocName + sprocArgs);
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
	if (data[curArg] == null||data[curArg]=="'null'") {
	    sprocArgs += "NULL";
	} else {
	    if(typeof(data[curArg])=='string'&&data[curArg].substring(0, 1) != '@'&&data[curArg]!='NOW()'&&data[curArg]!='true'&&data[curArg]!='false'){  //puts very necessary quotes around strings  
		sprocArgs += '"'+replaceAll(replaceAll(data[curArg],'\\','\\\\'),'"','\\"')+'"';
	    }else{
		sprocArgs += data[curArg].toString();
	    }
	}
    }
    return sprocArgs;
};

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}