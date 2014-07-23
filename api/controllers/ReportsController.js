/*---------------------
	:: Reports 
	-> controller

	This controller has several responsibilities

	Create: - loads the reports page

	Utility functions -getdevicesbyeqpid,   get_equipment


	View generation function:  view
	- figures out the locale based on where it was requested from
    - calls   BuildReportData  function
    - generates view (HTML)  via generate.ejs

	BuildReportData function -  uses report object and report ID - to make the stored proceedure calls
	it returns a structured object that is the report data.


    Promptprint / Promptsave:

    They take the report data,
    spin up Phantom.js- generate the pdf file, by using phantom passing in the report data as URL GET parameters
    to the View Generation page.
    promptsave creates the CSV seperately via the BuildReportData function again and responds with both PDF and CSV URLS of the created files.
    promptprint responds with the pdf filename and printers list



    Printreport:
    Calls on Acrobat reader to print the report- it uses the command line- and passes in the file name and printer name.


     There are a couple utility functions at the bottom of this controller, like toISOLocaleString- that make some time string manipulations


---------------------*/

var ReportsController = {

    create : function(req, res) {
	res.view({});
    },
    getdevicesbyeqpid : function(req, res) {
	sails.controllers.database.sp("BHS_REPORTS_GetDevicesByEquipID", [ req.param('id') ], function(err, devices) {
	    // sails.adapters[sails.config.adapters[sails.config.adapters['default']].module].query("users","SELECT
	    // * FROM cfg_dev_id WHERE eqp_ID = " +
	    // req.param('id'),function(err,devices){
	    if (err) {
		// res.view('error');
		res.json({
		    error : 'Database Error'
		});
		return;
	    }
	    res.json(devices);
	});
    },
    get_equipment : function(req, res) {
	sails.controllers.database.sp("BHS_REPORTS_GetEquipment", [], function(err, equipment) {
	    if (err) {
		res.json({
		    error : 'Database Error'
		});
		return;
	    }
	    res.json(equipment);
	});
    },
    promptsave : function(req, res) {
	var report = req.param('report');
	var phantom = require('node-phantom');

	var orientation = 'portrait';
	var footnotes_pass = [];
	if (report.id == 1) {
	    orientation = 'portrait';
	    footnotes_pass = [ 'First Footer Content line here *', 'second footer content line here *', 'down down down downer' ];
	}

	phantom.create(function(err, ph) {
	    ph.createPage(function(err, page) {
		page.set('viewportSize', {
		    width : 1024,
		    height : 480
		});
		page.set('paperSize', {
		    format : 'A4',
		    orientation : orientation,
		    header : {

			height : "1cm",
			contents : ''// function(pageNum, numPages) { return pageNum + "/"
		    // + numPages; }'
		    },
		    footer : {
			height : "30mm", // 30mm
			contents : 'test content pass',
			footnotes : footnotes_pass
		    }
		}, function() {
		    var start = new Date().getTime();
		    report.locale = req.session.user.locale;
		    page.open('http://localhost:1337/reports/view?report_parameters=' + encodeURIComponent(JSON.stringify(report)), function() {
			var timestampstring = new Date().getTime();

			var filename = '.tmp\\public\\data\\report_' + timestampstring + '.pdf';
			var filenamecsv = '.tmp\\public\\data\\report_' + timestampstring + '.csv';
			var url = '/data/report_' + timestampstring + '.pdf'; // sails.config.siteurl+
			var urlcsv = '/data/report_' + timestampstring + '.csv'; // sails.config.siteurl+

			page.render(filename, function() {
			    var end = new Date().getTime();
			    console.log('Page Rendered in ' + (end - start).toString() + 'ms.');
			    ph.exit();

			    buildReportData(report, true, function(data) {
				if (typeof (data) == 'undefined' || data == null) {
				    res.json({
					failure : 'Unable to Generate Report'
				    });
				}
				// BUILDING CSV STRING
				var outputstring = '';

				// BUILDING HEADER PARAMETERS
				var i = 0;
				if (typeof (data.header) != 'undefined') {
				    for (var i = 0; i < data.header.line.length; i++) {
					outputstring += "param," + data.header.line[i] + "\r\n";
				    }
				}
				for (i; i < 10; i++) {
				    outputstring += "\r\n";
				}

				if (report.id == 4) { // BAG SEARCH!!
				    if (typeof (data[0]) != 'undefined' && typeof (data[0].data != 'undefined')) {
					for (var i = 0; i < data[0].data.length; i++) {
					    outputstring += data[0].data[i].IATA_tag + "," + data[0].data[i].security_ID + "," + data[0].data[i].active + ","
						    + data[0].data[i].security_status + "," + data[0].data[i].EDS_Machine + ","
						    + data[0].data[i].level_1_status + "," + data[0].data[i].level_2_status + ","
						    + data[0].data[i].level_3_status + "," + data[0].data[i].ATR_name + "," + data[0].data[i].sort_destination
						    + "," + data[0].data[i].diverter_name + "," + data[0].data[i].lastmodified + "\r\n";
					}
				    }
				} else {
				    for (var i = 0; i < data.length; i++) {
					for (var j = 0; j < data[i].data.length; j++) {
					    for (var k = 0; k < data[i].data[j].length; k++) {
						if (k > 0) {
						    outputstring += ",";
						}
						outputstring += data[i].data[j][k].val;

					    }
					    outputstring += "\r\n"; // New line for end of row
					}
					outputstring += "\r\n"; // extra New line for end of data
					// set
				    }

				}

				var fs = require('fs');
				fs.writeFile(filenamecsv, outputstring, function(err) {
				    if (err) {
					console.log(err);
				    } else {
					// console.log("The file was saved!");
					res.json({
					    pdfurl : url,
					    csvurl : urlcsv
					});
				    }
				});
			    });
			});

		    });
		})
	    })
	});
    },
    promptprint : function(req, res) {

	// First, Generate the report!!

	var report = req.param('report');

	var phantom = require('node-phantom');

	var orientation = 'portrait';
	var footnotes_pass = [];
	if (report.id == 1) {
	    orientation = 'portrait';
	    footnotes_pass = [ 'First Footer Content line here *', 'second footer content line here *', 'down down down downer' ];
	}

	phantom.create(function(err, ph) {
	    ph.createPage(function(err, page) {
		page.set('viewportSize', {
		    width : 1024,
		    height : 480
		});
		page.set('paperSize', {
		    format : 'A4',
		    orientation : orientation,
		    header : {

			height : "1cm",
			contents : ''// function(pageNum, numPages) { return pageNum + "/"
		    // + numPages; }'
		    },
		    footer : {
			height : "30mm", // 30mm
			contents : 'test content pass',
			footnotes : footnotes_pass
		    }
		}, function() {
		    var start = new Date().getTime();
		    report.locale = req.session.user.locale;
		    page.open('http://localhost:1337/reports/view?report_parameters=' + encodeURIComponent(JSON.stringify(report)), function() {
			var filename = 'public\\reports\\report_' + new Date().getTime() + '.pdf';
			page.render(filename);
			var end = new Date().getTime();
			console.log('Page Rendered in ' + (end - start).toString() + 'ms.');
			ph.exit();
			// res.json({filename:filename});

			// do printer stuff -
			sails.controllers.database.sp("sp_bhs_util_get_printers", [], function(err, printers) {
			    res.json({
				printers : printers,
				filename : filename
			    });
			});

		    });
		});
	    });
	});
    },
    printreport : function(req, res) {
	var filename = req.param('filename');
	if (typeof (req.param('printer')) == 'undefined' || req.param('printer') == '') {
	    res.json({
		failure : 'No printer was selected'
	    });
	    return;
	}
	var printer = req.param('printer');
	var printername = printer.printername;
	var drivername = printer.drivername;
	var portname = printer.portname;

	var exec = require('child_process').exec, child;

	child = exec('AcroRd32.exe /h /t "C:\\sails\\start\\' + filename + '" "' + printername + '" "' + drivername + '" "' + portname + '"', function(error,
		stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
		console.log('exec error: ' + error);
	    }
	});

	res.json('success');
	/*
	 * child = exec('"C:\\Program Files (x86)\\Foxit Software\\Foxit
	 * Reader\\Foxit Reader.exe" /t "C:\\sails\\start\\'+filename+'"
	 * "'+printername+'" "'+drivername+'" "'+portname+'"', function (error,
	 * stdout, stderr) { console.log('stdout: ' + stdout); console.log('stderr: ' +
	 * stderr); if (error !== null) { console.log('exec error: ' + error); }
	 * res.json('success'); });
	 */
    },
    view : function(req, res) {

	var report;
	var pass_locale;
	var phantom_bool;
	if (typeof (req.query) != 'undefined' && typeof (req.query.report_parameters) != 'undefined') { // see if
	    // we're
	    // passing in
	    // the report
	    // stuff as
	    // GET
	    // parameters
	    report = JSON.parse(req.query.report_parameters);
	    // pass_locale = report.locale;
	    phantom_bool = true;
	} else { // Otherwise, we expect the parameters to be POSTED
	    report = req.body.report;
	    if (typeof (req.session.user) != 'undefined') {
		report.locale = req.session.user.locale;
	    } else {
		report.locale = 'en';
	    }
	    phantom_bool = false;
	}

	buildReportData(report, phantom_bool, function(data) {
	    if (typeof (data) == 'undefined' || data == null) {
		res.view('main/failure.ejs', {
		    layout : false,
		    locale : report.locale,
		    message : 'An error occurred while generating the report.'
		});
		return;
	    }
	    if (data.length == 0) {
		res.view('main/noresults.ejs', {
		    phantom : phantom_bool,
		    locale : report.locale,
		    layout : false,
		    noresults : 'noresults',
		    title : 'No Results',
		    data : data
		});
	    } else {
		res.view('reports/generate.ejs', {
		    phantom : phantom_bool,
		    layout : false,
		    title : 'test',
		    data : data
		});
	    }
	});

    }
};
module.exports = ReportsController;

function secondsToString(seconds) {

    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;

    return padLeft(numdays, 2) + ":" + padLeft(numhours, 2) + ":" + padLeft(numminutes, 2) + ":" + padLeft(numseconds, 2);

}

function padLeft(nr, n, str) {
    if (String(nr).length >= n) {
	return String(nr);
    }
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

function toLocaleDateTimeString(date) {
    return date.getFullYear() + '-' + padLeft((date.getMonth() + 1).toString(), 2) + '-' + padLeft(date.getDate(), 2) + ' ' + padLeft(date.getHours(), 2) + ':'
	    + padLeft(date.getMinutes(), 2) + ':' + padLeft(date.getSeconds(), 2);
}

function toUTCDateTimeString(date) {
    return date.getUTCFullYear() + '-' + padLeft((date.getUTCMonth() + 1).toString(), 2) + '-' + padLeft(date.getUTCDate(), 2) + ' '
	    + padLeft(date.getUTCHours(), 2) + ':' + padLeft(date.getUTCMinutes(), 2) + ':' + padLeft(date.getUTCSeconds(), 2);
}

var serialiseObject = function(obj) {
    var pairs = [];
    for ( var prop in obj) {
	if (!obj.hasOwnProperty(prop)) {
	    continue;
	}

	if (Object.prototype.toString.call(obj[prop]) == '[object Object]') {
	    pairs.push(serialiseObject(obj[prop]));
	    continue;
	}

	pairs.push(prop + '=' + obj[prop]);
    }
    return pairs.join('&');
}

function buildReportData(report, phantom_bool, cb) {
    // Generating report stuff
    // safety checks
    if (typeof (report) == 'undefined' || typeof (report.parameters) == 'undefined') {
	cb(null);
	return;
    }
    if (typeof (report.parameters.start_time) == 'undefined' || typeof (report.parameters.start_time.value) == 'undefined'
	    || report.parameters.start_time.value == '') {
	cb(null);
	return;
    }
    if (typeof (report.parameters.end_time) == 'undefined' || typeof (report.parameters.end_time.value) == 'undefined'
	    || report.parameters.end_time.value == '') {
	cb(null);
	return;
    }
    var data = new Array();
    var start_datetime = new Date(report.parameters.start_time.value);
    var start_label = report.parameters.start_time.locale_label[report.locale];
    var end_datetime = new Date(report.parameters.end_time.value);
    var end_label = report.parameters.end_time.locale_label[report.locale];
    var system_name = report.system_name;

    if (report.id == 1) { // / TYPE Alarm History Report

	var header = new Object();
	header.url = '/img/iSystemsNow-Logo-RGB-Black.png';
	var line = [];
	line.push(system_name);
	line.push(report.name.locale_label[report.locale]);
	line.push(start_label + ': ' + toLocaleDateTimeString(start_datetime));
	line.push(end_label + ': ' + toLocaleDateTimeString(end_datetime));

	var fault_type = null;
	if (typeof (report.parameters.fault_type.text) != 'undefined') {
	    line.push(report.parameters.fault_type.locale_label[report.locale] + ': ' + report.parameters.fault_type.text);
	    fault_type = report.parameters.fault_type.value;
	}

	var eqp_ID = null;
	if (typeof (report.parameters.eqp_id.text) != 'undefined') {
	    line.push(report.parameters.eqp_id.locale_label[report.locale] + ': ' + report.parameters.eqp_id.text);
	    eqp_ID = report.parameters.eqp_id.value;
	}
	var dev_ID = null;
	if (typeof (report.parameters.dev_id.text) != 'undefined') {
	    line.push(report.parameters.dev_id.locale_label[report.locale] + ': ' + report.parameters.dev_id.text);
	    dev_ID = report.parameters.dev_id.value;
	}
	header.line = line;

	data.header = header;
	data.css = "isystemsnowreports.css";
	data.landscape = false;

	addAlarmFaultHistory(start_datetime, end_datetime, fault_type, eqp_ID, dev_ID, report.locale, function(section) {
	    if (section != null) {
		data[data.length] = section;
	    }
	    cb(data);
	});

    } // END OF REPORT 1

    else if (report.id == 2) {

	var deviceWhere = '';

	var header = new Object();
	header.url = '/img/iSystemsNow-Logo-RGB-Black.png';
	var line = [];
	line.push(system_name);
	line.push(report.name.locale_label[report.locale]);
	line.push(start_label + ': ' + toLocaleDateTimeString(start_datetime));
	line.push(end_label + ': ' + toLocaleDateTimeString(end_datetime));

	var eqp_ID = null;
	if (typeof (report.parameters.eqp_id.text) != 'undefined') {
	    line.push(report.parameters.eqp_id.locale_label[report.locale] + ': ' + report.parameters.eqp_id.text);
	    eqp_ID = report.parameters.eqp_id.value;
	}

	var dev_ID = null;
	if (typeof (report.parameters.dev_id.text) != 'undefined') {
	    line.push(report.parameters.dev_id.locale_label[report.locale] + ': ' + report.parameters.dev_id.text);
	    dev_ID = report.parameters.dev_id.value;
	}

	if (typeof (report.parameters.sections) == 'undefined' || typeof (report.parameters.sections.checkboxes) == 'undefined') {
	    cb(null);
	    return;
	}
	header.line = line;

	data.header = header;
	data.css = "isystemsnowreports.css";
	data.landscape = false;
	// var report2query = function(){/*STRING*/}.toString().slice(14,-3);
	addTrackingPhotoEyes(parseInt(report.parameters.sections.checkboxes.tracking_photo_eyes.value), start_datetime, end_datetime, eqp_ID, dev_ID,
		report.locale, function(section) {
		    if (section != null) {
			data[data.length] = section;
		    }

		    addJamPhotoEyes(parseInt(report.parameters.sections.checkboxes.jam_photo_eyes.value), start_datetime, end_datetime, eqp_ID, dev_ID,
			    report.locale, function(section) {
				if (section != null) {
				    data[data.length] = section;
				}

				addDiverterCounts(parseInt(report.parameters.sections.checkboxes.diverters.value), start_datetime, end_datetime, eqp_ID,
					dev_ID, report.locale, function(section) {
					    if (section != null) {
						data[data.length] = section;
					    }
					    cb(data);
					});
			    });
		});
    } else if (report.id == 3) {

	var deviceWhere = '';

	var header = new Object();
	header.url = '/img/iSystemsNow-Logo-RGB-Black.png';
	var line = [];
	line.push(system_name);

	header.line = line;

	data.header = header;
	data.css = "isystemsnowreports.css";
	data.landscape = false;

	var section = new Object();
	section.startrow = true;
	section.endrow = true;

	section.data = new Array();
	section.data.topborder = true;
	section.data.bottomborder = true;
	section.data.spantype = 'row-fluid';
	section.data.toprowtableheader = true;
	section.data.searchenabled = true;

	for (var i = 0; i < 100; i++) {
	    section.data[i] = new Array();
	    section.data[i][0] = new Object();
	    section.data[i][0].val = 'Alarm Time' + i;
	    section.data[i][0].bold = true;
	    section.data[i][0].bordertop = false;
	    section.data[i][1] = new Object();
	    section.data[i][1].val = 'Equipment';
	    section.data[i][1].bold = true;
	    section.data[i][1].bordertop = false;
	    section.data[i][2] = new Object();
	    section.data[i][2].val = 'Device';
	    section.data[i][2].bold = true;
	    section.data[i][2].bordertop = false;
	    section.data[i][3] = new Object();
	    section.data[i][3].val = 'Fault';
	    section.data[i][3].bold = true;
	    section.data[i][3].bordertop = false;
	    section.data[i][4] = new Object();
	    section.data[i][4].val = 'Duration';
	    section.data[i][4].bold = true;
	    section.data[i][4].bordertop = false;
	}
	data[0] = section;

	cb(data);
    } else if (report.id == 4) { // Bag Search

	var deviceWhere = '';

	var header = new Object();
	header.url = '/img/iSystemsNow-Logo-RGB-Black.png';
	var line = [];
	line.push(system_name);
	line.push(report.name.locale_label[report.locale]);
	line.push(start_label + ': ' + toLocaleDateTimeString(start_datetime));
	line.push(end_label + ': ' + toLocaleDateTimeString(end_datetime));

	var search = null;
	if (typeof (report.parameters.search_field.value) != 'undefined' && report.parameters.search_field.value != '') {
	    line.push(report.parameters.search_field.locale_label[report.locale] + ': ' + report.parameters.search_field.value);
	    search = parseInt(report.parameters.search_field.value);
	    if (isNaN(search)) {
		search = null;
	    }
	}

	header.line = line;

	if (phantom_bool) {
	    data.header = header;
	}

	data.css = "isystemsnowreports.css";
	data.landscape = false;

	sails.controllers.database.sp("BHS_REPORTS_SearchBags", [ "'" + toUTCDateTimeString(start_datetime) + "'",
		"'" + toUTCDateTimeString(end_datetime) + "'", search ], function(err, bags) {
	    if (err) {
		cb(data);
		return;
	    }

	    if (bags.length < 1) {
		cb(data);
		return;
	    }
	    var section = new Object();
	    section.startrow = true;
	    section.endrow = true;

	    section.data = new Array();
	    section.data.topborder = true;
	    section.data.bottomborder = true;
	    section.data.spantype = 'row-fluid';
	    section.data.toprowtableheader = false;
	    section.data.searchenabled = false;
	    section.data.bagsearch = true;

	    for (var i = 0; i < bags.length; i++) {
		section.data[i] = new Object();
		var k = 0;
		for ( var key in bags[i]) {
		    if (bags[i].hasOwnProperty(key)) {
			section.data[i][key] = bags[i][key];
		    }
		}
	    }
	    data[0] = section;
	    cb(data);

	});

    }
}

function addAlarmFaultHistory(start_datetime, end_datetime, fault_type, eqp_ID, dev_ID, locale, cb) {

    sails.controllers.database.sp("BHS_REPORTS_AlarmHistoryReport",["'" + toUTCDateTimeString(start_datetime) + "'","'"
	    + toUTCDateTimeString(end_datetime) + "'", fault_type , eqp_ID , dev_ID , null], function(err, alarms) {
	if (err || alarms.length < 1) {
	    cb(null);
	    return;
	}
	sails.controllers.database.sp("BHS_REPORTS_AlarmHistoryReport",[null,null,null,null,null,"'" + locale + "'"], function(err,
		output_json) {

	    if (err || output_json.length < 1) {
		cb(null);
		return;
	    }
	    // var jsonData = getJSONTitles(output_json);
	    var jsonData = getJSONTitles(output_json);

	    var section = new Object();
	    section.startrow = true;
	    section.endrow = true;

	    /*
	     * section.groupheading = new Array();
	     * section.groupheading.spantype = 'row-fluid';
	     * 
	     * section.groupheading[0] = new Array();
	     * section.groupheading[0][0] = new Object();
	     * section.groupheading[0][0].val = 'Diverters';
	     * section.groupheading[0][0].bold = true;
	     * 
	     * 
	     * section.groupheading[0][1] = new Object();
	     * section.groupheading[0][1].val = '0 bags';
	     * section.groupheading[0][1].bold = false;
	     * 
	     * section.groupheading[1] = new Array();
	     * section.groupheading[1][0] = new Object();
	     * section.groupheading[1][0].val = 'Average Time Bag in
	     * CBIS'; section.groupheading[1][0].bold = false;
	     * 
	     * section.groupheading[1][1] = new Object();
	     * section.groupheading[1][1].val = '0.0 minutes';
	     * section.groupheading[1][1].bold = false;
	     */

	    section.data = new Array();
	    section.data.topborder = true;
	    section.data.bottomborder = true;
	    section.data.spantype = 'row-fluid';
	    section.data.toprowtableheader = true;
	    section.data.searchenabled = true;

	    section.data[0] = new Array();

	    for (var i = 0; i < jsonData.columns.length; i++) {
		section.data[0][i] = new Object();
		section.data[0][i].val = jsonData.columns[i].locale[locale];
		section.data[0][i].bold = true;
		section.data[0][i].bordertop = false;
		section.data[0][i].width = jsonData.columns[i].width;
		section.data[0][i].lastrow = jsonData.columns[i].lastrow;
		section.data[0][i].hidden = jsonData.columns[i].hidden;
	    }

	    for (var i = 0; i < alarms.length; i++) {
		var j = i + 1;
		section.data[j] = new Array();
		var k = 0;
		for ( var key in alarms[i]) {
		    if (alarms[i].hasOwnProperty(key)) {
			section.data[j][k] = new Object();
			if (typeof (jsonData.columns[k].modifier) != 'undefined') {
			    if (jsonData.columns[k].modifier == "localdatetime") {
				section.data[j][k].val = toLocaleDateTimeString(alarms[i][key]);
			    } else if (jsonData.columns[k].modifier == "secondsString") {
				section.data[j][k].val = secondsToString(alarms[i][key]);
			    }
			} else {
			    section.data[j][k].val = alarms[i][key];
			}
			section.data[j][k].bold = false;
			section.data[j][k].bordertop = false;
			k++;
		    }
		}
	    }
	    cb(section);
	});
    });

}
function addDiverterCounts(doquery, start_datetime, end_datetime, eqp_ID, dev_ID, locale, cb) {

    // Skip logic if the checkbox wasn't checked
    if (!doquery || dev_ID != null) {
	cb(null);
	return;
    }

    sails.controllers.database.sp("BHS_REPORTS_EquipmentSummaryReportDiverters", [ "'" + toUTCDateTimeString(start_datetime) + "'",
	    "'" + toUTCDateTimeString(end_datetime) + "'", eqp_ID, null ], function(err, photoeyes) {

	if (err || photoeyes.length < 1) {
	    cb(null);
	    return;
	}

	sails.controllers.database.sp("BHS_REPORTS_EquipmentSummaryReportDiverters", [ null, null, null, "'" + locale + "'" ], function(err, output_json) {

	    if (err || output_json.length < 1) {
		cb(null);
		return;
	    }
	    var jsonData = getJSONTitles(output_json);

	    var section = new Object();
	    section.startrow = true;
	    section.endrow = true;

	    section.groupheading = new Array();
	    section.groupheading.spantype = 'row-fluid';

	    section.groupheading[0] = new Array();
	    section.groupheading[0][0] = new Object();
	    section.groupheading[0][0].val = 'Diverters';
	    section.groupheading[0][0].bold = true;

	    section.data = new Array();
	    section.data.topborder = true;
	    section.data.bottomborder = true;
	    section.data.spantype = 'row-fluid';
	    section.data.toprowtableheader = true;
	    section.data.searchenabled = true;

	    section.data[0] = new Array();

	    for (var i = 0; i < jsonData.columns.length; i++) {
		section.data[0][i] = new Object();
		section.data[0][i].val = jsonData.columns[i].locale[locale];
		section.data[0][i].bold = true;
		section.data[0][i].bordertop = false;
		section.data[0][i].width = jsonData.columns[i].width;
		section.data[0][i].lastrow = jsonData.columns[i].lastrow;
		section.data[0][i].hidden = jsonData.columns[i].hidden;
	    }

	    for (var i = 0; i < photoeyes.length; i++) {
		var j = i + 1;
		section.data[j] = new Array();
		var k = 0;
		for ( var key in photoeyes[i]) {
		    if (photoeyes[i].hasOwnProperty(key)) {
			section.data[j][k] = new Object();
			section.data[j][k].val = photoeyes[i][key];
			section.data[j][k].bold = false;
			section.data[j][k].bordertop = false;
			k++;
		    }
		}
	    }
	    cb(section);
	});
    });
}

function addJamPhotoEyes(doquery, start_datetime, end_datetime, eqp_ID, dev_ID, locale, cb) {

    // Skip logic if the checkbox wasn't checked
    if (!doquery) {
	cb(null);
	return;
    }

    sails.controllers.database.sp("BHS_REPORTS_EquipmentSummaryReportJamPE", [ "'" + toUTCDateTimeString(start_datetime) + "'",
	    "'" + toUTCDateTimeString(end_datetime) + "'", eqp_ID, dev_ID, null ], function(err, photoeyes) {

	if (err || photoeyes.length < 1) {
	    cb(null);
	    return;
	}
	sails.controllers.database.sp("BHS_REPORTS_EquipmentSummaryReportJamPE", [ null, null, null, null, "'" + locale + "'" ], function(err, output_json) {
	    if (err || output_json.length < 1) {
		cb(null);
		return;
	    }
	    var jsonData = getJSONTitles(output_json);

	    var section = new Object();
	    section.startrow = true;
	    section.endrow = true;

	    section.groupheading = new Array();
	    section.groupheading.spantype = 'row-fluid';

	    section.groupheading[0] = new Array();
	    section.groupheading[0][0] = new Object();
	    section.groupheading[0][0].val = 'Jam Photo Eyes';
	    section.groupheading[0][0].bold = true;

	    section.data = new Array();
	    section.data.topborder = true;
	    section.data.bottomborder = true;
	    section.data.spantype = 'span6';
	    section.data.toprowtableheader = true;
	    section.data.searchenabled = true;

	    section.data[0] = new Array();

	    // Makes Headings
	    for (var i = 0; i < jsonData.columns.length; i++) {
		section.data[0][i] = new Object();
		section.data[0][i].val = jsonData.columns[i].locale[locale];
		section.data[0][i].bold = true;
		section.data[0][i].bordertop = false;
		section.data[0][i].width = jsonData.columns[i].width;
		section.data[0][i].lastrow = jsonData.columns[i].lastrow;
		section.data[0][i].hidden = jsonData.columns[i].hidden;
	    }

	    // Fills Data
	    for (var i = 0; i < photoeyes.length; i++) {
		var j = i + 1;
		section.data[j] = new Array();
		var k = 0;
		for ( var key in photoeyes[i]) {
		    if (photoeyes[i].hasOwnProperty(key)) {
			section.data[j][k] = new Object();
			section.data[j][k].val = photoeyes[i][key];
			section.data[j][k].bold = false;
			section.data[j][k].bordertop = false;
			k++;
		    }
		}
	    }
	    cb(section);
	});
    });
}

function addTrackingPhotoEyes(doquery, start_datetime, end_datetime, eqp_ID, dev_ID, locale, cb) {

    // Skip logic if the checkbox wasn't checked
    if (!doquery) {
	cb(null);
	return;
    }

    sails.controllers.database.sp("BHS_REPORTS_EquipmentSummaryReportTrackPE", [ "'" + toUTCDateTimeString(start_datetime) + "'",
	    "'" + toUTCDateTimeString(end_datetime) + "'", eqp_ID, dev_ID, null ], function(err, photoeyes) {

	if (err || photoeyes.length < 1) {
	    cb(null);
	    return;
	}
	sails.controllers.database.sp("BHS_REPORTS_EquipmentSummaryReportTrackPE", [ null, null, null, null, "'" + locale + "'" ], function(err, output_json) {
	    if (err || output_json.length < 1) {
		cb(null);
		return;
	    }
	    var jsonData = getJSONTitles(output_json);

	    var section = new Object();
	    section.startrow = true;
	    section.endrow = true;

	    section.groupheading = new Array();
	    section.groupheading.spantype = 'row-fluid';

	    section.groupheading[0] = new Array();
	    section.groupheading[0][0] = new Object();
	    section.groupheading[0][0].val = 'Tracking Photo Eyes';
	    section.groupheading[0][0].bold = true;

	    /*
	     * section.groupheading[0][1] = new Object();
	     * section.groupheading[0][1].val = '0 bags';
	     * section.groupheading[0][1].bold = false;
	     * 
	     * section.groupheading[1] = new Array();
	     * section.groupheading[1][0] = new Object();
	     * section.groupheading[1][0].val = 'Average Time Bag in CBIS';
	     * section.groupheading[1][0].bold = false;
	     * 
	     * section.groupheading[1][1] = new Object();
	     * section.groupheading[1][1].val = '0.0 minutes';
	     * section.groupheading[1][1].bold = false;
	     */

	    section.data = new Array();
	    section.data.topborder = true;
	    section.data.bottomborder = true;
	    section.data.spantype = 'row-fluid';
	    section.data.toprowtableheader = true;
	    section.data.searchenabled = true;

	    section.data[0] = new Array();

	    section.data[0] = new Array();

	    // Makes Headings
	    for (var i = 0; i < jsonData.columns.length; i++) {
		section.data[0][i] = new Object();
		section.data[0][i].val = jsonData.columns[i].locale[locale];
		section.data[0][i].bold = true;
		section.data[0][i].bordertop = false;
		section.data[0][i].width = jsonData.columns[i].width;
		section.data[0][i].lastrow = jsonData.columns[i].lastrow;
		section.data[0][i].hidden = jsonData.columns[i].hidden;
	    }

	    // Fills Data
	    for (var i = 0; i < photoeyes.length; i++) {
		var j = i + 1;
		section.data[j] = new Array();
		var k = 0;
		for ( var key in photoeyes[i]) {
		    if (photoeyes[i].hasOwnProperty(key)) {
			section.data[j][k] = new Object();
			section.data[j][k].val = photoeyes[i][key];
			section.data[j][k].bold = false;
			section.data[j][k].bordertop = false;
			k++;
		    }
		}
	    }
	    cb(section);
	});

    });
}

function toLocalISOString(date) {
    date = new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()));
    return date.toISOString();
}


function getJSONTitles(obj) {
    obj = obj[0];
    var str = '';
    for ( var p in obj) {
	if (obj.hasOwnProperty(p)) {
	    return JSON.parse(obj[p]);
	}
    }
}