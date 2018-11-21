(function (global) {

    const document = global.document;
    const setInterval = global.setInterval;
    const clearInterval = global.clearInterval;

    var isInitInProgress = false;
    var commitMessage = '';
    var commitMessageFormat = '';
    var divModuleId = 'commitmessagegeneratormodule';

    var ticketEnum =
    {
        TICKET_TYPE: '{TICKET_TYPE}',
        TICKET_NUMBER: '{TICKET_NUMBER}',
        TICKET_SUMMARY: '{TICKET_SUMMARY}',
        TICKET_DESCRIPTION: '{TICKET_DESCRIPTION}',
        NEWLINE: '{NEWLINE}',
        UPPERCASE_START: '{UPPERCASE}',
        UPPERCASE_END: '{UPPERCASE}',
        LOWERCASE_START: '{LOWERCASE}',
        LOWERCASE_END: '{LOWERCASE}'
    }

    // UI elements
    var viewIssueSidebar;
    var divModule;
    var titleHeader;
    var textAreaCommitMessage;
    var buttonCopyToClipboard;
    var buttonReset;
    var spanCharacterCount;

    function init() {

        isInitInProgress = true;

        const intervalInit = setInterval(function () {

            viewIssueSidebar = document.getElementById('viewissuesidebar');

            if (!viewIssueSidebar) return;

            clearInterval(intervalInit);

            chrome.storage.sync.get(['isCommitMessageDivCollapsed'], function (result) {

                createUi(result.isCommitMessageDivCollapsed);
                updateCharacterCount();
                setEventHandlers();
                setData();

                isInitInProgress = false;

            });

        }, 500);
    }

    function createUi(isCollapsed) {

        divModule = document.createElement('div');
        divModule.id = divModuleId;
        divModule.className = 'module toggle-wrap' + (isCollapsed ? ' collapsed' : '');

        let divHeader = document.createElement('div');
        divHeader.id = 'commitmessagegenerator_heading';
        divHeader.className = 'mod-header';

        titleHeader = document.createElement('h2');
        titleHeader.id = 'cm-title-header';
        titleHeader.className = 'toggle-title';
        titleHeader.appendChild(document.createTextNode('Commit Message'));

        let divContent = document.createElement('div');
        divContent.className = 'mod-content';
        divContent.style.marginBottom = '20px';

        let ulItemDetails = document.createElement('ul');
        ulItemDetails.className = 'item-details';

        let li0 = document.createElement('li');

        textAreaCommitMessage = document.createElement('textarea');
        textAreaCommitMessage.id = 'cm-textarea-commit-message';
        //textAreaCommitMessage.autofocus = true;
        textAreaCommitMessage.setAttribute('rows', '6');
        textAreaCommitMessage.setAttribute('placeholder', 'Did this, did that etc...');

        let li1 = document.createElement('li');
        li1.style.marginTop = '0';

        spanCharacterCount = document.createElement('span');

        buttonReset = document.createElement('a');
        buttonReset.id = 'cm-button-reset';
        buttonReset.className = 'switcher-item';
        buttonReset.appendChild(document.createTextNode('Reset'));

        let li2 = document.createElement('li');

        buttonCopyToClipboard = document.createElement('button');
        buttonCopyToClipboard.id = 'cm-button-cpoy-to-clipboard';
        buttonCopyToClipboard.appendChild(document.createTextNode('Copy To Clipboard'));

        divHeader.appendChild(titleHeader);
        li0.appendChild(textAreaCommitMessage);
        li1.appendChild(spanCharacterCount);
        li1.appendChild(buttonReset);
        li2.appendChild(buttonCopyToClipboard);
        ulItemDetails.appendChild(li0);
        ulItemDetails.appendChild(li1);
        ulItemDetails.appendChild(li2);
        divContent.appendChild(ulItemDetails);
        divModule.appendChild(divHeader);
        divModule.appendChild(divContent);
        viewIssueSidebar.insertBefore(divModule, viewIssueSidebar.firstChild);

    }

    function setEventHandlers() {

        titleHeader.addEventListener('click', function () {
            // Set collapsed status
            let isCollapsed = !divModule.className.includes('collapsed');
            chrome.storage.sync.set({ isCommitMessageDivCollapsed: isCollapsed }, function () { });
        });

        textAreaCommitMessage.addEventListener('keyup', function () {
            commitMessage = textAreaCommitMessage.value;
            updateCharacterCount();
        });

        buttonReset.addEventListener('click', function () {
            setData();
        });

        buttonCopyToClipboard.addEventListener('click', function () {
            copyToClipboard(commitMessage);
        });

    }

    function setData() {

        const intervalData = setInterval(function () {

            let ticketNumberElement = document.getElementById('key-val');
            let ticketTypeElement = document.getElementById('type-val');
            let ticketSummaryElement = document.getElementById('summary-val');

            if (!ticketNumberElement || !ticketTypeElement || !ticketSummaryElement) return;

            clearInterval(intervalData);

            chrome.storage.sync.get(['commitMessageFormat'], function (result) {

                if (result && result.commitMessageFormat) {
                    commitMessageFormat = result.commitMessageFormat;
                }

                let ticketType = ticketTypeElement.textContent.trim().toLowerCase();
                let ticketNumber = ticketNumberElement.textContent.trim();
                let ticketSummary = ticketSummaryElement.textContent.trim();

                commitMessage = getFormattedCommitMessage(ticketType, ticketNumber, ticketSummary);
                textAreaCommitMessage.value = commitMessage;
                updateCharacterCount();

            });

        }, 500);

    }

    function updateCharacterCount() {

        spanCharacterCount.innerHTML = 'Character count: ' + (commitMessage ? commitMessage.length : '0');

    }

    function copyToClipboard(text) {

        text = text.trim();

        let textareaElement = document.createElement('textarea');
        textareaElement.value = text;
        document.body.appendChild(textareaElement);
        textareaElement.select();
        document.execCommand('copy');
        document.body.removeChild(textareaElement);

    };

    function getFormattedCommitMessage(ticketType, ticketNumber, ticketSummary, ticketDescription) {

        let formattedCommitMessage = commitMessageFormat;

        while (formattedCommitMessage.includes(ticketEnum.TICKET_TYPE))
            formattedCommitMessage = formattedCommitMessage.replace(ticketEnum.TICKET_TYPE, ticketType);

        while (formattedCommitMessage.includes(ticketEnum.TICKET_NUMBER))
            formattedCommitMessage = formattedCommitMessage.replace(ticketEnum.TICKET_NUMBER, ticketNumber);

        while (formattedCommitMessage.includes(ticketEnum.TICKET_SUMMARY))
            formattedCommitMessage = formattedCommitMessage.replace(ticketEnum.TICKET_SUMMARY, ticketSummary);

        while (formattedCommitMessage.includes(ticketEnum.TICKET_DESCRIPTION))
            formattedCommitMessage = formattedCommitMessage.replace(ticketEnum.TICKET_DESCRIPTION, ticketDescription);

        while (formattedCommitMessage.includes(ticketEnum.NEWLINE))
            formattedCommitMessage = formattedCommitMessage.replace(ticketEnum.NEWLINE, '\n');

        // TODO: implement following tags
        //commitMessage = commitMessage.replace(ticketEnum.UPPERCASE_START, '');
        //commitMessage = commitMessage.replace(ticketEnum.UPPERCASE_END, '');
        //commitMessage = commitMessage.replace(ticketEnum.LOWERCASE_START, '');
        //commitMessage = commitMessage.replace(ticketEnum.LOWERCASE_END, '');

        return formattedCommitMessage;
    }

    // Start initialization interval
    const intervalDomChanges = setInterval(function () {

        if (!document.getElementById(divModuleId) && !isInitInProgress)
            init();

    }, 1000);

}(window));