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