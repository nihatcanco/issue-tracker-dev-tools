(function () {

    var pCommitMessagePreviewElement = document.getElementById('p-commit-message-preview');
    var txtCommitMessageElement = document.getElementById('txt-commit-message');
    var spanLoadingElement = document.getElementById('span-loading');
    var spanJiraVersionElement = document.getElementById('span-jira-version');
    var spanCharacterCount = document.getElementById('span-character-count');
    var intervalId;
    var commitMessagePrepend;
    var commitMessage;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        debugger;

    });

    txtCommitMessageElement.addEventListener('keyup', function () {

        updateCommitMessagePreview();
        //autoSizeTextArea(this);

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

    function autoSizeTextArea(textarea) {

        textarea = $(textarea);

        var minRows = Number(textarea.attr('rows'));
        var maxRows = Number(textarea.attr('max-rows'));

        // clone the textarea and hide it offscreen
        // TODO: copy all the styles
        var textareaClone = $('<textarea/>', {
            rows: minRows,
            maxRows: maxRows,
            class: textarea.attr('class')
        }).css({
            position: 'absolute',
            left: -$(document).width() * 2
        }).insertAfter(textarea);

        var textareaCloneNode = textareaClone.get(0);

        textarea.on('input', function () {
            // copy the input from the real textarea
            textareaClone.val(textarea.val());

            // set as small as possible to get the real scroll height
            textareaClone.attr('rows', 1);

            // save the real scroll height
            var scrollHeight = textareaCloneNode.scrollHeight;

            // increase the number of rows until the content fits
            for (var rows = minRows; rows < maxRows; rows++) {
                textareaClone.attr('rows', rows);

                if (textareaClone.height() > scrollHeight) {
                    break;
                }
            }

            // copy the rows value back to the real textarea
            textarea.attr('rows', textareaClone.attr('rows'));
        }).trigger('input');

    }

    function updateCharacterCount() {

        spanCharacterCount.innerHTML = 'Character count: ' + (commitMessage ? commitMessage.length : commitMessagePrepend.length);

    }

    requestSelectedIssue();

}(window));