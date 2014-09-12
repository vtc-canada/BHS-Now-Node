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
    setSecurityGroups: function(req,res){
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
                        sails.controllers.database.localSproc('addUserSecurityPolicy', [ req.body.id, securityGroups[0][i].id, '@id'], function(err, usp) {
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
    },
    create:function(req,res){
        var newuser = req.body;
        if(typeof(req.body.password)!='undefined'){
            var hasher = require("password-hash");
            var password = hasher.generate(newuser.password);
            newuser.password = password;
        }
        newuser.locale = 'en';
        Users.find({username:req.body.username},function(err,users){
           if(err)
                return res.json({error:'Database Error:'+err},500);
            if(users.length<1){
                Users.create(newuser,function(err,user){
                    req.body.id = user.id;
                    req.params.id = user.id;
                    sails.controllers.users.setSecurityGroups(req,res);
                });
            }else{
                res.json({error:'Username already exists!'},500);
            }
        });
    },
    update : function(req, res) {
        var test = req;
        if (typeof (req.params.id) != 'undefined' && !isNaN(parseInt(req.params.id))) {

            var updates = {email:req.body.email,active:req.body.active,loginattempts:0};

            if(typeof(req.body.password)!='undefined'){
                var hasher = require("password-hash");
                var password = hasher.generate(req.body.password);
                updates.password = password;
            }
            Users.update({id:req.params.id},updates,function(err,user){
                sails.controllers.users.setSecurityGroups(req,res);
            });

        }
    }

};