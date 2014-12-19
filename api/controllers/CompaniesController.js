/**
 * CompaniesController
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
   * (specific to CompaniesController)
   */
  _config: {},
  notes : function(req, res) {
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	     sails.controllers.database.credSproc('GetCompanyNotes', [
	     parseInt(req.params.id) ], function(err, result) {
		 if(err)
		    return res.json({error:'Database Error:'+err},500);
		 res.json(result[0]);
	     });  
	}
  },
  find : function(req, res) {
	res.view('companies/index', {});
  },
  getcontactsbyname : function(req,res){
	sails.controllers.database.credSproc('GetContactsByName',[typeof (req.body.search) != 'undefined' ?  req.body.search  : null],function(err, contacts){
	    if(err||typeof(contacts[0])=='undefined')
		return res.json({error:'Database Error'+err},500);
	    res.json(contacts[0]);
	});
  },
  getcontactsbycompanyid : function(req,res){
	    sails.controllers.database.credSproc('GetContactsByCompanyId',[req.body.id],function(err, companies){
		if(err||typeof(companies[0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(companies[0]);
	    });
  },
  getcompany : function(req,res){
	if (typeof (req.body.company_id) != 'undefined' && !isNaN(parseInt(req.body.company_id))) {
	    sails.controllers.database.credSproc('GetCompany',[parseInt(req.body.company_id)],function(err, company){
		if(err||typeof(company[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(company[0][0]);
	    });
	}
  },
  deletecompany:function(req,res){

	if(req.session.user.policy[req.route.path].delete==1){  // Delete access on this route?
        	if(typeof(req.body.company_id)!='undefined'&&!isNaN(parseInt(req.body.company_id))){
        	    sails.controllers.database.credSproc('DeleteCompany',[parseInt(req.body.company_id)],function(err,resultDelete){
        		if(err)
        		    return res.json({error:'Database Error:'+err},500);	
        		res.json({success:'success'});
        	    });
        	}
	}
  },
  getcontact:function(req,res){
      if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.credSproc('GetContact',[parseInt(req.params.id)],function(err, company){
		if(err||typeof(company[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(company[0][0]);
	    });
	}
  },
  export:function(req,res){
	req.query = req.body;
	req.query.length = 999999;
	req.query.start = 0;
	sails.controllers.companies.querycompanies(req,res,function(responseCompanies){
	    if(typeof(responseCompanies[0])!='undefined'){
		results = responseCompanies[0];
	    }
	    var bodystring = 'Company,Phone Number,Address\r\n';
	    for(var i=0;i<results.length;i++){
		bodystring+='"'+(results[i].company_name==null?'':results[i].company_name) + '"';
		bodystring+=',"'+(results[i].phone_number==null?'':results[i].phone_number) + '"';
		bodystring+=',"'+buildAddressString(results[i])+'"';
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
  searchcompanies: function(req,res){
	sails.controllers.companies.querycompanies(req,res,function(responseCompanies){
	    res.json({
		draw : req.query.draw,
		recordsTotal : responseCompanies[1][totalCount],
		recordsFiltered : responseCompanies[1][filteredCount],
		data : responseCompanies[0]
	    });
	});
	
  },
  querycompanies:function(req,res,cb){
      	var address_search = sails.controllers.utilities.prepfulltext(req.query.address_search);
	var contact_search = sails.controllers.utilities.prepfulltext(req.query.contact_search);
	

	var orderstring = null;
	if(typeof(req.query.order)!='undefined'){
		if(req.query.order[0].column==1){  //Address column
		    orderstring = 'company_name';
		}else if(req.query.order[0].column==2){
		    orderstring = 'phone_number';
		}else if(req.query.order[0].column==3){
		    orderstring = 'street_name';
		}else{
		    orderstring = req.query.columns[req.query.order[0].column].data;
		}
		orderstring = orderstring+'_'+req.query.order[0].dir;
	};
	
	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	totalCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	sails.controllers.database.credSproc('SearchCompanies',[contact_search,address_search,req.query.start, req.query.length, orderstring,filteredCount,totalCount],function(err,responseCompanies){
	    if(err){
		return res.json({error:'Database Error:'+err},500);
	    }
	    cb(responseCompanies);
	});
  },
  updatecompany:function(req,res){
	company = req.body.company;
	contacts = req.body.contacts;
	notes = req.body.notes;
	
	
	function updateAddress(company,cb){
	    sails.controllers.database.credSproc('GetAddressOnlyByCompanyId',[company.company_id],function(err,resAddress){
        	if(err)
        	    return res.json({error:'Database Error:'+err},500);
        	if(resAddress[0].length==0){
        	    var outaddressId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		    sails.controllers.database.credSproc('CreateAddress',[company.street_number_begin ,company.street_number_end,company.street_name,company.postal_code,company.city,2,company.province,company.lat, company.lng, null,outaddressId],function(err,resAddress){
		        if(err)
  			    cb(err);
		        sails.controllers.database.credSproc('CreateCompanyAddressMapping',[company.company_id,resAddress[1][outaddressId],'@paramout'],function(err,resMapping){
		            if(err)
		        	cb(err);
		            cb(); 
		        });
		   });	    
        	}else{
        	    sails.controllers.database.credSproc('UpdateAddressByCompanyId',[company.company_id,company.street_number_begin ,company.street_number_end,company.street_name,company.postal_code,company.city,company.province,company.lat, company.lng],function(err,resAddress){
        		if(err)
        		    cb(err);
        		cb(); 
        	    });	    
        	} 
	    });
	}
	
	function updateCompany(company,cb){
	    if(company.company_id != 'new'&&typeof(company.modified)!='undefined'){
		sails.controllers.database.credSproc('UpdateCompany',[company.company_id, company.company_name, company.phone_number],function(err,resCompany){
		    if(err)
			return res.json({error:'Database Error:'+err},500);
		
		    updateAddress(company,function(err){
			if(err)
			    cb(err);
			cb();
		    });
			
		});
	    }else if(company.company_id == 'new'){
		var outcompanyId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		sails.controllers.database.credSproc('CreateCompany',[company.company_name, company.phone_number, outcompanyId],function(err, responseCreateCompany){
		    if(err)
  			return res.json({error:'Database Error:'+err},500);
		    company.company_id = responseCreateCompany[1][outcompanyId];
		    
		    updateAddress(company,function(err){
			if(err)
			    cb(err);
			cb();
		    });
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
		    sails.controllers.database.credSproc('CreateNote', [ notes[i].note, req.session.user.username, 'NOW()',tempOutNoteVar], function(err, responseNote) {
			if (err)
			    return res.json({
				error : 'Database Error:' + err
			    }, 500);
			
			sails.controllers.database.credSproc('CreateNoteMapping',[company.company_id, responseNote[1][tempOutNoteVar], 2,'@outId'],function(err,responseNoteMapping){
			    if (err)
				return res.json({
					error : 'Database Error:' + err
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
		    sails.controllers.database.credSproc('DeleteNote', [ notes[i].id ], function(err, responseNote) {
			if (err)
			    return res.json({
				error : 'Database Error:' + err
			    }, 500);
			i++;
			if (i < notes.length) {
			    loopNotes(i);
			} else {
			    cb();
			}
		    });
		} else if (typeof (notes[i].modified) != 'undefined') {
		    sails.controllers.database.credSproc('UpdateNote', [ notes[i].id, notes[i].note, notes[i].user, 'NOW()' ], function(err, responseNote) {
			if (err)
			    return res.json({
				error : 'Database Error:' + err
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
		    sails.controllers.database.credSproc('CreateNote', [ notes[i].note, req.session.user.username, 'NOW()',tempOutNoteVar], function(err, responseNote) {
			if (err)
			    return res.json({
				error : 'Database Error:' + err
			    }, 500);
			
			sails.controllers.database.credSproc('CreateNoteMapping',[company.company_id, responseNote[1][tempOutNoteVar], 2,'@outId'],function(err,responseNoteMapping){
			    if (err)
				return res.json({
					error : 'Database Error:' + err
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
		    sails.controllers.database.credSproc('GetNote',[notes[i].id],function(err,resultMyNote){
			if(err)
			    return console.log('Note error');
			if(resultMyNote[0].length!=1){
			    return console.log('error verifying note');
			}
			if(resultMyNote[0][0].user==req.session.user.username){
        		    sails.controllers.database.credSproc('DeleteNote', [ notes[i].id ], function(err, responseNote) {
        			if (err)
        			    return res.json({
        				error : 'Database Error:' + err
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
		    sails.controllers.database.credSproc('GetNote',[notes[i].id],function(err,resultMyNote){
			if(err)
			    return console.log('Note error');
			if(resultMyNote[0].length!=1){
			    return console.log('error verifying note');
			}
			if(resultMyNote[0][0].user==req.session.user.username){
        		    sails.controllers.database.credSproc('UpdateNote', [ notes[i].id, notes[i].note, notes[i].user, 'NOW()' ], function(err, responseNote) {
        			if (err)
        			    return res.json({
        				error : 'Database Error:' + err
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
	
	
	if(req.session.user.policy[req.route.path].update==0){  // readonly account Notes update.
	    processReadOnlyNotes(function(){
		    return res.json({
			success : 'success',
			company_id : company.company_id
		    });
	    });
	}else{
        	updateCompany(company,function(err){
        	    if(err)
			return res.json({error:err.toString()},500);
        	    
        	    processNotes(function(){
                	    function loopContacts(i)
                	    {
                		if(typeof(contacts[i].new)!='undefined'){
                		    sails.controllers.database.credSproc('CreateContactCompanyMapping',[contacts[i].contact_id,company.company_id,'@outval'],function(err,resMapping){
                			    if(err)
                				return res.json({error:'Database Error:'+err},500);
                			    i++;	
                			    if(i<contacts.length){
                				loopContacts(i);
                			    }else{
                				res.json({'success':'success', company_id:company.company_id});
                			    }
                			    
                		    });
                		}else if(typeof(contacts[i].dodelete)!='undefined'){
                		    sails.controllers.database.credSproc('DeleteContactCompanyMapping',[contacts[i].contact_id, company.company_id],function(err,resDel){
                			    if(err)
                				return res.json({error:'Database Error:'+err},500);
                			    i++;
                			    if(i<contacts.length){
                				loopContacts(i);
                			    }else{
                				res.json({'success':'success', company_id:company.company_id});
                			    }
                		    });
                		}
                		i++;
                		if(i<contacts.length){
                		    loopContacts(i);
                		}else{
                		    res.json({'success':'success', company_id:company.company_id});
                		}
                		
                	    }
                	    if(contacts.length>0){
                		loopContacts(0);
                	    }else{
                		res.json({'success':'success', company_id:company.company_id});
                	    }
        	    });
        	});
	}
	
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
		city = data.city==null||data.city=='null'?'':','+data.city;
	}
	if(data.province != null && data.province != '')
	{
		province = data.province==null||data.province=='null'?'':','+data.province;
	}
	if(data.postal_code != null && data.postal_code != '')
	{
		postal_code =  data.postal_code==null||data.postal_code=='null'?'':','+data.postal_code; 
	}
	return street_number_begin+street_number_end+street_name+city+province+postal_code; 

}
  
