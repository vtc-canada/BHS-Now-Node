module.exports = function(req,res,next) {
  if (req.session.user) {
    if (req.session.user.admin != 1) {

      if (typeof (req.route) == 'undefined') { // socket response -
        res.json({
          error : "You must be admin or manager"
        }, 403);
      } else {
        var urltemp = req.url;
        if (urltemp.indexOf('/') === 0) {
          urltemp = urltemp.substring(1);
        }
        res.view('dashboard', {
          locale : req.session.user.locale,
          url : 'dashboard',
          id : req.session.user.id,
          username : req.session.user.username,
          errormessage : 'You do not have sufficient privileges to access',
          errorurl : urltemp
        });
      }
    } else {
      next();
    }
  } else {
    if (typeof (req.route) == 'undefined') { // socket response -
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
