/**
 * Created with JetBrains WebStorm. User: user Date: 11/28/13 Time: 1:37 PM To
 * change this template use File | Settings | File Templates.
 */

setInterval(function(){
    sails.controllers.dashboard.getBHSOverviewData(function(data) {
	if (sails.io.rooms['/DashboardBHSOverview'] !== undefined) {
	    sails.io.sockets.emit('DashboardBHSOverview', data);
	}
    });   
},5000);