/**
 * Security Service.
 * This service is to provide security utilities and methods.
 * Accessed by controllers via  
 * Security.resourceAccess(x,y,z)
 */


module.exports = {
    
    resourceAccess : function(req,page,requestAccess){
	    var policy = {create:0,read:0,update:0,delete:0};
	    if(typeof(req.session.user.policy[page])!='undefined'){
		policy = req.session.user.policy[page]; 
	    }else if(typeof(req.session.user.policy[page+'/:id?'])!='undefined'){
		policy = req.session.user.policy[page+'/:id?']; 
	    }
	    return (policy.create>=requestAccess.create&&policy.read>=requestAccess.read&&policy.update>=requestAccess.update&&policy.delete>=requestAccess.delete);
	}
}