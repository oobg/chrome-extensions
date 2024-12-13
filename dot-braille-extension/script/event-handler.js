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

// 선택 영역 동기화 함수
const syncSelectionHighlight = (sourceId, targetId) => {
	const source = document.getElementById(sourceId);
	const target = document.getElementById(targetId);
	const selector = "span, mark";
	const highlightedClass = "highlighted";
	const highlightedSelector = selector
		.split(", ")
		.map((tag) => `${tag}.${highlightedClass}`)
		.join(", ");

	if (!source || !target) return;

	// 기존 선택된 영역 초기화
	const clearSelection = (element) => {
		const tags = element.querySelectorAll(highlightedSelector);
		tags.forEach((tag) => tag.classList.remove(highlightedClass));
	};

	// 선택된 영역 강조
	const highlightSelection = (element, startIndex, endIndex) => {
		const tags = element.querySelectorAll(selector);
		for (let i = startIndex; i < endIndex; i++) {
			tags[i]?.classList.add(highlightedClass);
		}
	};

	// 마우스 움직임 중 선택 동기화
	const syncHighlight = () => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);

		// 선택 범위의 상위 요소와 오프셋 계산
		const startContainer = range.startContainer;
		const endContainer = range.endContainer;

		// 상위 요소의 인덱스 및 오프셋을 계산
		const startElement = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentElement : startContainer;
		const endElement = endContainer.nodeType === Node.TEXT_NODE ? endContainer.parentElement : endContainer;

		const startIndex = Array.from(source.querySelectorAll(selector)).indexOf(startElement);
		const endIndex = Array.from(source.querySelectorAll(selector)).indexOf(endElement);

		if (startIndex === -1 || endIndex === -1) {
			console.error("Selection is outside the source range");
			return;
		}

		// 기존 강조 제거
		clearSelection(source);
		clearSelection(target);

		// 새 강조 추가
		highlightSelection(source, startIndex, endIndex + 1); // endIndex는 범위 포함
		highlightSelection(target, startIndex, endIndex + 1);
	};

	// 드래그 중 동기화
	source.addEventListener("mousemove", syncHighlight);

	// 드래그 완료 후 클래스 유지
	source.addEventListener("mouseup", syncHighlight);
};

// 양방향 동기화 설정
syncSelectionHighlight("response-hex", "response-unicode");
syncSelectionHighlight("response-unicode", "response-hex");



