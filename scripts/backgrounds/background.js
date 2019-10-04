(function (global) {

	const console = global.console;

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


			chrome.tabs.query({}, function (tabs) {

				let url = '';

				for (let i = 0; i < tabs.length; i++) {

					if (tabs[i].id === tab.id) {

						url = tabs[i].url;

					}

				}

				const contentScriptJsContainerPath = 'scripts/contents/';
				const contentScriptCssContainerPath = 'styles/';
				const helperJsFilePath = 'scripts/libs/helper.js';
				const jiraDarkModeCssName = 'content_jira_darkmode.css';
				let contentScriptJsName = '';
				let contentScriptCssName = '';

				if (url.includes('atlassian') || url.includes('jira')) {

					contentScriptCssName = 'content_jira.css';
					contentScriptJsName = 'content_jira.js';

				}

				if (!contentScriptJsName) return;

				chrome.tabs.executeScript(tabId, { file: helperJsFilePath, allFrames: false }, function (result) {
					console.log('Injected ' + helperJsFilePath + ' to ' + url);
				});

				chrome.tabs.executeScript(tabId, { file: contentScriptJsContainerPath + contentScriptJsName, allFrames: false }, function (result) {
					console.log('Injected ' + contentScriptJsContainerPath + contentScriptJsName + ' to ' + url);
				});

				chrome.tabs.insertCSS(tabId, { file: contentScriptCssContainerPath + contentScriptCssName }, function (result) {
					console.log('Injected ' + contentScriptCssContainerPath + contentScriptJsName + ' to ' + url);
				});


				global.GetOptions([global.OptionsArray.isDarkMode], function (result) {

					if (!result.isDarkMode) return;

					chrome.tabs.insertCSS(tabId, { file: contentScriptCssContainerPath + jiraDarkModeCssName }, function (result) {
						console.log('Injected ' + contentScriptCssContainerPath + jiraDarkModeCssName + ' to ' + url);
					});

				});

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
				previousBranchNameFormats: result.previousBranchNameFormats != null ? result.previousBranchNameFormats : [branchNameFormatDefault],

				workLogBoxVisible: result.workLogBoxVisible != null ? result.workLogBoxVisible : true,
				isWorkLogDivCollapsed: result.isWorkLogDivCollapsed != null ? result.isWorkLogDivCollapsed : false,

				isDarkMode: false

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