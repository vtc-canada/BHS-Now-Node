/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your
 * controllers. You can apply one or more policies to a given controller, or
 * protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies`
 * folder, at which point it can be accessed below by its filename, minus the
 * extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.policies = {

    '*' : 'isAuthenticated',
    'buildings':{
	 '*' : 'isAuthenticated',
	 'find':'RoutePolicy',
	 'savebuilding':'RoutePolicy',
	 'getajax':'RoutePolicy',
	 'savebuilding':'RoutePolicy',
	 'getbuilding':'RoutePolicy',
	 'notes':'RoutePolicy',
	 'getcontacts':'RoutePolicy',
	 'getsales':'RoutePolicy',
	 'deletebuilding':'RoutePolicy',
	 'getcompaniesbycontactid':'RoutePolicy',
	 'getcontactsbycompanyid':'RoutePolicy',
	 'export':'RoutePolicy',
	 'deletesale':'RoutePolicy'
    },
    'companies':{
	'*' : 'isAuthenticated',
	'find':'RoutePolicy',
	'searchcompanies':'RoutePolicy',
	'getcontactsbyname':'RoutePolicy',
	'getcontactsbycompanyid':'RoutePolicy',
	'getcompany':'RoutePolicy',
	'notes':'RoutePolicy',
	'updatecompany':'RoutePolicy',
	'deletecompany':'RoutePolicy',
	'export':'RoutePolicy'
    },
    'contacts':{
	'*' : 'isAuthenticated',
	'find':'RoutePolicy',
	'searchcontacts':'RoutePolicy',
	'getcontact':'RoutePolicy',
	'getcompaniesbycontactid':'RoutePolicy',
	'getcompaniesbyname':'RoutePolicy',
	'notes':'RoutePolicy',
	'updatecontact':'RoutePolicy',
	'deletecontact':'RoutePolicy',
	'getaddressbycompanyid':'RoutePolicy',
	'export':'RoutePolicy'
	
    },
    'admin' : {
	'*':'isAuthenticated',
        'users' : 'RoutePolicy',
        'usersjoinedpolicies': 'RoutePolicy',
        'checkusername':'RoutePolicy'
    },
    'users':'RoutePolicy',
    'notes': {
	'*':'isAuthenticated',
	'find':'RoutePolicy',
	'searchnotes':'RoutePolicy',
	'export':'RoutePolicy'
    },
    'maps':{
	'*':'isAuthenticated',
	'index':'RoutePolicy'
    },
    'upload':true,
    'datautility':true,
    'public' : true,
    'main' : {
        'index' : true,  // just redirects here anyways... will pass through these policies again. detects/sets up 1st user.  the '/'  Route!
        'login' : true,
        'auth':true,
        'logout' : 'LoggedInPolicy',
        'joinrooms' : 'LoggedInPolicy'
    },/*
    'reports' : {
        'create' : 'LoggedInPolicy',
        'get_equipment' : 'LoggedInPolicy',
        'printreport' : 'LoggedInPolicy',
        'getdevicesbyeqpid' : 'LoggedInPolicy',
        'promptsave' : 'LoggedInPolicy',
        'promptprint' : 'LoggedInPolicy',
        'printreport' : true, // open for direct access
        'view' : true
    },*/

};

/**
 * Here's what the `isNiceToAnimals` policy from above might look like: (this
 * file would be located at `policies/isNiceToAnimals.js`)
 *
 * We'll make some educated guesses about whether our system will consider this
 * user someone who is nice to animals.
 *
 * Besides protecting rabbits (while a noble cause, no doubt), here are a few
 * other example use cases for policies: + cookie-based authentication +
 * role-based access control + limiting file uploads based on MB quotas + OAuth +
 * BasicAuth + or any other kind of authentication scheme you can imagine
 *
 */

/*
 * module.exports = function isNiceToAnimals (req, res, next) {
 *  // `req.session` contains a set of data specific to the user making this
 * request. // It's kind of like our app's "memory" of the current user.
 *  // If our user has a history of animal cruelty, not only will we // prevent
 * her from going even one step further (`return`), // we'll go ahead and
 * redirect her to PETA (`res.redirect`). if (
 * req.session.user.hasHistoryOfAnimalCruelty ) { return
 * res.redirect('http://PETA.org'); }
 *  // If the user has been seen frowning at puppies, we have to assume that //
 * they might end up being mean to them, so we'll if (
 * req.session.user.frownsAtPuppies ) { return
 * res.redirect('http://www.dailypuppy.com/'); }
 *  // Finally, if the user has a clean record, we'll call the `next()` function //
 * to let them through to the next policy or our controller next(); };
 */
