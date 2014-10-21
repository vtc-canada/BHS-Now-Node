/**
 * ChatController
 * 
 * @description :: Server-side logic for managing chats
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    saveopenboxes : function(req, res) {
	req.session.user.boxes = req.param('list');
	req.session.save();
    },
    // loads your active chatboxes - just after you load a new page
    getactivechatboxes : function(req, res) {
	if (req.session.user.boxes !== undefined) {
	    res.json(req.session.user.boxes);
	} else {
	    res.json([]);
	}
    },
    getunreadmessages : function(req, res) {
	Database.localSproc('getUnreadUserMessages', [ req.session.user.id ], function(err, unreadmessages) {
	    if (err) {
		console.log('Error getUnreadUserMessages :' + err.toString());
		return res.send(500, {
		    error : "DB Error:" + err.toString()
		});
	    }
	    res.json(unreadmessages[0]);
	});
    },
    seenmessage:function(req,res){
	Database.localSproc('updateSeenUserMessages',[req.session.user.id,req.param('fromUserId')],function(err,seen){
	    if (err) {
		console.log('Error getUnreadUserMessages :' + err.toString());
		return res.send(500, {
		    error : "DB Error:" + err.toString()
		});
	    }
	    var message = seen[0][0];
	    sails.io.sockets.emit(req.param('fromUserId'), {
		seen : {
		    toUserId : req.session.user.id
		}
	    });
	    sails.io.sockets.emit(req.session.user.id, {
		seen : {
		    fromUserId : req.param('fromUserId')
		}
	    });
	    res.json({success:'success'});
	});
    },
    sendmessage : function(req, res) {
	if (typeof (req.param('toUserId')) != 'undefined') {
	    var outMessageId = '@out' + Math.floor((Math.random() * 1000000) + 1);
	    Database.localSproc('createMessage', [ req.session.user.id, req.param('toUserId'), req.param('message'), null, 0, outMessageId ], function(err,
		    newmessage) {
		if (err) {
		    console.log('Error createMessage :' + err.toString());
		    return res.send(500, {
			error : "DB Error:" + err.toString()
		    });
		}
		Database.localSproc('getMessage', [ newmessage[1][outMessageId] ], function(err, messages) {
		    if (err) {
			console.log('Error createMessage :' + err.toString());
			return res.send(500, {
			    error : "DB Error:" + err.toString()
			});
		    }
		    if (messages[0][0]) {
			var message = messages[0][0];
			sails.io.sockets.emit(message.fromUserId, {
			    message : message
			});
			sails.io.sockets.emit(message.toUserId, {
			    message : message
			});
		    }
		});
	    });
	}
	return res.json({
	    failure : 'no user found'
	});
    },
    // loads older messages before a certain message ID
    loadpreviousmessagesPriorId : function(req, res) {
	Database.localSproc('getMessagesPriorId', [ req.param('priorID'), req.param('boxId'), req.session.user.id ], function(err, messages) {
	    if (err) {
		console.log('Error getting Prior messages:' + err);
		return res.send(500, {
		    error : "Error getting Prior messages:" + err.toString()
		});
	    }
	    res.json(messages[0]);
	});
    }
};
