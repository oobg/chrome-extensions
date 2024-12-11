const getIdValue = (id) => document.getElementById(id).value;

const saveSettings = () => {
	const apiServer = getIdValue('api-server');
	const engine = getIdValue('engine');
	const language = getIdValue('language');
	const grade = getIdValue('grade');
	const pin = getIdValue('pin');

	chrome.storage.sync.set({ apiServer, engine, language, grade, pin }, () => {
		console.log('Settings saved!');
	});
};

const loadSettings = async () => {
	return new Promise(async (resolve) => {
		chrome.storage.sync.get(['apiServer', 'engine', 'language', 'grade', 'pin'], (settings) => {
			resolve(settings);
		});
	});
};

const makeUri = (engine) => {
	switch (engine) {
		case "liblouis":
			return "/braille-app/v1/braille/translation-liblouis";
		case "amedia":
			return "/braille-amedia-app/v1/braille/translation-console";
		case "dot":
		default :
			return "/braille-app/v1/braille/translation-console";
	}
}

const makeFetchData = async () => {
	const settings = await loadSettings();
	const apiServer = settings.apiServer || getIdValue('api-server');
	const engine = settings.engine || getIdValue('engine');
	const language = settings.language || getIdValue('language');
	const grade = settings.grade || getIdValue('grade');
	const pin = settings.pin || getIdValue('pin');

	const text = document.getElementById('request-text').value;

	if (!text) {
		const NO_TEXT = "점역할 문구를 입력하세요.";
		document.getElementById('response-hex').value = NO_TEXT;
		throw new Error(NO_TEXT);
		return;
	}

	const url = `${apiServer}${makeUri(engine)}`;
	const body = {
		"CELL": "20",
		"PIN": pin,
		"TEXT": text,
		"LANGUAGE": language,
		"OPTION": grade,
		"LINE": 7
	}

	return { url, body };
}

const fetchBraille = async () => {
	const { url, body } = await makeFetchData();

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		const data = await response.json();

		if (data.result !== true) {
			throw new Error('API 요청 실패: ' + response.errors[0].msg);
		}

		document.getElementById('response-hex').value = data.BRAILLE_RESULT || data.result + ", 점자 변환 실패!";
	} catch (error) {
		console.error('API 요청 오류:', error);
		alert('API 요청 중 오류가 발생했습니다. 콘솔을 확인하세요.');
	}
};

document.getElementById("api-server").onchange = saveSettings;
document.getElementById("engine").onchange = saveSettings;
document.getElementById("language").onchange = saveSettings;
document.getElementById("grade").onchange = saveSettings;
document.getElementById("pin").onchange = saveSettings;

window.addEventListener("DOMContentLoaded", async () => {
	const settings = await loadSettings();
	const apiServer = settings.apiServer || getIdValue('api-server');
	const engine = settings.engine || getIdValue('engine');
	const language = settings.language || getIdValue('language');
	const grade = settings.grade || getIdValue('grade');
	const pin = settings.pin || getIdValue('pin');

	document.getElementById('api-server').value = apiServer;
	document.getElementById('engine').value = engine;
	document.getElementById('language').value = language;
	document.getElementById('grade').value = grade;
	document.getElementById('pin').value = pin;
});

document.getElementById('request-text').onenter = fetchBraille;
document.getElementById('request-button').onclick = fetchBraille;