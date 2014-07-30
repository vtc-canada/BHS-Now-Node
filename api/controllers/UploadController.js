/**
 * UploadController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UploadController)
   */
  _config: {},

  getPolicy:function(req,res){

      var bucket='credimages';
      var accesskey='AKIAJMQ2PJJK63JVPX6Q';
      var secret='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';

      var crypto = require("crypto");
      var current_date = (new Date()).valueOf().toString();
      var random = Math.random().toString();
      var filename = crypto.createHash('sha1').update(current_date + random).digest('hex');

      var policy = {
          "expiration": "2014-09-18T07:23:14Z",
          "conditions": [
              {
                  "bucket": bucket
              },
              {
                  "acl": "private"
              },
              [
                  "starts-with",
                  "$key",
                  ""
              ],
              {
                  "success_action_status": "200"
              }
          ]
      };
      var base64policy = new Buffer(JSON.stringify(policy)).toString('base64');
      var signature = crypto.createHmac("sha1", secret).update(base64policy).digest("base64");

      res.json(201,{'policy':base64policy,signature:signature,key:accesskey, filename:filename});
  }

  
};
