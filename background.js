/**SNP Alarms 
by Nathan Rowbottom on his own time and and with his own resources; all rights reserved
A google chrome extension that adds time notification events based on the school schedule
10/21/2019
Times are registered every day and notifications for events that have not passed. 
Number of events that are still stored are indicated on the extension badge
Notification has buttons to allow snooze/dismiss events
11/8/2019
Notifications are onTabActivated event
Notifications are cleaned up properly
TO DO:
Parameterize the snooze amount and the warning time by the same variable
Read times from a google sheets 
Allow admin to toggle special schedule
Test to make sure times are synchonized regardless of login times
Make sure period titles occur in notification
Tidy up code
**/

'use strict';

//the titles of the periods for the warning notifications
var period = ['STEAM Work', 'Period 1', 'Period 2', 'Lunch', 'Period 3', 'Period 4'];

//the notification times; currently 5 minutes left in class.
var hours = 	[9, 	11, 	12, 	13, 	14, 	15, 	16];
var minutes = 	[55, 	0, 	5, 	0, 	0, 	5, 	55];

//not used - remove
var count = 1;
var nextAlarmMinutes = 0;

//if testing will make several notifications separated by a minute
var testing = true;

var date = new Date();

//not used - remove
var convertToMilliseconds = function(hours, minutes){
  return hours*3600000 + minutes*60000;  
};

// used to get the amount of milliseconds between a period end and the current time 
var getTimeDiff = function(hours, minutes){
  date = new Date()
  return (hours - date.getHours())*3600000 + (minutes - date.getMinutes())*60000 - date.getSeconds()*1000 - date.getMilliseconds();
};

//used to update the extension badge with the number of alarms remaining
var updateNumAlarms = function(){
 var numAlarms = '';
 chrome.alarms.getAll(function(alarms){
    numAlarms = ''+alarms.length;
    //console.log(''+numAlarms);
    chrome.browserAction.setBadgeText({text: ''+numAlarms});
  });
};

//used to actually set the notification alarms
var setTimes = function(){
	if (testing){
	    hours = [];
    	     minutes = [];
	}
  date = new Date();
  //clear up old alarms. 
  chrome.alarms.clearAll(); 
  for(var i = 0; i < period.length; i++){

    if(testing){
	//make a series of entries starting 2 minutes in the future to avoid 
      hours.push(date.getHours());
      minutes.push(date.getMinutes()+i+2);      
    } 
    var tempPeriod = period[i];
    var timeDiff = getTimeDiff(hours[i], minutes[i]);
    if (timeDiff > 0){
	//when is snafu so do not use!!!
     // chrome.alarms.create(tempPeriod, {when: i * 60000 });
      chrome.alarms.create(tempPeriod, {delayInMinutes: timeDiff/60000 });
    }

    updateNumAlarms();
    //chrome.sync.set({tempPeriod:period[i]});
    //var tempHours = "hours"+i;
    //chrome.sync.set({tempHours:hours[i]});   
    //var tempMinutes = "minutes"+i;
    //chrome.sync.set({tempMinutes:minutes[i]});

  }
};

chrome.windows.onCreated.addListener(function(){
    
  // setTimes();
});

chrome.tabs.onActivated.addListener(function(){
   setTimes();
});

//force the script to run when a window is first opened.
chrome.windows.onCreated.addListener(function() {
	setTimes();    
//    chrome.windows.getAll(function(windows) {
// 	chrome.browserAction.setBadgeText({text: ''+windows.length});
//        if (windows.length == 1) {
            //TO DO look at the google sheet
            
            //store daily times
            /*for(var i = 0; i < period.length; i++){
                var tempPeriod = "period"+i;
		hours.push(Date.getHours());
		minutes.push(Date.getMinutes()+i+1);
                chrome.sync.set({tempPeriod:period[i]});
                var tempHours = "hours"+i;
                chrome.sync.set({tempHours:hours[i]});   
                var tempMinutes = "minutes"+i;
                chrome.sync.set({tempMinutes:minutes[i]});
                
                //get the milliseconds from now until the alarm 
                //(ignore any that have passed)
		var timeDiff = getTimeDiff(hours[i], minutes[i]);
                //if (timeDiff <= 0){
                //    continue;
                //}
                //else {
                    //make the alarms for the day   
                    chrome.alarms.create(tempPeriod, {when: timeDiff });    
                //}
            }//end for loop 
		*/
            //count = 1;
	//	    updateNumAlarms();
 //       }
  //  });
});


//TESTING when an alarm goes off
chrome.alarms.onAlarm.addListener(function() {
  
  //chrome.browserAction.setBadgeText({text: '!'});
  chrome.notifications.create({
      type:     'basic',
      iconUrl:  'SteamAcademy64.png',
      title:    'STEAM Academy 5 Minute Warning',
      message:  'In five minutes, get ready to go to the next class.',
      buttons: [
        {title: 'Tell me in 5 minutes'},
        {title: 'Nya:węh ,I am good'}
      ],
      priority: 0});

  updateNumAlarms();
});

chrome.notifications.onButtonClicked.addListener(function(item) {
    
    //need to test
   if (item.title === 'Tell me in 5 minutes'){
 //     chrome.storage.sync.get(['minutes'], function() {
  //      chrome.browserAction.setBadgeText({text: 'ON'});
  //      chrome.alarms.create({delayInMinutes: item.minutes});
  //      updateNumAlarms();
   //   });
   }
   else if (item.title === 'Nya:węh ,I am good'){
//       chrome.browserAction.setBadgeText({text: ''});
   }
});
