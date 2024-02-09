
//Information of current open tab
async function getCurrentTab() {
    return (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
}
//Message to background.js
async function sendmessback(tabid, message) {
    chrome.runtime.sendMessage({ togglestatus: message }, function (response) {
        // console.log("Send to background.js");
    });
}
const checkbox = document.getElementById('switch');

checkbox.addEventListener('change', async function (event) {
    if (event.target.checked) {
        // console.log('Checkbox is checked');
        chrome.runtime.sendMessage({ togglestatus: 1 }, function (response) {
            // console.log("Send to background.js");
        });
    } else {
        // console.log('Checkbox is not checked');
        chrome.runtime.sendMessage({ togglestatus: 0 }, function (response) {
            // console.log("Send to background.js");
        });
    }
});
const activationPrefix = "act_200203_";
var storage = chrome.storage.session ? chrome.storage.session : chrome.storage.local;

chrome.storage.local.get(["togglestatus"], async function (items) {
    let tabinfoarr = (items.togglestatus);
    let currtab = await chrome.tabs.query({ active: true, currentWindow: true });
    currtab = currtab[0].id
    console.log(tabinfoarr)
    console.log(currtab)

    for (let i = 0; i < tabinfoarr.length; i++) {
        if (tabinfoarr[i].tabid == currtab) {
            if(tabinfoarr[i].toggle == 1){
                checkbox.checked = true;
                break;
            }
            else{
                checkbox.checked = false;
                break;

            }
        }
    }
});
