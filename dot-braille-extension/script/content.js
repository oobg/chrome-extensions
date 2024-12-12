(() => {
	const getSelectedText = () => {
		const selectedText = window.getSelection()?.toString();
		console.log("Selected text:", selectedText);
		console.log("window", window)
		return selectedText || "No text selected.";
	};

	// 메시지 전송 (선택된 텍스트 전달)
	chrome.runtime.sendMessage({ action: "text-selected", text: getSelectedText() });
})();