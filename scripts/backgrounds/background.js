(function (global) {

    const console = global.console;

    const commitMessageFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}({UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}): {TICKET_SUMMARY}{NEWLINE}{NEWLINE}';
    const branchNameFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}/{UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}-';

    /**
     * Called when the extension installed.
     */
    chrome.runtime.onInstalled.addListener(function (details) {

        console.log(JSON.stringify(details));

        // Set the defaults for initial launch
        global.GetAllOptions(function (result) {

            if (!result) return;

            // Save the default options
            global.SetOptions({

                commitMessageBoxVisible: result.commitMessageBoxVisible != null ? result.commitMessageBoxVisible : true,
                isCommitMessageDivCollapsed: result.isCommitMessageDivCollapsed != null ? result.isCommitMessageDivCollapsed : false,
                commitMessageFormat: result.commitMessageFormat != null ? result.commitMessageFormat : commitMessageFormatDefault,

                branchNameBoxVisible: result.branchNameBoxVisible != null ? result.branchNameBoxVisible : true,
                isBranchNameDivCollapsed: result.isBranchNameDivCollapsed != null ? result.isBranchNameDivCollapsed : false,
                branchNameFormat: result.branchNameFormat != null ? result.branchNameFormat : branchNameFormatDefault

            });

        });

    });

    /**
     * Opens the options page in a new tab or focuses to the opened tab.
     */
    function openOrFocusOptionsPage() {

        var optionsUrl = chrome.extension.getURL('options.html');

        chrome.tabs.query({}, function (extensionTabs) {

            let found = false;

            for (let i = 0; i < extensionTabs.length; i++) {
                if (optionsUrl === extensionTabs[i].url) {
                    found = true;
                    chrome.tabs.update(extensionTabs[i].id, { "selected": true });
                }
            }

            if (!found) {
                chrome.tabs.create({ url: "options.html" });
            }

        });

    }

    /**
     * Called when the user clicks on the browser action icon.
     */
    chrome.browserAction.onClicked.addListener(function (tab) {

        openOrFocusOptionsPage();

    });

}(window));