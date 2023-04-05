(function (global) {

	const console = global.console;

    const weeklyWorkLogQueryDefault = 'currentUser()';
    const commitMessageFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}({UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}): {TICKET_SUMMARY}{NEWLINE}{NEWLINE}';
    const branchNameFormatDefault = '{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}/{UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}-';

    /**
     * Fired when a tab is updated. Injects content script to issue tracker pages.
     */
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

		if (!changeInfo || !changeInfo.status || changeInfo.status !== 'complete') return;

		chrome.tabs.sendMessage(tab.id, { text: 'isContentScriptInjected' }, function (isContentScriptInjected) {

			// To avoid duplicate injections.
			if (isContentScriptInjected) return;

			let url = tab.url;
			let tabId = tab.id;
			let tabTitle = tab.title;

			const contentScriptJsContainerPath = 'scripts/contents/';
			const contentScriptCssContainerPath = 'styles/';
			const helperJsFilePath = 'scripts/libs/helper.js';
			const jiraDarkModeCssName = 'content_jira_darkmode.css';
			let contentScriptJsName = '';
			let contentScriptCssName = '';

			if ((url.includes('http://atlassian') || url.includes('https://atlassian') || url.includes('http://jira') || url.includes('https://jira'))
				&& !url.includes('jira.issueviews:issue-html')) {

				contentScriptCssName = 'content_jira.css';
				contentScriptJsName = 'content_jira.js';

				global.GetOptions([global.OptionsArray.isDarkMode], function (result) {

					if (!result.isDarkMode) return;

					chrome.tabs.insertCSS(tabId, { file: contentScriptCssContainerPath + jiraDarkModeCssName }, function (result) {
						console.log('Injected ' + contentScriptCssContainerPath + jiraDarkModeCssName + ' to ' + url);
					});

				});

				chrome.tabs.executeScript(tabId, { file: helperJsFilePath, allFrames: false }, function (result) {
					console.log('Injected ' + helperJsFilePath + ' to ' + url);
				});

				chrome.tabs.executeScript(tabId, { file: contentScriptJsContainerPath + contentScriptJsName, allFrames: false }, function (result) {
					console.log('Injected ' + contentScriptJsContainerPath + contentScriptJsName + ' to ' + url);
				});

                chrome.tabs.insertCSS(tabId, { file: contentScriptCssContainerPath + contentScriptCssName }, function (result) {
                    console.log('Injected ' + contentScriptCssContainerPath + contentScriptCssName + ' to ' + url);
                });

			}
			//else if (url.includes('bamboo') || tabTitle.toLowerCase().includes('bamboo')) {

			//	global.GetOptions([global.OptionsArray.isDarkMode], function (result) {

			//		if (!result.isDarkMode) return;

			//		chrome.tabs.insertCSS(tabId, { file: contentScriptCssContainerPath + jiraDarkModeCssName }, function (result) {
			//			console.log('Injected ' + contentScriptCssContainerPath + jiraDarkModeCssName + ' to ' + url);
			//		});

			//	});

			//}

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
				previousBranchNameFormats: result.previousBranchNameFormats != null ? result.previousBranchNameFormats : [branchNameFormatDefault],

                workLogBoxVisible: result.workLogBoxVisible != null ? result.workLogBoxVisible : true,
                weeklyWorkLogQuery: result.weeklyWorkLogQuery != null ? result.weeklyWorkLogQuery : weeklyWorkLogQueryDefault,
                isWorkLogDivCollapsed: result.isWorkLogDivCollapsed != null ? result.isWorkLogDivCollapsed : false,

				isDarkMode: false,

				hoursInADay: result.hoursInADay != null ? result.hoursInADay : 8 // a default JIRA day is 8h

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