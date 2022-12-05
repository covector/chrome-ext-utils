// utils for manipulating the dom
const getStory = () => document.getElementsByClassName("sub header")?.[0]?.innerText;
const getWritingAreaRef = () => document.getElementsByTagName("textArea")?.[0];
const getContainerRef = () => document.getElementsByClassName("menu-items")?.[0];
const sign = () => {
  const div = document.getElementsByClassName("menu-items")?.[0]?.children?.[0];
  div?.getElementsByClassName("ui blue button")?.[0]?.click?.()
  div?.getElementsByClassName("ui green button")?.[0]?.click?.()
}

// call api then inject the result in text area
const write = async () => {
  const story = getStory();
  const textArea = getWritingAreaRef();
  if (story && textArea?.value === "") {
    console.log(`Prompt: ${story}`);
    const res = await chrome.runtime.sendMessage({prompt: story});
    const contin = res?.contin ?? "";
    textArea.value = contin;
    console.log(`Continuation: ${contin}`);
    textArea.dispatchEvent(new Event("input", {"bubbles": true}));
    sign();
  }
}

// manual activation failsafe
const manualActivation = async (sendResponse) => {
  await write();
  sendResponse({message: "ok"});
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Manual Activation");
    if (request.manual)
      manualActivation(sendResponse);
      return true;
  }
);

// mutation observer to know when to write
const callback = async (mutate) => {
  if (
    mutate.some((m) => m.type === "childList" && m.addedNodes?.[0]?.className === "ui icon header") ||
    mutate.some((m) => m.type === "characterData" && m.target?.parentNode?.className === "sub header") ||
    mutate.some((m) => m.type === "childList" && m.addedNodes?.[0]?.children?.[0]?.children?.[0]?.className === "sub header")
  ){
    await write();
  }
}
let observer = new MutationObserver(callback);
const setUpObserver = () => {
  const container = getContainerRef();
  if (!container) {
    setTimeout(setUpObserver, 3000);
  }
  else {
    const config = { attributes: true, childList: true, subtree: true, characterData: true };
    observer.observe(container, config);
    console.log("Observer Setup Successfully");
  }
}

setUpObserver();