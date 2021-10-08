
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
    let tos = document.getElementById("tos")
    console.log(conf)
    while (conf===null){
        if (tos != null){
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
    //tos
    //fn
    tos = document.getElementById("tos")
    console.log(tos)
    while (tos == null){
        await delay(50)
        retries++
        if(retries >= 1000){
            console.log("took too long")
            return
        }
        tos = document.getElementById("tos")
    }
    console.log("-------------")
    console.log(tos)

    tos.click()
    let checkoutParent = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Modalreact__ModalFooter-sc-xyql9f-4 CheckoutModalreact__StyledFooter-sc-3k02w3-0 dBFmez hLwTLZ iaPZMm")
    while (checkoutParent.length == 0){
        await delay(50)
        retries++
        if(retries >= 1000){
            console.log("took too long")
            return
        }
        checkoutParent = document.getElementsByClassName("Blockreact__Block-sc-1xf18x6-0 Modalreact__ModalFooter-sc-xyql9f-4 CheckoutModalreact__StyledFooter-sc-3k02w3-0 dBFmez hLwTLZ iaPZMm")
    }
    let checkout = checkoutParent[0].getElementsByTagName("button")[0]
    checkout.click()


}



function delay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(ms)
      }, ms )
    })
  }


chrome.storage.local.get(["autoCheckOutOn"], function(result){
    console.log(result)
    if(result.autoCheckOutOn == true){
        chrome.storage.local.set({"autoCheckOutOn": false}, function(){console.log("initalized")})
        check()
    }
})


// let observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutationRecord) {    //runs for each change to target declared below
//         console.log("detected change")
//         mutationRecord.addedNodes.forEach(function(addedNode) {
//             if(addedNode.nodeType === 1) {  // making sure the Node we are getting is an HTML element
//                 if (addedNode.className === "Rowreact__DivContainer-sc-amt98e-0 emCxyQ  EventHistory--row EventHistory--polledData" || addedNode.className === "Rowreact__DivContainer-sc-amt98e-0 emCxyQ  EventHistory--row") {
//                     //only want to take this route if it is an actual nft that is listed. polledData is for new listings, the other class name is for past listings when we scroll down
//                     let itemList = addedNode.getElementsByClassName("Row--cell Row--cellIsSpaced EventHistory--item-col")
//                     //get just the item element for the event row
//                     if(itemList.length != 0){
//                         let linksList = addedNode.getElementsByTagName("a") //get the link element for the item
//                         if(linksList.length != 0) {
//                             console.log("detected observed")
//                             let link = document.createElement("a")
//                             link.id = "purchase"
//                             link.onclick = function() {autoCheckOut(linksList[0].href)}
//                             link.title = "Purchase"
//                             link.href = "javascript:void(0);"
//                             link.textContent = "Purchase"
//                             itemList[0].appendChild(link) //created and added a button to kick off purchase script
//                         }
//                     }
//                 }
//             }
//         });
//     })
// });

// //setting the target to the event history scroll box
// //we only care about additions to this element
// let target = document.getElementsByClassName("EventHistory--Panel")[0].getElementsByClassName("Scrollbox--content")[0];

// observer.observe(target, {childList : true, subtree : true })