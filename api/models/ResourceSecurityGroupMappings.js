/**
 * ResourcesSecurityPolicies
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
      resourceId:{
	  type:'STRING',
	  required:true
      },
      securityGroupId:{
	  type:'INTEGER',
	  required:true
      },
      create:{
	  type:'BOOLEAN',
	  required:true,
	  defaultsTo:false
      },
      read:{
	  type:'BOOLEAN',
	  required:true,
	  defaultsTo:true
      },
      update:{
	  type:'BOOLEAN',
	  required:true,
	  defaultsTo:false
      },
      delete:{
	  type:'BOOLEAN',
	  required:true,
	  defaultsTo:false
      }
    
  }

};
