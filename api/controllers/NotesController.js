/**
 * NotesController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to NotesController)
   */
  _config: {},

    find : function(req, res) {
    	res.view('notes/index', {});
    },
    export:function(req,res){
	var timezoneoffset = req.body.timezoneoffset;
	var note_search = null;
	if (req.body.note_search != '') {
	    adr = req.body.note_search.trim().split(" ");
	    note_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    note_search=note_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    note_search = note_search;
	}
	var orderstring = null;
	
	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	totalCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	sails.controllers.database.credSproc('SearchNotes',[note_search, req.body.user==''?null:req.body.user,
        		(req.body.saleDateRangeStart == ''||req.body.saleDateRangeStart == null) ? null : toUTCDateTimeString(req.body.saleDateRangeStart),
        		(req.body.saleDateRangeEnd == ''||req.body.saleDateRangeEnd == null) ? null : toUTCDateTimeString(req.body.saleDateRangeEnd),	                                            	
			req.body.start, 999999, orderstring,filteredCount,totalCount],function(err,responseNotes){
	    if(err){
		return res.json({error:'Database Error:'+err},500);
	    }
	    var bodystring = '';
	    
	    for(var i=0;i<responseNotes[0].length;i++){
		var timestamp = responseNotes[0][i].timestamp;
		timestamp = new Date(timestamp.setMinutes(timestamp.getMinutes() -timezoneoffset));
		bodystring+=toUTCDateTimeString(timestamp);
		bodystring+=','+responseNotes[0][i].user;
		bodystring+=','+responseNotes[0][i].note;
		bodystring+=','+(responseNotes[0][i].company==null?'':responseNotes[0][i].company);
		bodystring+=','+(responseNotes[0][i].contact==null?'':responseNotes[0][i].contact);
		bodystring+=','+buildAddressString(responseNotes[0][i]);
		bodystring+='\r\n';
	    }

	    var AWS = require('aws-sdk'); 
	    AWS.config.update({ "accessKeyId": "AKIAJ7AKNL3ASNPN3IBA", "secretAccessKey": "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", "region": "us-west-2" });
	    

	    var s3 = new AWS.S3(); 

	     //s3.createBucket({Bucket: 'myBucket'}, function() {

	    var crypto = require("crypto");
	    var current_date = (new Date()).valueOf().toString();
	    var random = Math.random().toString();
	    var filename = crypto.createHash('sha1').update(current_date + random).digest('hex')+'.csv';
	    var params = {Bucket: 'credcsv', Key: filename, Body: bodystring};

	    s3.putObject(params, function(err, data) {
	    	if (err){       
	        	return console.log(err);  
	    	}
	        var params = {Bucket: 'credcsv', Key: filename};
	        s3.getSignedUrl('getObject', params, function (err, url) {
	             res.json({url:url});
	        }); 
	     });
	});

    },
    searchnotes:function(req,res){
	var note_search = null;
	if (req.query.note_search != '') {
	    adr = req.query.note_search.trim().split(" ");
	    note_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    note_search=note_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    note_search = note_search;
	}

	var orderstring = '';
	if(req.query.order[0].column==1){  //Address column
	    orderstring = 'timestamp';
	}else if(req.query.order[0].column==4){
	    orderstring = 'contact';
	}else{
	    orderstring = req.query.columns[req.query.order[0].column].data;
	}
	orderstring = orderstring+'_'+req.query.order[0].dir;

	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	totalCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	sails.controllers.database.credSproc('SearchNotes',[note_search, req.query.user==''?null:req.query.user,
        		(req.query.saleDateRangeStart == ''||req.query.saleDateRangeStart == null) ? null : toUTCDateTimeString(req.query.saleDateRangeStart),
        		(req.query.saleDateRangeEnd == ''||req.query.saleDateRangeEnd == null) ? null : toUTCDateTimeString(req.query.saleDateRangeEnd),	                                            	
			req.query.start, req.query.length, orderstring,filteredCount,totalCount],function(err,responseNotes){
	    if(err){
		return res.json({error:'Database Error:'+err},500);
	    }
	    res.json({
		draw : req.query.draw,
		recordsTotal : responseNotes[1][totalCount],
		recordsFiltered : responseNotes[1][filteredCount],
		data : responseNotes[0]
	    });
	});
	
    }
    
    
  
};

function toUTCDateTimeString(date){
    if(date==null){
	date = new Date();
    }else if(typeof(date)!=='object'){
	date = new Date(date);
    }
    return date.getUTCFullYear()+'-'+padLeft((date.getUTCMonth()+1).toString(),2)+'-'+ padLeft(date.getUTCDate(),2) + ' ' + padLeft(date.getUTCHours(),2)+':'+padLeft(date.getUTCMinutes(),2)+':'+padLeft(date.getUTCSeconds(),2);
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}

function buildAddressString(data){
	var street_number_begin = '';
	var street_number_end = '';
	var street_name = '';
	var city = '';
	var province = '';
	var postal_code = '';
	
	if(data.street_number_begin!=null){
		street_number_begin = data.street_number_begin;
	}
	if(data.street_number_end!=null&&data.street_number_end!=''){
		street_number_end = data.street_number_end==null||data.street_number_end=='null'?'':' - '+data.street_number_end;
	}
	if(data.street_name!=null&&data.street_name!='')
	{
		street_name= data.street_name==null||data.street_name=='null'?'':' '+data.street_name;
	}
	if(data.city != null && data.city != '')
	{
		city = data.city==null||data.city=='null'?'':data.city;
	}
	if(data.province != null && data.province != '')
	{
		province = data.province==null||data.province=='null'?'':data.province;
	}
	if(data.postal_code != null && data.postal_code != '')
	{
		postal_code =  data.postal_code==null||data.postal_code=='null'?'':data.postal_code; 
	}
	return street_number_begin+street_number_end+', '+street_name+', '+city+', '+province+', '+postal_code; 

}
  
