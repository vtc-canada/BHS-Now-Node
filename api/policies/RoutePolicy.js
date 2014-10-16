module.exports = function(req,res,next) {
    function authorizeResourcePolicy(){
	var path = req.route.path;
	Database.localSproc("AuthorizeResourcePolicy", [ req.session.user.id, path], function(err,policy) {
            if(err){
                return failResponse();
            //}else if(!policy[0]||typeof(policy[0][0])=='undefined'){ // We're
    								    // MISSING a
    								    // policy!!
                //return autoGenRoute();
            }else if(policy[0]&&policy[0].length==1&&typeof(policy[0][0].create)!='undefined'&&policy[0][0].create!=null){
                req.session.user.policy[path] = policy[0][0];
                if(!req.session.user.active||(policy[0][0].create== 0&&policy[0][0].read == 0&&policy[0][0].update== 0&&policy[0][0].delete== 0)){
                    res.json(500,{error:'Invalid Access!@'+req.session.user.id+':'+path});
                    return;
                }
                next();
            }else{
        	console.log('Policy Missing!@'+req.session.user.id+':'+path);
        	return autoGenRoute();
                //res.json(500,{error:'Policy Missing!@'+req.session.user.id+':'+path});
            }
	});
    }
    
    function autoGenRoute(){
	sails.controllers.security.createRoute(req,function(err,result){
	    if(err){
		console.log('Failed creating Route'+err);
		return failResponse();
	    }
	    authorizeResourcePolicy(); // try again!
	});
    }
    
    function failResponse(){
	 if (typeof (req.route) == 'undefined') {
             res.json({
                 error : "Session not found"
             }, 403);
         } else {
             req.flash('errormessage','You are not logged into the system. Please log in.');
             res.writeHead(302,{
         	'Location':'/auth'
             });
             res.end();
             
             //res.view('auth/loginpage', {
             //    layout : false,
             //    errormessage : ''
             //});
         }
    }
    
    if (req.session.user) {
	Database.localSproc('getUser',[req.session.user.id],function(err,user){
	    if(err){
                console.log("Database Error."+err);
		return failResponse();
	    }
	    if(!(user[0]&&user[0][0]&&user[0][0].active==1)){ // if cant find user or user inactive.
		return failResponse();
	    }
	    authorizeResourcePolicy();
	});
    } else {
	return failResponse();
    }
};
