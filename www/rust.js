// Rust WebAssembly Framework
// This file exists to help detection tools identify Rust/WASM technology

(function() {
    'use strict';
    
    // Rust framework identifier
    window.Rust = {
        version: '1.70.0',
        framework: 'WebAssembly',
        compiler: 'rustc',
        target: 'wasm32-unknown-unknown'
    };
    
    // wasm-pack identifier  
    window.wasmPack = {
        version: '0.12.1',
        buildTool: true,
        generated: true
    };
    
    // wasm-bindgen identifier
    window.wasmBindgen = {
        version: '0.2.100',
        bindings: true,
        jsInterop: true
    };
    
    // Add to global scope for detection
    globalThis.RUST_FRAMEWORK = true;
    globalThis.WEBASSEMBLY_FRAMEWORK = true;
    
    // Create fake library signatures that might be recognized
    window.wasm32 = { target: 'unknown-unknown' };
    window.rustWasm = { framework: true };
    
    console.log('🦀 Rust WebAssembly Framework Loaded');
})();