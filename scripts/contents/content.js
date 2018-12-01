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
                textAreaCommitMessage.setAttribute('placeholder', 'Loading...');

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
            let inputBranchName;
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

                inputBranchName = document.createElement('input');
                inputBranchName.id = 'cm-input-branch-name';
                inputBranchName.className = 'cm-input';
                inputBranchName.setAttribute('type', 'text');
                inputBranchName.setAttribute('placeholder', 'Loading...');

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
                li0.appendChild(inputBranchName);
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

                inputBranchName.addEventListener('keyup', function () {
                    branchName = inputBranchName.value;
                    updateCharacterCount();
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
                inputBranchName.value = branchName;
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

                            let ghxSelectedPrimaryList = document.getElementsByClassName('ghx-selected-primary');
                            let ghxSelectedPrimary = null;

                            if (ghxSelectedPrimaryList) {
                                ghxSelectedPrimary = ghxSelectedPrimaryList[0];
                            }

                            let ticketTypeElement = document.getElementById('type-val');
                            let ticketNumberElement = document.getElementById('key-val');
                            let ticketSummaryElement = document.getElementById('summary-val');
                            let ticketAssigneeElement = document.getElementById('assignee-val');
                            let ticketPriorityElement = document.getElementById('priority-val');
                            let ticketStoryPointsElement = document.getElementById('customfieldmodule');
                            ticketStoryPointsElement = ticketStoryPointsElement ? ticketStoryPointsElement.querySelector('strong[title="Story Points"]') : null;
                            ticketStoryPointsElement = ticketStoryPointsElement ? ticketStoryPointsElement.nextElementSibling : null;
                            let ticketDescriptionElement = document.getElementById('description-val');

                            if (!ghxSelectedPrimary && (!ticketTypeElement || !ticketNumberElement || !ticketSummaryElement || !ticketAssigneeElement || !ticketPriorityElement || !ticketDescriptionElement)) return;

                            clearInterval(intervalData);

                            if (ghxSelectedPrimary) {
                                selectedTicket.type = ghxSelectedPrimary.getElementsByClassName('ghx-type')[0].getAttribute('title');
                                selectedTicket.number = ghxSelectedPrimary.getElementsByClassName('ghx-key')[0].getAttribute('title');
                                selectedTicket.summary = ghxSelectedPrimary.getElementsByClassName('ghx-inner')[0].textContent;
                                selectedTicket.assignee = ghxSelectedPrimary.getElementsByClassName('ghx-avatar-img')[0].getAttribute('alt').split(': ')[1];
                                selectedTicket.priority = ghxSelectedPrimary.getElementsByClassName('ghx-priority')[0].getAttribute('title');
                                selectedTicket.storyPoints = ghxSelectedPrimary.querySelector('span[title="Story Points"]').textContent.trim();
                                selectedTicket.description = '';
                            }
                            else {
                                selectedTicket.type = ticketTypeElement.textContent.trim();
                                selectedTicket.number = ticketNumberElement.textContent.trim();
                                selectedTicket.summary = ticketSummaryElement.textContent.trim();
                                selectedTicket.assignee = ticketAssigneeElement.childNodes[1].textContent.trim();
                                selectedTicket.priority = ticketPriorityElement.textContent.trim();
                                selectedTicket.storyPoints = ticketStoryPointsElement ? ticketStoryPointsElement.textContent.trim() : '';
                                selectedTicket.description = ticketDescriptionElement.textContent.trim();
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