// let autoCheckoutOn = false
// chrome.storage.local.set({"autoCheckOutOn": false}, function(){console.log("initalized")})
// chrome.runtime.onMessage.addListener(function(request, sender) {
//     if(request.redirect != undefined && request.redirect)
//         chrome.storage.local.set({"autoCheckOutOn": true}, function(){console.log("auto set")})
//     // request.redirect.click()
// });
// let callback = function(details) {
//     alert("hello");
// };

chrome.tabs.onUpdated.addListener(function(details) {
    chrome.storage.local.set({"pageChanged": true}, function(){console.log("page set")})
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.message) {
        case 'login':
            console.log('login');
            doAuth();
            break;
    }
    return true;
});


function doAuth() {
    chrome.tabs.create({
        url: 'https://discord.com/api/oauth2/authorize?client_id=896236076384026625&redirect_uri=https%3A%2F%2Ffk46b8dvm3.execute-api.us-east-1.amazonaws.com%2Fharpoon-auth&response_type=code&scope=guilds',
        active: false
    }, function (tab) {
        chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true
        });
        const waitForCodeInterval = setInterval(() => {
            try {
                if (tab.id) {
                    chrome.scripting.executeScript({
                        func: () => {
                            return JSON.parse(document.getElementsByTagName('pre')[0].innerText); 
                        },
                        target: {tabId: tab.id}
                     }, function (result) {
                        console.log(result)
                        if(result[0] && result[0].result.status != undefined){
                            clearInterval(waitForCodeInterval);
                            console.log(result[0].result.token.access_token);
                            if (tab.id) {
                                chrome.tabs.remove(tab.id);
                            }
                            if(result[0].result.status == 'success'){
                                var d1 = new Date();
                                d1.getTime()
                                chrome.storage.local.set({harpoonToken: result[0].result.token.access_token});
                                chrome.storage.local.set({harpoon: d1.getTime()+86400000});
                            } 
                            
                            
                        }
                    });
                }
            }
            catch (e) {
                console.warn(e);
            }
        }, 100);
    });
}