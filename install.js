var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Now-Management-Studio-AV.14024.MHK',
  description: 'BHS NMS',
  script: require('path').join(__dirname,'app.js'),
  env: {
      name: "NODE_ENV",
      value: 'production' // 
    }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();