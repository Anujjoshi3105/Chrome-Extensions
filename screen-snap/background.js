chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'loadFrames') {
      console.log('loadFrames action received');
      // Handle the message as needed
      sendResponse({status: 'received'});
    }
  });
  