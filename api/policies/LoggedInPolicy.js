module.exports = function(req,res,next) {
  if (req.session.user) {
    next();
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
