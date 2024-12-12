(() => {
	const script = document.createElement("script");
	script.src = chrome.runtime.getURL("script/braille-api.js"); // 확장 프로그램 내부 스크립트 경로
	script.type = "module"; // 필요 시 모듈로 설정
	(document.head || document.documentElement).appendChild(script);
	script.onload = () => {
		script.remove(); // 삽입 후 DOM에서 제거
	};

	const container = document.createElement("div");
	container.id = "shadow-container";
	container.style.position = "fixed";
	container.style.left = "10px";
	container.style.bottom = "10px";
	container.style.zIndex = "9999";

	const shadow = container.attachShadow({ mode: "open" });
	shadow.innerHTML = `
    <style>
			.container {
				width: 300px;
				height: auto;
			
			  background: white;
				padding: 20px;
				border-radius: 12px;
			  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
			  			
				/*display: flex;*/
				display: none;
				flex-direction: column;
				gap: 1em;
			}
			
			.container p {
			  color: black;
				padding: 0;
				margin: 0;
			}
			
			.flex-row {
				display: flex;
			  gap: 0.5em;
			}

			.flex-col {
				display: flex;
				flex-direction: column;
				gap: 0.5em;
				flex: 1;
			}

			label {
				font-weight: 600;
				color: #333;
				font-size: 0.9em;
			}
      .editableText {
			  padding: 5px;
			  border: 1px solid #ddd;
			  background: #f9f9f9;
			  min-height: 120px;
			  overflow-y: auto;
			  white-space: pre-wrap;
			  word-wrap: break-word;
			  font-family: 'Courier New', Courier, monospace;
			  font-size: 16px;
			  border-radius: 6px;
			  transition: border-color 0.3s;
			}
			
			.editable {
			  padding: 5px;
			  border: 1px solid #ddd;
			  background: #f9f9f9;
			  min-height: 120px;
			  overflow-y: auto;
			  white-space: pre-wrap;
			  word-wrap: break-word;
			  font-family: 'Courier New', Courier, monospace;
			  font-size: 21px;
			  border-radius: 6px;
			  transition: border-color 0.3s;
			}
			
			.editable:focus {
			  outline: none;
			  border-color: #007bff;
			  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
			}
			
			.editableText *,
			.editable * {
				border: solid 1px #ccc;
				display: inline-block;
			}
			
			.editableText * {
				height: 1.7em;
				line-height: 1.7em;
				text-align: center;
			}
			
			.editable * {
				width: 1em;
			}
			
			.editableText mark,
			.editable mark {
			  background-color: #e6f2ff;
			  color: #333;
			  border: solid 1px #007bff;
			}
			
			#svg {
			  transform-origin: bottom left;
			  transition: transform 0.3s ease;
			  width: 100%;
			  height: 100%;
			}

			#svg:hover {
			  cursor: pointer;
			  border-radius: 50%;
			  transform: scale(1.2); /* 1.2배 확대 */
			}
		</style>
		
    <svg id="svg" class="svg" width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.6028 60.0009C36.3683 60.0009 37.7994 46.5692 37.7994 30.0004C37.7994 13.4317 36.3683 0 34.6028 0C32.8374 0 31.4062 13.4317 31.4062 30.0004C31.4062 46.5692 32.8374 60.0009 34.6028 60.0009Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M42.9201 57.0007C44.5087 57.0007 45.7966 44.9123 45.7966 30.0005C45.7966 15.0887 44.5087 3.00024 42.9201 3.00024C41.3314 3.00024 40.0436 15.0887 40.0436 30.0005C40.0436 44.9123 41.3314 57.0007 42.9201 57.0007Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M49.8842 51.6006C51.1551 51.6006 52.1854 41.9299 52.1854 30.0004C52.1854 18.071 51.1551 8.40027 49.8842 8.40027C48.6133 8.40027 47.583 18.071 47.583 30.0004C47.583 41.9299 48.6133 51.6006 49.8842 51.6006Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M55.3933 42.9607C56.1558 42.9607 56.774 37.1582 56.774 30.0004C56.774 22.8427 56.1558 17.0402 55.3933 17.0402C54.6307 17.0402 54.0126 22.8427 54.0126 30.0004C54.0126 37.1582 54.6307 42.9607 55.3933 42.9607Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M59.4481 35.1842C59.7529 35.1842 60 32.8633 60 30.0004C60 27.1375 59.7529 24.8167 59.4481 24.8167C59.1432 24.8167 58.8961 27.1375 58.8961 30.0004C58.8961 32.8633 59.1432 35.1842 59.4481 35.1842Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M25.5148 60.0009C27.2803 60.0009 28.7114 46.5692 28.7114 30.0004C28.7114 13.4317 27.2803 0 25.5148 0C23.7494 0 22.3182 13.4317 22.3182 30.0004C22.3182 46.5692 23.7494 60.0009 25.5148 60.0009Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M17.0809 57.0007C18.6695 57.0007 19.9574 44.9123 19.9574 30.0005C19.9574 15.0887 18.6695 3.00024 17.0809 3.00024C15.4922 3.00024 14.2043 15.0887 14.2043 30.0005C14.2043 44.9123 15.4922 57.0007 17.0809 57.0007Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M10.1158 51.6006C11.3867 51.6006 12.417 41.9299 12.417 30.0004C12.417 18.071 11.3867 8.40027 10.1158 8.40027C8.84486 8.40027 7.81458 18.071 7.81458 30.0004C7.81458 41.9299 8.84486 51.6006 10.1158 51.6006Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M4.6068 42.9607C5.36935 42.9607 5.98752 37.1582 5.98752 30.0004C5.98752 22.8427 5.36935 17.0402 4.6068 17.0402C3.84424 17.0402 3.22607 22.8427 3.22607 30.0004C3.22607 37.1582 3.84424 42.9607 4.6068 42.9607Z" fill="#EA5414" data-v-56a8df84=""></path>
      <path d="M0.551943 35.1842C0.856773 35.1842 1.10389 32.8633 1.10389 30.0004C1.10389 27.1375 0.856773 24.8167 0.551943 24.8167C0.247113 24.8167 0 27.1375 0 30.0004C0 32.8633 0.247113 35.1842 0.551943 35.1842Z" fill="#EA5414" data-v-56a8df84=""></path>
    </svg>
    
    <div id="popup" class="container">
      <p id="request-shortcut"></p>
      
      <div class="flex-col">
        <label for="response-hex">점역 응답 헥사값</label>
        <div id="response-hex" class="editableText" contenteditable="false"></div>
      </div>

      <div class="flex-col">
        <label for="response-unicode">점역 응답 유니코드</label>
        <div id="response-unicode" class="editable" contenteditable="false"></div>
      </div>
    </div>
  `;

	document.body.appendChild(container);

	// shadow.getElementById("close").addEventListener("click", () => {
	// 	container.remove();
	// });

	const getOS = () => {
		const platform = navigator.platform.toLowerCase();
		const userAgent = navigator.userAgent.toLowerCase();

		if (platform.includes("mac") || userAgent.includes("mac")) {
			return "macOS";
		} else if (platform.includes("win") || userAgent.includes("win")) {
			return "Windows";
		}
		return "Unknown";
	}
	const os = getOS();
	const metaOrCtrl = os === "macOS" ? "⌘" : "Ctrl";

	// Add Event Listeners
	const svg = shadow.getElementById("svg");
	const popup = shadow.getElementById("popup");
	const shortcut = shadow.getElementById("request-shortcut");

	shortcut.innerHTML = `닫기 : ( ESC ) <br /> 점역 : 문구 범위지정 + ( ${metaOrCtrl} + Shift + Y )`;

	const showPopup = () => {
		popup.style.display = "flex";
		svg.style.display = "none";
	};

	const hidePopup = () => {
		popup.style.display = "none";
		svg.style.display = "block";
	};

	const getSelectedText = () => window.getSelection().toString();

	svg.addEventListener("click", () => showPopup());
	window.addEventListener("keydown", async (event) => {
		if (event.key === "Escape") {
			hidePopup();
		}

		const isShiftY = event.shiftKey && event.code === "KeyY";
		if (isShiftY && ((os === "macOS" && event.metaKey) || (os === "Windows" && event.ctrlKey))) {
			event.preventDefault();

			const text = getSelectedText();
			showPopup();
			console.log("Selected text:", text);

			// TODO: 실행 컨텍스트가 달라서 fetchBraille 함수를 사용할 수 없음
			// const fetchBraille = window.fetchBraille;
			// console.log(fetchBraille);
			console.log(window);
			console.log(window.top);
			// const { hex, unicode } = await window.fetchBraille(text);
			// console.log("Braille result:", hex, unicode);
		}
	});
})();