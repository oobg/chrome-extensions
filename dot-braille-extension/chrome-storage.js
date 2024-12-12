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