/**
 * EngineeringController
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
    index : function(req, res) {
	res.view();
    },
    getHOA : function(req, res) {
	Database.dataSproc('BHS_UTIL_GetHOA', [], function(err, responseHOA) {
	    if (err)
		return res.json({
		    error : 'Database Error:' + err
		});

	    res.json(responseHOA[0]);
	});

    },
    joinHOA : function(req, res) {
	req.socket.join('hoa');
	res.json(true);
    },
    pushHOA : function(req, res) {
	Database.dataSproc('BHS_UTIL_GetHOA', [], function(err, responseHOA) {
	    if (err)
		return res.json({
		    error : 'Database Error:' + err
		});
	    if (typeof (sails.io.rooms['/hoa']) == 'undefined' || sails.io.rooms['hoa'].length <= 0) {
		res.json('none updated');
		return;
	    }
	    sails.io.sockets.emit('hoa', responseHOA[0]);
	    res.json('success');
	});
    },
    sendhoaclick : function(req, res) {
	var net = require('net');
	var connection = net.connect(sails.config.connections.ECMConn.Port, sails.config.connections.ECMConn.Host);// , function() {
	connection.on('error', function(err) {
	    console.log("ECM Client Connection failed." + err.toString());
	});
	connection.on('data', function(data) {
	});
	var writeMessage = {
	    source : 'BHSMS',
	    destination : 'ECM',
	    message : 'setHOA',
	    tag : JSON.stringify(req.body)
	};
	//writeMessage = {source:'RCM',destination:'ECM',message:'pushPLCReset'};

	connection.write(JSON.stringify(writeMessage), function(err) {
	    if (err) {
		console.log("ECM Client Write failed." + err.toString());
		return;
	    }
	    connection.end();
	    res.json({
		success : "Resent Sequence Sent"
	    });
	});

    },
    resetregisters : function(req, res) {

	var net = require('net');
	var connection = net.connect(sails.config.ECMConn.Port, sails.config.ECMConn.Host);// , function() {
	connection.on('error', function(err) {
	    console.log("ECM Client Connection failed." + err.toString());
	});
	connection.on('data', function(data) {
	});
	var writeMessage = {
	    source : 'BHSMS',
	    destination : 'ECM',
	    message : 'resetregisters'
	};
	//writeMessage = {source:'RCM',destination:'ECM',message:'pushPLCReset'};

	connection.write(JSON.stringify(writeMessage), function(err) {
	    if (err) {
		console.log("ECM Client Write failed." + err.toString());
		return;
	    }
	    connection.end();

	    Database.dataSproc('BHS_UTIL_UpdateLastResetTime', [], function(err, response) {

	    });

	    res.json({
		success : "Resent Sequence Sent"
	    });
	});
    }
};
