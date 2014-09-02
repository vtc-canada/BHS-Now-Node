/**
 * ContactsController
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
     * (specific to ContactsController)
     */
    _config : {},
    find : function(req, res) {
	res.view('contacts/index', {});
    },
    getcontact : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.credSproc('GetContact',[parseInt(req.params.id)],function(err, contact){
		if(err||typeof(contact[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(contact[0][0]);
	    });
	}
    },
    getcontactsbyname : function(req,res){
	sails.controllers.database.credSproc('GetContactsByName',[typeof (req.body.search) != 'undefined' ? "'" + req.body.search + "'" : null],function(err, contacts){
	    if(err||typeof(contacts[0])=='undefined')
		return res.json({error:'Database Error'+err},500);
	    res.json(contacts[0]);
	});
    },
    getcompany : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.credSproc('GetCompany',[parseInt(req.params.id)],function(err, company){
		if(err||typeof(company[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(company[0][0]);
	    });
	}
    },
    getcompaniesbyname : function(req,res){
	    sails.controllers.database.credSproc('GetCompaniesByName',[typeof (req.body.search) != 'undefined' ? "'" + req.body.search + "'" : null],function(err, companies){
		if(err||typeof(companies[0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(companies[0]);
	    });
    },
    getcompaniesbycontactid : function(req,res){
	    sails.controllers.database.credSproc('GetCompaniesByContactId',[req.body.contact_id],function(err, companies){
		if(err||typeof(companies[0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(companies[0]);
	    });
    },
    getaddressbycompanyid : function(req,res){
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.credSproc('GetAddressByCompanyId',[parseInt(req.params.id)],function(err, address){
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
	    sails.controllers.database.credSproc('GetAddress',[parseInt(req.params.id)],function(err, address){
		if(err||typeof(address[0][0])=='undefined')
		    return res.json({error:'Database Error'+err},500);
		
		res.json(address[0][0]);
	    });
	}
    },
    searchcontacts: function(req,res){
	var contact_search = null;
	if (req.query.contact_search != '') {
	    contact_search = req.query.contact_search.trim().split(" ");
	    adr = req.query.contact_search.trim().split(" ");
	    contact_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    contact_search=contact_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    contact_search = "'"+contact_search.trim()+"'";
	}

	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	sails.controllers.database.credSproc('SearchContacts',[contact_search,req.query.start, req.query.length, null,filteredCount],function(err,responseContacts){
	    if(err){
		return res.json({error:'Database Error:'+err},500);
	    }
	    sails.controllers.database.credSproc('GetContactsCount',[],function(err,responseContactsCount){
		if(err){
		   return res.json({error:'Database Error:'+err},500);
		}
		    res.json({
			draw : req.query.draw,
			recordsTotal : responseContactsCount[0][0].number_of_contact_mappings,
			recordsFiltered : responseContacts[1][filteredCount],
			data : responseContacts[0]
		    });
	    })
	});
	
    },
    deletecontact:function(req,res){
	if(typeof(req.body.contact_id)!='undefined'&&!isNaN(parseInt(req.body.contact_id))){
	    sails.controllers.database.credSproc('DeleteContact',[parseInt(req.body.contact_id)],function(err,resultDelete){
		if(err)
		    return res.json({error:'Database Error:'+err},500);	
		res.json({success:'success'});
		
	    });
	}
    },
    updatecontact:function(req,res){
	contact = req.body.contact;
	companies = req.body.companies;
	function updateContact(contact,cb){
	    if(contact.contact_id != 'new'&&typeof(contact.modified)!='undefined'){
		sails.controllers.database.credSproc('UpdateContact',[contact.contact_id,"'"+contact.contact_name+"'","'"+contact.email+"'"],function(err,resContact){
		    if(err)
			return res.json({error:'Database Error:'+err},500);
		
		   sails.controllers.database.credSproc('UpdatePhoneNumberByContactId',[contact.contact_id,"'"+contact.phone_number+"'"],function(err,resPhone){
		        if(err)
    			    return res.json({error:'Database Error:'+err},500);
    			cb(); 
		   });
		});
	    }else if(contact.contact_id == 'new'){
		var outcontactId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		sails.controllers.database.credSproc('CreateContact',["'"+contact.contact_name+"'", "'"+contact.email+"'",outcontactId],function(err, responseCreateContact){
		    if(err)
    			return res.json({error:'Database Error:'+err},500);
		    contact.contact_id = responseCreateContact[1][outcontactId];
		    sails.controllers.database.credSproc('CreatePhoneNumber',["'"+contact.phone_number+"'",contact.contact_id,'@outparamphone'],function(err,resPhone){
		        if(err)
    			    return res.json({error:'Database Error:'+err},500);
    			cb(); 
		   });
		});
	    }else{
		cb();
	    }
	}
	updateContact(contact,function(){
	    function loopCompanies(i)
	    {
		if(typeof(companies[i].new)!='undefined'){
		    sails.controllers.database.credSproc('CreateContactCompanyMapping',[contact.contact_id,companies[i].company_id,'@outval'],function(err,resMapping){
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
		    sails.controllers.database.credSproc('DeleteContactCompanyMapping',[contact.contact_id, companies[i].company_id],function(err,resDel){
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
	
	
    }

};
