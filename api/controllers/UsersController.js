/*---------------------
	:: Users
	-> controller

	this controller is interacted through with blue-prints-
	All users CRUD functionality is default behaviour
	except for update.

	Update is overridden to update and broadcast to the every other client.


---------------------*/
module.exports = {

    _config : {},

    index : function(req, res) {
	sails.controllers.database.localQuery('SELECT * FROM users', function(err, result) {
	    if (err) {
		res.json({
		    error : 'Database Error:' + err
		});
	    } else {
		res.json(result)
	    }
	});

    },
    destroy : function(req, res) {
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.localSproc('deleteUser', [ parseInt(req.params.id) ], function(err, result) {
		if (err) {
		    res.json({
			error : 'Database Error:' + err
		    });
		} else {
		    res.json({
			success : 'success'
		    });
		}
	    });
	}
    },
    update : function(req, res) {
	var test = req;
	if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {
	    sails.controllers.database.localSproc('getSecurityGroups', [], function(err, securityGroups) {
		if (err)
		    return res.json({
			error : 'Database Error:' + err
		    });
		sails.controllers.database.localSproc('clearUserSecurityPolicies', [ parseInt(req.params.id) ], function() {
		    if (err)
			return res.json({
			    error : 'Database Error:' + err
			});
		    for (var i = 0; i < securityGroups[0].length; i++) {
			if (req.body[securityGroups[0][i].name] == 1) {
			    var outid = '@id';
			    sails.controllers.database.localSproc('addUserSecurityPolicy', [ req.body.id, securityGroups[0][i].id, outid], function(err, usp) {
				if (err)
				    return res.json({
					error : 'Database Error:' + err
				    });
				res.json({
				    success : 'succcess'
				});
			    });
			}
		    }

		});
	    });
	}
    }

};