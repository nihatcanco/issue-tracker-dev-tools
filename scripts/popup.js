(function (global) {

    var pCommitMessagePreviewElement = document.getElementById('p-commit-message-preview');
    var txtCommitMessageElement = document.getElementById('txt-commit-message');
    var spanIssueTrackerTypeVersion = document.getElementById('span-issue-tracker-type-version');
    var spanCharacterCount = document.getElementById('span-character-count');
    var btnCopyToClipboard = document.getElementById('btn-copytoclipboard');
    var intervalIssueTrackerType;
    var intervalSelectedIssue;
    var commitMessagePrepend;
    var commitMessage;

    txtCommitMessageElement.addEventListener('keyup', function () {

        updateCommitMessagePreview();

    });

    btnCopyToClipboard.addEventListener('click', function () {

        global.CopyToClipboard(commitMessage || commitMessagePrepend);

    });

    function sendMessageToContentScript(messageData, callbackFunction) {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

            chrome.tabs.sendMessage(tabs[0].id, messageData, callbackFunction);

        });

    }

    function toggleLoadingView(doShow) {
        global.TogglePleaseWait(doShow);
    }

    function requestIssueTrackerTypeVersion() {

        //spanIssueTrackerTypeVersion

        intervalIssueTrackerType = window.setInterval(function () {

            sendMessageToContentScript({ message: 'getIssueTrackerTypeVersion' }, function (response) {

                console.log(response);

                if (!response || !response.message) return;

                window.clearInterval(intervalIssueTrackerType);
                setIssueTrackerTypeVersion(response.message);

            });

        }, 1000);

    }

    function requestSelectedIssue() {

        toggleLoadingView(true);

        intervalSelectedIssue = window.setInterval(function () {

            sendMessageToContentScript({ message: 'getSelectedIssue' }, function (response) {

                console.log(response);

                if (!response || !response.message) return;

                window.clearInterval(intervalSelectedIssue);
                toggleLoadingView(false);
                setCommitMessage(response.message);

            });

        }, 1000);

    }

    function setIssueTrackerTypeVersion(object) {

        spanIssueTrackerTypeVersion.innerHTML = object.type + ' ' + object.version

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

        spanCharacterCount.innerHTML = 'Character count: ' + (commitMessage ? commitMessage.length : commitMessagePrepend ? commitMessagePrepend.length : '0');

    }

    updateCharacterCount();
    requestIssueTrackerTypeVersion();
    requestSelectedIssue();

}(window));