function delay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(ms)
      }, ms )
    })
  }

/*
The following function will start the auto checkout process 
*/
function autoCheckOut(link) {
    link.click()
    check()
}

/*
This init function will initially scan for the activity panel and continually scan for it if it can't find it
*/
async function init(){
    let auth = await getFromChromeStorageLocal("harpoon");
    let d = new Date()
    if(auth && auth > d.getTime()) {
        if(location.href.includes("opensea.io/activity")) {
            // activity flow
            initActivityV2()
        } else if (location.href.includes("opensea.io/collection")) {
            // collection flow
            return
            // initCollection() //commenting out collection flow due to changes on opensea
            //future: make a listener that will listen for buy now click
        } else if (location.href.includes("opensea.io/assets")) {
            // assets flow
            initAsset()
        } else {
            return
        }
    }
    
}

async function initActivityV2() {
    //get the list element - we will go through the elements of this list and prepend the links
    let panel = document.querySelector("[role=list]");
    while(panel == null){
        await delay(500)
        panel = document.querySelector("[role=list]");
    }
    // console.log("panel found");
    let elements = panel.querySelectorAll("[role=listitem]");
    while(elements == null || elements.length == 0 || elements[0].children.length == 0){
        await delay(500)
        elements = panel.querySelectorAll("[role=listitem]");
    }
    for( let i = 0; i < elements.length; i++) {
        let ele = elements[i];
        let harpoonList = ele.getElementsByClassName("buy-now-harpoon");
        if (harpoonList.length == 0){
            let links = ele.getElementsByTagName("a");
            let link = document.createElement("a");
            link.id = "purchase";
            link.onclick = function() {autoCheckOut(links[1])};
            link.title = "Purchase";
            link.href = "javascript:void(0);"; //linksList[0].href
            link.textContent = "Buy Now";
            link.className = "buy-now-harpoon";
            let insertParent = ele.children[0].children[0];
            insertParent.insertBefore(link, insertParent.children[2]);
            // ele.prepend(link);
        }
    }

    // let targetList = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 hDhtYs ActivitySearch--history"); //set the observer; does panel change classes?
    // while(targetList.length == 0) {
    //     await delay(500)
    //     targetList = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 hDhtYs ActivitySearch--history");
    // }
    observer.observe(panel.parentElement.parentElement.parentElement, {childList: true, subtree: true });


}

async function initActivity() {
    let panelList = document.getElementsByClassName("EventHistory--Panel");
    while(panelList.length == 0) {
        await delay(500)
        panelList = document.getElementsByClassName("EventHistory--Panel")
    }
    let panel = panelList[0].getElementsByClassName("Scrollbox--content")
    while(panel.length == 0) {
        await delay(500)
        panel = panelList[0].getElementsByClassName("Scrollbox--content")
    }
    console.log("panel found")
    let target = panel[0]
    // observer.observe(target, {childList : true, subtree : true })


    let elements = document.getElementsByClassName("Row--cell Row--cellIsSpaced EventHistory--item-col")
    while(elements.length < 2) {
        console.log("wait for ele")
        await delay(500)
        elements = document.getElementsByClassName("Row--cell Row--cellIsSpaced EventHistory--item-col")
    }
    // console.log("got ele")
    // console.log(elements.length)
    // let style = getStyle();
    for(let i = 0; i < elements.length; i++) {

        let linksList = elements[i].getElementsByTagName("a")
        if(linksList.length == 1) {
            // console.log("detected observed")
            let link = document.createElement("a")
            link.id = "purchase"
            link.onclick = function() {autoCheckOut(linksList[0])}
            link.title = "Purchase"
            link.href = "javascript:void(0);" //linksList[0].href
            link.textContent = "Buy Now"
            link.className = "buy-now-harpoon"
            elements[i].appendChild(link)
        }
    }

}

async function initCollection(){
    //start by getting the grid - we want to set the observer to observe this
    let gridList = document.getElementsByClassName("AssetSearchView--results collection--results")
    while(gridList.length == 0) {
        await delay(500)
        gridList = document.getElementsByClassName("AssetSearchView--results collection--results")
    }
    let grid = gridList[0]

    let gridCells = grid.getElementsByClassName("Assetreact__DivContainer-sc-bnjqwy-0 gwTKfX Asset--loaded AssetSearchList--asset")
    while(gridCells.length == 0) {
        await delay(500)
        gridCells = document.getElementsByClassName("Assetreact__DivContainer-sc-bnjqwy-0 gwTKfX Asset--loaded AssetSearchList--asset")
    }
    //add purchase link to each item same logic as activity
    for(let i = 0; i < gridCells.length; i++) {
        let purchaseLinks = gridCells[i].getElementsByClassName("buy-now-harpoon")
        if (purchaseLinks.length == 0) {
                
            let linksList = gridCells[i].getElementsByTagName("a")
            // console.log("detected observed")
            let link = document.createElement("a")
            link.id = "purchase"
            link.onclick = function() {autoCheckOut(linksList[0])}
            link.title = "Purchase"
            link.href = "javascript:void(0);" //linksList[0].href
            link.textContent = "Buy Now"
            link.className = "buy-now-harpoon"
            gridCells[i].appendChild(link);
        }
        
    }

    // TODO: set the observer to observe grid for changes and add links to them
    // observer.observe(grid, {childList : true, subtree : true })

}

async function initAsset() {
    //just need to put a link or button on the page that calls the check() function
    if(document.getElementById("harpoon-qb")){
        await delay(1000)
        return;
    }
    let tradeStation = document.getElementsByClassName("TradeStation--main");
    let retries = 0
    while (tradeStation.length == 0) {
        await delay(100)
        retries++;
        if(retries > 100){
            console.log("tradestation not found");
            return;
        }
        tradeStation = document.getElementsByClassName("TradeStation--main");
    }
    let btn = document.createElement("button");
    btn.innerHTML = "Quick Buy";
    btn.id = "harpoon-qb";
    btn.onclick = function() { check() };
    tradeStation[0].prepend(btn);
    window.scrollTo(0, 0);
}

async function monitorForPageChange() {
    let auth = await getFromChromeStorageLocal("harpoon");
    let d = new Date()
    if(auth && auth > d.getTime()) {
        while(true) {

            await chrome.storage.local.get(["pageChanged"], async function(result){
                if(result.pageChanged != null && result.pageChanged == true){
                    chrome.storage.local.set({"pageChanged": false});
                    await init()
                }
            });
            
            await delay(500)

        }
    }
}

function changeActivity(mutationRecord) {
    mutationRecord.addedNodes.forEach(function(addedNode) {
        if(addedNode.nodeType === 1) {  // making sure the Node we are getting is an HTML element
            if (addedNode.className === "Rowreact__DivContainer-sc-amt98e-0 emCxyQ  EventHistory--row EventHistory--polledData" || addedNode.className === "Rowreact__DivContainer-sc-amt98e-0 emCxyQ  EventHistory--row") {
                //only want to take this route if it is an actual nft that is listed. polledData is for new listings, the other class name is for past listings when we scroll down
                let itemList = addedNode.getElementsByClassName("Row--cell Row--cellIsSpaced EventHistory--item-col")
                //get just the item element for the event row
                if(itemList.length != 0){
                    for(let i = 0; i < itemList.length; i++) {
                    let linksList = itemList[i].getElementsByTagName("a") //get the link element for the item
                    if(linksList.length == 1) {
                        // console.log("detected observed")
                        let link = document.createElement("a")
                        link.id = "purchase"
                        link.onclick = function() {autoCheckOut(linksList[0])}
                        link.title = "Purchase"
                        link.href = "javascript:void(0);"
                        link.textContent = "Buy Now"
                        link.className("buy-now-harpoon");
                        itemList[i].appendChild(link) //created and added a button to kick off purchase script
                    }
                }
                }
            }
        }
    });
}

function changeActivityV2(mutationRecord) {
    mutationRecord.addedNodes.forEach(function(addedNode) {
        if(addedNode.nodeType === 1) {  // making sure the Node we are getting is an HTML element
            // if (addedNode.className === "styles__StyledLink-sc-l6elh8-0 ekTmzq Blockreact__Block-sc-1xf18x6-0 Flexreact__Flex-sc-1twd32i-0 Itemreact__ItemBase-sc-1idymv7-0 styles__FullRowContainer-sc-12irlp3-0 Gweql jYqxGr fozYbC lcvzZN fresnel-greaterThanOrEqual-lg") {
            if (addedNode.attributes.role && addedNode.attributes.role.value == 'listitem'){
                let linksList = addedNode.getElementsByTagName("a") //get the link element for the item
                if(linksList.length == 0) {
                    // console.log("detected observed")
                    let link = document.createElement("a")
                    link.id = "purchase"
                    link.onclick = function() {autoCheckOut(addedNode)}
                    link.title = "Purchase"
                    link.href = "javascript:void(0);"
                    link.textContent = "Buy Now"
                    link.className("buy-now-harpoon");
                    itemList[i].prepend(link) //created and added a button to kick off purchase script
                }
            
                
            }
        }
    });
}

function changeCollection(mutationRecord) {
    mutationRecord.addedNodes.forEach(function(addedNode) {
        if(addedNode.nodeType === 1) {  // making sure the Node we are getting is an HTML element
            let gridCellContentList = addedNode.getElementsByClassName("Assetreact__DivContainer-sc-bnjqwy-0 gwTKfX Asset--loaded AssetSearchList--asset")

            if (gridCellContentList.length != 0) {
                //gridcell should have something in it
                let purchaseLinks = gridCellContentList[0].getElementsByClassName("buy-now-harpoon")
                if (purchaseLinks.length == 0) {
                        
                    let linksList = gridCellContentList[0].getElementsByTagName("a")
                    // console.log("detected observed")
                    let link = document.createElement("a")
                    link.id = "purchase"
                    link.onclick = function() {autoCheckOut(linksList[0])}
                    link.title = "Purchase"
                    link.href = "javascript:void(0);" //linksList[0].href
                    link.textContent = "Buy Now"
                    link.className = "buy-now-harpoon"
                    gridCellContentList[0].appendChild(link)
                }
            }
        }
    });
}

async function check(){
    let retries = 0
    let btnv1 = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 kmCSYg gMiESj")
    let btnv2 = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 kmCSYg fzwDgL")
    while(btnv1.length == 0 && btnv2.length == 0) {
        await delay(10)
        retries++
        if(retries == 1000){
            console.log("took too long")
            return
        }
        btnv1 = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 kmCSYg gMiESj")
        btnv2 = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 kmCSYg fzwDgL")
    }
    retries = 0
    if(btnv1.length != 0) {
        btnv1[0].click()
    } else {
        btnv2[0].click()
    }
    while(document.getElementById("review-confirmation") == null && document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Modalreact__ModalFooter-sc-xyql9f-4 CheckoutModalreact__StyledFooter-sc-3k02w3-0 dBFmez hLwTLZ iaPZMm").length == 0) {
        await delay(10)
        retries++
        if(retries >= 1000){
            console.log("took too long")
            return
        }
    }

    retries = 0
    let conf = document.getElementById("review-confirmation")
    let checkoutParent = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Modalreact__ModalFooter-sc-xyql9f-4 CheckoutModalreact__StyledFooter-sc-3k02w3-0 dBFmez hLwTLZ iaPZMm")
    console.log(conf)
    while (conf===null){
        if (checkoutParent.length != 0){
            //call checkout btn fn
            break
        }
        await delay(50)
        retries++
        if(retries >= 1000){
            console.log("took too long")
            return
        }
        conf = document.getElementById("review-confirmation")
    }
    if (conf != null) {
        conf.click()
    } 
    checkoutParent = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Modalreact__ModalFooter-sc-xyql9f-4 CheckoutModalreact__StyledFooter-sc-3k02w3-0 dBFmez hLwTLZ iaPZMm")
    while (checkoutParent.length == 0){
        await delay(50)
        retries++
        if(retries >= 1000){
            console.log("took too long")
            return
        }
        checkoutParent = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Modalreact__ModalFooter-sc-xyql9f-4 CheckoutModalreact__StyledFooter-sc-3k02w3-0 dBFmez hLwTLZ iaPZMm")
    }
    let tos = document.getElementById("tos")
    if(tos) {
        tos.click();
    }
    let checkout = checkoutParent[0].getElementsByTagName("button")[0]
    checkout.click();


}

let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {    //runs for each change to target declared below
        // console.log("detected change")
        if(location.href.includes("opensea.io/activity")) {
            // activity flow
            initActivityV2();
        } else if (location.href.includes("opensea.io/collection")) {
            // collection flow
            return
            // changeCollection(mutationRecord)
        } else {
            return
        }
    })
});

const getFromChromeStorageLocal = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, function (result) {
            if (result[key] === undefined) {
                reject();
            }
            else {
                resolve(result[key]);
            }
        });
    });
};



init()
monitorForPageChange()
