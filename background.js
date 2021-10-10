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

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.storage.local.set({"pageChanged": true}, function(){console.log("page set")})
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.message) {
        case 'login':
            console.log('login');
            handleLogin();
            break;
        // case 'get-auth-fe':
        //     let response = await readLocalStorage('auth');
        //     sendResponse({ auth: response });
        //     sendMsg({ type: 'authenticated' });
        //     break;
        // case 'refresh-auth':
        //     let responseBg = await readLocalStorage('auth');
        //     sendMessageContent({
        //         type: "authenticated",
        //         auth: responseBg
        //     });
        //     break;
    }
    return true;
});

// let filter = {urls: ["https://opensea.io/_next/static/chunks/pages/account-c2f01039aee9b9b1f07e.js"]};

// let opt_extraInfoSpec = [];

// chrome.webRequest.onCompleted.addListener(
//     callback, filter, opt_extraInfoSpec);


function handleLogin() {
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
                            return JSON.parse(document.getElementsByTagName('pre')[0].innerText); //change to return token
                        },
                        target: {tabId: tab.id}
                     }, function (result) {
                        console.log(result)
                        if(result[0] && result[0].result.status != undefined){
                            console.log(result[0].result.token.access_token)
                            if (tab.id) {
                                chrome.tabs.remove(tab.id);
                            }

                            clearInterval(waitForCodeInterval);

                        }
                        // }
                    });
                    // chrome.scripting.executeScript(tab.id, {
                    //     code: 'document.documentElement.outerHTML'
                    // }, function (result) {
                    //     console.log(result)
                    //     // if (result[0] && result[0].includes('auth')) {
                    //     //     const auth = result[0].split('auth: "')[1].split('"')[0];
                    //     //     // setStorage('auth', auth)
                    //     //     //eslint-disable-next-line
                    //     //     chrome.storage.local.set({
                    //     //         auth: auth
                    //     //     });
                    //     //     sendMsg({
                    //     //         type: "authenticated"
                    //     //     }); // tells frontend to set state to authenticated
                    //     //     sendMessageContent({
                    //     //         type: "update-auth",
                    //     //         auth: auth
                    //     //     });
                    //         if (tab.id) {
                    //             chrome.tabs.remove(tab.id);
                    //         }
                    //         clearInterval(waitForCodeInterval);
                    //     // }
                    // });
                }
            }
            catch (e) {
                console.warn(e);
            }
        }, 100);
    });
}
