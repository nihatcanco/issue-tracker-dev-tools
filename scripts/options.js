(function (global) {

    const document = global.document;
    const setTimeout = global.setTimeout;
    const clearTimeout = global.clearTimeout;

    var ulTicketTags = document.getElementById('cm-ul-ticket-tags');
    var inputCommitMessageFormat = document.getElementById('cm-input-commit-message-format');
    var inputBranchNameFormat = document.getElementById('cm-input-branch-name-format');
    var spanCommitMessageFormatPreview = document.getElementById('cm-input-commit-message-format-preview');
    var spanBranchNameFormatPreview = document.getElementById('cm-input-branch-name-format-preview');
    var buttonSaveOptions = document.getElementById('cm-btn-save-commit-message-format');
    var spanTitleText = document.getElementById('cm-span-title-text');
    var spanFooterText = document.getElementById('cm-footer-text');
    var checkboxShowCommitMessageBox = document.getElementById('cm-checkbox-show-commit-message-box');
    var checkboxShowBranchNameBox = document.getElementById('cm-checkbox-show-branch-name-box');
    var alertCommitMessageBoxVisibility = document.getElementById('cm-alert-commit-message-box-visibility');
    var alertBranchNameBoxVisibility = document.getElementById('cm-alert-branch-name-box-visibility');

    var timerInputCommitMessageFormatKeyUp;
    var timerInputBranchNameFormatKeyUp;
    var commitMessageFormat = '';
    var branchNameFormat = '';

    function init() {

        chrome.storage.sync.get(['commitMessageBoxVisible', 'branchNameBoxVisible', 'isCommitMessageDivCollapsed', 'isBranchNameDivCollapsed', 'commitMessageFormat', 'branchNameFormat'], function (result) {

            if (result) {
                commitMessageFormat = result.commitMessageFormat;
                branchNameFormat = result.branchNameFormat;
            }

            document.title = global.Manifest.name;
            spanTitleText.innerHTML = 'for ' + global.Manifest.name;
            spanFooterText.innerHTML = global.Manifest.name + '<br>v' + global.Manifest.version;

            inputCommitMessageFormat.value = commitMessageFormat;
            inputBranchNameFormat.value = branchNameFormat;

            checkboxShowCommitMessageBox.checked = result.commitMessageBoxVisible;
            checkboxShowBranchNameBox.checked = result.branchNameBoxVisible;

            alertCommitMessageBoxVisibility.hidden = checkboxShowCommitMessageBox.checked;
            alertBranchNameBoxVisibility.hidden = checkboxShowBranchNameBox.checked;

            updateCommitMessageFormatPreview();
            updateBranchNameFormatPreview();
            updateTagsList();
            setEventHandlers();

        });

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

        checkboxShowCommitMessageBox.addEventListener('click', function () {

            alertCommitMessageBoxVisibility.hidden = checkboxShowCommitMessageBox.checked;

        });

        checkboxShowBranchNameBox.addEventListener('click', function () {

            alertBranchNameBoxVisibility.hidden = checkboxShowBranchNameBox.checked;

        });

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

            chrome.storage.sync.set({ commitMessageFormat: commitMessageFormat, branchNameFormat: branchNameFormat, commitMessageBoxVisible: checkboxShowCommitMessageBox.checked, branchNameBoxVisible: checkboxShowBranchNameBox.checked }, function () {
                alert('Options saved! Please reload your page to see the changes.');
            });

        });

    }

    init();

}(window));