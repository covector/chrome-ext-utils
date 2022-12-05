try {
  importScripts("secret.js");
} catch (e) {
  console.log(e);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  asyncSend(request, sendResponse);
  return true;
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {manual: true}, function(response) {
    console.log(response.message);
  });
});

asyncSend = async (request, sendResponse) => {
  if (request?.prompt) {
    let contin = (await getContinuation(request.prompt))?.text?.replace(/\n/g, " ");
    const lastPeriod = contin.lastIndexOf(".");
    if (lastPeriod > contin.length / 2) {
      contin = contin.substring(0, lastPeriod + 1);
    }
    sendResponse({contin});
  } else {
    sendResponse({message: "fuckoff"});
  }
}

const getContinuation = (prompt) => {
  let myHeaders = new Headers();
  if (!textsynth_api_key) {
    throw new Error("Please put 'const textsynth_api_key = \"YOUR_API_KEY\";' into secret.js")
  }
  myHeaders.append("Authorization", `Bearer ${textsynth_api_key}`);
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    "prompt": prompt
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch("https://api.textsynth.com/v1/engines/gptj_6B/completions", requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
}