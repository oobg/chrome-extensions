chrome.commands.onCommand.addListener((command) => {
	if (command === "block-braille-translation") {
		console.log("Shortcut triggered!");

		// 현재 활성 탭에 content script 실행
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "text-selected") {
		console.log("Text selected in content script:", message.text);

		// 팝업을 열고 메시지 전달
		chrome.runtime.sendMessage({ action: "show-popup", text: message.text });

		// 새 탭 열기 (index.html)
		// chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
		chrome.windows.create({
			url: chrome.runtime.getURL("index.html"), // 열고자 하는 페이지
			type: "popup", // 창 유형 (팝업 창)
			width: 500,    // 창 너비
			height: 600    // 창 높이
		}, (newWindow) => {
			console.log("New window created:", newWindow);
		});
	}
});