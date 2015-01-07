/**
 * AutoReportsController
 * 
 * @description :: Server-side logic for generating reports
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	alarmhistoryreport : function(req,res){
		var report = {"id":1,"name":{"locale_label":{"en":"Alarm History Report","es":"Informe del historial de alarmas"}},"title":{"logo":"iSystemsNow-Logo-RGB-Black.png"},"footer":{"logo":"default.png"},"parameters":{"start_time":{"type":"datetime","locale_label":{"en":"Start Time","es":"Start Timesss"},"value":''},"end_time":{"type":"datetime","locale_label":{"en":"End Time","es":"Hora de Inicio"},"value":''},"fault_type":{"type":"fault","locale_label":{"en":"Fault","es":"Fault"},"value":""},"eqp_id":{"type":"select","source":"eqp_ids","dependant":{"dev_id":{"url":"/reports/getdevicesbyeqpid"}},"locale_label":{"en":"Equipment","es":"Equipo"},"value":""},"dev_id":{"type":"select","parent":"eqp_id","locale_label":{"en":"Device","es":"Dispositivo"},"value":""}},"system_name":"MHK International Airport","timezoneoffset":300};
		sails.controllers.autoreports.generate(req,res,report, 'Alarm_History_Report');
	},
	equipmentsummaryreport:function(req,res){
		var report = {"id":"2","name":{"locale_label":{"en":"Equipment Summary Report","es":"Informe resumido Equipo"}},"title":{"logo":"iSystemsNow-Logo-RGB-Black.png"},"footer":{"logo":"default.png"},"parameters":{"start_time":{"type":"datetime","locale_label":{"en":"Start Time","es":"Hora de Inicio"},"value":"2015-01-06T05:00:00.000Z"},"end_time":{"type":"datetime","locale_label":{"en":"End Time","es":"Hora de Finalización"},"value":"2015-01-06T17:05:43.054Z"},"eqp_id":{"type":"select","dependant":{"dev_id":{"url":"/reports/getdevicesbyeqpid"}},"source":"eqp_ids","locale_label":{"en":"Equipment","es":"Equipo"},"value":""},"dev_id":{"type":"select","parent":"eqp_id","locale_label":{"en":"Device","es":"Dispositivo"},"value":""},"sections":{"type":"checkboxes","locale_label":{"en":"Device Types","es":"Secciones"},"checkboxes":{"tracking_photo_eyes":{"locale_label":{"[en]":"Tracking Photo Eyes","[es]":"Seguimiento de Fotos Eyes"},"value":"1"},"jam_photo_eyes":{"locale_label":{"[en]":"Jam Photo Eyes","[es]":"Jam Fotos Eyes"},"value":"1"},"diverters":{"locale_label":{"[en]":"Diverters","[es]":"Desviadores"},"value":"1"},"vertical_sorters_mergers":{"locale_label":{"[en]":"Vertical Sorters / Mergers","[es]":"Clasificadores / Fusiones verticales"},"value":"1"}}}},"system_name":"MHK International Airport","timezoneoffset":"300","locale":"en"};
		sails.controllers.autoreports.generate(req,res,report, 'Equipment_Summary_Report');
	},
	equipmentintervalreport:function(req,res){
		var report = {"id":"3","name":{"locale_label":{"en":"Equipment Interval Report","es":"Informe resumido Equipo"}},"title":{"logo":"iSystemsNow-Logo-RGB-Black.png"},"footer":{"logo":"default.png"},"parameters":{"start_time":{"type":"datetime","locale_label":{"en":"Start Time","es":"Hora de Inicio"},"value":"2015-01-06T05:00:00.000Z"},"end_time":{"type":"datetime","locale_label":{"en":"End Time","es":"Hora de Finalización"},"value":"2015-01-06T17:07:25.679Z"},"eqp_id":{"type":"select","dependant":{"dev_id":{"url":"/reports/getdevicesbyeqpid"},"interval":{"disabled":"true"}},"source":"eqp_ids","locale_label":{"en":"Equipment","es":"Equipo"},"value":""},"dev_id":{"type":"select","parent":"eqp_id","locale_label":{"en":"Device","es":"Dispositivo"},"value":""},"interval":{"type":"select","source":"intervals","parent":"eqp_id","limit":"1000","disabled":"true","locale_label":{"en":"Interval","es":"Interval"},"value":"86400","text":"1 Day"},"sections":{"type":"checkboxes","locale_label":{"en":"Device Types","es":"Secciones"},"checkboxes":{"tracking_photo_eyes":{"locale_label":{"[en]":"Tracking Photo Eyes","[es]":"Seguimiento de Fotos Eyes"},"value":"1"},"jam_photo_eyes":{"locale_label":{"[en]":"Jam Photo Eyes","[es]":"Jam Fotos Eyes"},"value":"1"},"diverters":{"locale_label":{"[en]":"Diverters","[es]":"Desviadores"},"value":"1"},"vertical_sorters_mergers":{"locale_label":{"[en]":"Vertical Sorters / Mergers","[es]":"Clasificadores / Fusiones verticales"},"value":"1"}}}},"system_name":"MHK International Airport","timezoneoffset":"300","locale":"en"};
		sails.controllers.autoreports.generate(req,res,report, 'Equipment_Interval_Report');
	},
	throughputreport:function(req,res){
		var report = {"id":"5","name":{"locale_label":{"en":"Throughput Report","es":"Throughput Report"}},"title":{"logo":"iSystemsNow-Logo-RGB-Black.png"},"footer":{"logo":"default.png"},"parameters":{"start_time":{"type":"datetime","locale_label":{"en":"Start Time","es":"Hora de Inicio"},"value":"2015-01-06T05:00:00.000Z"},"end_time":{"type":"datetime","locale_label":{"en":"End Time","es":"Hora de Finalización"},"value":"2015-01-06T17:08:52.253Z"},"interval":{"type":"select","source":"intervals","limit":"1000","locale_label":{"en":"Interval","es":"Interval"},"value":"3600","text":"1 Hour"}},"system_name":"MHK International Airport","timezoneoffset":"300","locale":"en"};
		sails.controllers.autoreports.generate(req,res,report, 'Throughput_Report');
	},
	executivesummaryreport:function(req,res){
		var report = {"id":"6","name":{"locale_label":{"en":"Executive Summary Report","es":"Executive Summary Report"}},"title":{"logo":"iSystemsNow-Logo-RGB-Black.png"},"footer":{"logo":"default.png"},"parameters":{"start_time":{"type":"datetime","locale_label":{"en":"Start Time","es":"Hora de Inicio"},"value":"2015-01-06T05:00:00.000Z"},"end_time":{"type":"datetime","locale_label":{"en":"End Time","es":"Hora de Finalización"},"value":"2015-01-06T17:08:52.253Z"}},"system_name":"MHK International Airport","timezoneoffset":"300","locale":"en"};
		sails.controllers.autoreports.generate(req,res,report, 'Executive_Summary_Report');
	},
    generate : function(req,res,report, prefilename) {
    	var endDateTime = new Date();
    	endDateTime.setHours(0);
    	endDateTime.setMinutes(0);
    	endDateTime.setSeconds(0);
    	endDateTime.setMilliseconds(0);
    	
    
    	var startDateTime = new Date(endDateTime.getTime());
    	
    	startDateTime.setDate(startDateTime.getDate()-1);
    	startDateTime.setHours(4);
    	
    	startDateTime = toUTCDateTimeString(startDateTime);
    	endDateTime = toUTCDateTimeString(endDateTime);
    	
    	report.parameters.start_time.value = startDateTime;
    	report.parameters.end_time.value = endDateTime;
    	
    	//console.log(JSON.stringify(report));
    	
    	
    	var phantom = require('node-phantom');
		var fs = require("fs");
	
		var orientation = 'portrait';
		var footnotes_pass = [];
		if (report.id == 1) {
		    orientation = 'portrait';
		    //footnotes_pass = [ 'First Footer Content line here *', 'second footer content line here *', 'down down down downer' ];
		}
	
		phantom.create(function(err, ph) {
		    ph.createPage(function(err, page) {
			page.set('viewportSize', {
			    width : 1024,
			    height : 480
			});
			var path = sails.config.appPath +'\\assets\\reports\\footer\\' + report.footer.logo;
			fs.readFile(path, function(err, original_data){
			    var base64Image = original_data.toString('base64');
			    //var decodedImage = new Buffer(base64Image, 'base64');
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
        			footnotes : footnotes_pass,
        			logo:'data:image/png;base64,'+base64Image,
        			bot_left:toClientDateTimeString(new Date(), new Date().getTimezoneOffset())    
        		    }
        		}, function() {
        		    var start = new Date().getTime();
        		    report.locale = 'en';
        		    page.open(sails.getBaseurl()+'/reports/view?report_parameters=' + encodeURIComponent(JSON.stringify(report)), function() {
	        			var timestampstring = startDateTime.substring(0,10)+'_'+Math.floor((Math.random() * 1000) + 1); 
	        			
	        			
	        			var filename = 'C:\\iSystemsNow\\BHSArchivedReports\\' + prefilename + '_'+ timestampstring + '.pdf';
	        			var filenamecsv = 'C:\\iSystemsNow\\BHSArchivedReports\\' + prefilename + '_'+ timestampstring + '.csv';
	        			//var url = '/data/report_' + timestampstring + '.pdf'; // sails.config.siteurl+
	        			//var urlcsv = '/data/report_' + timestampstring + '.csv'; // sails.config.siteurl+
	        
	        			page.render(filename, function() {
	        			    var end = new Date().getTime();
	        			    console.log('Page Rendered in ' + (end - start).toString() + 'ms.');
	        			    ph.exit();
	        
	        			    sails.controllers.reports.buildReportData(report, true, function(data) {
		        				if (typeof (data) == 'undefined' || data == null) {
		        				    return res.json({
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
			        					    pdfurl : filename,
			        					    csvurl : filenamecsv
			        					});
		        				    }
		        				});
	        			    });
	        			});
	        
	        		    });
	        		});
        	    });
		    })
		});
    }
};


function toClientDateTimeString(date, offset) {
    var tdate = new Date(date.getTime());
    tdate = new Date(tdate.setMinutes(tdate.getMinutes() - offset)); // SHIFTING HERE!!!
    return tdate.getUTCFullYear() + '-' + padLeft((tdate.getUTCMonth() + 1).toString(), 2) + '-' + padLeft(tdate.getUTCDate(), 2) + ' '
	    + padLeft(tdate.getUTCHours(), 2) + ':' + padLeft(tdate.getUTCMinutes(), 2) + ':' + padLeft(tdate.getUTCSeconds(), 2);
}

function padLeft(nr, n, str) {
    if (String(nr).length >= n) {
	return String(nr);
    }
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}


function toUTCDateTimeString(date) {
    var tdate = new Date(date.getTime());
    tdate = new Date(tdate.setMinutes(tdate.getMinutes() - tdate.getTimezoneOffset())); // SHIFTING HERE!!!
    return tdate.getUTCFullYear() + '-' + padLeft((tdate.getUTCMonth() + 1).toString(), 2) + '-' + padLeft(tdate.getUTCDate(), 2) + ' '
	    + padLeft(tdate.getUTCHours(), 2) + ':' + padLeft(tdate.getUTCMinutes(), 2) + ':' + padLeft(tdate.getUTCSeconds(), 2);
}
