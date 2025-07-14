const BASE64_TABLE: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

#[unsafe(export_name = "neededSize")]
pub extern "C" fn needed_size(dlen: usize, padding: bool) -> usize {
    let remainder = dlen % 3;
    let normal_size = dlen / 3 * 4;

    if padding {
        if remainder == 0 {
            normal_size
        } else {
            normal_size + 4 // padding +4
        }
    } else {
        if remainder == 0 {
            normal_size
        } else if remainder == 1 {
            normal_size + 2 // 1B to 2
        } else {
            normal_size + 3 // 2B to 3
        }
    }
}

#[unsafe(export_name = "toBase64")]
pub extern "C" fn to_base64(dptr: *const u8, dlen: usize, rbuf: *mut u8, padding: bool) -> usize {
    let (mut d0, mut d1, mut d2);
    let (mut i, mut j) = (0, 0);

    while i < dlen - 2 {
        unsafe {
            (d0, d1, d2) = (*dptr.add(i), *dptr.add(i + 1), *dptr.add(i + 2));

            *rbuf.add(j) = map_b64(d0 >> 2);
            *rbuf.add(j + 1) = map_b64(((d0 & 0b0000_0011) << 4) | (d1 >> 4));
            *rbuf.add(j + 2) = map_b64(((d1 & 0b0000_1111) << 2) | (d2 >> 6));
            *rbuf.add(j + 3) = map_b64(d2 & 0b0011_1111);
        }
        i += 3;
        j += 4;
    }

    if dlen % 3 == 1 {
        unsafe {
            d0 = *dptr.add(dlen - 1);
            *rbuf.add(j) = map_b64((d0 & 0b1111_1100) >> 2);
            *rbuf.add(j + 1) = map_b64((d0 & 0b0000_0011) << 4);
            j += 2;

            if padding {
                *rbuf.add(j) = b'=';
                *rbuf.add(j + 1) = b'=';
                j += 2;
            }
        }
    } else if dlen % 3 == 2 {
        unsafe {
            d0 = *dptr.add(dlen - 2);
            d1 = *dptr.add(dlen - 1);
            *rbuf.add(j) = map_b64((d0 & 0b1111_1100) >> 2);
            *rbuf.add(j + 1) = map_b64(((d0 & 0b0000_0011) << 4) | ((d1 & 0b1111_0000) >> 4));
            *rbuf.add(j + 2) = map_b64((d1 & 0b0000_1111) << 2);
            j += 3;

            if padding {
                *rbuf.add(j) = b'=';
                j += 1;
            }
        }
    }
    j
}

// #[unsafe(export_name = "fromBase64")]
// pub fn from_base64(base64: &str, data: &mut [u8]) -> i32 {
//     0
// }

#[inline]
unsafe fn map_b64(code: u8) -> u8 {
    unsafe { *BASE64_TABLE.get_unchecked(code as usize) }
}

#[cfg(test)]
mod tests {
    // use super::*;

    // #[test]
    // fn test_encode_no_padding() {
    //     let mut buf = Vec::new();

    //     buf = to_base64("E1L".as_bytes(), buf, false);

    //     assert_eq!("RTFM".as_bytes(), buf);
    // }

    // #[test]
    // fn test_encode_no_padding2() {
    //     let mut buf = Vec::new();

    //     buf = to_base64("LimeCrate".as_bytes(), buf, false);

    //     assert_eq!("TGltZUNyYXRl".as_bytes(), buf);
    // }

    // #[test]
    // fn test_encode_no_padding3() {
    //     let mut buf = Vec::new();

    //     buf = to_base64("LimeCrate!".as_bytes(), buf, false);

    //     assert_eq!("TGltZUNyYXRlIQ".as_bytes(), buf);
    // }

    // #[test]
    // fn test_encode_no_padding4() {
    //     let mut buf = Vec::new();

    //     buf = to_base64("CrateLime64".as_bytes(), buf, false);

    //     assert_eq!("Q3JhdGVMaW1lNjQ".as_bytes(), buf);
    // }

    // #[test]
    // fn test_encode_padding() {
    //     let mut buf = Vec::new();

    //     buf = to_base64("E1L".as_bytes(), buf, true);

    //     assert_eq!("RTFM".as_bytes(), buf);
    // }

    // #[test]
    // fn test_encode_padding2() {
    //     let mut buf = Vec::new();

    //     buf = to_base64("CrateLime64".as_bytes(), buf, true);

    //     assert_eq!("Q3JhdGVMaW1lNjQ=".as_bytes(), buf);
    // }
}
