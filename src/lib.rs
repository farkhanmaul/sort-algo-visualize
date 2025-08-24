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
    insertion_step: usize,
    selection_step: usize,
    comparisons: u32,
    swaps: u32,
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
        
        SortingVisualizer { 
            data, 
            size,
            insertion_step: 0,
            selection_step: 0,
            comparisons: 0,
            swaps: 0,
        }
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
        
        // Reset counters
        self.insertion_step = 0;
        self.selection_step = 0;
        self.comparisons = 0;
        self.swaps = 0;
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

    #[wasm_bindgen]
    pub fn heap_sort(&mut self) {
        sorting::heap_sort::heap_sort(&mut self.data);
    }

    #[wasm_bindgen]
    pub fn insertion_sort(&mut self) {
        sorting::insertion_sort::insertion_sort(&mut self.data);
    }

    #[wasm_bindgen]
    pub fn insertion_sort_step(&mut self) -> bool {
        sorting::insertion_sort::insertion_sort_step(&mut self.data, &mut self.insertion_step)
    }

    #[wasm_bindgen]
    pub fn selection_sort(&mut self) {
        sorting::selection_sort::selection_sort(&mut self.data);
    }

    #[wasm_bindgen]
    pub fn selection_sort_step(&mut self) -> bool {
        sorting::selection_sort::selection_sort_step(&mut self.data, &mut self.selection_step)
    }

    #[wasm_bindgen]
    pub fn shell_sort(&mut self) {
        sorting::shell_sort::shell_sort(&mut self.data);
    }

    #[wasm_bindgen]
    pub fn get_comparisons(&self) -> u32 {
        self.comparisons
    }

    #[wasm_bindgen]
    pub fn get_swaps(&self) -> u32 {
        self.swaps
    }

    #[wasm_bindgen]
    pub fn reset_stats(&mut self) {
        self.comparisons = 0;
        self.swaps = 0;
        self.insertion_step = 0;
        self.selection_step = 0;
    }
}