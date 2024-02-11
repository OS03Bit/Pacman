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
    // websitebody = domCopyA;
    removeBlacklistNodes(domCopyB);
    // removeBlacklistNodes(websitebody);

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


const url = 'http://localhost:8000/websitesearch';

function cloneDocumentAndAddFullStop() {
    var clonedDocument = document.cloneNode(true);
    clonedDocument.querySelectorAll('script').forEach(function (script) {
        script.remove();
    });
    clonedDocument.querySelectorAll('style').forEach(function (style) {
        style.remove();
    });
    clonedDocument.querySelectorAll('noscript').forEach(function (noscript) {
        noscript.remove();
    });
    clonedDocument.querySelectorAll('audio').forEach(function (audio) {
        audio.remove();
    });
    clonedDocument.querySelectorAll('video').forEach(function (video) {
        video.remove();
    });
    clonedDocument.querySelectorAll('link').forEach(function (link) {
        link.remove();
    });
    clonedDocument.querySelectorAll('meta').forEach(function (link) {
        link.remove();
    });
    clonedDocument.querySelectorAll('head').forEach(function (link) {
        link.remove();
    });
    clonedDocument.querySelectorAll('iframe').forEach(function (link) {
        link.remove();
    });
    return clonedDocument;
}

function extractTextFromNode(node, textArray) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim() && !parseFloat(node.textContent.trim())) {

            textArray.push(node.textContent.trim());
        }
    } else {
        for (let childNode of node.childNodes) {
            extractTextFromNode(childNode, textArray);
        }
    }
}

function extractTextContent(clonedDocument) {
    var textArray = [];
    extractTextFromNode(clonedDocument.body, textArray);

    return textArray;
}
var clonedDocument = cloneDocumentAndAddFullStop();
var extractedText = extractTextContent(clonedDocument);

const postData = {
    websitedomain: 'http://localhost:8000/websitesearch',
    websitebody: extractedText

};

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
};

var sss;
function injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}
const cssRules = `
    .element2012 {
        border: 2px solid black;
        justify-content: center;
        /* align-items: center; */
        text-align: center;
        width: 20vw;
        font-size: 50px;
        border-radius: 20px;
    }

    .icon2012 {
        cursor: pointer;
        color: #000;
        height: 25px;
    }


    /*new style*/

    .tooltip2012 {
        position: relative;
        display: inline-block;
    }

    /* Tooltip text */
    .tooltip2012 .tooltiptext2012 {
        visibility: hidden;
        font-size: 15px;
        // width: 5vw;
        background-color: grey;
        justify-content: center;
        color: #fff;
        margin-top:30px;
        margin-left: 20px;
        text-align: center;
        border-radius: 6px;

        /* Position the tooltip text - see examples below! */
        position: absolute;
        z-index: 10000;
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip2012:hover .tooltiptext2012 {
        visibility: visible;
    }
  `;
// Inject CSS when the content script is executed
injectCSS(cssRules);
function highlightSponsoredWords(dataaa) {
    // List of sponsored words (customize as needed)
    const sponsoredWords = dataaa;
    // const sponsoredWords = ['Sponsored', 'left in stock'];
    // console.log(sponsoredWords);
    // sponsoredWords.push('Sponsored')
    // sponsoredWords.push('left in stock')

    // Helper function to replace matched words with highlighted version
    function highlightText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const replacedText = node.nodeValue.replace(
                new RegExp(`\\b(${sponsoredWords.join("|")})\\b`, "gi"),
                match => match ? `<div class="tooltip2012">${match}
          <span class="tooltiptext2012" style="width:250px; height: 20px;">Urgency/Scarcity</span>
          <sup><sup><img src="https://intellicampus.in/images/bigp3.png" class="icon2012" style="width:20px; height: 20px"></sup> </sup> <br>
      </div>`: match
            );

            // Check if the text was actually replaced
            if (replacedText !== node.nodeValue) {
                const newNode = document.createElement("span");
                newNode.innerHTML = replacedText;

                // Insert the new node before the original text node
                node.parentNode.insertBefore(newNode, node);

                // Remove the original text node
                node.parentNode.removeChild(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Recursively process child nodes
            for (const childNode of node.childNodes) {
                highlightText(childNode);
            }
        }
    }

    // Start processing from the body element
    highlightText(document.body);
}
fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
        sss = data;
        console.log("Recadasdadasda")
        console.log(sss)
        highlightSponsoredWords(sss);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });


// Function to inject CSS into the page




var maindomain;
function extractDomain(url) {
  const domainRegex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?([^\/.]+)/);
  // console.log(url);
  // console.log(domainRegex);
  const mat = url.match(domainRegex);
  return mat ? mat[1] : null;
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.message === "myMessage") {
    console.log("recieved message");
  }
  let c = 0;
  maindomain = message.message;
  maindomain = extractDomain(maindomain);
  // console.log(maindomain);
  let links = document.getElementsByTagName("a");
  for (let i = 0; i < links.length; i++) {
    // console.log(links[i].href);
    const domain = extractDomain(links[i].href);
    // console.log(domain);
    if (domain != maindomain && domain) {
      console.log(domain);
      c++;
    }
  }
  console.log(c);
  if (c >= links.length) {
    alert("Beware this site contains a lot of redirecting links");
    console.log("Website is harmful.");
  }
  else {
    console.log("Website is safe");
  }
});
