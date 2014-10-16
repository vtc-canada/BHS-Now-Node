
module.exports.autogenerate = {

    /***************************************************************************
     * The adminuser account is generated on bootup if the base database is 
     * empty.  The mappings tables are also created with full access to all
     * users to all resources.
     **************************************************************************/
    user : {
	username : 'admin',
	password : '.Glasgow931'
    },
    securitygroups:['Administrator'],
    resources : ['default']

};