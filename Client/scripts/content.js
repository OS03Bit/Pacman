const brw = chrome;
let constants;
var maindomain;
function extractDomain(url) {
    // const domainRegex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?([^\/.]+)/);
    const domainRegex = new RegExp(/(?:\d{1,2}\s*:\s*){1,3}\d{1,2}|(?:\d{1,2}\s*(?:days?|hours?|minutes?|seconds?|tage?|stunden?|minuten?|sekunden?|[a-zA-Z]{1,3}\.?)(?:\s*und)?\s*){2,4}/gi);
    // console.log(url);
    // console.log(domainRegex);
    const mat = url.match(domainRegex);
    return mat ? mat[1] : null;
}

function extractDomain(url) {
    var domain;
    // Find & remove protocol (http, https, ftp) and get domain
    // console.log(domain)
    return domain;
}
async function getdomain() {


    return domain
    // Function to extract domain from URL

}
// getdomain();

let x = document.head;


var cwflag = 0;
const metaTags = x.querySelectorAll('meta');
const ecommerceKeywords = ['shop', 'buy', 'store', 'purchase', 'order', 'checkout',
    'product', 'online', 'sale', 'retail', 'marketplace',
    'e-shop', 'e-store', 'catalog', 'cart', 'deal', 'discount',
    'shipping', 'delivery', 'add to cart', 'browse', 'inventory',
    'shopping', 'check out', 'shop now', 'get it now', 'limited stock', 'stock'];
metaTags.forEach(metaTag => {
    let nameAttribute = metaTag.getAttribute('name');
    let contentAttribute = metaTag.getAttribute('content');
    if (nameAttribute) {

        nameAttribute = nameAttribute.toLowerCase();
        if (contentAttribute) {

            contentAttribute = contentAttribute.toLowerCase();
            const isECommerce = ecommerceKeywords.some(keyword => contentAttribute.includes(keyword));
            if (isECommerce) {
                console.log(contentAttribute);
                cwflag = 1;
            }
            if (contentAttribute == 'guce.yahoo.com') {
                cwflag = 0;
            }
        }
    }
    if (nameAttribute == null && contentAttribute == 'on') {
        cwflag = 1;
    }
    console.log(`Meta Tag Name: ${nameAttribute}, Content: ${contentAttribute}`);
});


// initPatternHighlighter();
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


const url = 'http://websitedomain/websitesearch';

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
// let domaindb = getdomain();
var currentURL = window.location.href;
// Extract the domain from the URL
let domain;
if (currentURL.indexOf("://") > -1) {
    domain = currentURL.split('/')[2];
} else {
    domain = currentURL.split('/')[0];
}

// Find & remove port number
doma = domain.split(':')[0];
const pattern = /(?<=www\.)\w+/; // Regex pattern to match "amazon" after "www."
const match = doma.match(pattern);
doma = match[0];
// var doma = extractDomain(currentURL);

// console.log("Current tab's domain: " + doma);
// alert("Current tab's domain: " + doma);
// alert(domaindb);
const postData = {
    websitedomain: 'http://3.111.34.186/websitesearch',
    websitebody: extractedText,
    domain: doma
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
        background-color: lightgrey;
        justify-content: center;
        color: #ffffff;
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
function highlightProducts(dataaa) {
    // List of sponsored words (customize as needed)
    // const sponsoredWords = dataaa;
    // const sponsoredWords = ['No, I will take the risk'];
    // console.log(sponsoredWords);
    // sponsoredWords.push('Sponsored')
    // sponsoredWords.push('left in stock')

    // Helper function to replace matched words with highlighted version
    // Check if the div element exists
    if (divElement) {
        // Add a border to the div element to highlight it

        // Create an image element
        // // Set the source of the image
        // // Append the image before the end of the div element
    }
}

let divElement = document.getElementById("productTitle");
if (divElement) {
    let imgElement = document.createElement("img");
    let linkElement = document.createElement("a");
    linkElement.href = "https://pricehistoryapp.com/";
    linkElement.target = "_blank";
    linkElement.appendChild(imgElement);
    imgElement.src = "https://intellicampus.in/images/bigp3.png";
    imgElement.style.height = "20px";
    imgElement.style.width = "20px";
    divElement.appendChild(linkElement);
    var currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
        .then(function () {
            console.log('URL copied to clipboard:', currentUrl);
        })
        .catch(function (err) {
            console.error('Unable to copy URL to clipboard', err);
        });

}

console.log(window.location.href)
// console.log(navigator.clipboard.writeText)
if (window.location.href == "https://pricehistoryapp.com/") {
    // console.log(navigator.clipboard.writeText)
    // console.log(g.value)
    navigator.clipboard.readText()
        .then(pastedText => {
            // console.log(pastedText)
            // alert(pastedText)

            pastedText = pastedText + ' '
            let g = document.getElementsByTagName('input')[0];
            g.value = pastedText;
        })
}

highlightProducts("hi")
function highlightSponsoredWords(dataaa) {
    // List of sponsored words (customize as needed)
    const sponsoredWords = dataaa;
    // const sponsoredWords = ['Contribution to BookASmile', 'Rs. 2'];
    // console.log(sponsoredWords);
    // sponsoredWords.push('Sponsored')
    // sponsoredWords.push('left in stock')

    // Helper function to replace matched words with highlighted version
    function highlightText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const replacedText = node.nodeValue.replace(
                new RegExp(`\\b(${sponsoredWords.join("|")})\\b`, "gi"),
                match => match ? `<div class="tooltip2012">${match}
          <span class="tooltiptext2012" style="width:100px; height: 20px;">Urgency</span>
          <sup><sup><img src="https://intellicampus.in/images/bigp2.png" class="icon2012" style="width:20px; height: 20px"></sup> </sup> <br>
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
function highlightcontent() {
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

}


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


if (!cwflag) {
    console.log("hhjv")
    chrome.runtime.sendMessage({ checkwebsite: 0 }, function (res) {
        console.log(res)
    })
}
else {
    chrome.runtime.sendMessage({ checkwebsite: 1 }, function (res) {
        console.log(res)
    })
    initPatternHighlighter();
    highlightcontent();

}