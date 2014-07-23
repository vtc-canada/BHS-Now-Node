module.exports = function(req,res,next) {
  if (req.session.user) {
      var path = req.route.path;
      sails.controllers.database.localSproc("AuthorizeResourcePolicy", [ req.session.user.id,"'"+path+"'"], function(err,policy) {
	  if(err){
	      res.json(500,{error:'Database Error'});
	  }else if(policy.length==1){
	      req.session.user.policy[path] = policy[0];
	      next();
	  }else{
	      res.json(500,{error:'Policy Missing!@'+req.session.user.id+':'+path});
	  }
      });
  } else {
    if (typeof (req.route) == 'undefined') {
      res.json({
        error : "Session not found"
      }, 403);
    } else {
      res.view('main/loginpage', {
        locale : req.locale,
        layout : false,
        errormessage : 'You are not logged into the system. Please log in.'
      });
    }
  }
};
