chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == "getSource") {
    var str = msg.source;
    str = str.replace(/<style.*?>[\s\S]*?<\/style>/gm, ' ');
    str = str.replace(/<script.*?>[\s\S]*?<\/script>/gm, ' ');
    str = str.replace(/<(?:.|\n)*?>/gm, ' ');
    str = str.replace(/\n/gm, ' ');
    
    // message.innerText = str;

    xhr = new XMLHttpRequest();
    // xhr.open("POST", "http://surfshield-env.us-east-1.elasticbeanstalk.com/api/v0.1/rating", true);
    xhr.open("POST", "http://alexbeals.com/test.php", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () { 
      if (xhr.readyState == 4 && xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);

          // var colors = ['#AC1212', '#F37310', '#EBC621', '#9EC430', '#4E9A26'];
          var colors = ['#4E9A26', '#9EC430', '#EBC621', '#F37310', '#AC1212'];
          // var icons = ['red', 'orange', 'yellow', 'yellowgreen', 'green'];
          var icons = ['green', 'yellowgreen', 'yellow', 'orange', 'red'];

          // var data = {
          //   'audience': 5,
          //   'anger': 4.1,
          //   'cyberbullying': 3,
          //   'profanity': 2,
          //   'overall': 1
          // };

          var body = document.querySelector('body');
          var mainScore = document.querySelector('#mainScore');

          var anger = document.querySelector('#anger');
          var audience = document.querySelector('#audience');
          var cyberbullying = document.querySelector('#cyberbullying');
          var profanity = document.querySelector('#profanity');

          var color = colors[Math.round(data.overall) - 1];
          var iconColor = icons[Math.round(data.overall) - 1];

          body.style.backgroundColor = color;
          mainScore.innerText = data.overall;
          mainScore.style.color = color;

          anger.querySelector('.score').innerText = data.anger;
          anger.querySelector('.bar span').style.minWidth = (data.anger/5) * 3 + 'em';
          audience.querySelector('.score').innerText = data.audience;
          audience.querySelector('.bar span').style.minWidth = (data.audience/5) * 3 + 'em';
          cyberbullying.querySelector('.score').innerText = data.cyberbullying;
          cyberbullying.querySelector('.bar span').style.minWidth = (data.cyberbullying/5) * 3 + 'em';
          profanity.querySelector('.score').innerText = data.profanity;
          profanity.querySelector('.bar span').style.minWidth = (data.profanity/5) * 3 + 'em';

          chrome.browserAction.setIcon({
            path: {
              '19': 'icons/' + iconColor + '_19.png',
              '38': 'icons/' + iconColor + '_38.png'
            },
          });

          // chrome.notifications.create('reminder', {
          //   type: 'basic',
          //   iconUrl: 'icons/Main.png',
          //   title: 'Here is the score',
          //   message: 'Site is Safe'
          // }, function(notificationId) {
          //   timer = setTimeout(function(){chrome.notifications.clear(notificationId);}, 1000);
          // });
      }
    }
    var d = JSON.stringify({ url: 'test', text: str });
    xhr.send(d);
  } else if (msg.action == "google") {
    alert('Yup!');
    chrome.notifications.create('reminder', {
      type: 'basic',
      iconUrl: 'icons/Main.png',
      title: 'Here is the score',
      message: 'Site is Safe'
    }, function(notificationId) {
      timer = setTimeout(function(){chrome.notifications.clear(notificationId);}, 1000);
    });
  }
});

function onWindowLoad() {
  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;