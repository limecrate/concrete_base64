import { encodeBase64, decodeBase64 } from './base64';
import { extensionOf, toByteSize } from './bin_utils';

/** @type {HTMLInputElement} */
const fileInput = document.querySelector('#file-input');

/** @type {HTMLAnchorElement} */
const download = document.querySelector('#download');

/** @type {HTMLButtonElement} */
const toBase64 = document.querySelector('#to-b64');

/** @type {HTMLButtonElement} */
const toBase64UrlSafe = document.querySelector('#to-b64-url-safe');

/** @type {HTMLButtonElement} */
const toBase64OmitPadding = document.querySelector('#to-b64-omit-padding');

/** @type {HTMLButtonElement} */
const toBinary = document.querySelector('#to-bin');

/** @type {HTMLButtonElement} */
const toBinaryUrlSafe = document.querySelector('#to-bin-url-safe');

/** @type {HTMLDivElement} */
const fileNames = document.querySelector('#file-names');

/** @type {HTMLDivElement} */
const fileSize = document.querySelector('#file-size');

/** @type {HTMLSpanElement} */
const downloadFileName = document.querySelector('#download > span');

/** @type {HTMLDivElement} */
const message = document.querySelector('#message');

/** @type {HTMLDialogElement} */
const processingModal = document.querySelector('#processing-modal');

let isToB64Url = localStorage.getItem('isToB64Url') === 'true';
let isToB64Omit = localStorage.getItem('isToB64Omit') === 'true';
let isToBinUrl = localStorage.getItem('isToBinUrl') === 'true';

switchButton(toBase64UrlSafe, isToB64Url);
switchButton(toBase64OmitPadding, isToB64Omit);
switchButton(toBinaryUrlSafe, isToBinUrl);

/// 파일이 변경되었을 때
fileInput.addEventListener('change', function (_e) {
	fileNames.textContent = fileInput.files[0]?.name.normalize('NFC') ?? ''; // macOS NFC 정규화
	fileSize.textContent = `${toByteSize(fileInput.files[0]?.size)}`;

	hide(message);
	hide(download);
});

/// base64로 인코딩하려고 할 때
toBase64.addEventListener('click', function () {
	if (!fileInput.files.length) {
		showMessage('No file');
		return;
	}

	openProcessingModal('Encoding...');

	const reader = new FileReader();

	reader.onload = function () {
		try {
			const buf = new Uint8Array(reader.result);
			const base64 = encodeBase64(buf, isToB64Url, isToB64Omit);
			const blob = new Blob([base64], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const fileName = `${fileInput.files[0].name}.txt`;

			downloadFileName.textContent = toByteSize(blob.size, false);
			download.href = url;
			download.download = fileName;

			show(download);
		} catch (err) {
			console.log(err);
			showMessage('Failed encoding..\nFile size might be too large.');
		} finally {
			processingModal.close();
		}
	};

	reader.readAsArrayBuffer(fileInput.files[0]);
});

/// binary로 디코딩하려고 할 때
toBinary.addEventListener('click', function () {
	if (!fileInput.files.length) {
		showMessage('No file');
		return;
	}

	openProcessingModal('Decoding...');

	const reader = new FileReader();

	reader.onload = function () {
		try {
			const bin = decodeBase64(reader.result, isToBinUrl);

			if (bin.length === 0) throw new Error('Something wrong. Result is 0 bytes');

			const blob = new Blob([bin]);
			const url = URL.createObjectURL(blob);

			const fileName = `${fileInput.files[0].name}.${extensionOf(bin)}`;

			downloadFileName.textContent = toByteSize(blob.size, false);
			download.href = url;
			download.download = fileName;

			show(download);
		} catch {
			showMessage(
				'Failed decoding..\n' 
				+ (!isToBinUrl 
					? 'Try to use URL safe option.' 
					: 'This file might be invalid or too large.')
			);
		} finally {
			processingModal.close();
		}
	};

	reader.readAsText(fileInput.files[0]);
});

toBase64UrlSafe.addEventListener('click', function () {
	isToB64Url = !isToB64Url;
	switchButton(this, isToB64Url);
	localStorage.setItem('isToB64Url', isToB64Url);
});

toBase64OmitPadding.addEventListener('click', function () {
	isToB64Omit = !isToB64Omit;
	switchButton(this, isToB64Omit);
	localStorage.setItem('isToB64Omit', isToB64Omit);
});

toBinaryUrlSafe.addEventListener('click', function () {
	isToBinUrl = !isToBinUrl;
	switchButton(this, isToBinUrl);
	localStorage.setItem('isToBinUrl', isToBinUrl);
});

/**
 * @param {HTMLButtonElement} button
 * @param {boolean} on
 * @returns {void}
 */
function switchButton(button, on) {
	if (on) {
		button.classList.remove('push');
		button.classList.add('half-push');
	} else {
		button.classList.remove('half-push');
		button.classList.add('push');
	}
}

/**
 * @param {string} mes
 */
function showMessage(mes) {
	message.textContent = mes;
	message.classList.remove('hide');
}

/**
 * @param {HTMLElement} ele
 */
function hide(ele) {
	ele.classList.add('hide');
}

/**
 * @param {HTMLElement} ele
 */
function show(ele) {
	ele.classList.remove('hide');
}

/**
 * @param {string} mes
 */
function openProcessingModal(mes) {
	hide(message);
	hide(download);
	document.querySelector('#processing-modal > span').textContent = mes;
	processingModal.showModal();
}
