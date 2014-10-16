/**
 * SecurityGroupsController
 * 
 * @description :: Server-side logic for managing Securitygroups
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    getsecuritygroups:function(req,res){
	Database.localSproc('getSecurityGroups',[],function(err,result){
	    if(err){
		console.log('Error Getting Security Groups:'+err);
		return res.json({error:'Error Getting Security Groups:'+err},500);
	    }
	    return res.json(result[0]);
	});
    },
    getresourcegroups:function(req,res){
	Database.localSproc('getResources',[],function(err,result){
	    if(err){
		console.log('Error Getting Resources:'+err);
		return res.json({error:'Error Getting Resources:'+err},500);
	    }
	    return res.json(result[0]);
	});
	
    },
    checkAndCreateBaseUsers : function(cb) {
	Database.localSproc('getUsersCount', [], function(err, result) {
	    if (err) {
		console.log('getUsersCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		var username = sails.config.autogenerate.user.username;
		var hasher = require("password-hash");
		var password = hasher.generate(sails.config.autogenerate.user.password);
		Database.localSproc('createUser', [ username, password, null, 1, 0, 'en','@outCreateUser'], function(err, user) {
		    if (err) {
			console.log('createUser Error' + err);
			return cb(err);
		    }
		    cb(null, user);
		});
	    }
	});
    },
    checkAndCreateBaseSecurityGroups : function(cb) {
	Database.localSproc('getSecurityGroupsCount', [], function(err, result) {
	    if (err) {
		console.log('getSecurityGroupsCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		async.eachSeries(sails.config.autogenerate.securitygroups, function(securitygroup, callback) {
		    Database.localSproc('createSecurityGroup', [ securitygroup, '@outDummyParam' ], function(err, createdsecuritygroup) {
			if (err) {
			    console.log('createSecurityGroup Error' + err);
			    return callback(err);
			}
			callback(null, createdsecuritygroup);
		    });
		}, function(err, asyncresult) {
		    if (err) {
			console.log('SecurityGroup Startup Error:' + err.toString());
			return cb(err);
		    }
		    cb(null, asyncresult);
		});
	    } else { // returning as resources are already set up.
		cb(null, []);
	    }
	});
    },
    checkAndCreateBaseResources : function(cb) {
	Database.localSproc('getResourcesCount', [], function(err, result) {
	    if (err) {
		console.log('getResourcesCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		async.eachSeries(sails.config.autogenerate.resources, function(resource, callback) {
		    Database.localSproc('createResource', [ resource , '@outResourceId' ], function(err, createdresource) {
			if (err) {
			    console.log('createResource Error' + err);
			    return callback(err);
			}
			callback(null, createdresource);
		    });
		}, function(err, asyncresult) {
		    if (err) {
			console.log('Resource Startup Error:' + err.toString());
			return cb(err);
		    }
		    cb(null, asyncresult);
		});
	    } else { // returning as resources are already set up.
		cb(null, []);
	    }
	});
    },
    checkAndCreateUserSecurityGroupMappings : function(cb) {
	Database.localSproc('getUserSecurityGroupMappingsCount', [], function(err, result) {
	    if (err) {
		console.log('getUserSecurityGroupMappingsCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		Database.localSproc('getUsers', [], function(err, users) {
		    if (err) {
			console.log('getUsers Error' + err);
			return cb(err);
		    }
		    if (users[0].length > 0) {
			async.eachSeries(users[0], function(user, callback) {
			    Database.localSproc('getSecurityGroups', [], function(err, securitygroups) {
				if (err) {
				    console.log('getSecurityGroups Error' + err);
				    return callback(err);
				}
				if (securitygroups[0].length > 0) {
				    async.eachSeries(securitygroups[0], function(securitygroup, securitygroupcallback) {

					Database.localSproc('createUserSecurityGroupMapping', [ user.id, securitygroup.id ], function(err,
						createdusersecuritygroupmapping) {
					    if (err) {
						console.log('createUserSecurityGroupMapping Error' + err);
						return securitygroupcallback(err);
					    }
					    securitygroupcallback(null, createdusersecuritygroupmapping);
					});

				    }, function(err, asyncresult) {
					if (err) {
					    console.log('checkAndCreateUserSecurityGroupMappings Error:' + err.toString());
					    return callback(err);
					}
					callback(null, asyncresult);
				    });
				} else { // no users to map.
				    callback(null, []);
				}
			    });
			}, function(err, asyncresult) {
			    if (err) {
				console.log('checkAndCreateUserSecurityGroupMappings Error:' + err.toString());
				return cb(err);
			    }
			    cb(null, asyncresult);
			});
		    } else { // no users to map.
			cb(null, []);
		    }
		});
	    } else { // returning as mappings are already set up.
		cb(null, []);
	    }
	});
    },
    checkAndCreateResourceSecurityGroupMappings : function(cb) {
	Database.localSproc('getResourceSecurityGroupMappingsCount', [], function(err, result) {
	    if (err) {
		console.log('getUserSecurityGroupMappingsCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		Database.localSproc('getResources', [], function(err, resources) {
		    if (err) {
			console.log('getUsers Error' + err);
			return cb(err);
		    }
		    if (resources[0].length > 0) {
			async.eachSeries(resources[0], function(resource, callback) {
			    Database.localSproc('getSecurityGroups', [], function(err, securitygroups) {
				if (err) {
				    console.log('getSecurityGroups Error' + err);
				    return callback(err);
				}
				if (securitygroups[0].length > 0) {
				    async.eachSeries(securitygroups[0], function(securitygroup, securitygroupcallback) {

					Database.localSproc('createResourceSecurityGroupMapping', [ resource.id, securitygroup.id, 1, 1, 1, 1 ], function(err,
						createdresourcesecuritygroupmapping) {
					    if (err) {
						console.log('createResourceSecurityGroupMapping Error' + err);
						return securitygroupcallback(err);
					    }
					    securitygroupcallback(null, createdresourcesecuritygroupmapping);
					});

				    }, function(err, asyncresult) {
					if (err) {
					    console.log('checkAndCreateUserSecurityGroupMappings Error:' + err.toString());
					    return callback(err);
					}
					callback(null, asyncresult);
				    });
				} else { // no users to map.
				    callback(null, []);
				}
			    });
			}, function(err, asyncresult) {
			    if (err) {
				console.log('checkAndCreateUserSecurityGroupMappings Error:' + err.toString());
				return cb(err);
			    }
			    cb(null, asyncresult);
			});
		    } else { // no users to map.
			cb(null, []);
		    }
		});
	    } else { // returning as mappings are already set up.
		cb(null, []);
	    }
	});
    },
    createRoute : function(req,cb){
	var resourceId = '@out' + Math.floor((Math.random() * 1000000) + 1);
	Database.localSproc('createResource', [ req.route.path, resourceId], function(err, createdresource) {
	    if (err) {
		console.log('createRoute createResource Error' + err);
		cb(err);
	    }
	    Database.localSproc('getSecurityGroups', [], function(err, securitygroups) {
		if (err) {
		    console.log('createRoute getSecurityGroups Error' + err);
		    return cb(err);
		}
		if (securitygroups[0].length > 0) {
		    async.eachSeries(securitygroups[0], function(securitygroup, securitygroupcallback) {

			Database.localSproc('createResourceSecurityGroupMapping', [ createdresource[1][resourceId], securitygroup.id, 1, 1, 1, 1  ], function(err,
				createdresourcesecuritygroupmapping) {
			    if (err) {
				return securitygroupcallback(err);
			    }
			    securitygroupcallback(null, createdresourcesecuritygroupmapping);
			});

		    }, function(err, asyncresult) {
			if (err) {
			    console.log('createResource checkAndCreateResourceSecurityGroupMappings Error:' + err.toString());
			    return cb(err);
			}
			cb(null, asyncresult);
		    });
		} else { // no securitygroups to map to the new resource.
		    cb(null, []);
		}
	    });
	});
    }
};
