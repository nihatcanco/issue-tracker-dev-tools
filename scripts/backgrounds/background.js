(function (global) {

    const console = global.console;

    const commitMessageFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}({UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}): {TICKET_SUMMARY}{NEWLINE}{NEWLINE}';
    const branchNameFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}/{UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}-';

    /**
     * Fired when a tab is updated. Injects content script to issue tracker pages.
     */
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        if (!changeInfo || !changeInfo.status || changeInfo.status !== 'complete' || !tab || !tab.url) return;

        chrome.tabs.sendMessage(tab.id, { text: 'isContentScriptInjected' }, function (isContentScriptInjected) {

            // To avoid duplicate injections.
            if (isContentScriptInjected) return;

            const contentScriptJsContainerPath = 'scripts/contents/';
            const contentScriptCssContainerPath = 'styles/';
            const helperJsFilePath = 'scripts/libs/helper.js';
            let contentScriptJsName = '';
            let contentScriptCssName = '';

            if (tab.url.includes('atlassian') || tab.url.includes('jira')) {

                contentScriptCssName = 'content_jira.css';
                contentScriptJsName = 'content_jira.js';

            }

            if (!contentScriptJsName) return;

            chrome.tabs.executeScript(tabId, { file: helperJsFilePath, allFrames: false }, function (result) {
                console.log('Injected ' + helperJsFilePath + ' to ' + tab.url);
            });

            chrome.tabs.executeScript(tabId, { file: contentScriptJsContainerPath + contentScriptJsName, allFrames: false }, function (result) {
                console.log('Injected ' + contentScriptJsContainerPath + contentScriptJsName + ' to ' + tab.url);
            });

            chrome.tabs.insertCSS(tabId, { file: contentScriptCssContainerPath + contentScriptCssName }, function (result) {
                console.log('Injected ' + contentScriptCssContainerPath + contentScriptJsName + ' to ' + tab.url);
            });

        });

    });


    /**
     * Called when the extension installed.
     */
    chrome.runtime.onInstalled.addListener(function (details) {

        // Set the defaults for initial launch
        global.GetAllOptions(function (result) {

            if (!result) return;

            // Save the default options
            global.SetOptions({

                commitMessageBoxVisible: result.commitMessageBoxVisible != null ? result.commitMessageBoxVisible : true,
                isCommitMessageDivCollapsed: result.isCommitMessageDivCollapsed != null ? result.isCommitMessageDivCollapsed : false,
                commitMessageFormat: result.commitMessageFormat != null ? result.commitMessageFormat : commitMessageFormatDefault,
                previousCommitMessageFormats: result.previousCommitMessageFormats != null ? result.previousCommitMessageFormats : [commitMessageFormatDefault],

                branchNameBoxVisible: result.branchNameBoxVisible != null ? result.branchNameBoxVisible : true,
                isBranchNameDivCollapsed: result.isBranchNameDivCollapsed != null ? result.isBranchNameDivCollapsed : false,
                branchNameFormat: result.branchNameFormat != null ? result.branchNameFormat : branchNameFormatDefault,
                previousBranchNameFormats: result.previousBranchNameFormats != null ? result.previousBranchNameFormats : [branchNameFormatDefault]

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