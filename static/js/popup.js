window.onload = function() {
  console.log('onload extension2.');
  var bg = chrome.extension.getBackgroundPage();
console.log(bg)
  
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    var tab = tabs[0];
  
    document.querySelector('#title').innerText = tab.title
    document.querySelector('#url').innerText = tab.url;

    // var id = parseInt((new Date)/1);
    chrome.storage.sync.get('urls', (data) => {
      if(data === undefined || !data || !data.urls) {
        data = {
          urls: {
            children: []
          }
        };
      }


      const index = data.urls.children.length;
      const id = data.urls.children[data.urls.children.length - 1].id + 1;

      console.log(data, id);

      data.urls.children.push({
        title: tab.title,
        url: tab.url,
        favicon: tab.favIconUrl,
        index: index,
        id: id
      })
      chrome.storage.sync.set(data);
    })
  });
}

chrome.extension.onConnect.addListener(function(port)
{
  console.log("background.js");
  port.onMessage.addListener(function(msg){
    console.log(msg);

    if(msg.status == "start"){
    }
  });
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log(msg);
});
