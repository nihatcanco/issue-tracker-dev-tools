(function (global) {

    var document = global.document;
    var ulTicketTags = document.getElementById('cm-ul-ticket-tags');
    var inputCommitMessageFormat = document.getElementById('cm-input-commit-message-format');
    var spanCommitMessageFormatPreview = document.getElementById('cm-input-commit-message-format-preview');
    var buttonSaveCommitMessageFormat = document.getElementById('cm-btn-save-commit-message-format');

    var commitMessageFormat = '';

    function init() {

        inputCommitMessageFormat.value = commitMessageFormat;

        updateCommitMessageFormatPreview();
        updateTagsList();
        setEventHandlers();

    }

    function updateCommitMessageFormatPreview() {

        spanCommitMessageFormatPreview.innerHTML = global.ReplaceNewLinesToBr(global.GetFormattedCommitMessage(commitMessageFormat));

    };

    function updateTagsList() {

        let ulHtml = '';

        for (var key in global.TicketEnum) {
            if (global.TicketEnum.hasOwnProperty(key)) {
                ulHtml += '<li>' + global.TicketEnum[key] + '</li>';
            }
        }

        ulTicketTags.innerHTML = ulHtml;

    }

    function setEventHandlers() {

        inputCommitMessageFormat.addEventListener('keyup', function () {

            commitMessageFormat = inputCommitMessageFormat.value;
            updateCommitMessageFormatPreview();

        });

        buttonSaveCommitMessageFormat.addEventListener('click', function () {

            chrome.storage.sync.set({ commitMessageFormat: commitMessageFormat }, function () {
                alert('Saved the format! Please reload your page to see the changes.');
            });

        });

    }

    // Init
    chrome.storage.sync.get(['commitMessageFormat'], function (result) {

        if (result && result.commitMessageFormat) {
            commitMessageFormat = result.commitMessageFormat;
        }

        init();
    });

}(window));