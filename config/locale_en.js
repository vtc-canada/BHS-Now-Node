module.exports.views = {
    locals : {
	translate : {
	    'en' : {
		//Login Screen
		'DefaultTitle' : 'BHS Now',
		'Login Title' : 'Manage your Baggage Handling System',
		'You are not logged into the system. Please log in.' : 'You are not signed into the system. Your session may have automatically expired. Please sign in.',
		'This account does not have access privileges' : 'This account does not have access privileges.',
		'Main Title' : 'Manage your Real Estate.',
		'Sign in' : 'Sign in',
		'Change Password' : 'Change Password',
		'Sign Out' : 'Sign Out',
		'User' : 'User',
		'Search' : 'Search',
		'Messages' : 'Messages',
		'Password' : 'Password',
		'Wrong Password' : 'The username or password you have entered is incorrect.',
		'User not Found' : 'The username or password you have entered is incorrect.',
		'Username and Password is Required' : 'A username and Password are required.',
		'Messaging' : 'Messaging',
		'Search people' : 'Search people',
		'DB Error' : 'Database Error.',
		'FormError' : 'Error',
		'FormSuccess' : 'Success',
		'Password fields do not match.' : 'Password fields do not match.',
		'Password must be at least 1 character long.' : 'Password must be at least 1 character long.',
		'Enter a new password for' : 'Enter a new password for',
		'Current Password' : 'Current Password',
		'New Password' : 'New Password',
		'Confirm Password' : 'Confirm Password',
		'FormCancel' : 'Cancel',
		'FormSet' : 'Set',
		'Current password was incorrect.' : 'Current password was incorrect.',
		'Password has been successfully changed.' : 'Password has been successfully changed.',

		//Chat boxes
		'Load Earlier Messages' : 'Load Earlier Messages',
		'End of messages' : 'End of messages',

		//Messages Screen
		'Messaging' : 'Messaging',
		'Users' : 'Users',
		'Inbox' : 'Inbox',
		'Message User' : 'Message User',

		//Users Screen My Account Popover
		'Users Administration' : 'Users Administration',
		'Users' : 'Users',
		'Create New User' : 'Create New',
		'Create User' : 'Create User',
		'Edit' : 'Edit',
		'Invalid Username' : 'Invalid Username',
		'User Saved' : 'User Saved',
		'User Deleted' : 'User Deleted',
		'Password Mismatch' : 'New Password and Confirm Password fields did not match.',

		//Security Screen
		'LevelCreate' : 'Create',
		'LevelRead' : 'Read',
		'LevelUpdate' : 'Update',
		'LevelDelete' : 'Delete',
		'SecurityResource' : 'Resource',
		'Create Security Group' : 'Create Security Group',
		'Invalid Security Group Name' : 'Invalid Security Group Name',
		'Security Group Saved' : 'Security Group Saved',
		'Security Group Deleted' : 'Security Group Deleted',
		
		// General Security Translations
		'Invalid Access':'Invalid Access',

		// Engineering
		
		
		// Dashboard

		'You do not have sufficient privileges to access' : 'You do not have sufficient privileges to access',
		'Dashboard' : 'Dashboard',
		'Date' : 'Date',
		'Equipment' : 'Equipment',
		'Device' : 'Device',
		'Alarm Type' : 'Alarm Type',
		'System Health' : 'System Health',
		'System Throughput' : 'System Throughput',
		'Time In System' : 'Time In System',
		'BHS Overview' : 'BHS Overview',
		'Time' : 'Time',
		'Alarms' : 'Alarms',
		'Daily Reminders' : 'Daily Reminders',
		'Predictive Mainenance Tasks' : 'Predictive Mainenance Tasks',
		'DEVICE' : 'DEVICE',
		'REASON' : 'REASON',
		'Uptime' : 'Uptime',
		'Failsafe Rate' : 'Failsafe Rate',
		'Tracking Rate' : 'Tracking Rate',
		'Key Performance Indicators' : 'Key Performance Indicators',
		'Throughput (bph)' : 'Volume (total bags)',
		'State' : 'State',
		'Jam Rate' : 'Jam Rate',
		'ATR Read Rate' : 'ATR Read Rate',

		//Overview
		
		// Flights
		'All changes saved.':'All changes saved.',
	        'Flight Table':'Flight Table',
	        'Schedule Parameters':'Schedule Parameters',
	        'Schedule Date':'Schedule Date',
	        'Flight Schedule':'Flight Schedule',
	        'Create':'Create',
	        'Save':'Save',
	        'Set':'Set',
	        'Delete':'Delete',
	        'Filter By':'Filter by',
	        'Create Flight':'Create Flight',
	        'Departure Time':'Departure Time',
	        'Airline':'Airline',
	        'Flight Number':'Flight Number',
	        'On Time Offset':'Open Offset',
	        'Late Offset':'Late Offset',
	        'Closed Offset':'Closed Offset',
	        'Virtual Early Dest':'Virtual Early Dest',
	        'Virtual On Time Dest':'Virtual On Time Dest',
	        'Virtual Late Dest':'Virtual Late Dest',
	        'Virtual Locked Out Dest':'Virtual Locked Out Dest',
	        'Flight':'Flight',
	        'Success':'Success',
	        'Failure':'Failure',
	        'All changes saved.':'All changes saved.',
	        'Unprivileged': 'You do not have the required privileges to make changes to the Flight Table.',
	        'Error':'Error',
	        'Invalid Flight Number':'Invalid Flight Number',
	        'Another flight with the same Flight Number already exists.':'Another flight with the same Flight Number already exists.',
	        
	        //Airline Configuraiton
	        'Airline Configuration':'Airline Configuration',
	        'Success':'Success',
	        'Error':'Error',
	        'Airlines':'Airlines',
	        'Airline':'Airline',
	        'Carrier Destination':'Carrier Destination',
	        'Sort By Carrier':'Sort By Carrier',
	        'Sort By Flight':'Sort By Flight',
	        'Save':'Save',
	        'Sort Mode':'Sort Mode',
	        'Airline Configurations have been successfully saved.':'Airline Configurations have been successfully saved.',
	        
	        // Virtual 2 Physical
	        'Virtual 2 Physical':'Virtual to Physical Mapping',
                'Mapping':'Destination Mapping',
                'Virtual Destination':'Virtual Destination',
                'Physical Destination':'Physical Destination',
                'Virtual to Physical settings have been successfully saved.':'Virtual to Physical settings have been successfully saved.',
		
		//Reports
		'Reports' : 'Reports',
		'Reports Criteria' : 'Reports Criteria',
		'Report Type' : 'Report Type',
		'Start Time' : 'Start Time',
		'End Time' : 'End Time',
		'Styling' : 'Styling',
		'Run Report' : 'Run Report',
		'Report Header' : 'Report',
		'PrintError' : 'Error: Unable to print. No printer was selected',
		'Error' : 'Error',
		'DateOrderError' : 'End Time parameter must be greater than Start Time parameter',
		'1 Hour':'1 Hour',
		'30 Minutes':'30 Minutes',
		'15 Minutes':'15 Minutes',

		'pages' : {
		    '/' : 'test',
		    '/dashboard' : 'Dashboard',
		    '/messages' : 'Messaging',
		    '/systemconfig' : 'System Config',
		    '/admin/users' : 'Users',
		    '/admin/securitygroups' : 'Security Groups',
		    '/reports' : 'Reports',
		    '/search' : 'Bag Search',
		    '/flighttable':'Flight Table',
		    '/airlineconfiguration':'Airline Configuration',
		    '/virtual2physical':'Virtual to Physical Mapping',
		    '/engineering':'Engineering',
		    '/overview':'Overview'
		}
	    }
	}
    }
}