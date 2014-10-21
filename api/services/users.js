var deepequal = require('deep-equal');
var onlinestatus = null;
var users = null;
var onlineservicecounter = 0;
var fetchUsersInterval = 30000;
var monitorRate = 500;

setInterval(function(){
    function processStatus(){
	for(var i=0;i<users.length;i++){
	    users[i].online = false;
	    if(typeof(sails.io.rooms['/' + users[i].id]) != 'undefined'&&sails.io.rooms['/' + users[i].id].length>0){
		users[i].online = true;
	    }else{
		users[i].online = false;
	    }
	}
	if(!deepequal(onlinestatus,users)){ // Check to see if there's a change!
	    onlinestatus = JSON.parse(JSON.stringify(users)); // clones object!
	    sails.io.sockets.emit('onlinestatus',users);
	}
    }
    
    onlineservicecounter++;
    if(users == null||onlineservicecounter>Math.floor(fetchUsersInterval/monitorRate)){
	Database.localSproc('getUsers',[],function(err,tempusers){
	    if(err){
		return console.log('error:'+err);
	    }	
	    onlineservicecounter=0;
	    users = tempusers[0];
	    processStatus();
	});
    }else{
	processStatus();
    }
},monitorRate);

module.exports = {
    status : function(){
	return status;
    }
}