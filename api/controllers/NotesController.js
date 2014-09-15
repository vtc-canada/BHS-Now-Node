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
	var note_search = null;
	if (req.query.note_search != '') {
	    adr = req.query.note_search.trim().split(" ");
	    note_search = '';
	    for(var i=0;i<adr.length;i++){
		if(adr[i].trim()!=''){
		    note_search=note_search+ "+"+adr[i].trim()+"* ";
		}
	    }
	    note_search = "'"+note_search+"'";
	}

	var orderstring = '';
	if(req.query.order[0].column==1){  //Address column
	    orderstring = 'timestamp';
	}else if(req.query.order[0].column==4){
	    orderstring = 'contact';
	}else{
	    orderstring = req.query.columns[req.query.order[0].column].data;
	}
	orderstring = "'"+orderstring+'_'+req.query.order[0].dir+"'";

	filteredCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	totalCount = '@out' + Math.floor((Math.random() * 1000000) + 1);
	sails.controllers.database.credSproc('SearchNotes',[note_search, req.query.user==''?null:"'"+req.query.user+"'",
        		(req.query.saleDateRangeStart == ''||req.query.saleDateRangeStart == null) ? null : "'"+toUTCDateTimeString(req.query.saleDateRangeStart)+"'",
        		(req.query.saleDateRangeEnd == ''||req.query.saleDateRangeEnd == null) ? null : "'"+toUTCDateTimeString(req.query.saleDateRangeEnd)+"'",	                                            	
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
	//date = new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()));
    }
    return date.getUTCFullYear()+'-'+padLeft((date.getUTCMonth()+1).toString(),2)+'-'+ padLeft(date.getUTCDate(),2) + ' ' + padLeft(date.getUTCHours(),2)+':'+padLeft(date.getUTCMinutes(),2)+':'+padLeft(date.getUTCSeconds(),2);
}
