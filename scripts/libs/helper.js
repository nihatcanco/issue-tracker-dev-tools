(function (global) {

    /**
     * Ticket formatting tags.
     */
    global.TicketEnum = {
        TICKET_TYPE: '{TICKET_TYPE}',
        TICKET_NUMBER: '{TICKET_NUMBER}',
        TICKET_SUMMARY: '{TICKET_SUMMARY}',
        //TICKET_DESCRIPTION: '{TICKET_DESCRIPTION}',
        NEWLINE: '{NEWLINE}',
        UPPERCASE_START: '{UPPERCASE}',
        UPPERCASE_END: '{/UPPERCASE}',
        LOWERCASE_START: '{LOWERCASE}',
        LOWERCASE_END: '{/LOWERCASE}'
    };

    /**
     * Formats the given commit message with the given format string.
     * @param {any} commitMessageFormat
     * @param {any} ticketType
     * @param {any} ticketNumber
     * @param {any} ticketSummary
     * @param {any} ticketDescription
     */
    global.GetFormattedCommitMessage = function (
        commitMessageFormat,
        ticketType = 'type',
        ticketNumber = 'ABCDEFG-123',
        ticketSummary = 'This is the ticket summary',
        ticketDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque semper magna sed ullamcorper malesuada. Aenean lacinia tincidunt est, vel vestibulum turpis venenatis vel.') {

        let formattedCommitMessage = commitMessageFormat;

        while (formattedCommitMessage.includes(global.TicketEnum.TICKET_TYPE)) {
            formattedCommitMessage = formattedCommitMessage.replace(global.TicketEnum.TICKET_TYPE, ticketType);
        }

        while (formattedCommitMessage.includes(global.TicketEnum.TICKET_NUMBER)) {
            formattedCommitMessage = formattedCommitMessage.replace(global.TicketEnum.TICKET_NUMBER, ticketNumber);
        }

        while (formattedCommitMessage.includes(global.TicketEnum.TICKET_SUMMARY)) {
            formattedCommitMessage = formattedCommitMessage.replace(global.TicketEnum.TICKET_SUMMARY, ticketSummary);
        }

        //while (formattedCommitMessage.includes(global.TicketEnum.TICKET_DESCRIPTION)) {
        //    formattedCommitMessage = formattedCommitMessage.replace(global.TicketEnum.TICKET_DESCRIPTION, ticketDescription);
        //}

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
     * Replaces \n to <br /> in the given string.
     * @param {any} string
     */
    global.ReplaceNewLinesToBr = function (string) {

        return string.replace(/\n/g, "<br />");
    };

    /**
     * Copies the specified text to clipboard.
     * @param {string} text
     */
    global.CopyToClipboard = function (text) {

        let textareaElement = document.createElement('textarea');
        textareaElement.value = text;
        document.body.appendChild(textareaElement);
        textareaElement.select();
        document.execCommand('copy');
        document.body.removeChild(textareaElement);

    };

    /**
     * Shows/hides loading overlay.
     * @param {any} doShow
     * @param {any} element
     */
    global.TogglePleaseWait = function (doShow, element) {

        let el = element ? $(element) : $;

        if (doShow) {

            el.LoadingOverlay("show", {
                image: "",
                fontawesome: "fa fa-cog fa-spin"
            });

        } else {

            el.LoadingOverlay('hide');

        }

    };

}(window));