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

function openOrFocusOptionsPage() {

    var optionsUrl = chrome.extension.getURL('options.html');

    chrome.tabs.query({}, function (extensionTabs) {

        let found = false;

        for (let i = 0; i < extensionTabs.length; i++) {
            if (optionsUrl == extensionTabs[i].url) {
                found = true;
                chrome.tabs.update(extensionTabs[i].id, { "selected": true });
            }
        }

        if (!found) {
            chrome.tabs.create({ url: "options.html" });
        }

    });

}

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function (tab) {
    openOrFocusOptionsPage();
});
