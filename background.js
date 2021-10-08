let autoCheckoutOn = false
chrome.storage.local.set({"autoCheckOutOn": false}, function(){console.log("initalized")})
chrome.runtime.onMessage.addListener(function(request, sender) {
    if(request.redirect != undefined && request.redirect)
        chrome.storage.local.set({"autoCheckOutOn": true}, function(){console.log("auto set")})
    // request.redirect.click()
});
let callback = function(details) {
    alert("hello");
};

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.storage.local.set({"pageChanged": true}, function(){console.log("page set")})
});

// let filter = {urls: ["https://opensea.io/_next/static/chunks/pages/account-c2f01039aee9b9b1f07e.js"]};

// let opt_extraInfoSpec = [];

// chrome.webRequest.onCompleted.addListener(
//     callback, filter, opt_extraInfoSpec);