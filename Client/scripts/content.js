
const brw = chrome;
let constants;
initPatternHighlighter();
async function initPatternHighlighter() {
    constants = await import(await brw.runtime.getURL("scripts/constants.js"));
    await patternHighlighting();
}
const observer = new MutationObserver(async function () {
    await patternHighlighting(true);
});
async function patternHighlighting(waitForChanges = false) {
    if (this.lock === true) {
        return;
    }
    this.lock = true;
    observer.disconnect();
    if (waitForChanges === true) {
        await new Promise(resolve => { setTimeout(resolve, 1000) });
    }
    addPhidForEveryElement(document.body);
    let domCopyA = document.body.cloneNode(true);
    removeBlacklistNodes(domCopyA);
    await new Promise(resolve => { setTimeout(resolve, 1536) });
    addPhidForEveryElement(document.body);
    let domCopyB = document.body.cloneNode(true);
    removeBlacklistNodes(domCopyB);
    resetDetectedPatterns()
    findPatternDeep(domCopyB, domCopyA);
    domCopyA.replaceChildren();
    domCopyA = null;
    domCopyB.replaceChildren();
    domCopyB = null;
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
    });
    this.lock = false;
}


function addPhidForEveryElement(dom) {
    this.counter = this.counter || 0;
    for (const node of dom.querySelectorAll("*")) {
        if (!node.dataset.phid) {
            node.dataset.phid = this.counter;
            // Increment the ID counter.
            this.counter += 1;
        }
    }
}
function getElementByPhid(dom, id) {
    return dom.querySelector(`[data-phid="` + id + `"]`)
}

function removeBlacklistNodes(dom) {
    for (const elem of dom.querySelectorAll(constants.tagBlacklist.join(","))) {
        elem.remove();
    }
}

function findPatterInNode(node, nodeOld) {
    for (const pattern of constants.patternConfig.patterns) {
        for (const func of pattern.detectionFunctions) {
            if (func(node, nodeOld)) {
                return pattern.className;
            }
        }
    }
    return null;
}
function findPatternDeep(node, domOld) {
    for (const child of node.children) {
        findPatternDeep(child, domOld);
    }
    let nodeOld = getElementByPhid(domOld, node.dataset.phid);
    let foundPattern = findPatterInNode(node, nodeOld);
    if (foundPattern) {
        let elem = getElementByPhid(document, node.dataset.phid);
        if (elem) {
            elem.classList.add(
                constants.patternDetectedClassName,
                constants.extensionClassPrefix + foundPattern
            );
        }
        if (nodeOld) {
            nodeOld.remove();
        }
        node.remove();
    }
}
function resetDetectedPatterns() {
    let regx = new RegExp("\\b" + constants.extensionClassPrefix + "[^ ]*[ ]?\\b", "g");
    document.querySelectorAll("." + constants.patternDetectedClassName).forEach(
        function (node) {
            node.className = node.className.replace(regx, "");
        }
    );
}

const url = 'https://intellicampus.in/Login'; // Replace this with your API endpoint
console.log("hiii");
// Data to be sent in the POST request
const postData = {
  name: 'John Doe',
  email: 'john@example.com'
};

// Options for the fetch request
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // Specify content type as JSON
  },
  body: JSON.stringify(postData) // Convert data to JSON string
};

// Make the POST request using Fetch API
fetch(url, options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse response body as JSON
  })
  .then(data => {
    console.log('Response:', data); // Handle response data
  })
  .catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });
