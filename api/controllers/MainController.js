/**
 * MainController
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
     * MainController)
     */
    _config : {},
    
    // Function for joining basic rooms
    // joins you to a room named after your own ID
    // this room is used to broadcast direct messages from user to user
    joinrooms : function(req,res) {
      //req.socket.join(req.session.user.id);
      //req.socket.join('reference_time');
      //req.socket.join('read_' + req.session.user.id);
      //req.socket.join('flighttableupdate');
      //res.json({
      //  id : req.session.user.id
      //});
    },
    index : function(req, res) {
	if (req.session.user) {
	    res.view('dashboard/index', {
		locale : req.session.user.locale,
		title : 'Dashboard',
		url : 'dashboard',
		username : req.session.user.username,
		id : req.session.user.id
	    });
	} else {

	    Users.find().limit(1).done(function(err, users) {
		if (err) {
		    return;
		}
		if (users.length == 0) {
		    var hasher = require("password-hash");
		    password = hasher.generate('asdf');
		    Users.create({
			username : 'admin',
			password : password,
			admin : 1,
			manager : 0,
			operator : 0,
			viewonly : 0,
			locale : 'en'
		    }).done(function(error, user) {
			if (error) {
			    console.log(error.toString());
			    res.send(500, {
				error : "DB Error"
			    });
			}
		    });
		}

	    });

	    res.view('main/loginpage', {
		locale : req.locale,
		layout : false
	    });

	}
    },
    // Logs in
    // First checks if it can log in via LDAP
    // Otherwise, failsover to loggin in through the database
    login : function(req, res) {
	var username = req.param("username");
	var password = req.param("password");

	if (typeof (username) == 'undefined' || typeof (password) == 'undefined') {
	    res.json({
		error : 'username and password not posted'
	    });
	    return false;
	}

	console.log("Requiring LDAPJS");
	var ldap = require('ldapjs');
	console.log("Loaded Ldapjs");

	var client = ldap.createClient({
	    url : 'ldap://192.168.1.180:389',
	    connectTimeout : 1000
	});
	console.log("Ldapjs client created");

	client.bind(username, password, function(err, resource) {
	    if (err) {
		console.log("Falling back to default login");
		Users.find({
		    username : username
		}).done(function(err, usr) {
		    if (err) {
			console.log("Database Error. Sending 500");
			res.send(500, {
			    error : "DB Error"
			});
		    } else {
			if (usr.length == 1) {
			    usr = usr[0];
			    console.log("requing password-hash");
			    var hasher = require("password-hash");
			    console.log("Loaded password-hash");
			    if (hasher.verify(password, usr.password)) {
				req.session.user = usr;
				req.session.user.policy = {};
				res.send(usr);
			    } else {
				res.send(400, {
				    error : "Wrong Password"
				});
			    }
			} else {
			    res.send(404, {
				error : "User not Found"
			    });
			}
		    }
		});
	    } else {
		console.log("Mirroring LDAPJS client locally");
		Users.find({
		    username : username
		}).done(function(err, usr) {
		    if (err) {
			res.send(500, {
			    error : "DB Error"
			});
		    } else {
			if (usr) {
			    var hasher = require("password-hash");
			    if (hasher.verify(password, usr.password)) {
				req.session.user = usr;
				req.session.user.policy = {};
				res.send(usr);
			    } else { // Overwrite Password
				password = hasher.generate(password);
				Users.update({
				    username : username
				}, {
				    password : password
				}, function(err) { // corrects OUR password!
				    req.session.user = usr;
					req.session.user.policy = {};
				    res.send(usr);
				});
			    }
			} else {
			    var hasher = require("password-hash");
			    password = hasher.generate(password);
			    Users.create({
				username : username,
				password : password,
				locale : 'en'
			    }).done(function(error, user) {
				if (error) {
				    res.send(500, {
					error : "DB Error"
				    });
				} else {
				    if (sails.io.rooms['/sails_c_create_users'] !== undefined) {
					for (var i = 0; i < sails.io.rooms['/sails_c_create_users'].length; i++) {
					    sails.io.sockets.sockets[sails.io.rooms['/sails_c_create_users'][i]].emit('message', {
						model : 'users',
						verb : 'create',
						data : {
						    id : user.id,
						    username : user.username,
						    admin : user.admin,
						    manager : user.manager,
						    operator : user.operator,
						    viewonly : user.viewonly,
						    lastonline : user.lastonline
						}
					    });
					    sails.io.sockets.sockets[sails.io.rooms['/sails_c_create_users'][i]].join('sails_c_users_' + user.id);
					}
				    }
				    req.session.user = user;
				    req.session.user.policy = {};
				    res.send(user);
				}
			    });
			}
		    }
		});
	    }
	});
    },

    // To Logout
    // Destroy chatboxes from sessoin
    // kills user object
    logout : function(req, res) {
	delete req.session.user;
	delete req.session.boxes;
	res.redirect('/auth');
    }

};
