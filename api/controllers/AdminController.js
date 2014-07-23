/**
 * AdminController
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
     * AdminController)
     */
    _config : {},

    // Attempts to change users password.
    // broadcasts successful change to the appropriate User subscribed sockets
    checkandchangemypassword : function(req, res) {
	var username = req.session.user.username;
	var currentpassword = req.param('currentpassword');
	var newpassword = req.param('newpassword');

	Users.find({
	    username : username
	}).done(function(err, usr) {
	    if (err) {
		res.json({
		    error : "DB Error"
		});
	    } else {
		if (usr.length == 1) {
		    usr = usr[0];
		    var hasher = require("password-hash");
		    if (hasher.verify(currentpassword, usr.password)) {
			newpassword = hasher.generate(newpassword);
			Users.update({
			    id : req.session.user.id
			}, {
			    password : newpassword
			}, function(err) {
			    Users.findOne(req.session.user.id).done(function(err, user) {
				if (err)
				    return;
				if (typeof (user) == 'undefined') {
				    res.json({
					error : 'User no longer exists'
				    });
				    return;
				}
				res.json({
				    success : 'Updated the password'
				});
			    });
			});
		    } else {
			res.json({
			    failure : "Wrong Password"
			});
		    }
		} else {
		    res.send({
			error : "User not Found"
		    });
		}
	    }
	});
    },
    // This Creates a user - first does checks to make sure there is no user
    // with
    // the same username
    // on success, broadcasts to listening clients of the new user's creation
    adduser : function(req, res) {
	var username = req.param("username");
	var password = req.param("password");

	if (typeof (username) == 'undefined' || typeof (password) == 'undefined') {
	    res.json({
		error : 'Post parameters missing.'
	    });
	}

	Users.find({
	    username : username
	}).done(function(err, usr) {
	    if (err) {
		res.send(500, {
		    error : "DB Error"
		});
	    } else if (usr.length > 0) {
		res.send(400, {
		    error : "Username already Taken"
		});
	    } else {
		Users.create({
		    username : username,
		    password : password
		}).done(function(error, user) {
		    if (error) {
			res.json(500, {
			    error : "DB Error"
			});
		    } else {
			res.json(user);
		    }
		});
	    }
	});
    },
    // just checks to see if a username is available
    checkusername : function(req, res) {
	if (typeof (req.param) == 'undefined' || typeof (req.param('username')) == 'undefined') {
	    res.json({
		error : 'Invalid username passed in'
	    });
	    return;
	}
	Users.find({
	    username : req.param('username')
	}).done(function(err, usr) {
	    if (err) {
		res.json({
		    error : "DB Error"
		});
	    } else if (usr.length > 0) {
		res.json({
		    taken : "Username already Taken"
		});
	    } else {
		res.json({
		    success : "Username available"
		});
	    }
	});
    },
    // displays the users page
    users : function(req, res) {
	if (req.session.user.policy[req.route.path].read) { //if we had read access
	    res.view({});
	}else{
	    res.json(401, {
		    error : "Unauthorized."
		});
	}
    },
    // generates the hash when changing a users password
    createhash : function(req, res) {
	if (typeof (req.param) == 'undefined' || typeof (req.param('password')) == 'undefined') {
	    res.json({
		error : 'Unable to get user/password to update password'
	    });
	    return;
	}
	var hasher = require("password-hash");
	var password = hasher.generate(req.param('password'));
	res.json({
	    hash : password
	});
    },
    // changes the password - also broadcasts the change to listening user
    // subscribers
    updatepassword : function(req, res) {

	if (typeof (req.param) == 'undefined' || typeof (req.param('updateid')) == 'undefined' || typeof (req.param('password')) == 'undefined') {
	    res.json({
		error : 'Unable to get user/password to update password'
	    });
	    return;
	}
	Users.update({
	    id : req.param('updateid')
	}, {
	    password : req.param('password')
	}, function(err) {
	    if (sails.io.rooms['/sails_c_create_users'] == undefined) {
		return;
	    }
	    Users.findOne(req.param('updateid')).done(function(err, user) {
		if (err)
		    return;

		if (typeof (user) == 'undefined') {
		    res.json({
			error : 'User no longer exists'
		    });
		    return;
		}
		if (user.length == 1) {
		    user = user[0];
		}
		res.json({
		    success : 'Updated the password'
		});
	    });

	});
    }

};
