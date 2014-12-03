/**
 * UtilitiesController
 *
 * @description :: Server-side logic for managing utilities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    prepfulltext : function(searchterms) {
	if (searchterms != null && searchterms != '') {

	    adr = searchterms.trim();
	    adr = adr.replace(/-/g, ' ').split(" ");
	    
	    var result_search = '';
	    for(var i=0;i<adr.length;i++){
		
		//adr[i] = replaceAll(replaceAll(adr[i].trim(),'(',''),')','');
		adr[i] = adr[i].trim().replace(/[~@%*()\-+<>"]/g, "");//replace(/[|&;$%@"<>()+,]/g, "");
		
		if(adr[i]!=''){
		    result_search=result_search+ "+"+adr[i]+"* ";
		}
	    }
	    result_search = result_search.trim();
	    if(result_search==''){
		result_search = null;
	    }
	    return result_search;
	}else{
	    return null;
	}
    }
};


function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
