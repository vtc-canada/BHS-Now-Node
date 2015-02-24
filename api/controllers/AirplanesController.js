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
    getairplane : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	   Database.dataSproc('GetAirplane',[parseInt(req.params.id)],function(err, contact){
		if(err||typeof(contact[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(contact[0][0]);
	    });
	}
    },
    getwingtypebyresource : function(req,res){
		Database.dataSproc('GetWingTypeByResource',[typeof (req.body.resource) != 'undefined' ?  req.body.resource  : null
				,typeof (req.body.search) != 'undefined' ?  req.body.search  : null],function(err, wingTypes){
			if(err||typeof(wingTypes[0])=='undefined')
			    return res.json({error:'Database Error'+err},500);			
			res.json(wingTypes[0]);
		    });
    },
    getresourcecategories : function(req,res){
		Database.dataSproc('GetResourceCategories',[],function(err, resourceCategory){
			if(err||typeof(resourceCategory[0])=='undefined')
			    return res.json({error:'Database Error'+err},500);			
			res.json(resourceCategory[0]);
		    });
    },
    getcompaniesbyname : function(req,res){
			Database.dataSproc('GetCompaniesByName',[typeof (req.body.search) != 'undefined' ?  req.body.search  : null],function(err, companies){
			if(err||typeof(companies[0])=='undefined')
			    return res.json({error:'Database Error'+err},500);			
			res.json(companies[0]);
		    });
    },
   
    searchairplanes: function(req,res){
	sails.controllers.airplanes.queryairplanes(req,res,function(responseAirplanes,responseAirplanesCount){
	    if(typeof(responseAirplanes[0])=='undefined'){
		return res.json({error:'Database err'});
	    }
	    res.json({
		draw : req.query.draw,
		recordsTotal : responseAirplanesCount[0][0].number_of_contact_mappings,
		recordsFiltered : responseAirplanes[1][filteredCount],
		data : responseAirplanes[0]
	    });
	});
    },
    queryairplanes:function(req,res,cb){
	var airplane_search = null;
	var owner_search = null;
    /** Parse Airplane Search **/
		if (req.query.airplane_search != '') {
			airplane_search = req.query.airplane_search.trim().split(" ");
		    airplane = req.query.airplane_search.trim().split(" ");
		    airplane_search = '';
		
		    for(var i=0;i<airplane.length;i++){
		    	airplane[i] = airplane[i].trim().replace(/[~@%*()\-+<>"]/g, "");
				if(airplane[i].trim()!=''){
					airplane_search=airplane_search+ "+"+airplane[i]+"* ";
				}
		    }
		    airplane_search = airplane_search.trim();
		    if(airplane_search==''){
		    	airplane_search = null;
		}
	}
	
		/** Parse Company - TODO - this is pretty much the same as function above, should be cleaned up **/
		if (req.query.owner_search != '') {
			owner_search = req.query.owner_search.trim().split(" ");
		    owner = req.query.owner_search.trim().split(" ");
		    owner_search = '';
		
		    for(var i=0;i<owner.length;i++){
		    	owner[i] = owner[i].trim().replace(/[~@%*()\-+<>"]/g, "");
				if(owner[i].trim()!=''){
					owner_search=owner_search+ "+"+owner[i]+"* ";
				}
		    }
		    owner_search = owner_search.trim();
		    if(owner_search==''){
		    	owner_search = null;
		    }
		}
	var orderstring = null;
	if(typeof(req.query.order)!='undefined'){	  
	    	if(req.query.order[0].column==0){
	    	    orderstring = 'serial_number' +'_'+req.query.order[0].dir;
        	}else{
        	    orderstring = req.query.columns[req.query.order[0].column].data +'_'+req.query.order[0].dir;
        	}
	}
	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	Database.dataSproc('SearchAirplanes',[airplane_search,owner_search,req.query.start, req.query.length, orderstring,filteredCount],function(err,responseAirplanes){
	    if(err){
		return res.json({error:'Database Error:'+err},500);
	    }
	   Database.dataSproc('GetAirplanesCount',[],function(err,responseAirplanesCount){
		if(err){
		   return res.json({error:'Database Error:'+err},500);
		}
		cb(responseAirplanes,responseAirplanesCount);
	    });
	});
	
    },
    deleteairplane:function(req,res){
	if(req.session.user.policy[req.route.path].delete==1){  // Delete access on
															// this route?
        	if(typeof(req.body.airplane_id)!='undefined'&&!isNaN(parseInt(req.body.airplane_id))){
        	   Database.dataSproc('DeleteAirplane',[parseInt(req.body.airplane_id)],function(err,resultDelete){
        		if(err)
        		    return res.json({error:'Database Error:'+err},500);	
        		res.json({success:'success'});
        		
        	    });
        	}
	}
    },
    updateairplane:function(req,res){
	airplane = req.body.airplane;
	notes = req.body.notes;
	function updateAirplane(airplane,cb){
	    if(airplane.airplane_id != 'new'&&typeof(airplane.modified)!='undefined'){
		Database.dataSproc('UpdateAirplane',[airplane.airplane_id,airplane.resource_category,airplane.wing_type,airplane.call_sign,airplane.serial_number,airplane.owner, airplane.seats],function(err,resAirplane){
		    if(err){
		    	 return res.json({error:'Database Error:'+err},500);	
		    }
		    cb();
		});
	    }else if(airplane.airplane_id == 'new'){
		var outAirplaneId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		Database.dataSproc('CreateAirplane',[airplane.serial_number,airplane.resource_category,airplane.wing_type,airplane.call_sign,airplane.owner,airplane.seats,outAirplaneId],function(err, responseCreateAirplane){
		    if(err)
		    	return res.json({error:'Database Error:'+err},500);
		    airplane.airplane_id = responseCreateAirplane[1][outAirplaneId];
		    cb(); 
		});
	    }else{
		cb();
	    }
	}
	
	function processNotes(cb){
	    function loopNotes(i){
		if (notes[i].id.toString().indexOf('new')>-1) { // new Note!
		    var tempOutNoteVar = '@out' + Math.floor((Math.random() * 1000000) + 1);
		    Database.dataSproc('CreateNote', [ notes[i].note, req.session.user.username, 'NOW()',tempOutNoteVar], function(err, responseNote) {
			if (err)
			    return res.json({
				error : err.toString()
			    }, 500);
			
			Database.dataSproc('CreateNoteMapping',[airplane.airplane_id, responseNote[1][tempOutNoteVar], 1,'@outId'],function(err,responseNoteMapping){
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
		
	
        	updateAirplane(airplane,function(){
        		res.json({'success':'success', airplane_id:airplane.airplane_id});
        	}); 
        	  /*  processNotes(function(){
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
        	    });*/

	
	
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
    }
    
    return date.getUTCFullYear()+'-'+padLeft((date.getUTCMonth()+1).toString(),2)+'-'+ padLeft(date.getUTCDate(),2) + ' ' + padLeft(date.getUTCHours(),2)+':'+padLeft(date.getUTCMinutes(),2)+':'+padLeft(date.getUTCSeconds(),2);
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}


