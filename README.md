# Concrete Base64

## Minimal Online Base64 Encoder and Decoder!

Visit https://b64.lict.me/

Enjoy this project

## Speed and Capacity

If you use FireFox or Safari, this program can process larger file and will do so faster.

The reason is the existence of `Uint8Array.prototype.toBase64` and `Uint8Array.fromBase64` functions.

Chromium or old browsers do not currently support these functions (I think Chromium will support these soon).

Without these functions, this program will use `btoa` and `atob` functions.
