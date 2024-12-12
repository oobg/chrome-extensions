chrome.declarativeNetRequest.updateDynamicRules(
	{
		addRules: [
			{
				id: 1,
				priority: 1,
				action: {
					type: "modifyHeaders",
					responseHeaders: [
						{ header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
						{ header: "Access-Control-Allow-Methods", operation: "set", value: "GET, POST, OPTIONS" },
						{ header: "Access-Control-Allow-Headers", operation: "set", value: "Content-Type, Authorization" }
					]
				},
				condition: {
					urlFilter: "*://dev-apps.dotincorp.com/*",
					resourceTypes: ["xmlhttprequest"]
				}
			}
		],
		removeRuleIds: [1] // 기존 규칙 제거
	},
	() => {
		if (chrome.runtime.lastError) {
			console.error("Error adding rules:", chrome.runtime.lastError);
		} else {
			console.log("CORS rules added successfully.");
		}
	}
);