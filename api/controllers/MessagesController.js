/**
 * MessagesController
 * 
 * @description :: Server-side logic for managing messages
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	res.view();
    },
    findDistinct : function(req, res) {
	Database.localSproc('getDistinctMessages',[req.session.user.id],function(err,data) {
	    if (err) {
		console.log('Error getDistinctMessages :' + err.toString());
		return res.send(500, {
		    error : "DB Error:" + err.toString()
		});
	    }
	    res.json(data[0]);
	          //TODO- shift here for local hosting
	          //for(var i=0;i<data[0].length;i++){
	    	  	//data[0][i].createdAt = new Date(data[0][i].createdAt.setMinutes(data[0][i].createdAt.getMinutes() - data[0][i].createdAt.getTimezoneOffset()));
	          //}	    
	});
    },
    findUserMessages:function(req,res){
	Database.localSproc('getMessagesByUserId',[req.session.user.id,req.param('otherUserId')],function(err,messages){
	    if (err) {
		console.log('Error getMessagesByUserId :' + err.toString());
		return res.send(500, {
		    error : "DB Error:" + err.toString()
		});
	    }
	    res.json(messages[0]);	    
	});
	
    }
};
