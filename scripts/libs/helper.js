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
		TICKET_ASSIGNEE: '{TICKET_ASSIGNEE}',
		TICKET_PRIORITY: '{TICKET_PRIORITY}',
		TICKET_STORYPOINTS: '{TICKET_STORYPOINTS}',
		TICKET_DESCRIPTION: '{TICKET_DESCRIPTION}',
		NEWLINE: '{NEWLINE}',
		UPPERCASE_START: '{UPPERCASE}',
		UPPERCASE_END: '{/UPPERCASE}',
		LOWERCASE_START: '{LOWERCASE}',
		LOWERCASE_END: '{/LOWERCASE}'
	};

    /**
     * Array of options that the extension uses.
     */
	global.OptionsArray = {

		commitMessageBoxVisible: 'commitMessageBoxVisible',
		isCommitMessageDivCollapsed: 'isCommitMessageDivCollapsed',
		commitMessageFormat: 'commitMessageFormat',
		previousCommitMessageFormats: 'previousCommitMessageFormats',

		branchNameBoxVisible: 'branchNameBoxVisible',
		isBranchNameDivCollapsed: 'isBranchNameDivCollapsed',
		branchNameFormat: 'branchNameFormat',
		previousBranchNameFormats: 'previousBranchNameFormats',

		workLogBoxVisible: 'workLogBoxVisible',
		isWorkLogDivCollapsed: 'isWorkLogDivCollapsed',

		trimCopiedText: 'trimCopiedText'
	};

    /**
     * Formats the given commit message with the given format string.
     * @param {string} commitMessageFormat
     * @param {any} selectedTicket
     */
	global.GetFormattedCommitMessage = function (commitMessageFormat, selectedTicket) {

		if (!selectedTicket) {
			selectedTicket = {
				type: 'Type',
				number: 'AbcDef-123',
				summary: 'This is the ticket summary',
				assignee: 'John Doe',
				priority: 'Major',
				storyPoints: '8',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque semper magna sed ullamcorper malesuada. Aenean lacinia tincidunt est, vel vestibulum turpis venenatis vel.'
			}
		}

		let formattedCommitMessage = commitMessageFormat;

		// For empty description placeholder
		selectedTicket.description = selectedTicket.description.replace('Click to add description', '');

		formattedCommitMessage = formattedCommitMessage
			.replace(new RegExp(global.TicketEnum.TICKET_TYPE + '(.*?)', 'g'), selectedTicket.type)
			.replace(new RegExp(global.TicketEnum.TICKET_NUMBER + '(.*?)', 'g'), selectedTicket.number)
			.replace(new RegExp(global.TicketEnum.TICKET_SUMMARY + '(.*?)', 'g'), selectedTicket.summary)
			.replace(new RegExp(global.TicketEnum.TICKET_ASSIGNEE + '(.*?)', 'g'), selectedTicket.assignee)
			.replace(new RegExp(global.TicketEnum.TICKET_PRIORITY + '(.*?)', 'g'), selectedTicket.priority)
			.replace(new RegExp(global.TicketEnum.TICKET_STORYPOINTS + '(.*?)', 'g'), selectedTicket.storyPoints)
			.replace(new RegExp(global.TicketEnum.TICKET_DESCRIPTION + '(.*?)', 'g'), selectedTicket.description)
			.replace(new RegExp(global.TicketEnum.NEWLINE + '(.*?)', 'g'), '\n');

		while (formattedCommitMessage.includes(global.TicketEnum.UPPERCASE_START) && formattedCommitMessage.includes(global.TicketEnum.UPPERCASE_END)) {
			formattedCommitMessage = formattedCommitMessage.replace(new RegExp(global.TicketEnum.UPPERCASE_START + '(.*?)}', 'g'),
				function (x) {
					// Remove tags and make the text uppercase
					return x.replace(global.TicketEnum.UPPERCASE_START, '').replace(global.TicketEnum.UPPERCASE_END, '').toUpperCase();
				});
		}

		while (formattedCommitMessage.includes(global.TicketEnum.LOWERCASE_START) && formattedCommitMessage.includes(global.TicketEnum.LOWERCASE_END)) {
			formattedCommitMessage = formattedCommitMessage.replace(new RegExp(global.TicketEnum.LOWERCASE_START + '(.*?)}', 'g'),
				function (x) {
					// Remove tags and make the text lowercase
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

		global.GetOptions([global.OptionsArray.trimCopiedText], function (result) {

			if (result && result.trimCopiedText) text = text.trim();

			const textareaElement = global.document.createElement('textarea');
			textareaElement.value = text;
			global.document.body.appendChild(textareaElement);
			textareaElement.select();
			global.document.execCommand('copy');
			global.document.body.removeChild(textareaElement);

		});

	};

    /**
     * Gets all options from chrome storage.
     * @param {any} callback
     */
	global.GetAllOptions = function (callbackFunction) {

		const optionsArray = [];

		for (let key in global.OptionsArray) {
			if (global.OptionsArray.hasOwnProperty(key)) {
				optionsArray.push(global.OptionsArray[key]);
			}
		}

		chrome.storage.sync.get(optionsArray, callbackFunction);

	};

    /**
     * Gets the specified options.
     * @param {any} optionsArray
     * @param {any} callback
     */
	global.GetOptions = function (optionsArray, callbackFunction) {

		chrome.storage.sync.get(optionsArray, callbackFunction);

	};

    /**
     * Sets the given options to chrome storage.
     * @param {any} optionsObject
     * @param {any} callbackFunction
     */
	global.SetOptions = function (optionsObject, callbackFunction) {

		chrome.storage.sync.set(optionsObject, callbackFunction);

	};

	/**
	 * Gets JSON result from the given URL.
	 * @param {any} url
	 * @param {any} callback
	 */
	global.GetJSON = function (url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'json';
		xhr.onload = function () {
			var status = xhr.status;
			if (status === 200) {
				callback(null, xhr.response);
			} else {
				callback(status, xhr.response);
			}
		};
		xhr.send();
	};

	/**
	 * Returns the monday of the current week
	 * */
	global.GetMondayOfCurrentWeek = function () {
		var d = new Date();
		var day = d.getDay();
		return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day === 0 ? -6 : 1) - day);
	};

	global.GetFormattedDateString = function (date, options) {

		options = options || { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
		return date.toLocaleDateString('en-EN', options);

	};

}(window));