(function (global) {

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

}(window));