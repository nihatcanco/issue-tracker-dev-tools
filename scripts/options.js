(function (global) {

    const document = global.document;
    const setTimeout = global.setTimeout;
    const clearTimeout = global.clearTimeout;
    const alert = global.alert;
    const console = global.console;

    const ulTicketTags = document.getElementById('cm-ul-ticket-tags');
    const selectPreviousCommitMessageFormats = document.getElementById('cm-select-previous-commit-message-formats');
    const selectPreviousBranchNameFormats = document.getElementById('cm-select-previous-branch-name-formats');
    const aDeleteSelectedCommitMessageFormat = document.getElementById('cm-a-delete-selected-commit-message-format');
    const aDeleteSelectedBranchNameFormat = document.getElementById('cm-a-delete-selected-branch-name-format');
    const inputWeeklyWorkLogQuery = document.getElementById('cm-input-weekly-work-log-query');
    const inputCommitMessageFormat = document.getElementById('cm-input-commit-message-format');
    const inputBranchNameFormat = document.getElementById('cm-input-branch-name-format');
    const spanWeeklyWorkLogDefault = document.getElementById('cm-weekly-work-log-default');
    const spanCommitMessageFormatPreview = document.getElementById('cm-input-commit-message-format-preview');
    const spanBranchNameFormatPreview = document.getElementById('cm-input-branch-name-format-preview');
    const buttonSaveOptions = document.getElementById('cm-btn-save-options');
    const buttonSaveOptionsTop = document.getElementById('cm-btn-save-options-top');
    const spanTitleText = document.getElementById('cm-span-title-text');
    const spanFooterText = document.getElementById('cm-footer-text');
    const checkboxShowWorkLogBox = document.getElementById('cm-checkbox-show-work-log-box');
    const checkboxShowCommitMessageBox = document.getElementById('cm-checkbox-show-commit-message-box');
    const checkboxShowBranchNameBox = document.getElementById('cm-checkbox-show-branch-name-box');
    const checkboxTrimOnCopy = document.getElementById('cm-checkbox-trim-on-copy');
    const checkboxEnableDarkMode = document.getElementById('cm-checkbox-dark-mode');
    const alertWeeklyWorkLogBoxVisibility = document.getElementById('cm-alert-weekly-work-log-box-visibility');
    const alertCommitMessageBoxVisibility = document.getElementById('cm-alert-commit-message-box-visibility');
    const alertBranchNameBoxVisibility = document.getElementById('cm-alert-branch-name-box-visibility');

    let timerWeeklyWorkLogQueryKeyUp;
    let timerInputCommitMessageFormatKeyUp;
    let timerInputBranchNameFormatKeyUp;
    let weeklyWorkLogQuery = '';
    let commitMessageFormat = '';
    let branchNameFormat = '';

    function init() {

        global.GetAllOptions(function (result) {

            if (result) {
                weeklyWorkLogQuery = result.weeklyWorkLogQuery;
                commitMessageFormat = result.commitMessageFormat || (result.previousCommitMessageFormats.length > 0 ? result.previousCommitMessageFormats[0] : '');
                branchNameFormat = result.branchNameFormat !== '' ? result.branchNameFormat : result.previousBranchNameFormats.length > 0 ? result.previousBranchNameFormats[0] : '';
            }

            // Set title & footer texts
            document.title = global.Manifest.name;
            spanTitleText.innerHTML = '<small>for</small> ' + global.Manifest.name;
            spanFooterText.innerHTML = global.Manifest.name + ' v' + global.Manifest.version + '<br><a href="' + global.Manifest.homepage_url + '" target="_blank" style="color: white;">Github</a>';

            // Set checkboxes
            checkboxShowWorkLogBox.checked = result.workLogBoxVisible;
            checkboxShowCommitMessageBox.checked = result.commitMessageBoxVisible;
            checkboxShowBranchNameBox.checked = result.branchNameBoxVisible;
            checkboxTrimOnCopy.checked = result.trimCopiedText;
            checkboxEnableDarkMode.checked = result.isDarkMode;

            // Set previous format selects
            let previousCommitMessageFormatInnerHtml = '';
            for (let i = 0; i < result.previousCommitMessageFormats.length; i++) {
                const formatText = result.previousCommitMessageFormats[i];
                previousCommitMessageFormatInnerHtml += '<option value="' + formatText + '">' + formatText + '</option>';
            }
            selectPreviousCommitMessageFormats.innerHTML = previousCommitMessageFormatInnerHtml;
            selectPreviousCommitMessageFormats.selectedIndex = 0;

            let previousBranchNameFormatInnerHtml = '';
            for (let i = 0; i < result.previousBranchNameFormats.length; i++) {
                const formatText = result.previousBranchNameFormats[i];
                previousBranchNameFormatInnerHtml += '<option value="' + formatText + '">' + formatText + '</option>';
            }
            selectPreviousBranchNameFormats.innerHTML = previousBranchNameFormatInnerHtml;
            selectPreviousBranchNameFormats.selectedIndex = 0;

            // Set alert boxes
            alertWeeklyWorkLogBoxVisibility.hidden = checkboxShowWorkLogBox.checked;
            alertCommitMessageBoxVisibility.hidden = checkboxShowCommitMessageBox.checked;
            alertBranchNameBoxVisibility.hidden = checkboxShowBranchNameBox.checked;

            // Set delete buttons visibility
            aDeleteSelectedCommitMessageFormat.hidden = !(result.previousCommitMessageFormats && result.previousCommitMessageFormats.length > 1);
            aDeleteSelectedBranchNameFormat.hidden = !(result.previousBranchNameFormats && result.previousBranchNameFormats.length > 1);

            updateCommitMessageFormatPreview();
            updateBranchNameFormatPreview();
            updateTagsList();
            setEventHandlers();

            // To update format input elements.
            selectPreviousCommitMessageFormats.dispatchEvent(new global.Event('change'));
            selectPreviousBranchNameFormats.dispatchEvent(new global.Event('change'));
            
            spanWeeklyWorkLogDefault.innerHTML = weeklyWorkLogQuery;
            inputWeeklyWorkLogQuery.dispatchEvent(new global.Event('keyup'));

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

        checkboxShowWorkLogBox.addEventListener('click', function () {

            alertWeeklyWorkLogBoxVisibility.hidden = checkboxShowWorkLogBox.checked;

        });

        checkboxShowCommitMessageBox.addEventListener('click', function () {

            alertCommitMessageBoxVisibility.hidden = checkboxShowCommitMessageBox.checked;

        });

        checkboxShowBranchNameBox.addEventListener('click', function () {

            alertBranchNameBoxVisibility.hidden = checkboxShowBranchNameBox.checked;

        });
        
        inputWeeklyWorkLogQuery.addEventListener('keyup', function () {

            clearTimeout(timerWeeklyWorkLogQueryKeyUp);
            timerWeeklyWorkLogQueryKeyUp = setTimeout(function () {

                weeklyWorkLogQuery = inputWeeklyWorkLogQuery.value;

            }, 250);

        });

        inputCommitMessageFormat.addEventListener('keyup', function () {

            clearTimeout(timerInputCommitMessageFormatKeyUp);
            timerInputCommitMessageFormatKeyUp = setTimeout(function () {

                commitMessageFormat = inputCommitMessageFormat.value;
                updateCommitMessageFormatPreview();

            }, 250);

        });

        inputBranchNameFormat.addEventListener('keyup', function () {

            clearTimeout(timerInputBranchNameFormatKeyUp);
            timerInputBranchNameFormatKeyUp = setTimeout(function () {

                branchNameFormat = inputBranchNameFormat.value;
                updateBranchNameFormatPreview();

            }, 250);

        });

        selectPreviousCommitMessageFormats.addEventListener('change', function () {

            inputCommitMessageFormat.value = this.value;
            inputCommitMessageFormat.dispatchEvent(new global.Event('keyup'));

        });

        selectPreviousBranchNameFormats.addEventListener('change', function () {

            inputBranchNameFormat.value = this.value;
            inputBranchNameFormat.dispatchEvent(new global.Event('keyup'));

        });

        aDeleteSelectedCommitMessageFormat.addEventListener('click', function () {

            buttonSaveOptions.dispatchEvent(new global.CustomEvent('click', { 'detail': { 'deleteCurrentCommitMessage': true } }));

        });

        aDeleteSelectedBranchNameFormat.addEventListener('click', function () {

            buttonSaveOptions.dispatchEvent(new global.CustomEvent('click', { 'detail': { 'deleteCurrentBranchName': true } }));

        });

        buttonSaveOptionsTop.addEventListener('click', function () {
            buttonSaveOptions.dispatchEvent(new global.CustomEvent('click'));
        });

        buttonSaveOptions.addEventListener('click', function (eventData) {

            global.GetOptions([global.OptionsArray.previousCommitMessageFormats, global.OptionsArray.previousBranchNameFormats], function (result) {

                if (eventData.detail != null) {

                    result.previousCommitMessageFormats = result.previousCommitMessageFormats.filter(x => x !== commitMessageFormat);
                    if (commitMessageFormat && !eventData.detail.deleteCurrentCommitMessage) {
                        result.previousCommitMessageFormats.unshift(commitMessageFormat);
                    } else {
                        result.previousCommitMessageFormats = result.previousCommitMessageFormats.filter(x => x !== selectPreviousCommitMessageFormats[selectPreviousCommitMessageFormats.selectedIndex].value);
                        commitMessageFormat = result.previousCommitMessageFormats[0];
                    }

                    result.previousBranchNameFormats = result.previousBranchNameFormats.filter(x => x !== branchNameFormat);
                    if (branchNameFormat && !eventData.detail.deleteCurrentBranchName) {
                        result.previousBranchNameFormats.unshift(branchNameFormat);
                    } else {
                        result.previousBranchNameFormats = result.previousBranchNameFormats.filter(x => x !== selectPreviousBranchNameFormats[selectPreviousBranchNameFormats.selectedIndex].value);
                        branchNameFormat = result.previousBranchNameFormats[0];
                    }
                }

                global.SetOptions({
                    commitMessageFormat: commitMessageFormat,
                    workLogBoxVisible: checkboxShowWorkLogBox.checked,
                    weeklyWorkLogQuery: weeklyWorkLogQuery,
                    commitMessageBoxVisible: checkboxShowCommitMessageBox.checked,
                    previousCommitMessageFormats: result.previousCommitMessageFormats,
                    branchNameFormat: branchNameFormat,
                    branchNameBoxVisible: checkboxShowBranchNameBox.checked,
                    previousBranchNameFormats: result.previousBranchNameFormats,
                    trimCopiedText: checkboxTrimOnCopy.checked,
                    isDarkMode: checkboxEnableDarkMode.checked
                }, function () {
                    alert('Options saved! Please reload your page to see the changes.');
                    window.location.reload();
                });

            });

        });

    }

    init();

}(window));