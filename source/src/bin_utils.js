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
	// { ext: 'tar', sig: [] },
	// font
	{ ext: 'ttf', sig: [0x74, 0x72, 0x75, 0x65, 0x00] },
	{ ext: 'otf', sig: [0x4f, 0x54, 0x54, 0x4f, 0x00] },
	{ ext: 'woff', sig: [0x77, 0x4f, 0x46, 0x46] },
	{ ext: 'woff2', sig: [0x77, 0x4f, 0x46, 0x32] },
	{ ext: 'pdf', sig: [0x25, 0x50, 0x44, 0x46, 0x2d] },
	// etc
	{ ext: 'wasm', sig: [0x00, 0x61, 0x73, 0x6d] },
	{ ext: 'exe', sig: [0x5a, 0x4d] },
	// video
	{ ext: 'webm', sig: [0x1a, 0x45, 0xdf, 0xa3] },
	// UNSTABLE
	{ ext: 'doc', sig: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }, // DOC, DOT, PPS, PPT, XLA, XLS, WIZ
	/* 4B offset */
	{ ext: 'mp4', sig: [null, null, null, null, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d] },
	{ ext: 'mov', sig: [null, null, null, null, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20] },
	{ ext: 'mov', sig: [null, null, null, null, 0x6d, 0x6f, 0x6f, 0x76] },
	{ ext: 'avif', sig: [null, null, null, null, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66] },
	{
		ext: 'heif',
		sig: [
			null,
			null,
			null,
			null,
			0x00,
			0x00,
			0x00,
			0x18,
			0x66,
			0x74,
			0x79,
			0x70,
			0x68,
			0x65,
			0x69,
			0x63,
		],
	},
];

const kib = 0x400; // 0x400 1024
const mib = 0x100000; // 0x100000 1048576
const gib = 0x40000000; // 0x40000000 1073741824
const tib = 0x10000000000; // 0x10000000000 1099511627776
const pib = 0x4000000000000; // 0x4000000000000 1125899906842624

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
 * @returns {string}
 */
export function toByteSize(size) {
	if (!size) return '';

	if (size < kib) return `${size} B`;
	else if (size < mib) return `${size % kib ? (size / kib).toFixed(1) : size / kib} KiB`;
	else if (size < gib) return `${size % mib ? (size / mib).toFixed(1) : size / mib} MiB`;
	else if (size < tib) return `${size % gib ? (size / gib).toFixed(1) : size / gib} GiB`;
	else if (size < pib) return `${size % tib ? (size / tib).toFixed(1) : size / tib} TiB`;
	else return `${size % pib ? (size / pib).toFixed(1) : size / pib} PiB`;
}

/**
 * @param {string} orginName
 * @param {string} extension
 * @param {boolean} removePeriod
 * @returns {string}
 */
export function makeFileName(orginName, extension, removePeriod = true) {
	if (removePeriod) {
		if (orginName.startsWith('.')) {
			return `.${orginName.slice(1).replace(/\./g, '_')}.${extension}`;
		} else {
			return `${orginName.replace(/\./g, '_')}.${extension}`;
		}
	} else {
		return `${orginName}.${extension}`;
	}
}
