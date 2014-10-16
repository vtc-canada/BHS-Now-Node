return;
var status = [];

setTimeout(function() {
    console.log('sending clients new statuses');
    status.push('andy');
}, 5000);

module.exports = {
    status : function(){
	return status;
    }
}