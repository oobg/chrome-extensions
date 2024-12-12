const getIdValue = (id) => document.getElementById(id).value;

const saveSettings = () => {
	const apiServer = getIdValue('api-server');
	const engine = getIdValue('engine');
	const language = getIdValue('language');
	const grade = getIdValue('grade');
  const cell = getIdValue('cell');

	
  // Check if chrome.storage is available
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ apiServer, engine, language, grade, cell }, () => {
      console.log('Settings saved!');
    });
  } else {
    // Fallback to localStorage
    localStorage.setItem('apiServer', apiServer);
    localStorage.setItem('engine', engine);
    localStorage.setItem('language', language);
    localStorage.setItem('grade', grade);
    localStorage.setItem('cellWidth', cell);
    console.log('Settings saved to localStorage');
  }
};

const loadSettings = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([
      'apiServer',
      'engine',
      'language',
      'grade',
      'cell'
    ], (settings) => {
      resolve(settings);
    });
  });
};
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

const makeUri = (engine) => {
	switch (engine) {
		case "dot":
			return "/braille-app/v1/braille/translation-console";
		case "liblouis":
			return "/braille-app/v1/braille/translation-liblouis";
		default:
			return "/braille-app/v1/braille/translation-console";
	}
}

const makeFetchData = async () => {
	const settings = await loadSettings();
	const apiServer = settings.apiServer || getIdValue('api-server');
	const engine = settings.engine || getIdValue('engine');
	const language = settings.language || getIdValue('language');
	const grade = settings.grade || getIdValue('grade');
  const cell = settings.cell || getIdValue('cell');

	const text = document.getElementById('request-text').value;

	if (!text) {
		const NO_TEXT = "점역할 문구를 입력하세요.";
		document.getElementById('response-hex').value = NO_TEXT;
		throw new Error(NO_TEXT);
		return;
	}

	const url = `${apiServer}${makeUri(engine)}`;
	const body = {
		"CELL": cell,
		"PIN": 6,
		"TEXT": text,
		"LANGUAGE": language,
		"OPTION": grade,
		"LINE": 7
	}

	return { url, body };
}

const hexToText = (hex, cell) => {
  const hexArray = hex.split(' ');
  const lines = [];

  for (let i = 0; i < hexArray.length; i += cell) {
    const lineHex = hexArray.slice(i, i + cell);
    lines.push(lineHex.join(' '));
  }

  return lines.join('<br>');
};

const hexToBrailleUnicode = (hex, cell) => {
  const hexArray = hex.split(' ');

  const lines = [];
  for (let i = 0; i < hexArray.length; i += cell) {
    const lineHex = hexArray.slice(i, i + cell);
    const brailleLine = lineHex.map((hex) => {
      const braille = String.fromCodePoint(parseInt(hex, 16) + 0x2800);
      if (braille === '⠀') {
        return `<mark>${braille}</mark>`;
      } else {
        return `<span>${braille}</span>`;
      }
    }).join('');
    lines.push(brailleLine);
  }

  return lines.join('<br>');
}

const fetchBraille = async () => {
	const { url, body } = await makeFetchData();
  const cell = getIdValue('cell');

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

		const hexTextArea = document.getElementById('response-hex');
		const unicodeTextArea = document.getElementById('response-unicode');

		hexTextArea.innerHTML = hexToText(data.BRAILLE_RESULT, parseInt(cell));
		unicodeTextArea.innerHTML = hexToBrailleUnicode(data.BRAILLE_RESULT, parseInt(cell));
	} catch (error) {
		console.error('API 요청 오류:', error);
		alert('API 요청 중 오류가 발생했습니다. 콘솔을 확인하세요.');
	}
};

const onEnterFetchBraille = (event) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		fetchBraille();
	}
}

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
