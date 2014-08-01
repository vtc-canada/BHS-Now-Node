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
	sails.controllers.database.localSproc('getSecurityGroups', [], function(err, result) {
	    if (err)
		return res.json({
		    error : 'Database Error:' + err
		});

	    for (var i = 0; i < result[0].length; i++) {
		//console.log(result[0].id);
		console.log(req.body);
	    }

	});
	// sails.controllers.database.localSproc('update')
	/*
	 * Users.update({ id : req.param('id') }, { }, function(err, user) { if
	 * (err) return res.send(err, 500); res.json({ success : 'success' }); })
	 */
    }

};