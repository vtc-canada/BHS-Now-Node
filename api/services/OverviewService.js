/**
 * Created with JetBrains WebStorm. User: user Date: 11/28/13 Time: 1:37 PM To
 * change this template use File | Settings | File Templates.
 */

function timeoutService() {

  Database.dataSproc('BHS_UTIL_GetGraphicsStatus',[],function(err,graphics){
      if(err)
	  return console.log('error iterating graphics');
      
      sails.io.sockets.emit('overview', graphics[0]);
      setTimeout(timeoutService, 2000);
  });
};
setTimeout(timeoutService, 50000);