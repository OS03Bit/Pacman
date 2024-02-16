
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
        console.log('Checkbox is checked');
        // let x = {toggleStatus: true };
        // var storedTabData = JSON.parse(localStorage.getItem('x'));
        // localStorage.setItem('tabData', JSON.stringify(storedTabData));
        // chrome.runtime.sendMessage({ togglestatus: 1 }, function (response) {
        //     // console.log("Send to background.js");
        // });
    } else {
        console.log('Checkbox is not checked');
        // chrome.runtime.sendMessage({ togglestatus: 0 }, function (response) {
        //     // console.log("Send to background.js");
        //     // console.log()
        // });
    }
});
