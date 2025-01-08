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
		const NO_TEXT = "점역할 문구를 입력하고 다시 요청하세요.";
		document.getElementById('response-hex').innerHTML = NO_TEXT;
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

	// 선택된 텍스트를 chrome.storage에 저장
	chrome.storage.local.set({ selectedText: text }, () => {
		console.log("선택된 텍스트 저장:", text);
	});

	return { url, body };
}

const hexToText = (hex, cell) => {
  const hexArray = hex.split(' ');
  const lines = [];

  for (let i = 0; i < hexArray.length; i += cell) {
    const lineHex = hexArray.slice(i, i + cell);
		const hexWrap = lineHex.map((hex) => {
			if (hex === "00") {
				return `<mark>${hex}</mark>`;
			} else {
				return `<span>${hex}</span>`;
			}
		}).join("");
    lines.push(hexWrap);
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
			const FAIL_TEXT = 'API 요청 실패: ' + response.errors[0].msg;
			document.getElementById('response-hex').innerHTML = FAIL_TEXT;
			throw new Error(FAIL_TEXT);
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
