/**
 * ContactsController
 * 
 * @module :: Controller
 * @description :: A set of functions called `actions`.
 * 
 * Actions contain code telling Sails how to respond to a certain type of
 * request. (i.e. do stuff, then send some JSON, show an HTML page, or redirect
 * to another URL)
 * 
 * You can configure the blueprint URLs which trigger these actions
 * (`config/controllers.js`) and/or override them with custom routes
 * (`config/routes.js`)
 * 
 * NOTE: The code you write here supports both HTTP and Socket.io automatically.
 * 
 * @docs :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    _config : {},
    index : function(req, res) {
	res.view('',{});
    },
    notes : function(req, res) {
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    Database.dataSproc('GetContactNotes', [
	     parseInt(req.params.id) ], function(err, result) {
		 if(err)
		    return res.json({error:'Database Error:'+err},500);
		 res.json(result[0]);
	     });  
	}
    },
    getcontact : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	   Database.dataSproc('GetContact',[parseInt(req.params.id)],function(err, contact){
		if(err||typeof(contact[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(contact[0][0]);
	    });
	}
    },
    getcontactsbyname : function(req,res){
	req.body.search = sails.controllers.utilities.prepfulltext(req.body.search);
	Database.dataSproc('GetContactsByName',[typeof (req.body.search) != 'undefined' ?  req.body.search  : null,
			Security.resourceAccess(req,'/admin/users/:id?',{create:1,read:1,update:1,delete:1}),req.session.user.id],function(err, contacts){
	    if(err||typeof(contacts[0])=='undefined')
		return res.json({error:'Database Error'+err},500);
	    res.json(contacts[0]);
	});
    },
    getcompany : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	   Database.dataSproc('GetCompany',[parseInt(req.params.id)],function(err, company){
		if(err||typeof(company[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(company[0][0]);
	    });
	}
    },
    getcompaniesbyname : function(req,res){
		Database.dataSproc('GetCompaniesByName',[typeof (req.body.search) != 'undefined' ?  req.body.search  : null],function(err, companies){
		if(err||typeof(companies[0])=='undefined')
		    return res.json({error:'Database Error'+err},500);			
		res.json(companies[0]);
	    });
},
    getcompaniesbycontactid : function(req,res){
	   Database.dataSproc('GetCompaniesByContactId',[req.body.contact_id],function(err, companies){
		if(err||typeof(companies[0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(companies[0]);
	    });
    },
    getaddressbycompanyid : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	   Database.dataSproc('GetAddressByCompanyId',[parseInt(req.params.id)],function(err, address){
		if(err)
		    return res.json({error:'Database Error'+err},500);
		if(address[0].length!=1){
		    res.json({address_id:'new',street_number_begin:'',street_number_end:null,street_name:'', postal_code:'', city:'',address_type_id:2,province:'',latitude:'',longitude:''});
		}else{
		    res.json(address[0][0]);
		}
	    });
	}
    },
    getaddress : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	   Database.dataSproc('GetAddress',[parseInt(req.params.id)],function(err, address){
		if(err||typeof(address[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(address[0][0]);
	    });
	}
    },
    export:function(req,res){
	req.query = req.body;
	req.query.length = 999999;
	req.query.start = 0;
	sails.controllers.contacts.querycontacts(req,res,function(responseContacts){
	    if(typeof(responseContacts[0])!='undefined'){
		results = responseContacts[0];
	    }
	    var bodystring = 'Contact Name,Phone Number,Email,Associated Companies\r\n';
	    for(var i=0;i<results.length;i++){
		bodystring+='"'+(results[i].contact_name==null?'':results[i].contact_name)+'"';
		bodystring+=',"'+(results[i].phone==null?'':results[i].phone)+'"';
		bodystring+=',"'+(results[i].email==null?'':results[i].email)+'"';
		bodystring+=',"'+(results[i].company==null?'':results[i].company) + '"';
		bodystring+='\r\n';
	    }

	    var AWS = require('aws-sdk'); 
	    AWS.config.update({ "accessKeyId": "AKIAJ7AKNL3ASNPN3IBA", "secretAccessKey": "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", "region": "us-west-2" });
	    

	    var s3 = new AWS.S3(); 

	     // s3.createBucket({Bucket: 'myBucket'}, function() {

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
    searchcontacts: function(req,res){
	sails.controllers.contacts.querycontacts(req,res,function(responseContacts,responseContactsCount){
	    if(typeof(responseContacts[0])=='undefined'){
		return res.json({error:'Database err'});
	    }
	    res.json({
		draw : req.query.draw,
		recordsTotal : responseContactsCount[0][0].number_of_contact_mappings,
		recordsFiltered : responseContacts[1][filteredCount],
		data : responseContacts[0]
	    });
	});
    },
    querycontacts:function(req,res,cb){
	var contact_search = null;
	var company_search = null;
    /** Parse Contact Search **/
	if (req.query.contact_search != '') {
	    contact_search = req.query.contact_search.trim().split(" ");
	    contact = req.query.contact_search.trim().split(" ");
	    contact_search = '';
	
	    for(var i=0;i<contact.length;i++){
	    	contact[i] = contact[i].trim().replace(/[~@%*()\-+<>"]/g, "");
		if(contact[i].trim()!=''){
		    contact_search=contact_search+ "+"+contact[i]+"* ";
		}
	    }
	    contact_search = contact_search.trim();
	    if(contact_search==''){
		contact_search = null;
	    }
	}
	
	/** Parse Company - TODO - this is pretty much the same as function above, should be cleaned up **/
	if (req.query.company_search != '') {
	    company_search = req.query.company_search.trim().split(" ");
	    company = req.query.company_search.trim().split(" ");
	    company_search = '';
	
	    for(var i=0;i<company.length;i++){
	    	company[i] = company[i].trim().replace(/[~@%*()\-+<>"]/g, "");
		if(company[i].trim()!=''){
			company_search=company_search+ "+"+company[i]+"* ";
		}
	    }
	    company_search = company_search.trim();
	    if(company_search==''){
	    	company_search = null;
	    }
	}
	var orderstring = null;
	if(typeof(req.query.order)!='undefined'){	  
	    	if(req.query.order[0].column==0){
	    	    orderstring = 'contact_name' +'_'+req.query.order[0].dir;
	    	}else if(req.query.order[0].column==1){  // name column
        	    orderstring = 'contact_name' +'_'+req.query.order[0].dir;
	    	}else if(req.query.order[0].column==4){  // Birthdate column
        	    orderstring = 'date_of_birth' +'_'+req.query.order[0].dir;
	    	}else{
        	    orderstring = req.query.columns[req.query.order[0].column].data +'_'+req.query.order[0].dir;
        	}
	}
	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	Database.dataSproc('SearchContacts',[contact_search,company_search,req.query.start, req.query.length, orderstring
	                                     ,Security.resourceAccess(req,'/admin/users/:id?',{create:1,read:1,update:1,delete:1}),req.session.user.id,filteredCount],function(err,responseContacts){
	    if(err){
		return res.json({error:'Database Error:'+err},500);
	    }
	   Database.dataSproc('GetContactsCount',[],function(err,responseContactsCount){
		if(err){
		    return res.json({error:'Database Error'+err},500);		
		}
		cb(responseContacts,responseContactsCount);
	    });
	});
	
    },
    deletecontact:function(req,res){
	if(req.session.user.policy[req.route.path].delete==1){  // Delete access on
															// this route?
        	if(typeof(req.body.contact_id)!='undefined'&&!isNaN(parseInt(req.body.contact_id))){
        	   Database.dataSproc('DeleteContact',[parseInt(req.body.contact_id)],function(err,resultDelete){
        		if(err)
        		    return res.json({error:'Database Error:'+err},500);	
        		res.json({success:'success'});
        		
        	    });
        	}
	}
    },
    updatecontact:function(req,res){
	contact = req.body.contact;
	companies = req.body.companies;
	notes = req.body.notes;
	function updateContact(contact,cb){
	    if(contact.contact_id != 'new'&&typeof(contact.modified)!='undefined'){
		Database.dataSproc('UpdateContact',[contact.contact_id,contact.first_name,contact.middle_name,contact.last_name,contact.email,contact.phone_number,contact.date_of_birth
		                                    	,contact.drivers_license,contact.passport_no,contact.nationality, contact.gender, contact.company_id],function(err,resContact){
		    if(err){
			    return res.json({error:'Database Error'+err},500);		
		    }
		    cb();
		});
	    }else if(contact.contact_id == 'new'){
		var outcontactId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		Database.dataSproc('CreateContact',[contact.first_name,contact.middle_name,contact.last_name,contact.email,contact.phone_number,contact.date_of_birth
		                                    	,contact.drivers_license,contact.passport_no,contact.nationality,contact.gender, contact.company_id,outcontactId],function(err, responseCreateContact){
		    if(err)
			    return res.json({error:'Database Error'+err},500);		
		    contact.contact_id = responseCreateContact[1][outcontactId];
		    cb(); 
		});
	    }else{
		cb();
	    }
	}
	
	function processNotes(cb){
	    function loopNotes(i){
		if (notes[i].id.toString().indexOf('new')>-1) { // new
									// Note!
		    var tempOutNoteVar = '@out' + Math.floor((Math.random() * 1000000) + 1);
		   Database.dataSproc('CreateNote', [ notes[i].note, req.session.user.username, 'NOW()',tempOutNoteVar], function(err, responseNote) {
			if (err)
			    return res.json({
				error : err.toString()
			    }, 500);
			
			Database.dataSproc('CreateNoteMapping',[contact.contact_id, responseNote[1][tempOutNoteVar], 1,'@outId'],function(err,responseNoteMapping){
			    if (err)
				return res.json({
					error : err.toString()
				    }, 500);
			    
				i++;
				if (i < notes.length) {
				    loopNotes(i);
				} else {
				    cb();
				}
			});
			
		    });
		}else if (typeof (notes[i].deleted) != 'undefined') { // delete
		   Database.dataSproc('DeleteNote', [ notes[i].id ], function(err, responseNote) {
			if (err)
			    return res.json({
				error : err.toString()
			    }, 500);
			i++;
			if (i < notes.length) {
			    loopNotes(i);
			} else {
			    cb();
			}
		    });
		} else if (typeof (notes[i].modified) != 'undefined') {
		   Database.dataSproc('UpdateNote', [ notes[i].id, notes[i].note, notes[i].user, 'NOW()' ], function(err, responseNote) {
			if (err)
			    return res.json({
				error : err.toString()
			    }, 500);
			i++;
			if (i < notes.length) {
			    loopNotes(i);
			} else {
			    cb();
			}
		    });
		} else {
		    i++;
		    if (i < notes.length) {
			loopNotes(i);
		    } else {
			cb();
		    }
		}
	    }
	    if(notes.length>0){
		loopNotes(0);
	    }else{
		cb();
	    }
	}
		
	function processReadOnlyNotes(cb){
	    function loopNotes(i){
		if (notes[i].id.toString().indexOf('new')>-1) { // new
									// Note!
		    var tempOutNoteVar = '@out' + Math.floor((Math.random() * 1000000) + 1);
		   Database.dataSproc('CreateNote', [ notes[i].note, req.session.user.username, 'NOW()',tempOutNoteVar], function(err, responseNote) {
			if (err)
			    return res.json({
				error : err.toString()
			    }, 500);
			
			Database.dataSproc('CreateNoteMapping',[contact.contact_id, responseNote[1][tempOutNoteVar], 1,'@outId'],function(err,responseNoteMapping){
			    if (err)
				return res.json({
					error : err.toString()
				    }, 500);
			    
				i++;
				if (i < notes.length) {
				    loopNotes(i);
				} else {
				    cb();
				}
			});
			
		    });
		}else if (typeof (notes[i].deleted) != 'undefined') { // delete
		   Database.dataSproc('GetNote',[notes[i].id],function(err,resultMyNote){
			if(err)
			    return console.log('Note error');
			if(resultMyNote[0].length!=1){
			    return console.log('error verifying note');
			}
			if(resultMyNote[0][0].user==req.session.user.username){
        		   Database.dataSproc('DeleteNote', [ notes[i].id ], function(err, responseNote) {
        			if (err)
        			    return res.json({
        				error : err.toString()
        			    }, 500);
        			i++;
        			if (i < notes.length) {
        			    loopNotes(i);
        			} else {
        			    cb();
        			}
        		    });
			}
		    });
		} else if (typeof (notes[i].modified) != 'undefined') {
		   Database.dataSproc('GetNote',[notes[i].id],function(err,resultMyNote){
			if(err)
			    return console.log('Note error');
			if(resultMyNote[0].length!=1){
			    return console.log('error verifying note');
			}
			if(resultMyNote[0][0].user==req.session.user.username){
        		   Database.dataSproc('UpdateNote', [ notes[i].id, notes[i].note, notes[i].user, 'NOW()' ], function(err, responseNote) {
        			if (err)
        			    return res.json({
        				error : err.toString()
        			    }, 500);
        			i++;
        			if (i < notes.length) {
        			    loopNotes(i);
        			} else {
        			    cb();
        			}
        		    });
			}
		    });
		} else {
		    i++;
		    if (i < notes.length) {
			loopNotes(i);
		    } else {
			cb();
		    }
		}
	    }
	    if(notes.length>0){
		loopNotes(0);
	    }else{
		cb();
	    }
	}
	
	if(req.session.user.policy[req.route.path].update==0){  // readonly account
															// Notes update.
	    processReadOnlyNotes(function(){
		    return res.json({
			success : 'success',
			contact_id : contact.contact_id
		    });
	    });
	}else{
        	updateContact(contact,function(){
        	    processNotes(function(){
        		    return res.json({
        				success : 'success',
        				contact_id : contact.contact_id
        		    });

        	    });
        	});
	}
	
    }

};

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function toUTCDateTimeString(date){
    if(date==null){
	date = new Date();
    }else if(typeof(date)!=='object'){
	date = new Date(date);
	// date = new Date(date.setMinutes(date.getMinutes() -
	// date.getTimezoneOffset()));
    }
    
    return date.getUTCFullYear()+'-'+padLeft((date.getUTCMonth()+1).toString(),2)+'-'+ padLeft(date.getUTCDate(),2) + ' ' + padLeft(date.getUTCHours(),2)+':'+padLeft(date.getUTCMinutes(),2)+':'+padLeft(date.getUTCSeconds(),2);
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}


