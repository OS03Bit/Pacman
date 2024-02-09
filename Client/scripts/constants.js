export const patternConfig = {
    patterns: [
        {
            name: chrome.i18n.getMessage("patternCountdown_name"),
            className: "countdown",
            detectionFunctions: [
                function (node, nodeOld) {
                    // Countdowns should only be identified as such if they are actively running and not static.
                    // Therefore, it is necessary to check first if there is an old state of the element and if the text in it has changed.
                    if (nodeOld && node.innerText != nodeOld.innerText) {
                        /**
                         * Regular expression for a usual countdown with or without words.
                         * @constant
                         */
                        const reg = /(?:\d{1,5}\s*(?::|h(?:ou)?rs?|m(?:in(?:ute)?s?)?|s(?:ec(?:ond)?s?)?|[a-zA-Z]{1,3})\s*){1,4}/gi;

                        /**
                         * Regular expression for strings that match the regular expression for countdowns
                         * but are not countdowns because there are too many numbers.
                         * A maximum of 4 numbers for days, hours, minutes and seconds is expected.
                         * @constant
                         */
                        const regBad = /(?:\d{1,5}\s*(?::|h(?:ou)?rs?|m(?:in(?:ute)?s?)?|s(?:ec(?:ond)?s?)?|[a-zA-Z]{1,3})\s*){5,}/gi;

                        // If matches for "wrong" countdowns are found with the second regular expression,
                        // remove these parts from the string.
                        // Then search for matches for real countdowns in the remaining string.
                        // Do this for the old and current state of the text.
                        let matchesOld = nodeOld.innerText.replace(regBad, "").match(reg);
                        let matchesNew = node.innerText.replace(regBad, "").match(reg);

                        // If no matches were found in one of the two states of the texts or
                        // if the number of matches in the two states does not match,
                        // the element is not classified as a countdown.
                        if (matchesNew == null || matchesOld == null ||
                            (matchesNew != null && matchesOld != null
                                && matchesNew.length != matchesOld.length)) {
                            return false;
                        }

                        // Since it was ensured at the point that there are the same number of matches
                        // in both states of the text, it is initially assumed that the matches with the same index
                        // in both states are the same countdown.
                        for (let i = 0; i < matchesNew.length; i++) {
                            // Extract all contiguous numbers from the strings.
                            // Example: `"23:59:58"` -> `["23", "59", "58"]`.
                            let numbersNew = matchesNew[i].match(/\d+/gi);
                            let numbersOld = matchesOld[i].match(/\d+/gi);

                            // If the number of each number does not match,
                            // then the pair of countdowns does not match.
                            if (numbersNew.length != numbersOld.length) {
                                // Ignore this pair and examine at the next one.
                                continue;
                            }
                            for (let x = 0; x < numbersNew.length; x++) {
                                if (parseInt(numbersNew[x]) > parseInt(numbersOld[x])) {
                                    break;
                                }
                                if (parseInt(numbersNew[x]) < parseInt(numbersOld[x])) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
            ],
           
            
        }
    ]
}
export const extensionClassPrefix = "__ph__";
export const patternDetectedClassName = extensionClassPrefix + "pattern-detected";
export const currentPatternClassName = extensionClassPrefix + "current-pattern";
export const tagBlacklist = ["script", "style", "noscript", "audio", "video"];
