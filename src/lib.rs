mod utils;
mod sorting;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, sorting-visualizer!");
}

#[wasm_bindgen]
pub struct SortingVisualizer {
    data: Vec<i32>,
    size: usize,
}

#[wasm_bindgen]
impl SortingVisualizer {
    #[wasm_bindgen(constructor)]
    pub fn new(size: usize) -> SortingVisualizer {
        utils::set_panic_hook();
        
        let mut data = Vec::with_capacity(size);
        for i in 0..size {
            data.push((i + 1) as i32);
        }
        
        SortingVisualizer { data, size }
    }

    #[wasm_bindgen]
    pub fn get_data(&self) -> Vec<i32> {
        self.data.clone()
    }

    #[wasm_bindgen]
    pub fn shuffle(&mut self) {
        use js_sys::Math;
        
        for i in 0..self.size {
            let j = (Math::random() * self.size as f64).floor() as usize;
            self.data.swap(i, j);
        }
    }

    #[wasm_bindgen]
    pub fn bubble_sort_step(&mut self) -> bool {
        sorting::bubble_sort::bubble_sort_step(&mut self.data)
    }

    #[wasm_bindgen]
    pub fn quick_sort(&mut self) {
        let len = self.data.len();
        if len > 0 {
            sorting::quick_sort::quick_sort(&mut self.data, 0, len - 1);
        }
    }

    #[wasm_bindgen]
    pub fn merge_sort(&mut self) {
        sorting::merge_sort::merge_sort(&mut self.data);
    }
}