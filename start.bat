SET NODE_ENV=production
cd "C:\Program Files\iSystemsNow\Now-Management-Studio"
forever start -a -l "C:\iSystemsNow\Now-Management-Studio\Logs\Now-Management-Studio.log" app.js 