/**
 * View Engine Configuration (sails.config.views)
 * 
 * Server-sent views are a classic and effective way to get your app up and
 * running. Views are normally served from controllers. Below, you can configure
 * your templating language/framework of choice and configure Sails' layout
 * support.
 * 
 * For more information on views and layouts, check out:
 * http://sailsjs.org/#/documentation/concepts/Views
 */

module.exports.views = {

    /***************************************************************************
     * * View engine (aka template language) to use for your app's *server-side* *
     * views * * Sails+Express supports all view engines which implement TJ
     * Holowaychuk's * `consolidate.js`, including, but not limited to: * * ejs,
     * jade, handlebars, mustache underscore, hogan, haml, haml-coffee, * dust
     * atpl, eco, ect, jazz, jqtpl, JUST, liquor, QEJS, swig, templayed, *
     * toffee, walrus, & whiskers * * For more options, check out the docs: *
     * https://github.com/balderdashy/sails-wiki/blob/0.9/config.views.md#engine * *
     **************************************************************************/

    engine : 'ejs',

    /***************************************************************************
     * * Layouts are simply top-level HTML templates you can use as wrappers for *
     * your server-side views. If you're using ejs or jade, you can take *
     * advantage of Sails' built-in `layout` support. * * When using a layout,
     * when one of your views is served, it is injected * into the `body`
     * partial defined in the layout. This lets you reuse header * and footer
     * logic between views. * * NOTE: Layout support is only implemented for the
     * `ejs` view engine! * For most other engines, it is not necessary, since
     * they implement * partials/layouts themselves. In those cases, this config
     * will be * silently ignored. * * The `layout` setting may be set to one of
     * the following: * * If `false`, layouts will be disabled. Otherwise, if a
     * string is * specified, it will be interpreted as the relative path to
     * your layout * file from `views/` folder. (the file extension, ".ejs",
     * should be * omitted) * *
     **************************************************************************/

    layout : 'layout',

    /***************************************************************************
     * * Using Multiple Layouts with EJS * * If you're using the default engine,
     * `ejs`, Sails supports the use of * multiple `layout` files. To take
     * advantage of this, before rendering a * view, override the `layout` local
     * in your controller by setting * `res.locals.layout`. (this is handy if
     * you parts of your app's UI look * completely different from each other) * *
     * e.g. your default might be * layout: 'layouts/public' * * But you might
     * override that in some of your controllers with: * layout:
     * 'layouts/internal' * *
     **************************************************************************/
    locals : {
	
	logo:{
	    desktop:'/img/ISN-International-Airport-4.png',
	    mobile:'/img/ISN-International-Airport-3.png'
	},
	messaging : true,
	search:{
	    enabled:true,
	    url:'/search'
	},
	i18n:true,
	navpages : {
	    '/dashboard':{
		enabled:true,
		icon:'icon-dashboard'
	    },
	    '/systemconfig':{
		enabled:true,
		icon:'icon-cogs',
		children:{
		    '/admin/users':{
			enabled:true,
			icon:'icon-group'
		    },
		    '/admin/securitygroups':{
			enabled:true,
			icon:'icon-lock'
		    }
		}
	    }
	},
	translate : {
	    'en' : {
		//Login Screen
		'DefaultTitle' : 'BHS Now',
		'Login Title':'Manage your Baggage Handling System',
	        'You are not logged into the system. Please log in.':'You are not signed into the system. Your session may have automatically expired. Please sign in.',
	        'This account does not have access privileges':'This account does not have access privileges.',
	        'Main Title':'Manage your Real Estate.',
	        'Sign in':'Sign in',
	        'Change Password':'Change Password',
	        'Sign Out':'Sign Out',
	        'User':'User',
	        'Search':'Search',
	        'Messages':'Messages',
	        'Password':'Password',
	        'Wrong Password':'The username or password you have entered is incorrect.',
	        'User not Found':'The username or password you have entered is incorrect.',
	        'Username and Password is Required':'A username and Password are required.',
	        'Messaging':'Messaging',
	        'Search people':'Search people',
	        'DB Error':'Database Error.',
	        'FormError':'Error',
	        'FormSuccess':'Success',
	        'Password fields do not match.':'Password fields do not match.',
	        'Password must be at least 1 character long.':'Password must be at least 1 character long.',
	        'Enter a new password for':'Enter a new password for',
	        'Current Password':'Current Password',
	        'New Password':'New Password',
	        'Confirm Password':'Confirm Password',
	        'FormCancel':'Cancel',
	        'FormSet':'Set',
	        'Current password was incorrect.':'Current password was incorrect.',
	        'Password has been successfully changed.':'Password has been successfully changed.',
	        
	        //Chat boxes
	        'Load Earlier Messages':'Load Earlier Messages',
	        'End of messages':'End of messages',
	        
	        //Messages Screen
	        'Messaging':'Messaging',
	        'Users':'Users',
	        'Inbox':'Inbox',
	        'Message User':'Message User',
	        
	        //Users Screen My Account Popover
	        'Users Administration':'Users Administration',
	        'Users':'Users',
	        'Create New User':'Create New',
	        'Create User':'Create User',
	        'Edit':'Edit',
	        'Invalid Username':'Invalid Username',
	        'User Saved':'User Saved',
	        'User Deleted':'User Deleted',
	        'Password Mismatch':'New Password and Confirm Password fields did not match.',
	        
	        //Security Screen
	        'LevelCreate':'Create',
	        'LevelRead':'Read',
	        'LevelUpdate':'Update',
	        'LevelDelete':'Delete',
	        'SecurityResource':'Resource',
	        'Create Security Group':'Create Security Group',
	        'Invalid Security Group Name':'Invalid Security Group Name',
	        'Security Group Saved':'Security Group Saved',
	        'Security Group Deleted':'Security Group Deleted',
		'pages' : {
		    '/' : 'test',
		    '/dashboard':'Dashboard',
		    '/systemconfig':'System Config',
		    '/admin/users':'Users',
		    '/admin/securitygroups':'Security Groups'
		}
	    },
	    'es':{
		//Login Screen
		'DefaultTitle' : 'BHS Now ES',
		'Login Title':'Manage your Baggage Handling System',
	        'You are not logged into the system. Please log in.':'You are not signed into the system. Your session may have automatically expired. Please sign in.',
	        'This account does not have access privileges':'This account does not have access privileges.',
	        'Main Title':'Manage your Real Estate.',
	        'Sign in':'Sign in',
	        'Change Password':'Change Password',
	        'Sign Out':'Sign Out',
	        'User':'User',
	        'Search':'Search',
	        'Messages':'Messages',
	        'Password':'Password',
	        'Wrong Password':'The username or password you have entered is incorrect.',
	        'User not Found':'The username or password you have entered is incorrect.',
	        'Username and Password is Required':'A username and Password are required.',
	        'Messaging':'Messaging',
	        'Search people':'Search people',
	        'DB Error':'Database Error.',
	        'FormError':'Error',
	        'FormSuccess':'Success',
	        'Password fields do not match.':'Password fields do not match.',
	        'Password must be at least 1 character long.':'Password must be at least 1 character long.',
	        'Enter a new password for':'Enter a new password for',
	        'Current Password':'Current Password',
	        'New Password':'New Password',
	        'Confirm Password':'Confirm Password',
	        'FormCancel':'Cancel',
	        'FormSet':'Set',
	        'Current password was incorrect.':'Current password was incorrect.',
	        'Password has been successfully changed.':'Password has been successfully changed.',
	        
	        //Chat boxes
	        'Load Earlier Messages':'Load Earlier Messages',
	        'End of messages':'End of messages',
	        
	        //Messages Screen
	        'Messaging':'Messaging',
	        'Users':'Users',
	        'Inbox':'Inbox',
	        'Message User':'Message User',
	        
	        //Users Screen My Account Popover
	        'Users Administration':'Users Administration',
	        'Users':'Users',
	        'Create New User':'Create New',
	        'Create User':'Create User',
	        'Edit':'Edit',
	        'Invalid Username':'Invalid Username',
	        'User Saved':'User Saved',
	        'User Deleted':'User Deleted',
	        'Password Mismatch':'New Password and Confirm Password fields did not match.',
	        
	        //Security Screen
	        'LevelCreate':'Create',
	        'LevelRead':'Read',
	        'LevelUpdate':'Update',
	        'LevelDelete':'Delete',
	        'SecurityResource':'Resource',
	        'Create Security Group':'Create Security Group',
	        'Invalid Security Group Name':'Invalid Security Group Name',
	        'Security Group Saved':'Security Group Saved',
	        'Security Group Deleted':'Security Group Deleted',
		'pages' : {
		    '/' : 'test',
		    '/dashboard':'Dashboard',
		    '/systemconfig':'System Config',
		    '/admin/users':'Users',
		    '/admin/securitygroups':'Security Groups'
		}
	    }
	},
	templateHelper:{
	    hasChildPage:function(navpage,url){
		if(typeof(navpage.children)!='undefined'){
		    for(childpage in navpage.children){
			if(childpage==url){
			    return true;
			}
		    }
		}
		return false;
	    },
	    passVal:function(val){
		return val;
	    },
	    replaceAll:function(string, find, replace){
		return string.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
	    }
	}
    }

};
