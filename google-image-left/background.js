const css = "div.mJxzWe { display: flex; flex-direction: row-reverse; }";

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.insertCSS({
        target: {tabId: tab.id},
        css: css
    });
});