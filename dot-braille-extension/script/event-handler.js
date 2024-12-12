const onEnterFetchBraille = (event) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		fetchBraille();
	}
}

const setReadOnly = (element) => {
	// 키 입력 방지
	element.addEventListener('keydown', (event) => {
		event.preventDefault();
	});

	// 붙여넣기 방지
	element.addEventListener('paste', (event) => {
		event.preventDefault();
	});

	// 드래그 앤 드롭 방지
	element.addEventListener('drop', (event) => {
		event.preventDefault();
	});

	// 조합 입력 시작 방지
	element.addEventListener('compositionstart', (event) => {
		event.preventDefault();
	});

	// 조합 입력 중 방지
	element.addEventListener('compositionupdate', (event) => {
		event.preventDefault();
	});

	// 조합 입력 완료 방지
	element.addEventListener('compositionend', (event) => {
		event.preventDefault();
	});
};

// 이벤트 핸들러 등록
document.getElementById("api-server").onchange = saveSettings;
document.getElementById("engine").onchange = saveSettings;
document.getElementById("language").onchange = saveSettings;
document.getElementById("grade").onchange = saveSettings;
document.getElementById("cell").onchange = saveSettings;

window.addEventListener("DOMContentLoaded", async () => {
	const settings = await loadSettings();
	const apiServer = settings.apiServer || getIdValue('api-server');
	const engine = settings.engine || getIdValue('engine');
	const language = settings.language || getIdValue('language');
	const grade = settings.grade || getIdValue('grade');
	const cell = settings.cell || getIdValue('cell');

	document.getElementById('api-server').value = apiServer;
	document.getElementById('engine').value = engine;
	document.getElementById('language').value = language;
	document.getElementById('grade').value = grade;
	document.getElementById('cell').value = cell;

	// 읽기 전용 설정
	setReadOnly(document.getElementById('response-hex'));
	setReadOnly(document.getElementById('response-unicode'));
});

document.getElementById('request-text').onkeydown = onEnterFetchBraille;
document.getElementById('request-button').onclick = fetchBraille;
