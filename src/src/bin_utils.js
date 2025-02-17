// @ts-check

/** @type {{ ext: string, sig: (number | null)[]}[]} */
const fileSignatures = [
	// image
	{ ext: 'png', sig: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
	{ ext: 'jpg', sig: [0xff, 0xd8, 0xff, 0xe0] },
	{ ext: 'jpg', sig: [0xff, 0xd8, 0xff, 0xe1] },
	{ ext: 'webp', sig: [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50] },
	{ ext: 'gif', sig: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF 87a
	{ ext: 'gif', sig: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // GIF 89a
	{ ext: 'bmp', sig: [0x42, 0x4d] },
	// audio
	{ ext: 'mp3', sig: [0xff, 0xfb] },
	{ ext: 'ogg', sig: [0x4f, 0x67, 0x67, 0x53] },
	{ ext: 'wav', sig: [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x41, 0x56, 0x45] },
	// zip
	{ ext: 'zip', sig: [0x50, 0x4b, 0x03, 0x04] },
	{ ext: '7z', sig: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c] },
	{ ext: 'gz', sig: [0x1f, 0x8b] },
	{ ext: 'xz', sig: [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00] },
	// font
	{ ext: 'ttf', sig: [0x74, 0x72, 0x75, 0x65, 0x00] },
	{ ext: 'otf', sig: [0x4f, 0x54, 0x54, 0x4f, 0x00] },
	{ ext: 'woff', sig: [0x77, 0x4f, 0x46, 0x46] },
	{ ext: 'woff2', sig: [0x77, 0x4f, 0x46, 0x32] },
	{ ext: 'pdf', sig: [0x25, 0x50, 0x44, 0x46, 0x2d] },
	// etc
	{ ext: 'wasm', sig: [0x00, 0x61, 0x73, 0x6d] },
	{ ext: 'exe', sig: [0x5a, 0x4d] },
	{ ext: 'webm', sig: [0x1a, 0x45, 0xdf, 0xa3]},
	// UNSTABLE
	{ ext: 'doc', sig: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }, // DOC, DOT, PPS, PPT, XLA, XLS, WIZ
	/* 4B offset */ 
	{
		ext: 'heif',
		sig: [null, null, null, null, 0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63],
	},
	{ ext: 'mp4', sig: [null, null, null, null, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d] },
	{ ext: 'mov', sig: [null, null, null, null, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20] },
	{ ext: 'mov', sig: [null, null, null, null, 0x6d, 0x6f, 0x6f, 0x76] },
	{ ext: 'avif', sig: [null, null, null, null, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66] },
	// { ext: 'tar', sig: [] },
];

/**
 * @param {Uint8Array} bin
 * @returns {string}
 */
export function extensionOf(bin) {
	let i = 0;

	for (const fs of fileSignatures) {
		for (i = 0; i < fs.sig.length; i += 1) {
			if (fs.sig[i] === null) continue;
			if (bin[i] !== fs.sig[i]) break;
		}

		if (i === fs.sig.length) return fs.ext;
	}

	return 'txt';
}


/**
 * 들어온 값을 MiB, GiB 등의 형식으로 변환
 * @param {number | null} size
 * @param {boolean} addBorder
 * @returns {string}
 */
export function toByteSize(size, addBorder = true) {
	if (!size) return '';

	/** @type {string} */
	let res;

	if (size < 1024) {
		res = `${size} B`;
	} else if (size < 1048576) {
		res = `${size % 1024 ? (size / 1024).toFixed(1) : size / 1024} KiB`;
	} else if (size < 1073741824) {
		res = `${size % 1048576 ? (size / 1048576).toFixed(1) : size / 1048576} MiB`;
	} else if (size < 1099511627776) {
		res = `${size % 1073741824 ? (size / 1073741824).toFixed(1) : size / 1073741824} GiB`;
	} else if (size < 1125899906842624) {
		res = `${
			size % 1099511627776 ? (size / 1099511627776).toFixed(1) : size / 1099511627776
		} TiB`;
	} else {
		res = `${
			size % 1125899906842624 ? (size / 1125899906842624).toFixed(1) : size / 1125899906842624
		} PiB`;
	}

	if (addBorder) return `[ ${res} ]`;
	else return res;
}
