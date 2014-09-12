module.exports = function(req,res,next) {
    if (req.session.user) {
        var path = req.route.path;
        sails.controllers.database.localSproc("AuthorizeResourcePolicy", [ req.session.user.id,"'"+path+"'"], function(err,policy) {
            if(err){
                res.json(500,{error:'Database Error'});
            }else if(policy[0]&&policy[0].length==1&&typeof(policy[0][0].create)!='undefined'&&policy[0][0].create!=null){
                req.session.user.policy[path] = policy[0][0];
                if(policy[0][0].create== 0&&policy[0][0].read == 0&&policy[0][0].update== 0&&policy[0][0].delete== 0){
                    res.json(500,{error:'Invalid Access!@'+req.session.user.id+':'+path});
                    return;
                }
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
