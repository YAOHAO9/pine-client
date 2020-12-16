
export class TextEncoder {

    copyArray(dest, doffset, src, soffset, length) {
        for (let index = 0; index < length; index++) {
            dest[doffset++] = src[soffset++];
        }
    }
    encode(str: string): Uint8Array {
        const byteArray = new Uint8Array(str.length * 3);
        let offset = 0;
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            let codes = null;
            if (charCode <= 0x7f) {
                codes = [charCode];
            } else if (charCode <= 0x7ff) {
                // tslint:disable-next-line: no-bitwise
                codes = [0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f)];
            } else {
                // tslint:disable-next-line: no-bitwise
                codes = [0xe0 | (charCode >> 12), 0x80 | ((charCode & 0xfc0) >> 6), 0x80 | (charCode & 0x3f)];
            }
            for (const code of codes) {
                byteArray[offset] = code;
                ++offset;
            }
        }
        const _buffer = new Uint8Array(offset);
        this.copyArray(_buffer, 0, byteArray, 0, offset);
        return _buffer;
    }
}


export class TextDecoder {

    decode(bytes: Uint8Array): string {
        const array = [];
        let offset = 0;
        let charCode = 0;
        const end = bytes.length;
        while (offset < end) {
            if (bytes[offset] < 128) {
                charCode = bytes[offset];
                offset += 1;
            } else if (bytes[offset] < 224) {
                // tslint:disable-next-line: no-bitwise
                charCode = ((bytes[offset] & 0x1f) << 6) + (bytes[offset + 1] & 0x3f);
                offset += 2;
            } else {
                // tslint:disable-next-line: no-bitwise
                charCode = ((bytes[offset] & 0x0f) << 12) + ((bytes[offset + 1] & 0x3f) << 6) + (bytes[offset + 2] & 0x3f);
                offset += 3;
            }
            array.push(charCode);
        }
        return String.fromCharCode.apply(null, array);
    }
}
