'use strict';

function setAlarm(event) {
  //TESTING make a variable to store the time between alarms
    let _minutes = parseFloat(event.target.value);
  //TESTING
  //chrome.browserAction.setBadgeText({text: 'ON'});
  var numAlarms = 0;

 // var msg = ""+numAlarms;
 // chrome.browserAction.setBadgeText({text: msg});
  //TESTING create the alarm based on minutes to delay from NOW
  chrome.alarms.create({delayInMinutes: _minutes});
//  chrome.alarms.getAll(function(alarms){
//    numAlarms = alarms.length;
//    console.log(numAlarms);
//    chrome.browserAction.setBadgeText({text: ''+numAlarms});

//  });
 // chrome.storage.sync.set({minutes: minutes});
  //TESTING close the extension popup
  //window.close();
}

function clearAlarms() {
  //TESTING remove the extension ON label
  chrome.browserAction.setBadgeText({text: ''});
  //TESTING clear all alarms
  chrome.alarms.clearAll();
   
  //TESTING lose the extension popup
  window.close();
}

//establishing the extension settings
document.getElementById('5min').addEventListener('click', setAlarm);
document.getElementById('cancelAlarm').addEventListener('click', clearAlarms);
