chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.storage.sync.set({active: false});
        chrome.action.setBadgeText({text: "OFF"});
        chrome.action.setBadgeBackgroundColor({color: "#42495c"});
    } else {
        chrome.storage.sync.get("active", ({ active }) => {
            chrome.action.setBadgeText({text: active ? "ON" : "OFF"});
            chrome.action.setBadgeBackgroundColor({color: "#42495c"});
        });
    }
});

chrome.action.onClicked.addListener(() => {
    chrome.storage.sync.get("active", ({ active }) => {
        chrome.storage.sync.set({active: active == null ? true : !active});
        chrome.action.setBadgeText({text: !active ? "ON" : "OFF"});
        chrome.action.setBadgeBackgroundColor({color: "#42495c"});
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get("active", ({ active }) => {
        chrome.action.setBadgeText({text: active ? "ON" : "OFF"});
        chrome.action.setBadgeBackgroundColor({color: "#42495c"});
    });
});