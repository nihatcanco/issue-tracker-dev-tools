var commitMessageFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}({UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}): {TICKET_SUMMARY}{NEWLINE}{NEWLINE}';

chrome.runtime.onInstalled.addListener(function (details) {

    console.log(JSON.stringify(details));

    // Set the defaults for initial launch
    chrome.storage.sync.get(['commitMessageFormat'], function (result) {

        if (!result || !result.commitMessageFormat) {
            chrome.storage.sync.set({ commitMessageFormat: commitMessageFormatDefault }, function () { });
        }

    });

});
