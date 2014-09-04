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
    searchnotes:function(req,res){
	var address_search = null;
	var contact_search = null;
	var company_search = null;
	var note_search = null;
	if (req.query.address_search != '') {
	    adr = req.query.address_search.trim().split(" ");
	    address_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    address_search=address_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    address_search = "'"+address_search.trim()+"'";
	}
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
	if (req.query.company_search != '') {
	    company_search = req.query.company_search.trim().split(" ");
	    adr = req.query.company_search.trim().split(" ");
	    company_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    company_search=company_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    company_search = "'"+company_search.trim()+"'";
	}
	if (req.query.note_search != '') {
	    note_search = req.query.note_search.trim().split(" ");
	    adr = req.query.note_search.trim().split(" ");
	    note_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    note_search=note_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    note_search = "'"+note_search.trim()+"'";
	}

	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	totalCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	sails.controllers.database.credSproc('SearchNotes',[contact_search, address_search, company_search, note_search,
	                                                    req.query.saleDateRangeStart == '' ? null : "'"+req.query.saleDateRangeStart+"'", req.query.saleDateRangeEnd == '' ? null : "'"+req.query.saleDateRangeEnd+"'",
	                                            	req.query.start, req.query.length, null,filteredCount,totalCount],function(err,responseNotes){
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
