(function (global) {

    var document = global.document;
    var ulTicketTags = document.getElementById('cm-ul-ticket-tags');
    var inputCommitMessageFormat = document.getElementById('cm-input-commit-message-format');
    var inputBranchNameFormat = document.getElementById('cm-input-branch-name-format');
    var spanCommitMessageFormatPreview = document.getElementById('cm-input-commit-message-format-preview');
    var spanBranchNameFormatPreview = document.getElementById('cm-input-branch-name-format-preview');
    var buttonSaveOptions = document.getElementById('cm-btn-save-commit-message-format');
    var spanTitleText = document.getElementById('cm-span-title-text');
    var spanFooterText = document.getElementById('cm-footer-text');

    var timerInputCommitMessageFormatKeyUp;
    var timerInputBranchNameFormatKeyUp;
    var commitMessageFormat = '';
    var branchNameFormat = '';

    function init() {

        document.title = global.Manifest.name;
        spanTitleText.innerHTML = 'for ' + global.Manifest.name;
        spanFooterText.innerHTML = global.Manifest.name + '<br>v' + global.Manifest.version;

        inputCommitMessageFormat.value = commitMessageFormat;
        inputBranchNameFormat.value = branchNameFormat;

        updateCommitMessageFormatPreview();
        updateBranchNameFormatPreview();
        updateTagsList();
        setEventHandlers();

    }

    function updateCommitMessageFormatPreview() {

        spanCommitMessageFormatPreview.innerText = global.GetFormattedCommitMessage(commitMessageFormat);

    };

    function updateBranchNameFormatPreview() {

        spanBranchNameFormatPreview.innerText = global.GetFormattedCommitMessage(branchNameFormat);

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

        inputBranchNameFormat.addEventListener('keyup', function () {

            clearTimeout(timerInputBranchNameFormatKeyUp);
            timerInputBranchNameFormatKeyUp = setTimeout(function () {

                branchNameFormat = inputBranchNameFormat.value;
                updateBranchNameFormatPreview();

            }, 500);

        });

        buttonSaveOptions.addEventListener('click', function () {

            chrome.storage.sync.set({ commitMessageFormat: commitMessageFormat, branchNameFormat: branchNameFormat }, function () {
                alert('Options saved! Please reload your page to see the changes.');
            });

        });

    }

    // Init
    chrome.storage.sync.get(['commitMessageFormat', 'branchNameFormat'], function (result) {

        if (result) {
            commitMessageFormat = result.commitMessageFormat;
            branchNameFormat = result.branchNameFormat;
        }

        init();
    });

}(window));