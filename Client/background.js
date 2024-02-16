
const activationPrefix = "act_200203_";
var storage = chrome.storage.local;
var currtabid;
async function start() {
    const tabinfo = await chrome.tabs.query({ active: true, currentWindow: true });
    currtabid = tabinfo[0].id;
    let stat = [{ toggle: 0, tabid: tabinfo[0].id }];
    chrome.storage.local.set({ "togglestatus": stat }, function () {
        console.log('Settings saved');
    });
}
start();
async function fetchtabdata(tabinfo) {
    chrome.storage.local.get(["togglestatus"], async function (items) {
        let currtabid = tabinfo.id, f = 0;
        let tabinfoarr = (items.togglestatus);
        for (let i = 0; i < tabinfoarr.length; i++) {
            if (tabinfoarr[i].tabid === currtabid) {
                f = 1;
            }
        }
        if (f == 0) {
            const tabinfo = await chrome.tabs.query({ active: true, currentWindow: true });
            let currtabinfo = { toggle: 0, tabid: tabinfo[0].id };
            tabinfoarr.push(currtabinfo);
            chrome.storage.local.set({ "togglestatus": tabinfoarr }, function () {
                console.log('Settings saved');
            });
        }
        if(f == 1){
            // chrome.tabs.sendMessage(currtabid, {msg: "dsfsdf"}, function(response){
            //     console.log(response);
            // });
        }
    });
    return;
}
async function updatetoggle(tabinfo, status) {
    chrome.storage.local.get(["togglestatus"], async function (items) {
        let tabinfoarr = (items.togglestatus);
        for (let i = 0; i < tabinfoarr.length; i++) {
            if (tabinfoarr[i].tabid == tabinfo) {
                tabinfoarr[i].toggle = status;
            }
        }
        chrome.storage.local.set({ "togglestatus": tabinfoarr }, function () {
            console.log('Settings updated');
        });
    });
    return;
}
chrome.tabs.onActivated.addListener(async function (tabId, changeInfo, tab) {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        currtabid = tabs[0].id;
        fetchtabdata(tabs[0]);
    } catch (error) {
        console.error("Error:", error);
    }
});
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        currtabid = tabs[0].id;
        fetchtabdata(tabs[0]);
    } catch (error) {
        console.error("Error:", error);
    }
}); 

chrome.runtime.onMessage.addListener(async (mess, sender, sendRes) => {
    if (mess.togglestatus == 1) {
        updatetoggle(currtabid, 1);
    }
    else {
        updatetoggle(currtabid, 0);
    }
    if (mess.checkwebsite == 1) {
        console.log("IS eCommerce");
        chrome.action.setBadgeText({ text: " " });
        chrome.action.setBadgeBackgroundColor({ color: "green" });
        // chrome.action.setIcon({path: 'default.png', tabId: currtabid});
    }
    else {
        console.log("IS not eCommerce");
        chrome.action.setBadgeText({ text: "" });
        chrome.action.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
        // chrome.action.setIcon({path: 'icongrey.png', tabId: currtabid});
    }
    if(mess.domain == 1){
        let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        tabs = tabs[0].url;
        sendRes({domain: tabs})
    }
})
// chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
//     console.log(req);
//     console.log(sender);
//     console.log(sendRes);
//     if(req.checkwebsite == 0){
//         sendRes({checkwebsite: "R"})
//         chrome.action.setBadgeText({ text: "R" });
//         chrome.action.setBadgeBackgroundColor({ color: "red" });
//     }
//     else{
//         sendRes({checkwebsite: "G"})
//         chrome.action.setBadgeText({ text: "G" });
//         chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
//     }
// })
// chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {
//         key: "retrieve_success " 
//     });
// });



