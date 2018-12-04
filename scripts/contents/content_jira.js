chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    // To avoid duplicate injections.
    if (msg.text === 'isContentScriptInjected') {
        sendResponse(true);
    }

});

(function (global, document) {

    const setInterval = global.setInterval;
    const clearInterval = global.clearInterval;
    const console = global.console;

    const app = (function () {

        let viewIssueSidebar = null;

        const selectedTicket = {
            type: '',
            number: '',
            summary: '',
            assignee: '',
            priority: '',
            storyPoints: '',
            description: ''
        };

        const options = {

            commitMessageBox: {
                divModuleId: 'commitmessagegeneratormodule',
                visible: true,
                collapsed: false,
                format: ''
            },

            branchNameBox: {
                divModuleId: 'branchnamegeneratormodule',
                visible: true,
                collapsed: false,
                format: ''
            }

        };

        const commitMessageBox = (function () {

            let commitMessage = '';

            // UI elements
            let divModule = null;
            let titleHeader;
            let textAreaCommitMessage;
            let buttonCopyToClipboard;
            let buttonReset;
            let spanCharacterCount;

            const init = function () {

                createUi();
                updateCharacterCount();
                setEventHandlers();
                setData();

            };

            function createUi() {

                divModule = document.createElement('div');
                divModule.id = options.commitMessageBox.divModuleId;
                divModule.className = 'module toggle-wrap' + (options.commitMessageBox.collapsed ? ' collapsed' : '');

                let divHeader = document.createElement('div');
                divHeader.id = 'commitmessagegenerator_heading';
                divHeader.className = 'mod-header';

                titleHeader = document.createElement('h2');
                titleHeader.id = 'cm-title-header-commit-message';
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
                textAreaCommitMessage.className = 'cm-input';
                textAreaCommitMessage.setAttribute('rows', '6');

                let li1 = document.createElement('li');
                li1.style.marginTop = '0';

                spanCharacterCount = document.createElement('span');

                let spanButtonContainer = document.createElement('span');
                spanButtonContainer.style.float = 'right';

                buttonCopyToClipboard = document.createElement('a');
                buttonCopyToClipboard.id = 'cm-button-copy-to-clipboard-commit-message';
                buttonCopyToClipboard.className = 'switcher-item cm-a-button';
                buttonCopyToClipboard.appendChild(document.createTextNode('Copy'));

                buttonReset = document.createElement('a');
                buttonReset.id = 'cm-button-reset-commit-message';
                buttonReset.className = 'switcher-item cm-a-button';
                buttonReset.appendChild(document.createTextNode('Reset'));

                divHeader.appendChild(titleHeader);
                li0.appendChild(textAreaCommitMessage);
                spanButtonContainer.appendChild(buttonCopyToClipboard);
                spanButtonContainer.appendChild(buttonReset);
                li1.appendChild(spanCharacterCount);
                li1.appendChild(spanButtonContainer);
                ulItemDetails.appendChild(li0);
                ulItemDetails.appendChild(li1);
                divContent.appendChild(ulItemDetails);
                divModule.appendChild(divHeader);
                divModule.appendChild(divContent);

                viewIssueSidebar.insertBefore(divModule, viewIssueSidebar.firstChild);

            }

            function setEventHandlers() {

                titleHeader.addEventListener('click', function () {
                    // Set collapsed status
                    const isCollapsed = !divModule.className.includes('collapsed');
                    global.SetOptions({ isCommitMessageDivCollapsed: isCollapsed });
                });

                textAreaCommitMessage.addEventListener('keyup', function () {
                    commitMessage = textAreaCommitMessage.value;
                    updateCharacterCount();
                });

                buttonReset.addEventListener('click', function () {
                    setData();
                });

                buttonCopyToClipboard.addEventListener('click', function () {
                    global.CopyToClipboard(commitMessage);
                });

            }

            function setData() {

                commitMessage = global.GetFormattedCommitMessage(options.commitMessageBox.format, selectedTicket);
                textAreaCommitMessage.value = commitMessage;
                updateCharacterCount();

            }

            function updateCharacterCount() {

                spanCharacterCount.innerHTML = 'Character count: ' + (commitMessage ? commitMessage.length : '0');

            }

            return {

                init: init

            };

        })();

        const branchNameBox = (function () {

            let branchName = '';

            // UI elements
            let divModule = null;
            let titleHeader;
            let textareaBranchName;
            let buttonCopyToClipboard;
            let buttonReset;
            let spanCharacterCount;

            const init = function () {

                createUi();
                updateCharacterCount();
                setEventHandlers();
                setData();

            };

            function createUi() {

                divModule = document.createElement('div');
                divModule.id = options.branchNameBox.divModuleId;
                divModule.className = 'module toggle-wrap' + (options.branchNameBox.collapsed ? ' collapsed' : '');
                divModule.style.padding = '0';
                divModule.style.margin = '0';

                let divHeader = document.createElement('div');
                divHeader.id = 'branchnamegenerator_heading';
                divHeader.className = 'mod-header';

                titleHeader = document.createElement('h2');
                titleHeader.id = 'cm-title-header-branch-name';
                titleHeader.className = 'toggle-title';
                titleHeader.appendChild(document.createTextNode('Branch Name'));

                let divContent = document.createElement('div');
                divContent.className = 'mod-content';
                divContent.style.marginBottom = '20px';

                let ulItemDetails = document.createElement('ul');
                ulItemDetails.className = 'item-details';

                let li0 = document.createElement('li');

                textareaBranchName = document.createElement('textarea');
                textareaBranchName.id = 'cm-textarea-branch-name';
                textareaBranchName.className = 'cm-input';
                textareaBranchName.setAttribute('rows', '1');

                let li1 = document.createElement('li');

                spanCharacterCount = document.createElement('span');

                let spanButtonContainer = document.createElement('span');
                spanButtonContainer.style.float = 'right';

                buttonCopyToClipboard = document.createElement('a');
                buttonCopyToClipboard.id = 'cm-button-copy-to-clipboard-branch-name';
                buttonCopyToClipboard.className = 'switcher-item cm-a-button';
                buttonCopyToClipboard.appendChild(document.createTextNode('Copy'));

                buttonReset = document.createElement('a');
                buttonReset.id = 'cm-button-reset-branch-name';
                buttonReset.className = 'switcher-item cm-a-button';
                buttonReset.appendChild(document.createTextNode('Reset'));

                divHeader.appendChild(titleHeader);
                li0.appendChild(textareaBranchName);
                spanButtonContainer.appendChild(buttonCopyToClipboard);
                spanButtonContainer.appendChild(buttonReset);
                li1.appendChild(spanCharacterCount);
                li1.appendChild(spanButtonContainer);
                ulItemDetails.appendChild(li0);
                ulItemDetails.appendChild(li1);
                divContent.appendChild(ulItemDetails);
                divModule.appendChild(divHeader);
                divModule.appendChild(divContent);

                viewIssueSidebar.insertBefore(divModule, viewIssueSidebar.firstChild);

            }

            function setEventHandlers() {

                titleHeader.addEventListener('click', function () {
                    // Set collapsed status
                    const isCollapsed = !divModule.className.includes('collapsed');
                    global.SetOptions({ isBranchNameDivCollapsed: isCollapsed });
                });

                textareaBranchName.addEventListener('keyup', function () {
                    branchName = textareaBranchName.value;
                    updateCharacterCount();
                });

                textareaBranchName.addEventListener('keydown', function (e) {
                    // To disable newline on enter keypress.
                    if (e.keyCode === 13 && !e.shiftKey) {
                        e.preventDefault();
                    }
                });

                buttonReset.addEventListener('click', function () {
                    setData();
                });

                buttonCopyToClipboard.addEventListener('click', function () {
                    global.CopyToClipboard(branchName);
                });

            }

            function setData() {

                branchName = global.GetFormattedCommitMessage(options.branchNameBox.format, selectedTicket);
                textareaBranchName.value = branchName;
                updateCharacterCount();

            }

            function updateCharacterCount() {

                spanCharacterCount.innerHTML = 'Character count: ' + (branchName ? branchName.length : '0');

            }

            return {

                init: init

            };

        })();

        const init = function () {

            let isInitInProgress = false;

            setInterval(function () {

                if (
                    (document.getElementById('viewissuesidebar') || document.getElementById('ghx-detail-view')) &&
                    (
                        (!document.getElementById(options.commitMessageBox.divModuleId) && options.commitMessageBox.visible) ||
                        (!document.getElementById(options.branchNameBox.divModuleId) && options.branchNameBox.visible)
                    ) &&
                    !isInitInProgress
                ) {

                    isInitInProgress = true;

                    viewIssueSidebar = document.getElementById('viewissuesidebar') || document.getElementById('ghx-detail-view').childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0];

                    global.GetAllOptions(function (result) {

                        // Set options
                        options.commitMessageBox.visible = result.commitMessageBoxVisible;
                        options.commitMessageBox.collapsed = result.isCommitMessageDivCollapsed;
                        options.commitMessageBox.format = result.commitMessageFormat;
                        options.branchNameBox.visible = result.branchNameBoxVisible;
                        options.branchNameBox.collapsed = result.isBranchNameDivCollapsed;
                        options.branchNameBox.format = result.branchNameFormat;

                        // Wait for the UI elements load
                        const intervalData = setInterval(function () {

                            let ticketTypeElement = document.getElementById('type-val');
                            let ticketNumberElement = document.getElementById('key-val');
                            let ticketSummaryElement = document.getElementById('summary-val');
                            let ticketAssigneeElement = document.getElementById('assignee-val');
                            let ticketPriorityElement = document.getElementById('priority-val');
                            let ticketStoryPointsElement = document.getElementById('customfieldmodule');
                            ticketStoryPointsElement = ticketStoryPointsElement ? ticketStoryPointsElement.querySelector('strong[title="Story Points"]') : null;
                            ticketStoryPointsElement = ticketStoryPointsElement ? ticketStoryPointsElement.nextElementSibling : null;
                            let ticketDescriptionElement = document.getElementById('description-val');

                            let ghxSelectedPrimaryList = document.getElementsByClassName('ghx-selected-primary');
                            let ghxSelectedPrimary = null;

                            if (ghxSelectedPrimaryList && ghxSelectedPrimaryList.length > 0) {

                                ghxSelectedPrimary = ghxSelectedPrimaryList[0];

                                let ghxTypes = ghxSelectedPrimary.getElementsByClassName('ghx-type');
                                let ghxKeys = ghxSelectedPrimary.getElementsByClassName('ghx-key');
                                let ghxInners = ghxSelectedPrimary.getElementsByClassName('ghx-inner');
                                let ghxAvatarImgs = ghxSelectedPrimary.getElementsByClassName('ghx-avatar-img');
                                let ghxPriorities = ghxSelectedPrimary.getElementsByClassName('ghx-priority');

                                if (ghxTypes && ghxTypes.length > 0)
                                    ticketTypeElement = ghxTypes[0];

                                if (ghxKeys && ghxKeys.length > 0)
                                    ticketNumberElement = ghxKeys[0];

                                if (ghxInners && ghxInners.length > 0)
                                    ticketSummaryElement = ghxInners[0];

                                if (ghxAvatarImgs && ghxAvatarImgs.length > 0)
                                    ticketAssigneeElement = ghxAvatarImgs[0];

                                if (ghxPriorities && ghxPriorities.length > 0)
                                    ticketPriorityElement = ghxPriorities[0];

                                ticketStoryPointsElement = ghxSelectedPrimary.querySelector('span[title="Story Points"]');

                                // TODO: add description element too (if any)

                            }

                            if (!ticketNumberElement || !ticketSummaryElement || !ticketTypeElement) return;

                            clearInterval(intervalData);

                            if (ghxSelectedPrimary) {
                                selectedTicket.type = ticketTypeElement ? ticketTypeElement.getAttribute('title') : '';
                                selectedTicket.number = ticketNumberElement ? ticketNumberElement.getAttribute('title') : '';
                                selectedTicket.summary = ticketSummaryElement ? ticketSummaryElement.textContent : '';
                                selectedTicket.assignee = (ticketAssigneeElement && ticketAssigneeElement.getAttribute('alt') && ticketAssigneeElement.getAttribute('alt').includes(': ')) ? ticketAssigneeElement.getAttribute('alt').split(': ')[1] : '';
                                selectedTicket.priority = ticketPriorityElement ? ticketPriorityElement.getAttribute('title') : '';
                                selectedTicket.storyPoints = ticketStoryPointsElement && ticketStoryPointsElement.textContent ? ticketStoryPointsElement.textContent.trim() : '';
                                selectedTicket.description = '';
                            }
                            else {
                                selectedTicket.type = ticketTypeElement && ticketTypeElement.textContent ? ticketTypeElement.textContent.trim() : '';
                                selectedTicket.number = ticketNumberElement && ticketNumberElement.textContent ? ticketNumberElement.textContent.trim() : '';
                                selectedTicket.summary = ticketSummaryElement && ticketSummaryElement.textContent ? ticketSummaryElement.textContent.trim() : '';
                                selectedTicket.assignee = (ticketAssigneeElement && ticketAssigneeElement.childNodes && ticketAssigneeElement.childNodes.length > 1 && ticketAssigneeElement.childNodes[1].textContent) ? ticketAssigneeElement.childNodes[1].textContent.trim() : '';
                                selectedTicket.priority = ticketPriorityElement && ticketPriorityElement.textContent ? ticketPriorityElement.textContent.trim() : '';
                                selectedTicket.storyPoints = ticketStoryPointsElement && ticketStoryPointsElement.textContent ? ticketStoryPointsElement.textContent.trim() : '';
                                selectedTicket.description = ticketDescriptionElement && ticketDescriptionElement.textContent ? ticketDescriptionElement.textContent.trim() : '';
                            }

                            // Ordering is backwards
                            if (options.branchNameBox.visible) {
                                branchNameBox.init();
                            }

                            if (options.commitMessageBox.visible) {
                                commitMessageBox.init();
                            }

                            isInitInProgress = false;

                        }, 500);

                    });

                }

            }, 1000);

        };

        return {

            init: init

        };

    })();

    app.init();

}(window, document));