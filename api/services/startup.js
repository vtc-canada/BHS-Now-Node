/*
 * Startup service.
 */


setTimeout(function(){
    async.series([sails.controllers.security.checkAndCreateBaseUsers,
                  sails.controllers.security.checkAndCreateBaseSecurityGroups,
                  sails.controllers.security.checkAndCreateUserSecurityGroupMappings,
                  sails.controllers.security.checkAndCreateBaseResources,
                  sails.controllers.security.checkAndCreateResourceSecurityGroupMappings
                  ]
    ,function(err,result){
	if(err){
	    console.log('Startup Error:'+err.toString());
	}
    });
},30000);
