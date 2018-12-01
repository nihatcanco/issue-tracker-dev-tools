(function (global) {

    const document = global.document;
    const setTimeout = global.setTimeout;
    const clearTimeout = global.clearTimeout;
    const alert = global.alert;
    const console = global.console;

    const ulTicketTags = document.getElementById('cm-ul-ticket-tags');
    const inputCommitMessageFormat = document.getElementById('cm-input-commit-message-format');
    const inputBranchNameFormat = document.getElementById('cm-input-branch-name-format');
    const spanCommitMessageFormatPreview = document.getElementById('cm-input-commit-message-format-preview');
    const spanBranchNameFormatPreview = document.getElementById('cm-input-branch-name-format-preview');
    const buttonSaveOptions = document.getElementById('cm-btn-save-commit-message-format');
    const spanTitleText = document.getElementById('cm-span-title-text');
    const spanFooterText = document.getElementById('cm-footer-text');
    const checkboxShowCommitMessageBox = document.getElementById('cm-checkbox-show-commit-message-box');
    const checkboxShowBranchNameBox = document.getElementById('cm-checkbox-show-branch-name-box');
    const checkboxTrimOnCopy = document.getElementById('cm-checkbox-trim-on-copy');
    const alertCommitMessageBoxVisibility = document.getElementById('cm-alert-commit-message-box-visibility');
    const alertBranchNameBoxVisibility = document.getElementById('cm-alert-branch-name-box-visibility');

    let timerInputCommitMessageFormatKeyUp;
    let timerInputBranchNameFormatKeyUp;
    let commitMessageFormat = '';
    let branchNameFormat = '';

    function init() {

        global.GetAllOptions(function (result) {

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
            checkboxTrimOnCopy.checked = result.trimCopiedText;

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

        for (let key in global.TicketEnum) {
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

            global.SetOptions({
                commitMessageFormat: commitMessageFormat,
                commitMessageBoxVisible: checkboxShowCommitMessageBox.checked,
                branchNameFormat: branchNameFormat,
                branchNameBoxVisible: checkboxShowBranchNameBox.checked,
                trimCopiedText: checkboxTrimOnCopy.checked
            }, function () {
                alert('Options saved! Please reload your page to see the changes.');
            });

        });

    }

    init();

}(window));