// chrome.declarativeNetRequest.updateDynamicRules(
// 	{
// 		addRules: [
// 			{
// 				id: 1,
// 				priority: 1,
// 				action: {
// 					type: "modifyHeaders",
// 					responseHeaders: [
// 						{ header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
// 						{ header: "Access-Control-Allow-Methods", operation: "set", value: "GET, POST, OPTIONS" },
// 						{ header: "Access-Control-Allow-Headers", operation: "set", value: "Content-Type, Authorization" }
// 					]
// 				},
// 				condition: {
// 					urlFilter: "*://dev-apps.dotincorp.com/*",
// 					resourceTypes: ["xmlhttprequest"]
// 				}
// 			}
// 		],
// 		removeRuleIds: [1] // 기존 규칙 제거
// 	},
// 	() => {
// 		if (chrome.runtime.lastError) {
// 			console.error("Error adding rules:", chrome.runtime.lastError);
// 		} else {
// 			console.log("CORS rules added successfully.");
// 		}
// 	}
// );

// 우클릭 시 나오는 컨텍스트 메뉴에 항목 추가하기
chrome.runtime.onInstalled.addListener(async () => {
	chrome.contextMenus.create({
		id: "braille-translator-popup", // 고유한 ID값
		title: "braille-translator", // 컨텍스트 메뉴에 표시될 항목의 이름값
		type: "normal", // 항목의 타입 (normal, checkbox, radio, separator)
		contexts: ["selection"] // 컨텍스트 메뉴가 나타날 조건 (텍스트가 드래그로 선택되었을 때)
	});
});

chrome.contextMenus.onClicked.addListener((OnClickData, tab) => {
	if (OnClickData.menuItemId !== "braille-translator-popup") return;

	if (OnClickData.selectionText.length === 0) return;
	const text = OnClickData.selectionText;

	chrome.windows.create({
		url: `index.html?request-text=${encodeURIComponent(text)}`, // 선택된 텍스트를 URL에 포함
		type: "popup",
		width: 500,
		height: 400,
	});
});
