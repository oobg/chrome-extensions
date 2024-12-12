chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "block-braille-translation") {
		console.log("Blocking braille translation", message);
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]) {
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					files: ["script/content.js"]
				});
			}
		});
	}
});