/**
 * OverviewController
 *
 * @description :: Server-side logic for managing overviews
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	if (!req.session.user) {
	    return res.json({
		error : "Log in"
	    });
	}
	Database.dataSproc('BHS_UTIL_GetRefStatusDef',[],function(err,result){
	    if(err){
		console.log('err'+err);
		return res.json({error:'Error:'+err},500);
	    }
	    res.view({alarm_legend:result[0]});
	});
    },
    joinroom : function(req, res) {
	req.socket.join('overview');
    }
};
