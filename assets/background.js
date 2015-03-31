var Q = require('q');
var moment = require('moment');
var windowManager = require('./background/window_manager')(chrome);

var PADDING_TOP = 150;
var PADDING_BOTTOM = 300;
var SWITCHER_WIDTH = 455;

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.commands.onCommand.addListener(function(command) {
  // Users can bind a key to this command in their Chrome
  // keyboard shortcuts, at the bottom of their extensions page.
  if (command == 'show-gscheduler') {

    var currentWindow = windowManager.getCurrentWindow();
    var switcherWindowId = windowManager.getSwitcherWindowId();

    Q.all([currentWindow, switcherWindowId])
    .spread(function(currentWindow, switcherWindowId) {
      // Don't activate the switcher from an existing switcher window.
      if (currentWindow.id == switcherWindowId) {
        windowManager.hideSwitcher();
        return;
      };

      windowManager.setLastWindowId(currentWindow.id);
      var left = currentWindow.left + Math.round((currentWindow.width - SWITCHER_WIDTH) / 2);
      var top = currentWindow.top + PADDING_TOP;
      var height = Math.max(currentWindow.height - PADDING_TOP - PADDING_BOTTOM, 600);
      var width = SWITCHER_WIDTH;
      
      windowManager.showSwitcher(width, height, left, top);
    });

  }
});

// chrome.browserAction.setBadgeText({text:data.unreadItems});


