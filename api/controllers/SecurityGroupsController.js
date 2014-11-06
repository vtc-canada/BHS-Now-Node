/**
 * SecurityGroupsController
 * 
 * @description :: Server-side logic for managing Securitygroups
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    findAll : function(req, res) {
	Database.localSproc('NMS_BASE_GetSecurityGroups', [], function(err, securitygroups) {
	    if (err) {
		console.log('getSecurityGroups Error: ' + err);
		return res.json(err);
	    }
	    if (securitygroups[0]) {
		res.json({
		    'data' : securitygroups[0]
		});
	    }
	});

    },
    delete:function(req,res){
	Database.localSproc('NMS_BASE_DeleteSecurityGroup',[req.body.id],function(err,resposne){
	    if(err){
		console.log('Error Deleting User:'+err);
		return res.json({error:'Error Deleting User:'+err},500);
	    } 
	    return res.json({success:true});
	});
    },
    getsecuritygroupandresources : function(req, res) {
	Database.localSproc('NMS_BASE_GetSecurityGroup', [ req.body.id ], function(err, securitygroup) {
	    if (err) {
		console.log('getSecurityGroup Error: ' + err);
		return res.json(err);
	    }
	    Database.localSproc('NMS_BASE_GetSecurityGroupResources', [req.body.id], function(err, securitygroupresources) {
		if (err) {
		    console.log('getSecurityGroupResources Error: ' + err);
		    return res.json(err);
		}
		securitygroup[0][0].resources = securitygroupresources[0];
		res.json(securitygroup[0][0]);
	    });
	});
    },
    savesecuritygroupandresources:function(req,res){
	var securitygroup = req.body.securitygroup;
	

	async.series([
	    function(callback){ // NEW user
		if(securitygroup.id!='new'){
		    return callback(null);// skip out otherwise
		}
		var paramCreateId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		Database.localSproc('NMS_BASE_CreateSecurityGroup',[securitygroup.name,paramCreateId],function(err,responsesecuritygroup){
        	    if(err){
        		return callback(err);
        	    }
        	    securitygroup.newid = responsesecuritygroup[1][paramCreateId];
        	    callback(null);
        	});
	    },
	    function(callback){ // Existing user
		if(securitygroup.id=='new'){ 
		    securitygroup.id = securitygroup.newid;
		    delete securitygroup.newid;
		    return callback(null);// skip out otherwise
		}
        	Database.localSproc('NMS_BASE_UpdateSecurityGroup',[securitygroup.id, securitygroup.name],function(err,responsesecuritygroup){
        	    if(err){
        		return callback(err);
        	    }
        	    callback(null);
        	});
	    }
        ],
        function(err){
	    if(err){
		console.log('Error Saving Security Group'+err);
		return res.json({error:'Error Saving Security Group:'+err},500);
	    }
	    Database.localSproc('NMS_BASE_GetResources',[],function(err,dbresources){
		    if(err){
			console.log('getResources Error'+err);
			return res.json({error:'getResources Error:'+err},500);
		    }
		    dbresources = dbresources[0];
		    var keys = [];
		    var clientresourceset = {};
		    for(group in securitygroup.resources){  // security group.resources should be unioned with FULL set. A new resource may exist at this point, 
								// The ajax may not have ALL the resources included as parameters.
			keys.push(group);
			clientresourceset[securitygroup.resources[group].id]= true; // records the id in an associative array.
		    }
		    for(dbgroup in dbresources){
			if(typeof(clientresourceset[dbresources[dbgroup].id])=='undefined'){ //missing a resource
			    keys.push(''+securitygroup.resources.length);
			    securitygroup.resources.push({id:dbresources[dbgroup].id,create:1,read:1,update:1,delete:1});
			}
		    }
		    
		    Database.localSproc('NMS_BASE_DeleteResourceSecurityGroupMappings',[securitygroup.id],function(err,result){
			if(err){
			    console.log('Error Clearing Resource Security Group Mappings'+err);
			    return res.json({error:'Error Clearing Resource Security Group Mappings'+err},500);
			}
			async.eachSeries(keys,function(key,callback){
			    var resourceObj = securitygroup.resources[key];
			    Database.localSproc('NMS_BASE_CreateResourceSecurityGroupMapping',[resourceObj.id,securitygroup.id,resourceObj.create,resourceObj.read,resourceObj.update,resourceObj.delete],function(err,newmapping){
				if(err){
				    return callback(err);
				}
				callback(null);
			    });
			},function(err,result){
			    if(err){
				console.log('Error Saving Mappings:'+err);
				return res.json({error:'Error Saving Mappings:'+err},500);
			    }
			    res.json({success:true});
			});
		    });
	    });
	});
    }
};
