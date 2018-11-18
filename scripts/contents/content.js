chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.message === 'getSelectedIssue') {


        let data = {};
        let navigatorContent = null;
        let navigatorContents = document.getElementsByClassName('navigator-content');
        let keyVal = document.getElementById('key-val');

        if (navigatorContents) navigatorContent = navigatorContents[0];

        if (!navigatorContent || !keyVal) return;

        let dataIssueTableModelState = JSON.parse(navigatorContent.getAttribute('data-issue-table-model-state'));

        if (!dataIssueTableModelState.issueTable || !dataIssueTableModelState.issueTable.table) return;

        for (let i = 0; i < dataIssueTableModelState.issueTable.table.length; i++) {

            let tableElement = dataIssueTableModelState.issueTable.table[i];

            if (tableElement.key === keyVal.getAttribute('data-issue-key')) {
                data = tableElement;
                break;
            }

        }

        sendResponse({ message: data });

    }

});


















//(function (global) {

//    //const manifestData = chrome.runtime.getManifest();

//    /*var jiraLeftMenu = document.getElementById('navigation-app');
//    var jiraLeftMenuWidth = jiraLeftMenu.offsetWidth;
//    var jiraLeftMenuWidthPx = jiraLeftMenuWidth + 'px';

//    var contentElement = document.createElement('div');
//    contentElement.id = 'jce-contentbar';
//    contentElement.style.width = 'calc(100% - ' + jiraLeftMenuWidthPx + ')';
//    contentElement.style.height = '100px';
//    contentElement.style.position = 'fixed';
//    contentElement.style.background = 'green';
//    contentElement.style.zIndex = '99999';
//    contentElement.style.marginLeft = jiraLeftMenuWidthPx;
//    contentElement.className = '';

//    document.body.prepend(contentElement);*/

//    /*
//    // Get filter name & hrefs from dashboard view
//    let list = document.getElementById('gadget-10003').getElementsByTagName('table')[0].getElementsByTagName('a');
//    for(let i=0;i<list.length;i++){
//        console.log(list[i].text + ' : ' + list[i].getAttribute('href'));
//    }
//    */

//    var navigatorContent;
//    var mutationObserver;

//    function getValuesFromUi() {


//    }

//    function init() {

//        var navigatorContents = global.document.getElementsByClassName('navigator-content');
//        if (navigatorContents) navigatorContent = navigatorContents[0];

//        mutationObserver = new global.MutationObserver(function (mutations) {

//            debugger;
//            mutations.forEach(function (mutation) {

//                for (let i = 0; i < mutation.addedNodes.length; i++) {

//                    global.console.log('Added: ' + mutation.addedNodes[i].className);

//                }

//                for (let i = 0; i < mutation.removedNodes.length; i++) {

//                    global.console.log('Removed: ' + mutation.removedNodes[i].className);

//                }

//            });

//        });

//        if (navigatorContent)
//            mutationObserver.observe(navigatorContent, { attributes: true });
//    }

//    init();

//}(window));