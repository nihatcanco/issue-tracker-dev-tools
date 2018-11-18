(function (global) {

    var pCommitMessagePreviewElement = document.getElementById('p-commit-message-preview');
    var txtCommitMessageElement = document.getElementById('txt-commit-message');
    var spanLoadingElement = document.getElementById('span-loading');
    var spanJiraVersionElement = document.getElementById('span-jira-version');
    var spanCharacterCount = document.getElementById('span-character-count');
    var btnCopyToClipboard = document.getElementById('btn-copytoclipboard');
    var intervalId;
    var commitMessagePrepend;
    var commitMessage;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        debugger;

    });

    txtCommitMessageElement.addEventListener('keyup', function () {

        updateCommitMessagePreview();

    });

    btnCopyToClipboard.addEventListener('click', function() {

        global.CopyToClipboard(commitMessage || commitMessagePrepend);

    });

    function sendMessageToContentScript(messageData, callbackFunction) {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

            chrome.tabs.sendMessage(tabs[0].id, messageData, callbackFunction);

        });

    }

    function toggleLoadingView(doShow) {

        txtCommitMessageElement.disabled = doShow;
        spanLoadingElement.style.display = doShow ? 'block' : 'none';

    }

    function requestJiraVersion() {

        //spanJiraVersionElement

    }

    function requestSelectedIssue() {

        toggleLoadingView(true);

        intervalId = window.setInterval(function () {

            sendMessageToContentScript({ message: 'getSelectedIssue' }, function (response) {

                console.log(response);

                if (!response || !response.message) return;

                window.clearInterval(intervalId);
                toggleLoadingView(false);
                setCommitMessage(response.message);

            });

        }, 1000);

    }

    function setCommitMessage(selectedIssue) {

        commitMessagePrepend = selectedIssue.type.name.toLowerCase() + '(' + selectedIssue.key + '): ' + selectedIssue.summary;
        pCommitMessagePreviewElement.innerHTML = commitMessagePrepend;
        updateCharacterCount();
        txtCommitMessageElement.focus();

    }

    function updateCommitMessagePreview() {

        commitMessage = commitMessagePrepend + '\n\n' + txtCommitMessageElement.value;
        pCommitMessagePreviewElement.innerHTML = commitMessage.replace(/(?:\r\n|\r|\n)/g, '<br>');
        updateCharacterCount();

    }

    function updateCharacterCount() {

        spanCharacterCount.innerHTML = 'Character count: ' + (commitMessage ? commitMessage.length : commitMessagePrepend.length);

    }

    requestSelectedIssue();

}(window));