/**
 * AuthController
 * 
 * @description :: Server-side logic for managing auths
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	if (req.session&&req.session.user) {
            res.writeHead(302,{
        	'Location':'/dashboard'
            });
            res.end();
            return;
        }
	res.view('auth/loginpage', {
	    layout : false
	});
    },
    logout:function(req,res){
	delete req.session.user;
	res.redirect('/auth');
    },
    joinrooms:function(req,res){
	req.socket.join('onlinestatus');
	req.socket.join(req.session.user.id);
    },
    togglelocale:function(req,res){
	var found = false;
	var next=false;   
	for(var i=0;i<sails.config.i18n.locales.length;i++){
	    if(next){
		req.session.user.locale = sails.config.i18n.locales[i];
		found = true;
		break;
	    }
	    if(sails.config.i18n.locales[i]==req.session.user.locale){
		next=true;
	    }
	}
	if(!found){ // get the first one
	    for(var i=0;i<sails.config.i18n.locales.length;i++){
		req.session.user.locale = sails.config.i18n.locales[i];
		break;
	    }
	}
	Database.localSproc('NMS_BASE_UpdateUser',[req.session.user.id, null, req.session.user.email, req.session.user.active, req.session.user.loginattempts, req.session.user.locale],function(err,response){
	    res.send(req.session.user);
	});
    },
    login : function(req, res) {

	var username = req.param("username");
	var password = req.param("password");

	if (typeof (username) == 'undefined' || typeof (password) == 'undefined') {
	    res.json({
		error : req.__('username and password not posted')
	    });
	    return false;
	}

	Database.localSproc('NMS_BASE_GetUserByUsername', [ username ], function(err, user) {
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
			error : req.__("Locked")
		    });
		    return 
		}
		var hasher = require("password-hash");
		if (hasher.verify(password, foundUser.password)) { // here
		    //Database.localSproc("AuthorizeResourcePolicy", [ foundUser.id, "default" ], function(err, policy) {
			//if (err) {
			//    console.log('Database Error' + err);
			//    res.json(500, {
			//	error : 'Database Error' + err
			//    });
			//} else if (policy[0] && policy[0][0]) { // }.length==1&&typeof(policy[0][0].create)!='undefined'&&policy[0][0].create!=null){
			//    if(typeof(policy[0][0].create)!='undefined'&&policy[0][0].create!=null){

				req.session.user = foundUser;
				req.session.user.policy = {};
				//req.session.user.policy['default'] = policy[0][0];
				Database.localSproc('NMS_BASE_UpdateUserActiveLoginAttempts', [ foundUser.id, 1, 0 ], function(err, result) {
				    if (err)
					console.log('Unable to update User Login Attempts');
				});
				res.send(foundUser);
			    //}else{
			//	res.json({error:'This account does not have access privileges'});
			    //}
			//}
		    //});
		} else {// increment login count

		    if (foundUser.loginattempts == null) {
			foundUser.loginattempts = 1;
		    } else {
			foundUser.loginattempts++;
		    }
		    if (foundUser.loginattempts >= 6) {
			foundUser.active = 0;
		    }
		    Database.localSproc('NMS_BASE_UpdateUserActiveLoginAttempts', [ foundUser.id, foundUser.active, foundUser.loginattempts ], function(err, user) {
			if (err) {
			    return console.log('error' + err);
			}
			return

		    });
		    res.send(400, {
			error : req.__("Wrong Password")
		    });
		}
	    } else {
		res.send(404, {
		    error : req.__("User not Found")
		});
	    }
	});
    },
    checkandchangemypassword : function(req,res) {
	var username = req.session.user.username;
	var currentpassword = req.param('currentpassword');
	var newpassword = req.param('newpassword');
	
	if (typeof (username) == 'undefined' || typeof (currentpassword) == 'undefined' ||typeof (newpassword) == 'undefined') {
	    res.json({
		error : 'Missing Parameters!'
	    },500);
	    return false;
	}

	Database.localSproc('NMS_BASE_GetUserByUsername', [ username ], function(err, user) {
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
		if (hasher.verify(currentpassword, foundUser.password)) { // here
		    Database.localSproc('NMS_BASE_UpdateUser',[foundUser.id,hasher.generate(newpassword),foundUser.email,foundUser.active,foundUser.loginattempts,foundUser.locale],function(err,user){
			if (err) {
			    console.log('Error updateUser :' + err.toString());
			    return res.send(500, {
				error : "updateUser Error:" + err.toString()
			    });
			}
			res.json({success:true});
		    });
		}else {
                    res.json({failure : "Wrong Password"});
                }
	    }
	});
    }
};
