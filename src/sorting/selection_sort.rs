pub fn selection_sort(arr: &mut Vec<i32>) {
    let len = arr.len();
    
    for i in 0..len {
        let mut min_idx = i;
        
        for j in (i + 1)..len {
            if arr[j] < arr[min_idx] {
                min_idx = j;
            }
        }
        
        if min_idx != i {
            arr.swap(i, min_idx);
        }
    }
}

pub fn selection_sort_step(arr: &mut Vec<i32>, step: &mut usize) -> bool {
    let len = arr.len();
    
    if *step >= len {
        return true; // Sorting complete
    }
    
    let mut min_idx = *step;
    
    for j in (*step + 1)..len {
        if arr[j] < arr[min_idx] {
            min_idx = j;
        }
    }
    
    if min_idx != *step {
        arr.swap(*step, min_idx);
    }
    
    *step += 1;
    *step >= len
}