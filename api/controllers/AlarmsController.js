/*---------------------
	:: Alarms 
	-> controller
	Provides alarms utility functions

---------------------*/
var ALARMS_ROOM = '/alarms';
var ALARMS_ROOM_CLIENT = 'alarms';
    
var AlarmsController = {
  // Called by users connecting to the dashboard the first time
  getAlarms : function(req,res) {
    sails.controllers.database.sp("BHS_ALARMS_GetAlarms", [], function(err,
        curAlarms) {
      if (err) {
        res.json({
          error : "DB Error"
        });
        return;
      }
      res.json(curAlarms);
    });
  },
  // OPEN ACCESS function -
  // called from equipment status manager - triggering pushes to everyone subscribed to alarms.
  pushAlarms : function(req,res) {
    Database.dataSproc("BHS_ALARMS_GetAlarms", [], function(err, curAlarms) {
	    if (err) {
		res.json({
		    error : "DB Error"
		});
		return;
	    }
	    if (typeof (sails.io.rooms['/alarms']) == 'undefined' || sails.io.rooms['/alarms'].length <= 0) {
		res.json('none updated');
		return;
	    }
	    sails.io.sockets.emit('alarms', curAlarms[0]);
	    res.json('success');
	});
  },
  // joins clients to the alarms room.
  joinAlarms : function(req,res) {
    req.socket.join(ALARMS_ROOM_CLIENT);
    res.json(true);
  }

};
module.exports = AlarmsController;