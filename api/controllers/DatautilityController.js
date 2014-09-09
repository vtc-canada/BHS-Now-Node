/**
 * DatautilityController
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
   * (specific to DatautilityController)
   */
  _config: {},
  
  fixLastSalePrice:function(req,res){
      sails.controllers.database.credQuery('SELECT * FROM cur_buildings WHERE last_sale_price IS NOT NULL',function(err,buildings){
	 if(err) 
	     return console.log('couldnt get cur_buildings');
	 //for(var i=0;i<res.length;i)
	 console.log(buildings.length);
	 for(var i=0;i<buildings.length;i++){
	     if(buildings[i].last_sale_price==''&&isNaN(parseInt(buildings[i].last_sale_price))){
		 console.log('bad value');
		 continue;
	     }
	     if(buildings[i].last_sale_price.indexOf('.')==-1){
		sails.controllers.database.credQuery("UPDATE `cred`.`cur_buildings` SET `last_sale_price` = '"+buildings[i].last_sale_price+".00' WHERE `id` = '"+buildings[i].id+"'",function(err,sres){
		    
		});
	     }
	 }
	 
      });
      
  }

  
};
