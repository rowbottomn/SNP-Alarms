'use strict';

var period = ['STEAM Work', 'Period 1', 'Period 2', 'Lunch', 'Period 3', 'Period 4'];
//var hours = [9, 11, 12, 13, 14, 15];
//var minutes = [55, 0, 5, 0, 0, 5];
var hours = [];
var minutes = [];
var count = 1;
var nextAlarmMinutes = 0;
//var date = Date();
var convertToMilliseconds = function(hours, minutes){
  return hours*3600000 + minutes*60000;  
};

var getTimeDifference = function(hours, minutes){
  return (hours - Date.getHours())*3600000 + (minutes - Date.getMinutes())*60000 - Date.getSeconds()*1000 - Date.getMilliSeconds();
};

var updateNumAlarms = function(){
 var numAlarms = '';
 chrome.alarms.getAll(function(alarms){
    numAlarms = ''+alarms.length;
    //console.log(''+numAlarms);
    chrome.browserAction.setBadgeText({text: ''+numAlarms});

  });
};

var setTimes = function(){
  for(var i = 0; i < period.length; i++){
    var tempPeriod = "period"+i;
    hours.push(Date.getHours());
    minutes.push(Date.getMinutes()+i+1);
    chrome.sync.set({tempPeriod:period[i]});
    var tempHours = "hours"+i;
    chrome.sync.set({tempHours:hours[i]});   
    var tempMinutes = "minutes"+i;
    chrome.sync.set({tempMinutes:minutes[i]});
    var timeDiff = getTimeDiff(hours[i], minutes[i]);
    chrome.alarms.create(tempPeriod, {when: timeDiff });
    updateNumAlarms();
  }
};

//force the script to run when a window is first opened.
chrome.windows.onCreated.addListener(function() {
	setTimes();    
    chrome.windows.getAll(function(windows) {
 	chrome.browserAction.setBadgeText({text: ''+windows.length});
        if (windows.length == 1) {
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
        }
    });
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

chrome.notifications.onButtonClicked.addListener(function() {
    
    //need to test
   if (item.title === 'Tell me in 5 minutes'){
      chrome.storage.sync.get(['minutes'], function(item) {
        chrome.browserAction.setBadgeText({text: 'ON'});
        chrome.alarms.create({delayInMinutes: item.minutes});
        updateNumAlarms();
      });
   }
   else if (item.title === 'Nya:węh ,I am good'){
       chrome.browserAction.setBadgeText({text: ''});
   }
});
