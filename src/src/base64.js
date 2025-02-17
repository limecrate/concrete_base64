/**
 * @param {Uint8Array} bytes
 * @param {boolean} urlSafe
 * @param {boolean} omitPadding
 * @returns {string}
 */
export function encodeBase64(bytes, urlSafe = false, omitPadding = false) {
	if (Uint8Array.prototype.toBase64) {
		console.log('Encode with toBase64!');

		return bytes.toBase64({ alphabet: urlSafe ? 'base64url' : 'base64', omitPadding });
	} else {
		console.log('Encode with compatible mode');

		return encodeBase64Compat(bytes, urlSafe, omitPadding);
	}
}

/**
 * @param {string} base64
 * @param {boolean} urlSafe
 * @returns {Uint8Array}
 */
export function decodeBase64(base64, urlSafe = false) {
	if (Uint8Array.fromBase64) {
		console.log('Decode with fromBase64!');

		return Uint8Array.fromBase64(base64, { alphabet: urlSafe ? 'base64url' : 'base64' });
	} else {
		console.log('Decode with compatible mode');

		return decodeBase64Compat(base64, urlSafe);
	}
}

/**
 * @param {Uint8Array} bytes
 * @param {boolean} urlSafe
 * @param {boolean} omitPadding
 * @returns {string}
 */
export function encodeBase64Compat(bytes, urlSafe = false, omitPadding = false) {
	const binString = Array.from(bytes, (b) => String.fromCodePoint(b)).join('');
	const base64 = btoa(binString);

	if (!urlSafe && !omitPadding) return base64; // default
	else if (!urlSafe) return base64.replace(/=+$/, ''); // omitPadding
	else if (!omitPadding) return base64.replace(/\+/g, '-').replace(/\//g, '_'); // urlSafe
	else return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // urlSafe and omitPadding
}

/**
 * @param {string} base64
 * @param {boolean} urlSafe
 * @returns {Uint8Array}
 */
export function decodeBase64Compat(base64, urlSafe = false) {
	const stdBase64 = urlSafe ? base64.replace(/-/g, '+').replace(/_/g, '/') : base64;
	const binString = atob(stdBase64);

	return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
