#![no_std]

mod alloc;
mod b64;

#[global_allocator]
static WALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[unsafe(no_mangle)]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(not(test))]
#[panic_handler]
pub fn panic(_info: &::core::panic::PanicInfo) -> ! {
    loop {}
}
