chrome.runtime.sendMessage({ action: 'loadFrames' }, (response) => {
  if (chrome.runtime.lastError) {
    console.log('Error:', chrome.runtime.lastError.message);
  } else {
    console.log('Message sent successfully', response);
  }
});

function injectFrames(url, selectedDevices) {
  const style = document.createElement('style');
  style.innerText = `
    .device-frames-container {
      font-weight: 700;
      font-size: 0.9rem;
      color: white;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      padding: 10px;
    }
    input{
      border-radius: 4px;
      margin: 5px;
      width: 60px;
      color: black;
      background-color: white;
      padding: 2px 4px;
    }
    .frame-wrapper, .responsive-frame-wrapper {
      text-align: center;
      margin: 30px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .iframe, .responsive-iframe {
      display: block;
      border: 1px solid black;
      margin-bottom: 10px;
    }
    .responsive-iframe {
      resize: both;
      overflow: auto;
    }
    .label, label {
      margin: 10px;
    }
    .closeBtn {
      position: sticky;
      top: 0;
      right: 0;
      padding: 10px;
      background-color: #f00;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }
    .closeBtn:hover {
      background-color: #c00;
    }
    .iframe-controls {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.className = 'device-frames-container';

  const responsiveFrameWrapper = document.createElement('div');
  responsiveFrameWrapper.className = 'responsive-frame-wrapper';

  const responsiveLabel = document.createElement('div');
  responsiveLabel.className = 'label';

  const responsiveIframe = document.createElement('iframe');
  responsiveIframe.src = url;
  responsiveIframe.className = 'responsive-iframe';
  responsiveIframe.style.width = '1000px';
  responsiveIframe.style.height = '1000px';

  const iframeControls = document.createElement('div');
  iframeControls.className = 'iframe-controls';

  const widthInput = document.createElement('input');
  widthInput.type = 'number';
  widthInput.value = 1000;
  widthInput.min = 10;
  widthInput.addEventListener('input', () => {
    responsiveIframe.style.width = `${widthInput.value}px`;
    updateSizeDisplay();
  });

  const heightInput = document.createElement('input');
  heightInput.type = 'number';
  heightInput.value = 1000;
  heightInput.min = 10;
  heightInput.addEventListener('input', () => {
    responsiveIframe.style.height = `${heightInput.value}px`;
    updateSizeDisplay();
  });

  iframeControls.appendChild(document.createTextNode('Width: '));
  iframeControls.appendChild(widthInput);
  iframeControls.appendChild(document.createTextNode('Height: '));
  iframeControls.appendChild(heightInput);

  responsiveFrameWrapper.appendChild(responsiveLabel);
  responsiveFrameWrapper.appendChild(iframeControls);
  responsiveFrameWrapper.appendChild(responsiveIframe);
  container.appendChild(responsiveFrameWrapper);

  selectedDevices.forEach(device => {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.width = device.width;
    iframe.height = device.height;
    iframe.className = 'iframe';

    const label = document.createElement('div');
    label.innerText = `${device.name} (${device.width}x${device.height})`;
    label.className = 'label';

    const frameWrapper = document.createElement('div');
    frameWrapper.className = 'frame-wrapper';
    frameWrapper.appendChild(label);
    frameWrapper.appendChild(iframe);
    container.appendChild(frameWrapper);
  });

  document.body.appendChild(container);

  const closeButton = document.createElement('button');
  closeButton.className = 'closeBtn';
  closeButton.innerText = 'Close';

  closeButton.addEventListener('click', () => {
    document.body.removeChild(container);
  });

  container.appendChild(closeButton);

  function updateSizeDisplay() {
    const width = responsiveIframe.offsetWidth;
    const height = responsiveIframe.offsetHeight;
    responsiveLabel.innerText = `Responsive Frame: ${width}px x ${height}px`;
  }

  updateSizeDisplay();

  const resizeObserver = new ResizeObserver(updateSizeDisplay);
  resizeObserver.observe(responsiveIframe);
}

const devices = [
  { width: 360, height: 640, class: 'Phone', name: 'Android Small' },
  { width: 360, height: 800, class: 'Phone', name: 'Android Large' },
  { width: 853, height: 1280, class: 'Phone', name: 'Asus Zenbook Fold' },
  { width: 344, height: 882, class: 'Phone', name: 'Galaxy Z Fold 5' },
  { width: 414, height: 736, class: 'Phone', name: 'iPhone 8 Plus' },
  { width: 375, height: 667, class: 'Phone', name: 'iPhone 8' },
  { width: 375, height: 812, class: 'Phone', name: 'iPhone 11 Pro' },
  { width: 414, height: 896, class: 'Phone', name: 'iPhone 11 Pro Max' },
  { width: 390, height: 844, class: 'Phone', name: 'iPhone 12 Pro' },
  { width: 390, height: 844, class: 'Phone', name: 'iPhone 13 & 14' },
  { width: 375, height: 812, class: 'Phone', name: 'iPhone 13 mini' },
  { width: 428, height: 926, class: 'Phone', name: 'iPhone 14 Plus' },
  { width: 393, height: 852, class: 'Phone', name: 'iPhone 14 & 15 Pro' },
  { width: 430, height: 932, class: 'Phone', name: 'iPhone 14 & 15 Pro Max' },
  { width: 414, height: 896, class: 'Phone', name: 'iPhone XR' },
  { width: 375, height: 812, class: 'Phone', name: 'iPhone XS' },
  { width: 320, height: 568, class: 'Phone', name: 'iPhone SE' },
  { width: 320, height: 480, class: 'Phone', name: 'Mobile' },
  { width: 412, height: 732, class: 'Phone', name: 'Nexus 6P' },
  { width: 412, height: 869, class: 'Phone', name: 'Google Pixel 4 XL' },
  { width: 412, height: 915, class: 'Phone', name: 'Pixel 7' },
  { width: 540, height: 720, class: 'Phone', name: 'Surface Duo' },
  { width: 360, height: 740, class: 'Phone', name: 'Samsung Galaxy S8+' },
  { width: 360, height: 740, class: 'Phone', name: 'Samsung Galaxy S10+' },
  { width: 412, height: 914, class: 'Phone', name: 'Samsung Galaxy A51/71' },
  { width: 1440, height: 960, class: 'Tablet', name: 'Surface Pro 8' },
  { width: 744, height: 1133, class: 'Tablet', name: 'iPad mini 8.3' },
  { width: 834, height: 1194, class: 'Tablet', name: 'iPad Pro 11' },
  { width: 1024, height: 1366, class: 'Tablet', name: 'iPad Pro 12.9' },
  { width: 912, height: 1368, class: 'Tablet', name: 'Surface Pro 7' },
  { width: 1280, height: 800, class: 'Tablet', name: 'Nest Hub Max' },
  { width: 1024, height: 600, class: 'Tablet', name: 'Nest Hub' },
  { width: 820, height: 1180, class: 'Tablet', name: 'iPad Air' },
  { width: 768, height: 1024, class: 'Tablet', name: 'iPad Mini' },
  { width: 1024, height: 1366, class: 'Tablet', name: 'iPad Pro' },
  { width: 1440, height: 1024, class: 'Desktop', name: 'Desktop' },
  { width: 1280, height: 832, class: 'Desktop', name: 'MacBook Air' },
  { width: 1512, height: 982, class: 'Desktop', name: 'MacBook Pro 14' },
  { width: 1728, height: 1117, class: 'Desktop', name: 'MacBook Pro 16' },
  { width: 1440, height: 1024, class: 'Desktop', name: 'Wireframe' },
  { width: 1280, height: 720, class: 'Desktop', name: 'TV' },
  { width: 1920, height: 1080, class: 'Presentation', name: 'Slide 16:9' },
  { width: 1024, height: 768, class: 'Presentation', name: 'Slide 4:3' },
];

document.addEventListener('DOMContentLoaded', () => {
  const deviceCheckboxes = document.getElementById('device-checkboxes');
  const deviceClasses = devices.reduce((acc, device) => {
    acc[device.class] = acc[device.class] || [];
    acc[device.class].push(device);
    return acc;
  }, {});

  Object.keys(deviceClasses).forEach(deviceClass => {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.innerText = deviceClass || 'Others';
    fieldset.appendChild(legend);

    deviceClasses[deviceClass].forEach((device, index) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `device-${index}`;
      checkbox.name = device.name;
      checkbox.value = JSON.stringify(device);
      checkbox.checked = true;

      const label = document.createElement('label');
      label.htmlFor = `device-${index}`;
      label.innerText = `${device.name} (${device.width}x${device.height})`;

      const div = document.createElement('div');
      div.className = 'device';
      div.appendChild(checkbox);
      div.appendChild(label);

      fieldset.appendChild(div);
    });
    if (deviceCheckboxes) {
      deviceCheckboxes.appendChild(fieldset);
    }
  });

  document.getElementById('same-window')?.addEventListener('click', () => handleWindowChoice('same-window'));
  document.getElementById('new-window')?.addEventListener('click', () => handleWindowChoice('new-window'));
});

async function handleWindowChoice(windowChoice) {
  let url = document.getElementById('url').value;
  if (!url) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    url = tab.url;
  }

  const selectedDevices = Array.from(document.querySelectorAll('#device-checkboxes input:checked')).map(checkbox => JSON.parse(checkbox.value));

  if (windowChoice === 'same-window') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectFrames,
      args: [url, selectedDevices]
    });
  } else {
    chrome.windows.create({
      url: chrome.runtime.getURL('iframe_viewer.html'),
      type: 'popup',
      state: 'maximized'
    }, (newWindow) => {
      chrome.runtime.onMessage.addListener(function listener(message, sender, sendResponse) {
        if (message.action === 'loadFrames') {
          chrome.runtime.onMessage.removeListener(listener);
          chrome.tabs.sendMessage(newWindow.tabs[0].id, { url, selectedDevices });
        }
      });
    });
  }
}
