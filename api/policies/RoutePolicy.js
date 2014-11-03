module.exports = function(req,res,next) {
    function authorizeResourcePolicy(){
	var path = req.route.path;
	Database.localSproc("AuthorizeResourcePolicy", [ req.session.user.id, path], function(err,policy) {
            if(err){
                return failResponse();
            //}else if(!policy[0]||typeof(policy[0][0])=='undefined'){ // We're
    								    // MISSING a
    								    // policy!!
                // return autoGenRoute();
            if(policies[0]){
        	policies = policies[0];
            	delete req.session.user.policy;
            	req.session.user.policy = {};
            	for(var i =0;i<policies.length;i++){
            	    req.session.user.policy[policies[i].name]=policies[i];
            	}
            	if(req.session.user.policy[path].create==0&&req.session.user.policy[path].read==0&&req.session.user.policy[path].update==0&&req.session.user.policy[path].delete==0){
            	    req.flash('errormessage','Invalid Access');
                        req.flash('errordebug','UserId:'+req.session.user.id+' @Path:'+path);
                        res.json(403,{error:'Invalid Access! UserId:'+req.session.user.id+' @Path:'+path});
                        return;
            	}
                next();
            }else{
        	console.log('Policy Missing!@'+req.session.user.id+':'+path);
        	if(sails.config.environment=='development'){//}&&req.session.user.username==sails.config.autogenerate.user.username){
            		return autoGenRoute();
        	}
        	failResponse();//res.json(500,{error:'Policy Missing!@'+req.session.user.id+':'+path});
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
             try{
                 res.writeHead(302,{
              	'Location':'/auth'
                  });
                 req.flash('errormessage','You are not logged into the system. Please log in.');
                 res.end();
             }
             catch(err){
        	 console.log('Error sending fail Response.'+err);
                 res.json({error:'Invalid Access!@'},403);
//                 res.json({
//                     error : "Session not found"
//                 }, 403);
             }
             
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