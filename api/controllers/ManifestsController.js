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
    board:function(req,res){	
	Database.dataSproc('FMS_MANIFEST_UpdateManifestDetail',[req.params.id,null,1],function(err,result){
	    if(err)
		return res.json({error:'Error:'+err},500);
	    Database.dataSproc('FMS_MANIFEST_GetManifestDetail',[req.params.id],function(err,details){
		if(err||typeof(details[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		Database.dataSproc('FMS_MANIFEST_GetManifest',[details[0][0].cur_manifest_id],function(err, manifest){
			if(err||typeof(manifest[0][0])=='undefined')
			    return res.json({error:'Database Error'+err},500);
			
			sails.io.sockets.emit('manifest_' + manifest[0][0].flight_ID, details[0][0]);
			res.json({success:details[0][0]});
		   });
	    });
	});
	
    },
    addmanifestdetail:function(req,res){
	Database.dataSproc('FMS_MANIFEST_GetManifestByLegId',[req.body.leg_ID],function(err,response){
		if(err)
		    return res.json({error:'Error:'+err});
		if(response[0].length==0){  // returns blank if no results
		    console.log('No such manifest exists under flight ID:'+req.body.flight_ID);
		    return res.json([]);
		}
		var manifestDetailsId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		Database.dataSproc('FMS_MANIFEST_CreateManifestDetail',[response[0][0].id, req.body.contact_ID,manifestDetailsId],function(err,manifestdetail){
		    if(err){
			return console.log('Error:'+err);
		    }
		    Database.dataSproc('FMS_MANIFEST_GetManifestDetail',[manifestdetail[1][manifestDetailsId]],function(err,details){
			if(err||typeof(details[0][0])=='undefined')
			    return res.json({error:'Database Error'+err},500);
			    
			sails.io.sockets.emit('manifest_'+response[0][0].id, details[0][0]);  // manifestId,
												// addedrow
			res.json({success:details[0][0]});
		    });
		});
	    });
    },
    getmanifestdetails : function(req,res){
	if (typeof (req.params.id) == 'undefined' || isNaN(parseInt(req.params.id))) {
	    return console.log('Missing Manifest Id');
	}
	
	Database.dataSproc('FMS_MANIFEST_GetManifestDetails',[parseInt(req.params.id)],function(err,details){
	    if(err||typeof(details[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
	    res.json(details[0][0]);
	});
    },
    getmanifest : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    Database.dataSproc('GetManifest',[parseInt(req.params.id)],function(err, contact){
		if(err||typeof(contact[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(contact[0][0]);
	   });
	}
    },
    updaterow : function(req,res){
	if(typeof(req.body.row.id)!='undefined' && !isNaN(parseInt(req.body.row.id))) {
	    
	    if(req.body.row.is_deleted){
		Database.dataSproc('FMS_MANIFEST_DeleteManifestDetails',[req.body.row.id],function(err,result){
		    if(err)
			return res.json({error:'Error:'+err},500);
		    sails.io.sockets.emit('manifest_'+req.body.row.cur_manifest_id, req.body.row);
		});
	    }else{
		Database.dataSproc('FMS_MANIFEST_UpdateManifestDetail',[req.body.row.id,req.body.row.checked_in,null],function(err,result){
		    if(err)
			return res.json({error:'Error:'+err},500);
		    sails.io.sockets.emit('manifest_'+req.body.row.cur_manifest_id, req.body.row);
		});
	    }
	}
    },
    getandjoinmanifestdetailsbyflight : function(req,res){
	if (typeof (req.body.id) != 'undefined' && !isNaN(parseInt(req.body.id))) {
	    Database.dataSproc('FMS_MANIFEST_GetManifestsByFlightId',[parseInt(req.body.id)],function(err,response){
		if(err)
		    return res.json({error:'Error:'+err});
		
		if(response[0].length==0){  // returns blank if no results
		    console.log('No such manifest exists under flight ID:'+parseInt(req.body.id));
		    return res.json([]);
		}
		
		async.each(response[0],function(manifest,cb){
		    Database.dataSproc('FMS_MANIFEST_GetManifestDetails',[manifest.id],function(err, details){
			    if(err)
				return cb(err);
			    manifest.details = details[0];
			    cb(null);
			    // orphan subscribe.
			    sails.controllers.manifests.subscribetomanifest(req,res,manifest.id,function(err,sub){
				if(err)
				    return console.log('Database Error'+err);
			    });
			}); 
		},function(err,responses){
		    if(err)
			
				return res.json({error:'Database Error'+err},500);
		    res.json(response[0]);
		});
	    });
	}
    },
    clearManifestByLegId:function(leg_ID,cb){
	Database.dataSproc('FMS_MANIFEST_GetManifestByLegId',[leg_ID],function(err,response){
	    if(err||typeof(response[0][0])=='undefined')
		    return cb(err);
	    var manifestId = response[0][0].id; 
	    Database.dataSproc('FMS_MANIFEST_DeleteManifestDetailsByManifestID',[manifestId],function(err,response){
		if(err)
		    return cb(err);
	    
    	    	Database.dataSproc('FMS_MANIFEST_DeleteManifest',[manifestId],function(err,response){
        	    if(err)
        		return cb(err);
        	    cb();
    	    	});
	    });
	});
    },
    subscribetomanifest:function(req,res,flightId,cb){
	for(room in sails.io.roomClients[req.socket.id]){  // leaves all
							    // manifests.....
	    if(room.indexOf('/manifest_')==0){
		req.socket.leave(room);
	    }
	}
	req.socket.join('manifest_'+flightId);
	cb(null);
    },
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    getcontactsbyname : function(req,res){
	req.body.search = sails.controllers.utilities.prepfulltext(req.body.search);
	
	Database.dataSproc('GetContactsByName',[typeof (req.body.search) != 'undefined' ?  req.body.search  : null],function(err, contacts){
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
    searchmanifests: function(req,res){
		sails.controllers.manifests.querymanifests(req,res,function(responseContacts,responseContactsCount){
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
    querymanifests:function(req,res,cb){
	var manifest_search = null;
	if (req.query.manifest_search != '') {
	    manifest_search = req.query.manifest_search.trim().split(" ");
	    adr = req.query.manifest_search.trim().split(" ");
	    manifest_search = '';
	    for(var i=0;i<adr.length;i++){
		adr[i] = adr[i].trim().replace(/[~@%*()\-+<>"]/g, "");
		if(adr[i].trim()!=''){
		    manifest_search=manifest_search+ "+"+adr[i]+"* ";
		}
	    }
	    manifest_search = manifest_search.trim();
	    if(manifest_search==''){
		manifest_search = null;
	    }
	}
	
	var orderstring = null;
	if(typeof(req.query.order)!='undefined'){	  
	    	if(req.query.order[0].column==0){
	    	    orderstring = 'contact_name' +'_'+req.query.order[0].dir;
	    	}else if(req.query.order[0].column==1){  // Address column
        	    orderstring = 'contact_name' +'_'+req.query.order[0].dir;
        	}else if(req.query.order[0].column==4){
        	    orderstring = 'invalid';
        	}else{
        	    orderstring = req.query.columns[req.query.order[0].column].data +'_'+req.query.order[0].dir;
        	}
	}
	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	Database.dataSproc('SearchManifests',[manifest_search,req.query.start, req.query.length, orderstring,filteredCount],function(err,responseContacts){
	    if(err){
		return res.json({error:'Database Error:'+err},500);
	    }
	   Database.dataSproc('GetContactsCount',[],function(err,responseContactsCount){
		if(err){
		   return res.json({error:'Database Error:'+err},500);
		}
		cb(responseContacts,responseContactsCount);
	    });
	});
	
    },
    deletecontact:function(req,res){
	if(req.session.user.policy[req.route.path].delete==1){  // Delete access
								// on
															// this
															// route?
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
		Database.dataSproc('UpdateContact',[contact.contact_id,contact.contact_name,contact.email,contact.phone_number],function(err,resContact){
		    if(err){
		    	return res.json({error:err},500);
		    }
		    cb();
		});
	    }else if(contact.contact_id == 'new'){
		var outcontactId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		Database.dataSproc('CreateContact',[contact.contact_name, contact.email,contact.phone_number,outcontactId],function(err, responseCreateContact){
		    if(err)
    			return res.json({error:err.toString()},500);
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
	
	if(req.session.user.policy[req.route.path].update==0){  // readonly
								// account
															// Notes
															// update.
	    processReadOnlyNotes(function(){
		    return res.json({
			success : 'success',
			contact_id : contact.contact_id
		    });
	    });
	}else{
        	updateContact(contact,function(){
        	    processNotes(function(){
                	    function loopCompanies(i)
                	    {
                		if(typeof(companies[i].new)!='undefined'){
                		   Database.dataSproc('CreateContactCompanyMapping',[contact.contact_id,companies[i].company_id,'@outval'],function(err,resMapping){
                			    if(err)
                				return res.json({error:'Database Error:'+err},500);
                			    i++;	
                			    if(i<companies.length){
                				loopCompanies(i);
                			    }else{
                				res.json({'success':'success', contact_id:contact.contact_id});
                			    }
                			    
                		    });
                		}else if(typeof(companies[i].dodelete)!='undefined'){
                		   Database.dataSproc('DeleteContactCompanyMapping',[contact.contact_id, companies[i].company_id],function(err,resDel){
                			    if(err)
                				return res.json({error:'Database Error:'+err},500);
                			    i++;
                			    if(i<companies.length){
                				loopCompanies(i);
                			    }else{
                				res.json({'success':'success', contact_id:contact.contact_id});
                			    }
                		    });
                		}
                		i++;
                		if(i<companies.length){
                		    loopCompanies(i);
                		}else{
                		    res.json({'success':'success', contact_id:contact.contact_id});
                		}
                		
                	    }
                	    if(companies.length>0){
                		loopCompanies(0);
                	    }else{
                		res.json({'success':'success', contact_id:contact.contact_id});
                	    }
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
	return street_number_begin+street_number_end+','+street_name+','+city+','+province+','+postal_code; 

}
  
