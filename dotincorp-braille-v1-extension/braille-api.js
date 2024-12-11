const getIdValue = (id) => document.getElementById(id).value;

const saveSettings = () => {
	const apiServer = getIdValue('api-server');
	const engine = getIdValue('engine');
	const language = getIdValue('language');
	const grade = getIdValue('grade');

	chrome.storage.sync.set({ apiServer, engine, language, grade }, () => {
		console.log('Settings saved!');
	});
};

const loadSettings = async () => {
	return new Promise(async (resolve) => {
		chrome.storage.sync.get(['apiServer', 'engine', 'language', 'grade'], (settings) => {
			resolve(settings);
		});
	});
};

document.getElementById("api-server").onchange = saveSettings;
document.getElementById("engine").onchange = saveSettings;
document.getElementById("language").onchange = saveSettings;
document.getElementById("grade").onchange = saveSettings;

window.addEventListener("DOMContentLoaded", async () => {
	const {
		apiServer = getIdValue('api-server'),
		engine = getIdValue('engine'),
		language = getIdValue('language'),
		grade = getIdValue('grade'),
	} = await loadSettings();
	document.getElementById('api-server').value = apiServer;
	document.getElementById('engine').value = engine;
	document.getElementById('language').value = language;
	document.getElementById('grade').value = grade;
});

document.getElementById('request-button').addEventListener('click', async () => {
	const {
		apiServer = getIdValue('api-server'),
		engine = getIdValue('engine'),
		language = getIdValue('language'),
		grade = getIdValue('grade'),
	} = await loadSettings();

	const text = document.getElementById('request-text').value;

	if (!text) {
		console.error('점역할 문구를 입력하세요.');
		return;
	}
	const requestUrl = `${apiServer}/braille-app/v1/braille/translation-console`;
	const requestData = { engine, language, grade, text };

	try {
		const response = await fetch(requestUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestData)
		});

		if (!response.ok) {
			throw new Error('API 요청 실패: ' + response.statusText);
		}

		const responseData = await response.json();
		document.getElementById('response-text').value = responseData.result || '응답 없음';
	} catch (error) {
		console.error('API 요청 오류:', error);
		alert('API 요청 중 오류가 발생했습니다. 콘솔을 확인하세요.');
	}
});