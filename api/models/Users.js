/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
	  username : 'STRING',
	  password : 'STRING',
	  email:{
	      type:'STRING'
	  },
	  active:{
	      type:'BOOLEAN',
	      defaultsTo: 1
	  },
	  loginattempts:{
	      type : 'INTEGER',
	      defaultsTo : 0
	  },
	  locale : 'STRING'
  }

};
