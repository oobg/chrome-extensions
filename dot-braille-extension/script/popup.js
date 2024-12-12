// 메시지 수신
chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "show-popup") {
		console.log("Show popup with text:", message.text);

		// 팝업 DOM 업데이트
		setTimeout(() => {
			const requestText = document.getElementById("request-text");
			const requestButton = document.getElementById("request-button");
			const responseHex = document.getElementById("response-hex");

			if (responseHex) {
				responseHex.value = "asdfasfasdfasdfasdfasdfasdf";
			}

			if (requestText && requestButton) {
				requestText.value = message.text;
				requestButton.click();
			}
		}, 5000);
	}
});