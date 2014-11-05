/**
 * DashboardController
 * 
 * @description :: Server-side logic for managing dashboards
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	res.view();
    },
    getAlarms : function(req, res) {
	Database.dataSproc("BHS_ALARMS_GetAlarms", [], function(err, curAlarms) {
	    if (err) {
		res.json({
		    error : "DB Error"
		});
		return;
	    }
	    res.json(curAlarms[0]);
	});
    },
    // OPEN ACCESS function -
    // called from equipment status manager - triggering pushes to everyone subscribed to alarms.
    pushAlarms : function(req, res) {
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
    joinAlarms : function(req, res) {
	req.socket.join('alarms');
	res.json(true);
    },
    joinDashboardBHSOverview : function(req, res) {
	req.socket.join('DashboardBHSOverview');
	res.json(true);
    },
 // Initial Get for the BHS data.
    getBHSOverview : function(req, res) {
	sails.controllers.dashboard.getBHSOverviewData(function(data){
	    res.json(data);
	});
    },
    getBHSOverviewData : function(cb) {
	Database.dataSproc('BHS_UTIL_GetJamRate', [], function(err, response) {
	    if (err)
		return console.log(err.toString());
	    var jamrate = parseFloat(response[0][0].jam_rate).toFixed(2);

	    Database.dataSproc('BHS_UTIL_GetTrackingRate', [], function(err, response) {
		if (err)
		    return console.log(err.toString());
		var trackingrate = parseFloat(100 - response[0][0].tracking_rate).toFixed(2);
		Database.dataSproc('BHS_UTIL_GetSystemThroughput', [], function(err, response) {
		    if (err)
			return console.log(err.toString());

		    var bagrate = 0;
		    if(response[0].length==1){
			bagrate = response[0][0].system_throughput;
		    }
		    Database.dataSproc('BHS_UTIL_GetTimeInSystem', [], function(err, response) {
			if (err)
			    return console.log(err.toString());

			var timeInSystem = response[0][0].time;

			Database.dataSproc('BHS_UTIL_GetThroughput', [], function(err, throughput) {
			    if (err)
				return console.log(err.toString());

			    Database.dataSproc('BHS_UTIL_GetTotalSortedBags', [], function(err, sortedbags) {
				if (err)
				    return console.log(err.toString());

				var bhsStruct = {
				    'ticketcounters' : [ {
					'id' : 1,
					'name' : 'TC1',
					'values' : [ throughput[0][0].value ],
					'threshold' : 80
				    }, {
					'id' : 2,
					'name' : 'TC2',
					'values' : [ throughput[0][1].value ],
					'threshold' : 80
				    }, {
					'id' : 3,
					'name' : 'CS1',
					'values' : [ throughput[0][2].value ],
					'threshold' : 80
				    } ],
				    'edsmachines' : [ {
					'id' : 1,
					'name' : 'EDS-01',
					'throughput' : throughput[0][5].value,
					'uptime' : 100,
					'failsaferate' : 0,
					'uptimethreshold' : 95
				    }, {
					'id' : 2,
					'name' : 'EDS-02',
					'throughput' : throughput[0][6].value,
					'uptime' : 100,
					'failsaferate' : 0,
					'uptimethreshold' : 95
				    } ],
				    'makeupunits' : [ {
					'id' : 1,
					'name' : 'MU-01',
					'throughput' : (typeof (sortedbags[0][0]) != 'undefined') ? sortedbags[0][0].total_bag : 0,
					'active' : 1
				    }, {
					'id' : 2,
					'name' : 'MU-02',
					'throughput' : (typeof (sortedbags[0][1]) != 'undefined') ? sortedbags[0][1].total_bag : 0,
					'active' : 0
				    }, {
					'id' : 3,
					'name' : 'MU-03',
					'throughput' : (typeof (sortedbags[0][2]) != 'undefined') ? sortedbags[0][2].total_bag : 0,
					'active' : 1
				    }, {
					'id' : 4,
					'name' : 'MU-04',
					'throughput' : (typeof (sortedbags[0][3]) != 'undefined') ? sortedbags[0][3].total_bag : 0,
					'active' : 1
				    }, {
					'id' : 5,
					'name' : 'MU-05',
					'throughput' : (typeof (sortedbags[0][4]) != 'undefined') ? sortedbags[0][4].total_bag : 0,
					'active' : 1
				    }, {
					'id' : 6,
					'name' : 'MU-06',
					'throughput' : (typeof (sortedbags[0][5]) != 'undefined') ? sortedbags[0][5].total_bag : 0,
					'active' : 1
				    } ],
				    'trackingrate' : trackingrate,
				    'faultrate' : jamrate,
				    'timeinsystem' : timeInSystem,
				    'bagrate' : bagrate,
				    'atrrate' : (Math.random() * 3 + 92).toFixed(0),
				    'healthlines' : [

				    {
					'id' : 1,
					'name' : 'PLC-01',
					'values' : [ 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ]
				    }, {
					'id' : 2,
					'name' : 'Sort Controller',
					'values' : [ 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ]
				    }, {
					'id' : 3,
					'name' : 'PLC-02',
					'values' : [ 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0 ]
				    }, {
					'id' : 4,
					'name' : 'HMI-01',
					'values' : [ 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0 ]
				    }, {
					'id' : 5,
					'name' : 'PLC-03',
					'values' : [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ]
				    }, {
					'id' : 6,
					'name' : 'HMI-02',
					'values' : [ 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ]
				    }, {
					'id' : 7,
					'name' : 'PLC-04',
					'values' : [ 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1 ]
				    } ]

				};

				cb(bhsStruct);
			    });
			});
		    });
		});
	    });
	});
    }
};
