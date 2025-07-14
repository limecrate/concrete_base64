use core::alloc::GlobalAlloc;
use core::alloc::Layout;
use core::mem;

#[unsafe(no_mangle)]
pub extern "C" fn alloc(size: usize) -> *const u8 {
    unsafe {
        let layout = Layout::from_size_align_unchecked(size, mem::align_of::<u8>());
        super::WALLOC.alloc(layout)
    }
}

#[unsafe(no_mangle)]
pub extern "C" fn dealloc(ptr: *mut u8, size: usize) {
    unsafe {
        let layout = Layout::from_size_align_unchecked(size, mem::align_of::<u8>());
        super::WALLOC.dealloc(ptr, layout);
    }
}
