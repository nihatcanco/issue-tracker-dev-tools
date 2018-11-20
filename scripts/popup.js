(function (global) {

    var document = global.document;
    var ulTicketTags = document.getElementById('cm-ul-ticket-tags');
    var inputCommitMessageFormat = document.getElementById('cm-input-commit-message-format');
    var smallCommitMessageFormatDefault = document.getElementById('cm-input-commit-message-format-default');
    var spanCommitMessageFormatPreview = document.getElementById('cm-input-commit-message-format-preview');
    var buttonSaveCommitMessageFormat = document.getElementById('cm-btn-save-commit-message-format');

    var commitMessageFormatDefault = '{TICKET_TYPE}({TICKET_NUMBER}): {TICKET_SUMMARY}{NEWLINE}{NEWLINE}';
    var commitMessageFormat = commitMessageFormatDefault;

    var ticketEnum =
    {
        TICKET_TYPE: '{TICKET_TYPE}',
        TICKET_NUMBER: '{TICKET_NUMBER}',
        TICKET_SUMMARY: '{TICKET_SUMMARY}',
        TICKET_DESCRIPTION: '{TICKET_DESCRIPTION}',
        NEWLINE: '{NEWLINE}',
        //UPPERCASE_START: '{UPPERCASE}',
        //UPPERCASE_END: '{UPPERCASE}',
        //LOWERCASE_START: '{LOWERCASE}',
        //LOWERCASE_END: '{LOWERCASE}'
    }

    function init() {

        inputCommitMessageFormat.value = commitMessageFormat;
        smallCommitMessageFormatDefault.innerHTML = 'Default format: ' + commitMessageFormatDefault;

        updateCommitMessagePreview(commitMessageFormat);
        updateTagsList();
        setEventHandlers();

    }

    function updateTagsList() {

        let ulHtml = '';

        for (var key in ticketEnum) {
            if (ticketEnum.hasOwnProperty(key)) {
                ulHtml += '<li>' + ticketEnum[key] + '</li>';
            }
        }

        ulTicketTags.innerHTML = ulHtml;

    }

    function updateCommitMessagePreview() {

        let commitMessagePreview = commitMessageFormat;

        while (commitMessagePreview.includes(ticketEnum.TICKET_TYPE))
            commitMessagePreview = commitMessagePreview.replace(ticketEnum.TICKET_TYPE, 'bug');

        while (commitMessagePreview.includes(ticketEnum.TICKET_NUMBER))
            commitMessagePreview = commitMessagePreview.replace(ticketEnum.TICKET_NUMBER, 'ABCDEFG-123');

        while (commitMessagePreview.includes(ticketEnum.TICKET_SUMMARY))
            commitMessagePreview = commitMessagePreview.replace(ticketEnum.TICKET_SUMMARY, 'This is the ticket summary');

        while (commitMessagePreview.includes(ticketEnum.TICKET_DESCRIPTION))
            commitMessagePreview = commitMessagePreview.replace(ticketEnum.TICKET_DESCRIPTION, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque semper magna sed ullamcorper malesuada. Aenean lacinia tincidunt est, vel vestibulum turpis venenatis vel.');

        while (commitMessagePreview.includes(ticketEnum.NEWLINE))
            commitMessagePreview = commitMessagePreview.replace(ticketEnum.NEWLINE, "<br>");

        // TODO: implement following tags
        //commitMessage = commitMessage.replace(ticketEnum.UPPERCASE_START, '');
        //commitMessage = commitMessage.replace(ticketEnum.UPPERCASE_END, '');
        //commitMessage = commitMessage.replace(ticketEnum.LOWERCASE_START, '');
        //commitMessage = commitMessage.replace(ticketEnum.LOWERCASE_END, '');

        spanCommitMessageFormatPreview.innerHTML = commitMessagePreview;
    }

    function setEventHandlers() {

        inputCommitMessageFormat.addEventListener('keyup', function () {

            commitMessageFormat = inputCommitMessageFormat.value;
            updateCommitMessagePreview();

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