/*
This init function will initially scan for the activity panel and continually scan for it if it can't find it
*/
async function init(){
    if(location.href.includes("opensea.io/activity")) {
        // activity flow
        initActivity()
    } else if (location.href.includes("opensea.io/collection")) {
        // collection flow
        initCollection()
    } else if (location.href.includes("opensea.io/assets")) {
        // assets flow
        return
    } else {
        return
    }
    
}

async function initActivity() {
    let panelList = document.getElementsByClassName("EventHistory--Panel")
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
    observer.observe(target, {childList : true, subtree : true })


    let elements = document.getElementsByClassName("Row--cell Row--cellIsSpaced EventHistory--item-col")
    while(elements.length < 2) {
        console.log("wait for ele")
        await delay(500)
        elements = document.getElementsByClassName("Row--cell Row--cellIsSpaced EventHistory--item-col")
    }
    console.log("got ele")
    console.log(elements.length)
    for(let i = 0; i < elements.length; i++) {

        let linksList = elements[i].getElementsByTagName("a")
        if(linksList.length == 1) {
            // console.log("detected observed")
            let link = document.createElement("a")
            link.id = "purchase"
            link.onclick = function() {autoCheckOut(linksList[0])}
            link.title = "Purchase"
            link.href = "javascript:void(0);" //linksList[0].href
            link.textContent = "Purchase"
            link.className = "purchase"
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
        let purchaseLinks = gridCells[i].getElementsByClassName("purchase")
        if (purchaseLinks.length == 0) {
                
            let linksList = gridCells[i].getElementsByTagName("a")
            // console.log("detected observed")
            let link = document.createElement("a")
            link.id = "purchase"
            link.onclick = function() {autoCheckOut(linksList[0])}
            link.title = "Purchase"
            link.href = "javascript:void(0);" //linksList[0].href
            link.textContent = "Purchase"
            link.className = "purchase"
            gridCells[i].appendChild(link)
        }
        
    }

    // TODO: set the observer to observe grid for changes and add links to them
    observer.observe(grid, {childList : true, subtree : true })

}

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
    // chrome.runtime.sendMessage({redirect: true});
    link.click()
    check()
}


async function monitorForPageChange() {
    while(true) {

        chrome.storage.local.get(["pageChanged"], function(result){
            // console.log(result)
            if(result.pageChanged != null && result.pageChanged == true){
                // console.log(result)
                // chrome.storage.local.set({"pageChanged": false}, function(){console.log("reinitalized page changed")})
                // chrome.storage.local.get(["autoCheckOutOn"], function(result){
                //     console.log(result)
                //     if(result.autoCheckOutOn == true){
                //         chrome.storage.local.set({"autoCheckOutOn": false}, function(){console.log("initalized")})
                //         check()
                //     }
                // })
                init()
            }
        });
        
        await delay(500)

    }
}

let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {    //runs for each change to target declared below
        console.log("detected change")
        if(location.href.includes("opensea.io/activity")) {
            // activity flow
            changeActivity(mutationRecord)
        } else if (location.href.includes("opensea.io/collection")) {
            // collection flow
            changeCollection(mutationRecord)
        } else {
            return
        }
    })
});

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
                        link.textContent = "Purchase"
                        itemList[i].appendChild(link) //created and added a button to kick off purchase script
                    }
                }
                

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
                let purchaseLinks = gridCellContentList[0].getElementsByClassName("purchase")
                if (purchaseLinks.length == 0) {
                        
                    let linksList = gridCellContentList[0].getElementsByTagName("a")
                    // console.log("detected observed")
                    let link = document.createElement("a")
                    link.id = "purchase"
                    link.onclick = function() {autoCheckOut(linksList[0])}
                    link.title = "Purchase"
                    link.href = "javascript:void(0);" //linksList[0].href
                    link.textContent = "Purchase"
                    link.className = "purchase"
                    gridCellContentList[0].appendChild(link)
                }
            }
        }
    });
}

//if auth

chrome.storage.local.get(["auth"], function(result){
    console.log(result)
    if(result.auth){
        init()
    } else {

    }
})
init()

monitorForPageChange()



async function check(){
    let retries = 0
    while(document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 kmCSYg gMiESj").length == 0) {
            await delay(10)
            retries++
            if(retries == 1000){
                console.log("took too long")
                return
            }
    }
    retries = 0
    document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 kmCSYg gMiESj")[0].click()
    while(document.getElementById("review-confirmation") == null && document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Modalreact__ModalFooter-sc-xyql9f-4 CheckoutModalreact__StyledFooter-sc-3k02w3-0 dBFmez hLwTLZ iaPZMm").length == 0) {
        await delay(10)
        retries++
        if(retries >= 1000){
            console.log("took too long")
            return
        }
        document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 kmCSYg gMiESj")[0].click()
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
    document.getElementById("tos").click()
    let checkout = checkoutParent[0].getElementsByTagName("button")[0]
    checkout.click()


}