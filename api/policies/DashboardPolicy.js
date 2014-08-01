module.exports = function(req,res,next) {
  if (req.session.user) {
      var path = "'"+req.route.path+"'";
      sails.controllers.database.localSproc("AuthorizeResourcePolicy", [ req.session.user.id,path], function(err,policy) {
	  if(err){
	      res.json(500,{error:'Database Error'});
	  }else{
	      req.session.user.policy[path] = policy[0][0];
	      next();
	  }
      });
  } else {
    // res.send("You Must Be Logged In", 403);
    res.view('main/loginpage', {
      locale : req.locale,
      layout : false,
      errormessage : 'You are not logged into the system. Please log in.'
    });
  }
};
