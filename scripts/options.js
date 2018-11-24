(function (global) {

    var document = global.document;
    var ulTicketTags = document.getElementById('cm-ul-ticket-tags');
    var inputCommitMessageFormat = document.getElementById('cm-input-commit-message-format');
    var spanCommitMessageFormatPreview = document.getElementById('cm-input-commit-message-format-preview');
    var buttonSaveCommitMessageFormat = document.getElementById('cm-btn-save-commit-message-format');
    var spanTitleText = document.getElementById('cm-span-title-text');
    var spanFooterText = document.getElementById('cm-footer-text');

    var timerInputCommitMessageFormatKeyUp;
    var commitMessageFormat = '';

    function init() {

        document.title = global.Manifest.name;
        spanTitleText.innerHTML = 'for ' + global.Manifest.name;
        spanFooterText.innerHTML = global.Manifest.name + '<br>v' + global.Manifest.version;

        inputCommitMessageFormat.value = commitMessageFormat;

        updateCommitMessageFormatPreview();
        updateTagsList();
        setEventHandlers();

    }

    function updateCommitMessageFormatPreview() {

        spanCommitMessageFormatPreview.innerText = global.GetFormattedCommitMessage(commitMessageFormat);

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

            clearTimeout(timerInputCommitMessageFormatKeyUp);
            timerInputCommitMessageFormatKeyUp = setTimeout(function () {

                commitMessageFormat = inputCommitMessageFormat.value;
                updateCommitMessageFormatPreview();

            }, 500);

        });

        buttonSaveCommitMessageFormat.addEventListener('click', function () {

            chrome.storage.sync.set({ commitMessageFormat: commitMessageFormat }, function () {
                alert('Saved the format! Please reload your page to see the changes.');
            });

        });

    }

    // Init
    chrome.storage.sync.get(['commitMessageFormat'], function (result) {

        if (result) {
            commitMessageFormat = result.commitMessageFormat;
        }

        init();
    });

}(window));