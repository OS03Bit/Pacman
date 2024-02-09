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
                        const reg = /(?:\d{1,2}\s*:\s*){1,3}\d{1,2}|(?:\d{1,2}\s*(?:days?|hours?|minutes?|seconds?|tage?|stunden?|minuten?|sekunden?|[a-zA-Z]{1,3}\.?)(?:\s*und)?\s*){2,4}/gi;

                        /**
                         * Regular expression for strings that match the regular expression for countdowns
                         * but are not countdowns because there are too many numbers.
                         * A maximum of 4 numbers for days, hours, minutes and seconds is expected.
                         * @constant
                         */
                        const regBad = /(?:\d{1,2}\s*:\s*){4,}\d{1,2}|(?:\d{1,2}\s*(?:days?|hours?|minutes?|seconds?|tage?|stunden?|minuten?|sekunden?|[a-zA-Z]{1,3}\.?)(?:\s*und)?\s*){5,}/gi;

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

                            // Iterate through all pairs of numbers in the strings.
                            for (let x = 0; x < numbersNew.length; x++) {
                                // Since countdowns should be detected that are running down,
                                // the numbers from left to right become smaller over time.
                                // When the numbers are iterated from left to right,
                                // at least one number in the current state of the text
                                // should be smaller than in the old state.
                                // If a number in the current state is larger before a number
                                // is smaller than in the previous state, it does not seem to be an elapsing countdown.
                                // Examples: current state - previous state -> result
                                //           23,30,40      - 23,30,39       -> is a countdown
                                //           23,30,00      - 23,29,59       -> is a countdown
                                //           23,30,40      - 23,31,20       -> is not a countdown
                                //           23,30,40      - 23,30,41       -> is not a countdown
                                //           23,30,40      - 23,30,40       -> is not a countdown
                                if (parseInt(numbersNew[x]) > parseInt(numbersOld[x])) {
                                    // If the number in the current state is larger,
                                    // break out of the loop and examine the next pair, if present.
                                    // This case occurs only if the second if-clause did not occur and `true` was returned.
                                    break;
                                }
                                if (parseInt(numbersNew[x]) < parseInt(numbersOld[x])) {
                                    // Return `true` if a number has decreased.
                                    return true;
                                }
                            }
                        }
                    }
                    // Return `false` if no countdown was detected by the previous steps.
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
