/*---------------------
	:: Messages
	-> model
---------------------*/
module.exports = {

  attributes : {
    fromUserId : 'INT',
    toUserId : 'INT',
    message : 'STRING',
    status:{
	type:'STRING',
	in: ['typing','lostfocus','focused']
    },
    seen : {
      type : 'BOOLEAN',
      defaultsTo : 0
    }
  }

};