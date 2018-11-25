(function (global) {

    var commitMessageFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}({UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}): {TICKET_SUMMARY}{NEWLINE}{NEWLINE}';
    var branchNameFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}/{UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}-';

    chrome.runtime.onInstalled.addListener(function (details) {

        console.log(JSON.stringify(details));

        // Set the defaults for initial launch
        chrome.storage.sync.get(['commitMessageBoxVisible', 'branchNameBoxVisible', 'isCommitMessageDivCollapsed', 'isBranchNameDivCollapsed', 'commitMessageFormat', 'branchNameFormat'], function (result) {

            if (!result) return;

            // Commit Message Box options
            if (!result.commitMessageBoxVisible) chrome.storage.sync.set({ commitMessageBoxVisible: true }, function () { });
            if (!result.isCommitMessageDivCollapsed) chrome.storage.sync.set({ isCommitMessageDivCollapsed: false }, function () { });
            if (!result.commitMessageFormat) chrome.storage.sync.set({ commitMessageFormat: commitMessageFormatDefault }, function () { });

            // Branch Name Box options
            if (!result.branchNameBoxVisible) chrome.storage.sync.set({ branchNameBoxVisible: true }, function () { });
            if (!result.isBranchNameDivCollapsed) chrome.storage.sync.set({ isBranchNameDivCollapsed: false }, function () { });
            if (!result.branchNameFormat) chrome.storage.sync.set({ branchNameFormat: branchNameFormatDefault }, function () { });

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

}(window));