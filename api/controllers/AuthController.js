/**
 * AuthController
 * 
 * @description :: Server-side logic for managing auths
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	res.view('auth/loginpage', {
	    layout : false
	});
    },
    logout:function(req,res){
	delete req.session.user;
	res.redirect('/auth');
    },
    login : function(req, res) {

	var username = req.param("username");
	var password = req.param("password");

	if (typeof (username) == 'undefined' || typeof (password) == 'undefined') {
	    res.json({
		error : 'username and password not posted'
	    });
	    return false;
	}

	Database.localSproc('getUserByUsername', [ username ], function(err, user) {
	    if (err) {
		console.log('Error getUserByUsername :' + err.toString());
		return res.send(500, {
		    error : "DB Error:" + err.toString()
		});
	    }
	    if (user[0] && user[0][0]) {
		var foundUser = user[0][0];
		if (!foundUser.active) {
		    res.send(400, {
			error : "Locked"
		    });
		    return 
		}
		var hasher = require("password-hash");
		if (hasher.verify(password, foundUser.password)) { // here
		    req.session.user = foundUser;
		    req.session.user.policy = {};
		    Database.localSproc("AuthorizeResourcePolicy", [ req.session.user.id, "default" ], function(err, policy) {
			if (err) {
			    console.log('Database Error' + err);
			    res.json(500, {
				error : 'Database Error' + err
			    });
			} else if (policy[0] && policy[0][0]) { // }.length==1&&typeof(policy[0][0].create)!='undefined'&&policy[0][0].create!=null){
			    req.session.user.policy['default'] = policy[0][0];
			    Database.localSproc('updateUserActiveLoginAttempts', [ foundUser.id, 1, 0 ], function(err, result) {
				if (err)
				    console.log('Unable to update User Login Attempts');
			    });
			    res.send(foundUser);
			}
		    });
		} else {// increment login count

		    if (foundUser.loginattempts == null) {
			foundUser.loginattempts = 1;
		    } else {
			foundUser.loginattempts++;
		    }
		    if (foundUser.loginattempts >= 6) {
			foundUser.active = 0;
		    }
		    Database.localSproc('updateUserActiveLoginAttempts', [ foundUser.id, foundUser.active, foundUser.loginattempts ], function(err, user) {
			if (err) {
			    return console.log('error' + err);
			}
			return

		    });
		    res.send(400, {
			error : "Wrong Password"
		    });
		}
	    } else {
		res.send(404, {
		    error : "User not Found"
		});
	    }
	});
    }
};
