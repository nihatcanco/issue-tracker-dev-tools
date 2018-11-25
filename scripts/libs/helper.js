(function (global) {

    /**
     * The manifest.json object.
     */
    global.Manifest = chrome.runtime.getManifest();

    /**
     * Ticket formatting tags.
     */
    global.TicketEnum = {
        TICKET_TYPE: '{TICKET_TYPE}',
        TICKET_NUMBER: '{TICKET_NUMBER}',
        TICKET_SUMMARY: '{TICKET_SUMMARY}',
        NEWLINE: '{NEWLINE}',
        UPPERCASE_START: '{UPPERCASE}',
        UPPERCASE_END: '{/UPPERCASE}',
        LOWERCASE_START: '{LOWERCASE}',
        LOWERCASE_END: '{/LOWERCASE}'
    };

    /**
     * Formats the given commit message with the given format string.
     * @param {string} commitMessageFormat
     * @param {any} selectedTicket
     */
    global.GetFormattedCommitMessage = function (commitMessageFormat, selectedTicket) {

        if (!selectedTicket) {
            selectedTicket = {
                type: 'type',
                number: 'ABCDEFG-123',
                summary: 'This is the ticket summary',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque semper magna sed ullamcorper malesuada. Aenean lacinia tincidunt est, vel vestibulum turpis venenatis vel.'
            }
        }

        let formattedCommitMessage = commitMessageFormat;

        while (formattedCommitMessage.includes(global.TicketEnum.TICKET_TYPE)) {
            formattedCommitMessage = formattedCommitMessage.replace(global.TicketEnum.TICKET_TYPE, selectedTicket.type);
        }

        while (formattedCommitMessage.includes(global.TicketEnum.TICKET_NUMBER)) {
            formattedCommitMessage = formattedCommitMessage.replace(global.TicketEnum.TICKET_NUMBER, selectedTicket.number);
        }

        while (formattedCommitMessage.includes(global.TicketEnum.TICKET_SUMMARY)) {
            formattedCommitMessage = formattedCommitMessage.replace(global.TicketEnum.TICKET_SUMMARY, selectedTicket.summary);
        }

        while (formattedCommitMessage.includes(global.TicketEnum.NEWLINE)) {
            formattedCommitMessage = formattedCommitMessage.replace(global.TicketEnum.NEWLINE, '\n');
        }

        while (formattedCommitMessage.includes(global.TicketEnum.UPPERCASE_START) && formattedCommitMessage.includes(global.TicketEnum.UPPERCASE_END)) {
            formattedCommitMessage = formattedCommitMessage.replace(new RegExp(global.TicketEnum.UPPERCASE_START + '(.*?)}', 'g'),
                function (x) {
                    return x.replace(global.TicketEnum.UPPERCASE_START, '').replace(global.TicketEnum.UPPERCASE_END, '').toUpperCase();
                });
        }

        while (formattedCommitMessage.includes(global.TicketEnum.LOWERCASE_START) && formattedCommitMessage.includes(global.TicketEnum.LOWERCASE_END)) {
            formattedCommitMessage = formattedCommitMessage.replace(new RegExp(global.TicketEnum.LOWERCASE_START + '(.*?)}', 'g'),
                function (x) {
                    return x.replace(global.TicketEnum.LOWERCASE_START, '').replace(global.TicketEnum.LOWERCASE_END, '').toLowerCase();
                });
        }

        return formattedCommitMessage;
    };

    /**
     * Copies the specified text to clipboard.
     * @param {string} text
     */
    global.CopyToClipboard = function (text) {

        text = text.trim();

        let textareaElement = global.document.createElement('textarea');
        textareaElement.value = text;
        global.document.body.appendChild(textareaElement);
        textareaElement.select();
        global.document.execCommand('copy');
        global.document.body.removeChild(textareaElement);

    };

}(window));