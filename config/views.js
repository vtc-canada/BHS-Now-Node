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
	about:{
	    software:'Now Management Studio : 1.0<br>\
	 			MySQL Server : 5.6<br>\
	    		node.js : 0.10.26 <br>\
    			Sails  : 0.10.5',
	    support:'Technical Support : 1-519-279-6485<br>\
		 		Email : support@isystemsnow.com<br>\
	    		Website : <a href="http://www.isystemsnow.com">www.isystemsnow.com</a>'
	},
	messaging : false,
	search:{
	    enabled:true,
	    url:'/search'
	},
	i18nEnabled:true,
	navpages : {
	    '/dashboard':{
		enabled:true,
		icon:'icon-dashboard'
	    },
	    '/reports':{
		enabled:true,
		icon:'icon-copy'
	    },
	    '/search':{
		enabled:true,
		icon:'icon-suitcase'
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
	i18n:function(req,word){
	    return this.translate[req.session.user.locale][word];
	},
	resourceAccess:function(req,page,requestAccess){
	    var policy = {create:0,read:0,update:0,delete:0};
	    if(typeof(req.session.user.policy[page])!='undefined'){
		policy = req.session.user.policy[page]; 
	    }else if(typeof(req.session.user.policy[page+'/:id?'])!='undefined'){
		policy = req.session.user.policy[page+'/:id?']; 
	    }
	    return (policy.create>=requestAccess.create&&policy.read>=requestAccess.read&&policy.update>=requestAccess.update&&policy.delete>=requestAccess.delete);
	},
	templateHelper:{
	    hasChildPage:function(navpage,url){ //checks URL against child pages to see if it is an active parent
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
